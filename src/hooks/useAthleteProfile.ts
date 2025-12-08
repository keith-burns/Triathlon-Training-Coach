/**
 * Athlete Profile Hook
 * CRUD operations for athlete profiles in Supabase
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { AthleteProfile, DisciplineSplit, DayOfWeek, Injury, HeartRateZones, RaceTimeBreakdown } from '../types/athlete';
import { useAuth } from '../contexts/AuthContext';

interface UseAthleteProfileReturn {
    profile: AthleteProfile | null;
    loading: boolean;
    error: string | null;
    hasProfile: boolean;
    saveProfile: (profile: Partial<AthleteProfile>) => Promise<{ error: string | null }>;
    refreshProfile: () => Promise<void>;
}

export function useAthleteProfile(): UseAthleteProfileReturn {
    const { user } = useAuth();
    const [profile, setProfile] = useState<AthleteProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!user) {
            setProfile(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('athlete_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (fetchError) {
                // No profile found is not an error for us
                if (fetchError.code === 'PGRST116') {
                    setProfile(null);
                } else {
                    setError(fetchError.message);
                }
            } else if (data) {
                // Map database fields to camelCase
                setProfile({
                    id: data.id,
                    userId: data.user_id,
                    experienceLevel: data.experience_level || 'beginner',
                    swimCSS: data.swim_css,
                    bikeFTP: data.bike_ftp,
                    runThresholdPace: data.run_threshold_pace,
                    injuries: (data.injuries as Injury[]) || [],
                    raceTimeBreakdown: data.race_time_breakdown as RaceTimeBreakdown | undefined,
                    restDayPreferences: (data.rest_day_preferences as DayOfWeek[]) || [],
                    disciplineSplit: (data.discipline_split as DisciplineSplit) || { swim: 20, bike: 45, run: 35 },
                    heartRateZones: data.hr_zones as HeartRateZones | undefined,
                    createdAt: data.created_at,
                    updatedAt: data.updated_at,
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const saveProfile = async (profileData: Partial<AthleteProfile>): Promise<{ error: string | null }> => {
        if (!user) {
            return { error: 'Must be logged in to save profile' };
        }

        setLoading(true);
        setError(null);

        try {
            // Map camelCase to snake_case for database
            const dbData = {
                user_id: user.id,
                experience_level: profileData.experienceLevel,
                swim_css: profileData.swimCSS,
                bike_ftp: profileData.bikeFTP,
                run_threshold_pace: profileData.runThresholdPace,
                injuries: profileData.injuries,
                race_time_breakdown: profileData.raceTimeBreakdown,
                rest_day_preferences: profileData.restDayPreferences,
                discipline_split: profileData.disciplineSplit,
                hr_zones: profileData.heartRateZones,
                updated_at: new Date().toISOString(),
            };

            const { error: upsertError } = await supabase
                .from('athlete_profiles')
                .upsert(dbData, { onConflict: 'user_id' });

            if (upsertError) {
                setError(upsertError.message);
                return { error: upsertError.message };
            }

            // Refresh the profile after save
            await fetchProfile();
            return { error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to save profile';
            setError(message);
            return { error: message };
        } finally {
            setLoading(false);
        }
    };

    return {
        profile,
        loading,
        error,
        hasProfile: profile !== null,
        saveProfile,
        refreshProfile: fetchProfile,
    };
}
