import { describe, it, expect } from 'vitest';
import { recalculateWeekSummary, adjustRestDays, mergeGenericPlans } from './trainingPlanLogic';
import type { TrainingWeek, TrainingPlan, TrainingDay, Workout } from '../types/race';

describe('Training Plan Logic', () => {
    describe('recalculateWeekSummary', () => {
        it('should correctly sum total hours from workouts', () => {
            const mockWeek: TrainingWeek = {
                weekNumber: 1,
                phase: 'base',
                phaseWeek: 1,
                focus: 'Test',
                totalHours: 0, // Wrong initial value
                days: [
                    {
                        date: '2025-01-01',
                        dayOfWeek: 'Monday',
                        workouts: [
                            { totalDuration: 60 } as Workout,
                            { totalDuration: 30 } as Workout
                        ],
                        isRestDay: false
                    },
                    {
                        date: '2025-01-02',
                        dayOfWeek: 'Tuesday',
                        workouts: [
                            { totalDuration: 90 } as Workout
                        ],
                        isRestDay: false
                    }
                ]
            };

            const result = recalculateWeekSummary(mockWeek);
            // 60 + 30 + 90 = 180 min = 3 hours
            expect(result.totalHours).toBe(3.0);
        });
    });

    describe('adjustRestDays', () => {
        it('should swap rest day to preferred day', () => {
            const mockDays: TrainingDay[] = [
                {
                    dayOfWeek: 'Monday',
                    isRestDay: false,
                    workouts: [{ id: 'swim', discipline: 'swim' } as Workout],
                    date: '2025-01-01'
                },
                {
                    dayOfWeek: 'Friday',
                    isRestDay: true,
                    workouts: [{ id: 'rest', discipline: 'rest' } as Workout],
                    date: '2025-01-05'
                }
            ];

            const result = adjustRestDays(mockDays, ['monday']);

            const monday = result.find(d => d.dayOfWeek === 'Monday');
            const friday = result.find(d => d.dayOfWeek === 'Friday');

            expect(monday?.isRestDay).toBe(true);
            expect(monday?.workouts[0].discipline).toBe('rest');

            expect(friday?.isRestDay).toBe(false);
            expect(friday?.workouts[0].discipline).toBe('swim'); // Moved from Monday
        });

        it('should force rest on preferred day even when no existing rest day', () => {
            // Simulates build/peak phase where Friday has an easy run instead of rest
            const mockDays: TrainingDay[] = [
                {
                    dayOfWeek: 'Monday',
                    isRestDay: false,
                    workouts: [{ id: 'swim', discipline: 'swim' } as Workout],
                    date: '2025-01-01'
                },
                {
                    dayOfWeek: 'Friday',
                    isRestDay: false, // No rest day in this week
                    workouts: [{ id: 'easyrun', discipline: 'run' } as Workout],
                    date: '2025-01-05'
                }
            ];

            const result = adjustRestDays(mockDays, ['monday']);

            const monday = result.find(d => d.dayOfWeek === 'Monday');
            const friday = result.find(d => d.dayOfWeek === 'Friday');

            // Monday should become rest day
            expect(monday?.isRestDay).toBe(true);
            expect(monday?.workouts[0].discipline).toBe('rest');

            // Friday should keep its workout (no swap partner)
            expect(friday?.isRestDay).toBe(false);
            expect(friday?.workouts[0].discipline).toBe('run');
        });

        it('should do nothing if preferred day is not found', () => {
            const mockDays: TrainingDay[] = [
                {
                    dayOfWeek: 'Monday',
                    isRestDay: true,
                    workouts: [],
                    date: '2025-01-01'
                }
            ];

            const result = adjustRestDays(mockDays, ['tuesday']); // Tuesday not in mock
            expect(result).toEqual(mockDays);
        });
    });

    describe('mergeGenericPlans', () => {
        it('should preserve past days from old plan', () => {
            const pastDate = '2000-01-01'; // Definitely past
            const futureDate = '2099-01-01'; // Definitely future

            const oldPlan: TrainingPlan = {
                id: 'old',
                weeks: [{
                    weekNumber: 1,
                    days: [
                        { date: pastDate, workouts: [{ id: 'old_workout', completion: { status: 'completed' } }] } as any,
                        { date: futureDate, workouts: [{ id: 'old_future' }] } as any
                    ]
                } as any]
            } as any;

            const newPlan: TrainingPlan = {
                id: 'new',
                weeks: [{
                    weekNumber: 1,
                    days: [
                        { date: pastDate, workouts: [{ id: 'new_workout' }] } as any,
                        { date: futureDate, workouts: [{ id: 'new_future' }] } as any
                    ]
                } as any]
            } as any;

            const merged = mergeGenericPlans(oldPlan, newPlan);

            const mergedPastDay = merged.weeks[0].days.find(d => d.date === pastDate);
            const mergedFutureDay = merged.weeks[0].days.find(d => d.date === futureDate);

            // Should preserve old past workout (completed)
            expect(mergedPastDay?.workouts[0].id).toBe('old_workout');

            // Should use new future workout
            expect(mergedFutureDay?.workouts[0].id).toBe('new_future');
        });
    });
});
