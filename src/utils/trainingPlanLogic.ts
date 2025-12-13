import type { TrainingPlan, TrainingWeek, TrainingDay, Workout } from '../types/race';
import type { DayOfWeek } from '../types/athlete';
import { parseLocalDate, getDayOfWeek } from './dateUtils';

/**
 * Recalculates total hours for a week based on its workouts
 */
export function recalculateWeekSummary(week: TrainingWeek): TrainingWeek {
    let totalMinutes = 0;

    week.days.forEach(day => {
        day.workouts.forEach(workout => {
            totalMinutes += workout.totalDuration;
        });
    });

    return {
        ...week,
        totalHours: Math.round((totalMinutes / 60) * 10) / 10
    };
}

/**
 * Updates a plan with a modified workout, ensuring week totals are updated
 */
export function updatePlanWithWorkout(
    plan: TrainingPlan,
    workout: Workout,
    weekIndex: number,
    dayIndex: number,
    workoutIndex: number,
    newDate?: string
): TrainingPlan {
    const updatedPlan = { ...plan };
    updatedPlan.weeks = [...plan.weeks];
    updatedPlan.weeks[weekIndex] = { ...plan.weeks[weekIndex] };
    updatedPlan.weeks[weekIndex].days = [...plan.weeks[weekIndex].days];
    updatedPlan.weeks[weekIndex].days[dayIndex] = {
        ...plan.weeks[weekIndex].days[dayIndex],
    };

    if (newDate) {
        updatedPlan.weeks[weekIndex].days[dayIndex].date = newDate;
    }

    updatedPlan.weeks[weekIndex].days[dayIndex].workouts = [
        ...plan.weeks[weekIndex].days[dayIndex].workouts
    ];
    updatedPlan.weeks[weekIndex].days[dayIndex].workouts[workoutIndex] = workout;

    // Recalculate totals for this week
    updatedPlan.weeks[weekIndex] = recalculateWeekSummary(updatedPlan.weeks[weekIndex]);

    return updatedPlan;
}

/**
 * Standard week order for consistent sorting of day preferences.
 */
const WEEK_DAY_ORDER: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

/**
 * Creates a standard rest day workout.
 */
function createRestWorkout(): Workout {
    return {
        id: Math.random().toString(36).substring(2, 15),
        discipline: 'rest',
        title: 'Rest Day',
        description: 'Recovery is when your body adapts and gets stronger',
        totalDuration: 0,
        steps: [
            {
                name: 'Active Recovery (Optional)',
                duration: '20-30 min',
                intensity: 'recovery',
                instructions: 'Very easy activity if desired: gentle walk, light stretching, yoga, or foam rolling.',
            },
        ],
        tips: ['Rest is essential for improvement'],
    };
}

/**
 * Adjusts rest days in a generated week to match user preferences.
 * Enforces ALL preferred rest days by swapping with non-preferred rest days
 * or overwriting workout days if no swap candidate is available.
 */
export function adjustRestDays(
    days: TrainingDay[],
    preferredRestDays: DayOfWeek[]
): TrainingDay[] {
    if (!preferredRestDays || preferredRestDays.length === 0) return days;

    // Sort preferences by standard week order for consistent behavior
    const sortedPreferences = [...preferredRestDays]
        .map(d => d.toLowerCase() as DayOfWeek)
        .sort((a, b) => WEEK_DAY_ORDER.indexOf(a) - WEEK_DAY_ORDER.indexOf(b));

    const preferredDaysLower = new Set(sortedPreferences);
    const newDays = [...days];

    // Process each preferred rest day
    for (const preferredDay of sortedPreferences) {
        const targetDayIndex = newDays.findIndex(d => d.dayOfWeek.toLowerCase() === preferredDay);
        if (targetDayIndex === -1) continue; // Preferred day not in this week

        const targetDay = newDays[targetDayIndex];

        // If it's already a rest day, we're done with this preference
        if (targetDay.isRestDay) continue;

        // Find a swap candidate: an existing rest day that is NOT in the preferred list
        const swapCandidateIndex = newDays.findIndex(d =>
            d.isRestDay && !preferredDaysLower.has(d.dayOfWeek.toLowerCase() as DayOfWeek)
        );

        if (swapCandidateIndex !== -1) {
            // SWAP: Move target day's workout to the swap candidate, make target a rest day
            const swapCandidate = newDays[swapCandidateIndex];

            newDays[swapCandidateIndex] = {
                ...swapCandidate,
                workouts: [...targetDay.workouts],
                isRestDay: false
            };
        }
        // If no swap candidate, we just overwrite (lose that day's workout)

        // Set target day as rest day
        newDays[targetDayIndex] = {
            ...targetDay,
            workouts: [createRestWorkout()],
            isRestDay: true
        };
    }

    return newDays;
}

/**
 * Merges a new plan with an old plan, preserving:
 * 1. Entire logged workouts (those with completion data) on their original dates
 * 2. New day structure (date, dayOfWeek) - ALWAYS recalculated from date
 * 3. New workouts for any non-logged workout slots
 */
export function mergeGenericPlans(oldPlan: TrainingPlan, newPlan: TrainingPlan): TrainingPlan {
    const mergedPlan = { ...newPlan };
    mergedPlan.weeks = [...newPlan.weeks];

    // Build a lookup map of old days by date
    const oldDaysByDate: Map<string, { workouts: Workout[]; isRestDay: boolean }> = new Map();
    for (const week of oldPlan.weeks) {
        for (const day of week.days) {
            oldDaysByDate.set(day.date, { workouts: day.workouts, isRestDay: day.isRestDay });
        }
    }

    // Iterate through all days in new plan
    for (let w = 0; w < mergedPlan.weeks.length; w++) {
        const newWeek = mergedPlan.weeks[w];

        const mergedDays = newWeek.days.map(newDay => {
            // ALWAYS recalculate dayOfWeek from the date string to fix any timezone issues
            const correctDayOfWeek = getDayOfWeek(parseLocalDate(newDay.date));

            const oldDayData = oldDaysByDate.get(newDay.date);

            if (oldDayData) {
                // Check if any old workouts on this date were logged
                const loggedOldWorkouts = oldDayData.workouts.filter(w => w.completion);

                if (loggedOldWorkouts.length > 0) {
                    // Preserve the ENTIRE old day's workouts if any were logged
                    // but use the RECALCULATED dayOfWeek
                    return {
                        ...newDay,
                        dayOfWeek: correctDayOfWeek,
                        workouts: oldDayData.workouts,
                        isRestDay: oldDayData.isRestDay
                    };
                }
            }

            // No logged workouts on this date - use the new plan's workouts with corrected dayOfWeek
            return {
                ...newDay,
                dayOfWeek: correctDayOfWeek
            };
        });

        mergedPlan.weeks[w] = { ...newWeek, days: mergedDays };
    }

    return mergedPlan;
}
