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
    lthr?: number; // Lactate Threshold HR - preferred for zone calculation
    zone1: HeartRateZone; // Recovery
    zone2: HeartRateZone; // Endurance
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


export type Discipline = 'swim' | 'bike' | 'run';

export interface Equipment {
    hasPoolAccess: boolean;
    hasBikeTrainer: boolean;
    hasGymAccess: boolean;
    hasPowerMeter: boolean;
    hasHeartRateMonitor: boolean;
}

export interface StrengthWeakness {
    strongest: Discipline;
    weakest: Discipline;
}

export interface AthleteProfile {
    id?: string;
    userId: string;

    // Demographics
    age?: number;
    trainingYearsExperience?: number;

    // Fitness Level
    experienceLevel: ExperienceLevel;
    swimCSS?: string; // e.g., "1:45" per 100m
    bikeFTP?: number; // watts
    runThresholdPace?: string; // e.g., "5:30" per km
    lactateThresholdHR?: number; // LTHR from 30-min time trial test

    // Injury History
    injuries: Injury[];

    // Equipment Access
    equipment?: Equipment;

    // Strengths
    strengthWeakness?: StrengthWeakness;

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

export const DEFAULT_EQUIPMENT: Equipment = {
    hasPoolAccess: true,
    hasBikeTrainer: false,
    hasGymAccess: false,
    hasPowerMeter: false,
    hasHeartRateMonitor: true,
};

/**
 * Estimate max HR using the Tanaka formula
 * More accurate than 220-age, based on meta-analysis of 351 studies
 * Tanaka H, Monahan KD, Seals DR (2001)
 */
export function estimateMaxHR(age: number): number {
    return Math.round(208 - (0.7 * age));
}

/**
 * Estimate LTHR from max HR (approximately 85-92% of max HR for trained athletes)
 * Use 89% as a reasonable estimate for intermediate athletes
 */
export function estimateLTHR(maxHR: number): number {
    return Math.round(maxHR * 0.89);
}

/**
 * Calculate HR zones using Joe Friel's LTHR-based system
 * This is the preferred method used by professional triathlon coaches
 * 
 * If LTHR is provided, uses Friel zones directly
 * If only age is provided, estimates maxHR from Tanaka, then estimates LTHR
 */
export function calculateHeartRateZones(
    ageOrMaxHR: number,
    restingHROrLTHR: number,
    useLTHR: boolean = false
): HeartRateZones {
    let maxHR: number;
    let restingHR: number;
    let lthr: number;

    if (useLTHR) {
        // restingHROrLTHR is actually LTHR
        lthr = restingHROrLTHR;
        maxHR = Math.round(lthr / 0.89); // Estimate maxHR from LTHR
        restingHR = Math.round(maxHR * 0.35); // Rough estimate
    } else {
        // Using age-based estimation (ageOrMaxHR is maxHR, restingHROrLTHR is restingHR)
        maxHR = ageOrMaxHR;
        restingHR = restingHROrLTHR;
        lthr = estimateLTHR(maxHR);
    }

    // Joe Friel's 5-zone system based on LTHR
    // These percentages are based on lactate threshold, not max HR
    const calcZone = (lowPct: number, highPct: number): { minHR: number; maxHR: number } => ({
        minHR: Math.round(lthr * lowPct),
        maxHR: Math.round(lthr * highPct),
    });

    return {
        maxHR,
        restingHR,
        lthr,
        zone1: {
            name: 'Zone 1 - Recovery',
            ...calcZone(0.00, 0.81),
            description: 'Active recovery, warm-up/cool-down',
        },
        zone2: {
            name: 'Zone 2 - Endurance',
            ...calcZone(0.81, 0.89),
            description: 'All-day pace, builds aerobic base',
        },
        zone3: {
            name: 'Zone 3 - Tempo',
            ...calcZone(0.90, 0.93),
            description: 'Moderate-hard effort, steady-state training',
        },
        zone4: {
            name: 'Zone 4 - Threshold',
            ...calcZone(0.94, 1.00),
            description: 'Hard effort at lactate threshold',
        },
        zone5: {
            name: 'Zone 5 - VO2max',
            ...calcZone(1.01, 1.10),
            description: 'Maximum effort, interval training',
        },
    };
}

/**
 * Preferred method: Calculate zones directly from LTHR
 * Use this when athlete knows their tested LTHR
 */
export function calculateZonesFromLTHR(lthr: number): HeartRateZones {
    return calculateHeartRateZones(0, lthr, true);
}

/**
 * Fallback method: Calculate zones from age
 * Uses Tanaka formula to estimate max HR, then estimates LTHR
 */
export function calculateZonesFromAge(age: number, restingHR: number = 60): HeartRateZones {
    const maxHR = estimateMaxHR(age);
    return calculateHeartRateZones(maxHR, restingHR, false);
}

// Create empty/default profile
export function createDefaultProfile(userId: string): AthleteProfile {
    return {
        userId,
        experienceLevel: 'beginner',
        injuries: [],
        restDayPreferences: DEFAULT_REST_DAYS,
        disciplineSplit: { ...DEFAULT_DISCIPLINE_SPLIT },
        equipment: { ...DEFAULT_EQUIPMENT },
    };
}

