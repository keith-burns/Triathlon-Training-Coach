/**
 * Athlete Profile Types
 * Defines the athlete's fitness data, preferences, and customizations
 */

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Injury {
    id: string;
    bodyPart: string;
    severity: 'minor' | 'moderate' | 'severe';
    isActive: boolean;
    notes?: string;
}

export interface HeartRateZone {
    name: string;
    minHR: number;
    maxHR: number;
    description: string;
}

export interface HeartRateZones {
    maxHR: number;
    restingHR: number;
    zone1: HeartRateZone; // Recovery
    zone2: HeartRateZone; // Aerobic
    zone3: HeartRateZone; // Tempo
    zone4: HeartRateZone; // Threshold
    zone5: HeartRateZone; // VO2max
}

export interface DisciplineSplit {
    swim: number; // Percentage (0-100)
    bike: number;
    run: number;
}

export interface RaceTimeBreakdown {
    swimMinutes: number;
    t1Minutes: number;
    bikeMinutes: number;
    t2Minutes: number;
    runMinutes: number;
}

export interface AthleteProfile {
    id?: string;
    userId: string;

    // Fitness Level
    experienceLevel: ExperienceLevel;
    swimCSS?: string; // e.g., "1:45" per 100m
    bikeFTP?: number; // watts
    runThresholdPace?: string; // e.g., "5:30" per km

    // Injury History
    injuries: Injury[];

    // Race Time Breakdown
    raceTimeBreakdown?: RaceTimeBreakdown;

    // Preferences
    restDayPreferences: DayOfWeek[];
    disciplineSplit: DisciplineSplit;
    heartRateZones?: HeartRateZones;

    // Metadata
    createdAt?: string;
    updatedAt?: string;
}

// Default values for new profiles
export const DEFAULT_DISCIPLINE_SPLIT: DisciplineSplit = {
    swim: 20,
    bike: 45,
    run: 35,
};

export const DEFAULT_REST_DAYS: DayOfWeek[] = ['monday', 'friday'];

// Calculate HR zones using Karvonen formula
export function calculateHeartRateZones(maxHR: number, restingHR: number): HeartRateZones {
    const hrReserve = maxHR - restingHR;

    const calcZone = (lowPct: number, highPct: number): { minHR: number; maxHR: number } => ({
        minHR: Math.round(restingHR + hrReserve * lowPct),
        maxHR: Math.round(restingHR + hrReserve * highPct),
    });

    return {
        maxHR,
        restingHR,
        zone1: {
            name: 'Zone 1 - Recovery',
            ...calcZone(0.50, 0.60),
            description: 'Very easy effort, recovery and warm-up',
        },
        zone2: {
            name: 'Zone 2 - Aerobic',
            ...calcZone(0.60, 0.70),
            description: 'Comfortable pace, fat burning, base building',
        },
        zone3: {
            name: 'Zone 3 - Tempo',
            ...calcZone(0.70, 0.80),
            description: 'Moderate effort, improves aerobic capacity',
        },
        zone4: {
            name: 'Zone 4 - Threshold',
            ...calcZone(0.80, 0.90),
            description: 'Hard effort, lactate threshold training',
        },
        zone5: {
            name: 'Zone 5 - VO2max',
            ...calcZone(0.90, 1.00),
            description: 'Maximum effort, short intervals only',
        },
    };
}

// Estimate max HR from age (220 - age formula, simple but commonly used)
export function estimateMaxHR(age: number): number {
    return Math.round(220 - age);
}

// Create empty/default profile
export function createDefaultProfile(userId: string): AthleteProfile {
    return {
        userId,
        experienceLevel: 'beginner',
        injuries: [],
        restDayPreferences: DEFAULT_REST_DAYS,
        disciplineSplit: { ...DEFAULT_DISCIPLINE_SPLIT },
    };
}
