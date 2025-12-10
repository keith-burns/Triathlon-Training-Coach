import type { TrainingPlan, TrainingWeek, TrainingDay, Workout } from '../types/race';
import type { DayOfWeek } from '../types/athlete';

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
 * Adjusts rest days in a generated week to match user preferences.
 * Forces the preferred day to be a rest day, moving any workout that was there.
 */
export function adjustRestDays(
    days: TrainingDay[],
    preferredRestDays: DayOfWeek[]
): TrainingDay[] {
    if (!preferredRestDays || preferredRestDays.length === 0) return days;

    const preferredDay = preferredRestDays[0].toLowerCase();

    // Find the target day (user's preferred rest day)
    const targetDayIndex = days.findIndex(d => d.dayOfWeek.toLowerCase() === preferredDay);
    if (targetDayIndex === -1) return days; // Preferred day not in this week

    const targetDay = days[targetDayIndex];

    // If it's already a rest day, we're done
    if (targetDay.isRestDay) return days;

    // Find any existing rest day (we'll move its workout to it from target)
    const existingRestIndex = days.findIndex(d => d.isRestDay);

    const newDays = [...days];

    // Create a rest workout for the target day
    const restWorkout: Workout = {
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

    // If there's an existing rest day, swap workouts
    if (existingRestIndex !== -1 && existingRestIndex !== targetDayIndex) {
        const existingRestDay = days[existingRestIndex];

        // Move target day's workout to the old rest day
        newDays[existingRestIndex] = {
            ...existingRestDay,
            workouts: [...targetDay.workouts],
            isRestDay: false
        };
    }
    // If no existing rest day, we just replace target day (no swap needed)

    // Set target day as rest day
    newDays[targetDayIndex] = {
        ...targetDay,
        workouts: [restWorkout],
        isRestDay: true
    };

    return newDays;
}

/**
 * Merges a new plan with an old plan, preserving past history
 */
export function mergeGenericPlans(oldPlan: TrainingPlan, newPlan: TrainingPlan): TrainingPlan {
    // If configurations don't match roughly, we can't safely merge history by date
    // But we'll assume "Regenerate" implies same race date target.

    const todayDate = new Date().toISOString().split('T')[0];
    const mergedPlan = { ...newPlan };
    mergedPlan.weeks = [...newPlan.weeks];

    // Iterate through all days in new plan
    for (let w = 0; w < mergedPlan.weeks.length; w++) {
        const newWeek = mergedPlan.weeks[w];
        // Try to find matching week in old plan? 
        // Safer to map by date.

        const mergedDays = newWeek.days.map(newDay => {
            if (newDay.date < todayDate) {
                // Look for this date in old plan
                for (const oldWeek of oldPlan.weeks) {
                    const oldDay = oldWeek.days.find(d => d.date === newDay.date);
                    if (oldDay) {
                        return oldDay; // Keep history
                    }
                }
            }
            return newDay;
        });

        mergedPlan.weeks[w] = { ...newWeek, days: mergedDays };
    }

    return mergedPlan;
}
