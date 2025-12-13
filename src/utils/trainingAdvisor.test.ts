import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateComplianceStats, generateRecommendations } from './trainingAdvisor';
import { getLocalToday } from './dateUtils';
import type { TrainingPlan } from '../types/race';

// Mock dateUtils
vi.mock('./dateUtils', async () => {
    const actual = await vi.importActual('./dateUtils');
    return {
        ...actual,
        getLocalToday: vi.fn(),
    };
});

describe('trainingAdvisor', () => {
    // Mock plan skeleton
    const createMockPlan = (workouts: any[]): TrainingPlan => ({
        raceConfig: { raceDate: '2025-12-01', raceType: 'triathlon', experienceLevel: 'intermediate', id: '1', createdAt: '2024-01-01' },
        weeks: [
            {
                weekNumber: 1,
                days: workouts.map(w => ({
                    date: w.date,
                    dayOfWeek: 'Monday', // simplified
                    workouts: [w]
                }))
            }
        ],
        createdAt: '2024-01-01'
    } as any);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calculateComplianceStats ignores future workouts', () => {
        // Today is 2025-01-02
        (getLocalToday as any).mockReturnValue('2025-01-02');

        const plan = createMockPlan([
            // Past - Completed (1 pt)
            { date: '2025-01-01', discipline: 'run', completion: { status: 'completed' }, totalDuration: 30 },
            // Today - Skipped (0 pt)
            { date: '2025-01-02', discipline: 'run', completion: { status: 'skipped' }, totalDuration: 30 },
            // Future - Completed (should be ignored)
            { date: '2025-01-03', discipline: 'run', completion: { status: 'completed' }, totalDuration: 30 }
        ]);

        const stats = calculateComplianceStats(plan);
        // Total points: 2 (Past + Today). 
        // Earned: 1 (Past) + 0 (Today). 
        // Future ignored.
        // Score: 1/2 = 50%
        expect(stats.complianceScore).toBe(50);
        expect(stats.pastWorkoutsCount).toBe(2);
    });

    it('calculateComplianceStats scores partial workouts correctly', () => {
        (getLocalToday as any).mockReturnValue('2025-01-05');

        const plan = createMockPlan([
            // Completed: 1
            { date: '2025-01-01', discipline: 'run', completion: { status: 'completed' }, totalDuration: 30 },
            // Partial: 0.75
            { date: '2025-01-02', discipline: 'run', completion: { status: 'partial' }, totalDuration: 30 },
            // Skipped: 0
            { date: '2025-01-03', discipline: 'run', completion: { status: 'skipped' }, totalDuration: 30 },
            // Unlogged (no completion): 0
            { date: '2025-01-04', discipline: 'run', totalDuration: 30 },
        ]);

        const stats = calculateComplianceStats(plan);
        // Total: 4
        // Earned: 1 + 0.75 + 0 + 0 = 1.75
        // Score: (1.75 / 4) * 100 = 43.75
        expect(stats.complianceScore).toBe(43.75);
    });

    it('generateRecommendations handles low compliance', () => {
        (getLocalToday as any).mockReturnValue('2025-01-10');

        // 4 past workouts, all skipped => 0% compliance
        const plan = createMockPlan([
            { date: '2025-01-01', discipline: 'run', completion: { status: 'skipped' } },
            { date: '2025-01-02', discipline: 'run', completion: { status: 'skipped' } },
            { date: '2025-01-03', discipline: 'run', completion: { status: 'skipped' } },
            { date: '2025-01-04', discipline: 'run', completion: { status: 'skipped' } },
        ]);

        const recs = generateRecommendations(plan);
        const consistencyRec = recs.find(r => r.type === 'consistency');

        expect(consistencyRec).toBeDefined();
        expect(consistencyRec?.title).toBe('Focus on Consistency');
        expect(consistencyRec?.message).toContain('0% compliance');
    });

    it('generateRecommendations handles high compliance', () => {
        (getLocalToday as any).mockReturnValue('2025-01-10');

        // 4 past workouts, all completed => 100% compliance
        const plan = createMockPlan([
            { date: '2025-01-01', discipline: 'run', completion: { status: 'completed' } },
            { date: '2025-01-02', discipline: 'run', completion: { status: 'completed' } },
            { date: '2025-01-03', discipline: 'run', completion: { status: 'completed' } },
            { date: '2025-01-04', discipline: 'run', completion: { status: 'completed' } },
        ]);

        const recs = generateRecommendations(plan);
        const consistencyRec = recs.find(r => r.type === 'info' && r.title === 'Great Consistency!');

        expect(consistencyRec).toBeDefined();
        expect(consistencyRec?.message).toContain('100% compliance');
    });
});
