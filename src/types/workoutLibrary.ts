/**
 * Workout Library Type Definitions
 * Triathlon Training Coach
 */

import type { Discipline, Intensity, WorkoutStep, Workout } from './race';

// ============================================
// Workout Library Types
// ============================================

export type WorkoutCategory =
    | 'endurance'
    | 'intervals'
    | 'tempo'
    | 'technique'
    | 'test'
    | 'recovery'
    | 'speed'
    | 'strength';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface WorkoutVariation {
    id: string;
    duration: number; // minutes
    label: string; // e.g., "30 min", "45 min", "60 min"
    steps: WorkoutStep[];
}

export interface LibraryWorkout {
    id: string;
    discipline: Discipline;
    category: WorkoutCategory;
    title: string;
    description: string;
    difficulty: DifficultyLevel;
    /** Primary intensity level for training load calculations and polarized training distribution */
    intensity: Intensity;
    equipment?: string[]; // e.g., ["pool", "pull buoy"] or ["trainer", "power meter"]
    variations: WorkoutVariation[];
    tips?: string[];
    /** For future custom workouts */
    isCustom?: boolean;
    createdBy?: string; // user id for custom workouts
}

/**
 * Extended Workout interface for workouts in a training plan
 * that reference the library
 */
export interface PlanWorkout extends Workout {
    /** ID of the library workout this was derived from */
    libraryWorkoutId?: string;
    /** ID of the specific variation used */
    variationId?: string;
    /** Whether the user has customized this workout */
    isCustomized?: boolean;
}
