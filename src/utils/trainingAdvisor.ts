/**
 * Training Advisor
 * Analyzes workout completion data to generate adaptive recommendations
 */

import type { TrainingPlan, Workout, TrainingWeek } from '../types/race';

export interface TrainingRecommendation {
    type: 'recovery' | 'progression' | 'consistency' | 'info';
    title: string;
    message: string;
    priority: number; // 1-3, higher = more important
}

export interface TrainingStats {
    totalWorkouts: number;
    completedWorkouts: number;
    skippedWorkouts: number;
    partialWorkouts: number;
    completionRate: number;
    averageRPE: number;
    rpeVsTargetDiff: number;
    totalPlannedMinutes: number;
    totalActualMinutes: number;
}

/**
 * Calculate training statistics from a training plan
 */
export function calculateTrainingStats(plan: TrainingPlan): TrainingStats {
    let totalWorkouts = 0;
    let completedWorkouts = 0;
    let skippedWorkouts = 0;
    let partialWorkouts = 0;
    let totalRPE = 0;
    let totalRPEDiff = 0;
    let rpeCount = 0;
    let totalPlannedMinutes = 0;
    let totalActualMinutes = 0;

    plan.weeks.forEach(week => {
        week.days.forEach(day => {
            day.workouts.forEach(workout => {
                if (workout.discipline === 'rest') return;

                totalWorkouts++;
                totalPlannedMinutes += workout.totalDuration;

                if (workout.completion) {
                    const c = workout.completion;

                    if (c.status === 'completed') {
                        completedWorkouts++;
                        totalActualMinutes += c.actualDuration || workout.totalDuration;
                    } else if (c.status === 'skipped') {
                        skippedWorkouts++;
                    } else if (c.status === 'partial') {
                        partialWorkouts++;
                        totalActualMinutes += c.actualDuration || 0;
                    }

                    if (c.perceivedEffort && c.targetEffort) {
                        totalRPE += c.perceivedEffort;
                        totalRPEDiff += c.perceivedEffort - c.targetEffort;
                        rpeCount++;
                    }
                }
            });
        });
    });

    const completedTotal = completedWorkouts + partialWorkouts;

    return {
        totalWorkouts,
        completedWorkouts,
        skippedWorkouts,
        partialWorkouts,
        completionRate: totalWorkouts > 0 ? (completedTotal / totalWorkouts) * 100 : 0,
        averageRPE: rpeCount > 0 ? totalRPE / rpeCount : 0,
        rpeVsTargetDiff: rpeCount > 0 ? totalRPEDiff / rpeCount : 0,
        totalPlannedMinutes,
        totalActualMinutes,
    };
}

/**
 * Get stats for a specific week
 */
export function getWeekStats(week: TrainingWeek): TrainingStats {
    let totalWorkouts = 0;
    let completedWorkouts = 0;
    let skippedWorkouts = 0;
    let partialWorkouts = 0;
    let totalRPE = 0;
    let totalRPEDiff = 0;
    let rpeCount = 0;
    let totalPlannedMinutes = 0;
    let totalActualMinutes = 0;

    week.days.forEach(day => {
        day.workouts.forEach(workout => {
            if (workout.discipline === 'rest') return;

            totalWorkouts++;
            totalPlannedMinutes += workout.totalDuration;

            if (workout.completion) {
                const c = workout.completion;

                if (c.status === 'completed') {
                    completedWorkouts++;
                    totalActualMinutes += c.actualDuration || workout.totalDuration;
                } else if (c.status === 'skipped') {
                    skippedWorkouts++;
                } else if (c.status === 'partial') {
                    partialWorkouts++;
                    totalActualMinutes += c.actualDuration || 0;
                }

                if (c.perceivedEffort && c.targetEffort) {
                    totalRPE += c.perceivedEffort;
                    totalRPEDiff += c.perceivedEffort - c.targetEffort;
                    rpeCount++;
                }
            }
        });
    });

    const completedTotal = completedWorkouts + partialWorkouts;

    return {
        totalWorkouts,
        completedWorkouts,
        skippedWorkouts,
        partialWorkouts,
        completionRate: totalWorkouts > 0 ? (completedTotal / totalWorkouts) * 100 : 0,
        averageRPE: rpeCount > 0 ? totalRPE / rpeCount : 0,
        rpeVsTargetDiff: rpeCount > 0 ? totalRPEDiff / rpeCount : 0,
        totalPlannedMinutes,
        totalActualMinutes,
    };
}

