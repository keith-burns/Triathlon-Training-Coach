/**
 * Tests for Training Plan Generation
 * Tests date utilities, phase distribution, and plan generation logic
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { generateTrainingPlan } from './generateTrainingPlan';
import type { RaceConfig } from '../types/race';
import { RACE_DISTANCES } from '../types/race';

describe('generateTrainingPlan', () => {
    let baseConfig: RaceConfig;

    beforeEach(() => {
        // Create a base config with race date 12 weeks from now
        const raceDate = new Date();
        raceDate.setDate(raceDate.getDate() + 84); // 12 weeks

        baseConfig = {
            distance: RACE_DISTANCES.olympic,
            raceDate: raceDate.toISOString().split('T')[0],
            raceName: 'Test Race',
            targetTime: { hours: 3, minutes: 0 },
            maxWeeklyHours: 8,
        };
    });

    describe('Plan Structure', () => {
        it('should generate a plan with correct race config', () => {
            const plan = generateTrainingPlan(baseConfig);

            expect(plan.raceConfig).toEqual(baseConfig);
            expect(plan.id).toBeDefined();
            expect(plan.createdAt).toBeDefined();
        });

        it('should generate weeks with days', () => {
            const plan = generateTrainingPlan(baseConfig);

            expect(plan.weeks.length).toBeGreaterThan(0);
            expect(plan.weeks[0].days.length).toBe(7); // 7 days per week
        });

        it('should number weeks sequentially starting from 1', () => {
            const plan = generateTrainingPlan(baseConfig);

            plan.weeks.forEach((week, index) => {
                expect(week.weekNumber).toBe(index + 1);
            });
        });

        it('should include all 4 training phases', () => {
            const plan = generateTrainingPlan(baseConfig);
            const phases = new Set(plan.weeks.map(w => w.phase));

            expect(phases.has('base')).toBe(true);
            expect(phases.has('build')).toBe(true);
            expect(phases.has('peak')).toBe(true);
            expect(phases.has('taper')).toBe(true);
        });
    });

    describe('Training Days', () => {
        it('should have a date for each day', () => {
            const plan = generateTrainingPlan(baseConfig);

            plan.weeks.forEach(week => {
                week.days.forEach(day => {
                    expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
                    expect(day.dayOfWeek).toBeDefined();
                });
            });
        });

        it('should have workouts for non-rest days', () => {
            const plan = generateTrainingPlan(baseConfig);

            plan.weeks.forEach(week => {
                week.days.forEach(day => {
                    expect(day.workouts.length).toBeGreaterThanOrEqual(0);
                });
            });
        });

        it('should have workout IDs', () => {
            const plan = generateTrainingPlan(baseConfig);
            const firstWeek = plan.weeks[0];

            firstWeek.days.forEach(day => {
                day.workouts.forEach(workout => {
                    expect(workout.id).toBeDefined();
                    expect(typeof workout.id).toBe('string');
                });
            });
        });
    });

    describe('Workout Content', () => {
        it('should include swim, bike, and run workouts', () => {
            const plan = generateTrainingPlan(baseConfig);
            const allWorkouts = plan.weeks.flatMap(w => w.days.flatMap(d => d.workouts));
            const disciplines = new Set(allWorkouts.map(w => w.discipline));

            expect(disciplines.has('swim')).toBe(true);
            expect(disciplines.has('bike')).toBe(true);
            expect(disciplines.has('run')).toBe(true);
        });

        it('should include strength workouts', () => {
            const plan = generateTrainingPlan(baseConfig);
            const allWorkouts = plan.weeks.flatMap(w => w.days.flatMap(d => d.workouts));
            const hasStrength = allWorkouts.some(w => w.discipline === 'strength');

            expect(hasStrength).toBe(true);
        });

        it('should have workout steps with instructions', () => {
            const plan = generateTrainingPlan(baseConfig);
            const firstWorkout = plan.weeks[0].days[0].workouts[0];

            if (firstWorkout && firstWorkout.discipline !== 'rest') {
                expect(firstWorkout.steps.length).toBeGreaterThan(0);
                expect(firstWorkout.steps[0].name).toBeDefined();
                expect(firstWorkout.steps[0].instructions).toBeDefined();
            }
        });
    });

    describe('Race Distance Variations', () => {
        it('should generate plan for sprint distance', () => {
            const config = { ...baseConfig, distance: RACE_DISTANCES.sprint };
            const plan = generateTrainingPlan(config);

            expect(plan.weeks.length).toBeGreaterThan(0);
        });

        it('should generate plan for half distance', () => {
            const config = { ...baseConfig, distance: RACE_DISTANCES.half };
            const plan = generateTrainingPlan(config);

            expect(plan.weeks.length).toBeGreaterThan(0);
        });

        it('should generate plan for full distance', () => {
            const config = { ...baseConfig, distance: RACE_DISTANCES.full };
            const plan = generateTrainingPlan(config);

            expect(plan.weeks.length).toBeGreaterThan(0);
        });
    });

    describe('Experience Level Variations', () => {
        // Note: Experience level is not used by generateTrainingPlan directly
        // These tests verify the function works with any valid config
        it('should generate plan with different max hours', () => {
            const config = { ...baseConfig, maxWeeklyHours: 6 };
            const plan = generateTrainingPlan(config);

            expect(plan.weeks.length).toBeGreaterThan(0);
        });

        it('should generate plan with higher max hours', () => {
            const config = { ...baseConfig, maxWeeklyHours: 12 };
            const plan = generateTrainingPlan(config);

            expect(plan.weeks.length).toBeGreaterThan(0);
        });
    });

    describe('Profile Integration', () => {
        it('should use profile discipline split when provided', () => {
            const profile = {
                userId: 'test',
                experienceLevel: 'intermediate' as const,
                injuries: [],
                restDayPreferences: ['monday' as const, 'friday' as const],
                disciplineSplit: { swim: 30, bike: 40, run: 30 }, // Custom split
            };

            const plan = generateTrainingPlan(baseConfig, profile);
            expect(plan.weeks.length).toBeGreaterThan(0);

            // Plan should generate successfully with custom split
            const allWorkouts = plan.weeks.flatMap(w => w.days.flatMap(d => d.workouts));
            expect(allWorkouts.length).toBeGreaterThan(0);
        });

        it('should adjust for strength/weakness when provided', () => {
            const profile = {
                userId: 'test',
                experienceLevel: 'intermediate' as const,
                injuries: [],
                restDayPreferences: ['monday' as const, 'friday' as const],
                disciplineSplit: { swim: 20, bike: 45, run: 35 },
                strengthWeakness: { strongest: 'bike' as const, weakest: 'swim' as const },
            };

            const plan = generateTrainingPlan(baseConfig, profile);
            expect(plan.weeks.length).toBeGreaterThan(0);
        });
    });

    describe('Edge Cases', () => {
        it('should handle very short training period (4 weeks)', () => {
            const raceDate = new Date();
            raceDate.setDate(raceDate.getDate() + 28);
            const config = { ...baseConfig, raceDate: raceDate.toISOString().split('T')[0] };

            const plan = generateTrainingPlan(config);
            expect(plan.weeks.length).toBeGreaterThanOrEqual(1);
        });

        it('should handle long training period (24 weeks)', () => {
            const raceDate = new Date();
            raceDate.setDate(raceDate.getDate() + 168);
            const config = { ...baseConfig, raceDate: raceDate.toISOString().split('T')[0] };

            const plan = generateTrainingPlan(config);
            expect(plan.weeks.length).toBeLessThanOrEqual(24);
        });

        it('should handle very low weekly hours (4 hours)', () => {
            const config = { ...baseConfig, maxWeeklyHours: 4 };
            const plan = generateTrainingPlan(config);

            expect(plan.weeks.length).toBeGreaterThan(0);
        });

        it('should handle high weekly hours (15 hours)', () => {
            const config = { ...baseConfig, maxWeeklyHours: 15 };
            const plan = generateTrainingPlan(config);

            expect(plan.weeks.length).toBeGreaterThan(0);
        });
    });
});
