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
        it('should preserve entire logged workouts while using new day structure', () => {
            const testDate = '2025-01-15';

            const oldPlan: TrainingPlan = {
                id: 'old',
                weeks: [{
                    weekNumber: 1,
                    days: [{
                        date: testDate,
                        dayOfWeek: 'WrongDay',  // Old incorrect dayOfWeek
                        workouts: [{
                            id: 'old_swim',
                            discipline: 'swim',
                            title: 'Old Swim Title',
                            completion: { status: 'completed', notes: 'Great swim!' }
                        }],
                        isRestDay: false
                    } as any]
                } as any]
            } as any;

            const newPlan: TrainingPlan = {
                id: 'new',
                weeks: [{
                    weekNumber: 1,
                    days: [{
                        date: testDate,
                        dayOfWeek: 'Wednesday',  // Correct dayOfWeek
                        workouts: [{
                            id: 'new_swim',
                            discipline: 'swim',
                            title: 'New Swim Title'
                        }],
                        isRestDay: false
                    } as any]
                } as any]
            } as any;

            const merged = mergeGenericPlans(oldPlan, newPlan);

            const mergedDay = merged.weeks[0].days.find(d => d.date === testDate);

            // Should use NEW dayOfWeek (fixed timezone)
            expect(mergedDay?.dayOfWeek).toBe('Wednesday');
            // Should preserve OLD workout entirely (since it was logged)
            expect(mergedDay?.workouts[0].id).toBe('old_swim');
            expect(mergedDay?.workouts[0].title).toBe('Old Swim Title');
            expect(mergedDay?.workouts[0].completion?.status).toBe('completed');
        });

        it('should use new workouts for days without logged data', () => {
            const testDate = '2099-01-15';

            const oldPlan: TrainingPlan = {
                id: 'old',
                weeks: [{
                    weekNumber: 1,
                    days: [{
                        date: testDate,
                        dayOfWeek: 'OldDay',
                        workouts: [{
                            id: 'old_bike',
                            discipline: 'bike'
                            // No completion - not logged
                        }],
                        isRestDay: false
                    } as any]
                } as any]
            } as any;

            const newPlan: TrainingPlan = {
                id: 'new',
                weeks: [{
                    weekNumber: 1,
                    days: [{
                        date: testDate,
                        dayOfWeek: 'NewDay',
                        workouts: [{
                            id: 'new_bike',
                            discipline: 'bike',
                            title: 'New Bike Workout'
                        }],
                        isRestDay: false
                    } as any]
                } as any]
            } as any;

            const merged = mergeGenericPlans(oldPlan, newPlan);

            const mergedDay = merged.weeks[0].days.find(d => d.date === testDate);

            // Should use new workout (old was not logged)
            expect(mergedDay?.workouts[0].id).toBe('new_bike');
            // dayOfWeek is now recalculated from date (2099-01-15 is a Thursday)
            expect(mergedDay?.dayOfWeek).toBe('Thursday');
        });

        it('should preserve logged rest days', () => {
            const testDate = '2025-01-13'; // A Monday

            const oldPlan: TrainingPlan = {
                id: 'old',
                weeks: [{
                    weekNumber: 1,
                    days: [{
                        date: testDate,
                        dayOfWeek: 'Monday',
                        isRestDay: true,
                        workouts: [{
                            id: 'rest_workout',
                            discipline: 'rest',
                            title: 'Rest Day',
                            totalDuration: 0,
                            completion: { status: 'completed', actualDuration: 0 } // Logged rest day
                        } as any]
                    } as any]
                } as any]
            } as any;

            const newPlan: TrainingPlan = {
                id: 'new',
                weeks: [{
                    weekNumber: 1,
                    days: [{
                        date: testDate,
                        dayOfWeek: 'Monday',
                        isRestDay: false,
                        workouts: [{
                            id: 'new_swim',
                            discipline: 'swim',
                            title: 'New Swim Workout',
                            totalDuration: 60
                        } as any]
                    } as any]
                } as any]
            } as any;

            const merged = mergeGenericPlans(oldPlan, newPlan);
            const mergedDay = merged.weeks[0].days.find(d => d.date === testDate);

            // Should preserve logged rest day, not replace with swim
            expect(mergedDay?.isRestDay).toBe(true);
            expect(mergedDay?.workouts[0].discipline).toBe('rest');
        });

        it('should always recalculate dayOfWeek from date', () => {
            // Simulates loading a plan from Supabase with incorrect dayOfWeek
            const testDate = '2025-12-13'; // Saturday

            const oldPlan: TrainingPlan = {
                id: 'old',
                weeks: [{
                    weekNumber: 1,
                    days: [{
                        date: testDate,
                        dayOfWeek: 'Sunday', // WRONG! Dec 13, 2025 is Saturday
                        isRestDay: false,
                        workouts: []
                    } as any]
                } as any]
            } as any;

            const newPlan: TrainingPlan = {
                id: 'new',
                weeks: [{
                    weekNumber: 1,
                    days: [{
                        date: testDate,
                        dayOfWeek: 'Sunday', // Also wrong in new plan
                        isRestDay: false,
                        workouts: [{ id: 'new', discipline: 'swim', totalDuration: 60 } as any]
                    } as any]
                } as any]
            } as any;

            const merged = mergeGenericPlans(oldPlan, newPlan);
            const mergedDay = merged.weeks[0].days.find(d => d.date === testDate);

            // dayOfWeek should be corrected to Saturday
            expect(mergedDay?.dayOfWeek).toBe('Saturday');
        });
    });
});