/**
 * Generate adaptive training recommendations based on completion data
 */
export function generateRecommendations(plan: TrainingPlan): TrainingRecommendation[] {
    const recommendations: TrainingRecommendation[] = [];
    const stats = calculateTrainingStats(plan);

    // Check recent weeks for patterns
    const recentWeeks = plan.weeks.slice(-3);
    const recentStats = recentWeeks.map(getWeekStats);

    // 1. Check for consistently high RPE (overtraining risk)
    const avgRPEDiff = recentStats
        .filter(s => s.averageRPE > 0)
        .reduce((sum, s) => sum + s.rpeVsTargetDiff, 0) / Math.max(recentStats.filter(s => s.averageRPE > 0).length, 1);

    if (avgRPEDiff >= 2) {
        recommendations.push({
            type: 'recovery',
            title: 'Consider More Recovery',
            message: 'Your recent workouts have felt harder than planned. Consider adding extra recovery time or reducing intensity.',
            priority: 3,
        });
    } else if (avgRPEDiff >= 1) {
        recommendations.push({
            type: 'recovery',
            title: 'Monitor Fatigue',
            message: 'Workouts are feeling slightly harder than expected. Make sure you\'re getting enough rest and nutrition.',
            priority: 2,
        });
    }

    // 2. Check for consistently low RPE (ready for progression)
    if (avgRPEDiff <= -2 && recentStats.some(s => s.averageRPE > 0)) {
        recommendations.push({
            type: 'progression',
            title: 'Ready for More Challenge',
            message: 'You\'re handling workouts well! Consider increasing intensity or adding volume.',
            priority: 2,
        });
    }

    // 3. Check completion rate
    if (stats.completionRate < 70 && stats.totalWorkouts > 5) {
        recommendations.push({
            type: 'consistency',
            title: 'Focus on Consistency',
            message: `You've completed ${Math.round(stats.completionRate)}% of workouts. Try to maintain at least 80% for optimal progress.`,
            priority: 3,
        });
    } else if (stats.completionRate >= 90 && stats.totalWorkouts > 10) {
        recommendations.push({
            type: 'info',
            title: 'Great Consistency!',
            message: 'Excellent adherence to your training plan. Keep up the great work!',
            priority: 1,
        });
    }

    // 4. Check for missed week patterns
    const skippedRecently = recentStats.reduce((sum, s) => sum + s.skippedWorkouts, 0);
    if (skippedRecently >= 3) {
        recommendations.push({
            type: 'consistency',
            title: 'Getting Back on Track',
            message: 'You\'ve missed a few workouts recently. Consider adjusting your schedule or workout times.',
            priority: 2,
        });
    }

    // Sort by priority (highest first)
    return recommendations.sort((a, b) => b.priority - a.priority);
}

/**
 * Get completion status icon
 */
export function getCompletionIcon(workout: Workout): string {
    if (!workout.completion) return '';
    switch (workout.completion.status) {
        case 'completed': return '✓';
        case 'partial': return '◐';
        case 'skipped': return '⏭';
        default: return '';
    }
}

/**
 * Get completion status color
 */
export function getCompletionColor(workout: Workout): string {
    if (!workout.completion) return 'transparent';
    switch (workout.completion.status) {
        case 'completed': return 'var(--success)';
        case 'partial': return 'var(--warning)';
        case 'skipped': return 'var(--neutral-400)';
        default: return 'transparent';
    }
}
