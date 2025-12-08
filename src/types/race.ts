/**
 * Race and Training Plan Type Definitions
 * Triathlon Training Coach
 */

// ============================================
// Race Distance Types
// ============================================

export type RaceDistanceId = 'sprint' | 'olympic' | 'half' | 'full';

export interface RaceDistance {
    id: RaceDistanceId;
    name: string;
    swim: string;
    bike: string;
    run: string;
    /** Typical finish times for pacing reference */
    typicalTimes: {
        beginner: string;
        intermediate: string;
        advanced: string;
    };
}

export const RACE_DISTANCES: Record<RaceDistanceId, RaceDistance> = {
    sprint: {
        id: 'sprint',
        name: 'Sprint',
        swim: '750m',
        bike: '20km',
        run: '5km',
        typicalTimes: {
            beginner: '1:30:00',
            intermediate: '1:15:00',
            advanced: '1:00:00',
        },
    },
    olympic: {
        id: 'olympic',
        name: 'Olympic',
        swim: '1.5km',
        bike: '40km',
        run: '10km',
        typicalTimes: {
            beginner: '3:30:00',
            intermediate: '2:45:00',
            advanced: '2:00:00',
        },
    },
    half: {
        id: 'half',
        name: '70.3 (Half Ironman)',
        swim: '1.9km',
        bike: '90km',
        run: '21.1km',
        typicalTimes: {
            beginner: '7:00:00',
            intermediate: '5:30:00',
            advanced: '4:30:00',
        },
    },
    full: {
        id: 'full',
        name: 'Full Ironman',
        swim: '3.8km',
        bike: '180km',
        run: '42.2km',
        typicalTimes: {
            beginner: '15:00:00',
            intermediate: '12:00:00',
            advanced: '10:00:00',
        },
    },
};

// ============================================
// Race Configuration (User Input)
// ============================================

export interface RaceConfig {
    distance: RaceDistance;
    raceName: string;
    raceDate: string; // ISO date string
    targetTime: {
        hours: number;
        minutes: number;
    };
    maxWeeklyHours: number;
}

// ============================================
// Training Plan Types
// ============================================

export type TrainingPhase = 'base' | 'build' | 'peak' | 'taper';
export type Discipline = 'swim' | 'bike' | 'run' | 'brick' | 'strength' | 'rest';
export type Intensity = 'recovery' | 'easy' | 'moderate' | 'tempo' | 'threshold' | 'intervals' | 'race';

export interface WorkoutStep {
    name: string;
    duration: string; // e.g., "10 min", "400m"
    intensity: Intensity;
    instructions: string;
    targetHeartRateZone?: number; // 1-5
    targetPace?: string; // e.g., "8:00/km"
    cadence?: string; // e.g., "90 rpm"
}

export interface Workout {
    id: string;
    discipline: Discipline;
    title: string;
    description: string;
    totalDuration: number; // minutes
    steps: WorkoutStep[];
    tips?: string[];
}

export interface TrainingDay {
    date: string; // ISO date string
    dayOfWeek: string;
    workouts: Workout[];
    isRestDay: boolean;
}

export interface TrainingWeek {
    weekNumber: number;
    phase: TrainingPhase;
    phaseWeek: number; // Week within the phase
    focus: string;
    totalHours: number;
    days: TrainingDay[];
}

export interface TrainingPlan {
    id: string;
    createdAt: string;
    raceConfig: RaceConfig;
    totalWeeks: number;
    phases: {
        base: number;
        build: number;
        peak: number;
        taper: number;
    };
    weeks: TrainingWeek[];
}
