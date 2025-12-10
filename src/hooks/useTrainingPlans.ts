/**
 * Training Plans Hook
 * CRUD operations for training plans in Supabase
 */

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { TrainingPlan } from '../types/race';
import { useAuth } from '../contexts/AuthContext';

interface SavedPlan {
    id: string;
    user_id: string;
    race_name: string;
    race_date: string;
    distance_id: string;
    target_hours: number;
    target_minutes: number;
    max_weekly_hours: number;
    plan_data: TrainingPlan;
    created_at: string;
    updated_at: string;
}

export function useTrainingPlans() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const savePlan = async (plan: TrainingPlan): Promise<{ id: string | null; error: string | null }> => {
        if (!user) {
            return { id: null, error: 'Must be logged in to save plans' };
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: supabaseError } = await supabase
                .from('training_plans')
                .insert({
                    user_id: user.id,
                    race_name: plan.raceConfig.raceName,
                    race_date: plan.raceConfig.raceDate,
                    distance_id: plan.raceConfig.distance.id,
                    target_hours: plan.raceConfig.targetTime.hours,
                    target_minutes: plan.raceConfig.targetTime.minutes,
                    max_weekly_hours: plan.raceConfig.maxWeeklyHours,
                    plan_data: plan,
                })
                .select('id')
                .single();

            if (supabaseError) {
                setError(supabaseError.message);
                return { id: null, error: supabaseError.message };
            }

            return { id: data?.id ?? null, error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to save plan';
            setError(message);
            return { id: null, error: message };
        } finally {
            setLoading(false);
        }
    };

    const getPlans = async (): Promise<SavedPlan[]> => {
        if (!user) return [];

        setLoading(true);
        setError(null);

        try {
            const { data, error: supabaseError } = await supabase
                .from('training_plans')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (supabaseError) {
                setError(supabaseError.message);
                return [];
            }

            return (data as SavedPlan[]) ?? [];
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load plans';
            setError(message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const deletePlan = async (planId: string): Promise<{ error: string | null }> => {
        if (!user) {
            return { error: 'Must be logged in to delete plans' };
        }

        setLoading(true);

        try {
            const { error: supabaseError } = await supabase
                .from('training_plans')
                .delete()
                .eq('id', planId)
                .eq('user_id', user.id);

            if (supabaseError) {
                return { error: supabaseError.message };
            }

            return { error: null };
        } finally {
            setLoading(false);
        }
    };

    const updatePlan = async (planId: string, plan: TrainingPlan): Promise<{ error: string | null }> => {
        if (!user) {
            return { error: 'Must be logged in to update plans' };
        }

        setLoading(true);

        try {
            const { error: supabaseError } = await supabase
                .from('training_plans')
                .update({
                    race_name: plan.raceConfig.raceName,
                    race_date: plan.raceConfig.raceDate,
                    target_hours: plan.raceConfig.targetTime.hours,
                    target_minutes: plan.raceConfig.targetTime.minutes,
                    max_weekly_hours: plan.raceConfig.maxWeeklyHours,
                    plan_data: plan,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', planId)
                .eq('user_id', user.id);

            if (supabaseError) {
                return { error: supabaseError.message };
            }

            return { error: null };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        savePlan,
        getPlans,
        deletePlan,
        updatePlan,
    };
}
