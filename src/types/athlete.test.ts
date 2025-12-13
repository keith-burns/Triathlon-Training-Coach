/**
 * Tests for Heart Rate Zone Calculations
 * Tests the Tanaka formula, LTHR estimation, and Friel zone system
 */

import { describe, it, expect } from 'vitest';
import {
    estimateMaxHR,
    estimateLTHR,
    calculateZonesFromLTHR,
    calculateZonesFromAge,
    calculateHeartRateZones,
    createDefaultProfile,
    DEFAULT_DISCIPLINE_SPLIT,
    DEFAULT_REST_DAYS,
} from './athlete';

describe('estimateMaxHR (Tanaka formula)', () => {
    it('should calculate max HR using 208 - 0.7 * age', () => {
        expect(estimateMaxHR(30)).toBe(187); // 208 - 21 = 187
        expect(estimateMaxHR(40)).toBe(180); // 208 - 28 = 180
        expect(estimateMaxHR(50)).toBe(173); // 208 - 35 = 173
        expect(estimateMaxHR(20)).toBe(194); // 208 - 14 = 194
    });

    it('should return rounded integers', () => {
        expect(estimateMaxHR(35)).toBe(184); // 208 - 24.5 = 183.5 → 184
        expect(estimateMaxHR(45)).toBe(177); // 208 - 31.5 = 176.5 → 177
    });
});

describe('estimateLTHR', () => {
    it('should estimate LTHR as 89% of max HR', () => {
        expect(estimateLTHR(180)).toBe(160); // 180 * 0.89 = 160.2 → 160
        expect(estimateLTHR(200)).toBe(178); // 200 * 0.89 = 178
    });

    it('should return rounded integers', () => {
        expect(estimateLTHR(185)).toBe(165); // 185 * 0.89 = 164.65 → 165
    });
});

describe('calculateZonesFromLTHR', () => {
    it('should calculate 5 zones based on LTHR', () => {
        const zones = calculateZonesFromLTHR(160);

        expect(zones.lthr).toBe(160);
        expect(zones.zone1).toBeDefined();
        expect(zones.zone2).toBeDefined();
        expect(zones.zone3).toBeDefined();
        expect(zones.zone4).toBeDefined();
        expect(zones.zone5).toBeDefined();
    });

    it('should have Zone 4 threshold at LTHR', () => {
        const zones = calculateZonesFromLTHR(160);

        // Zone 4 is 94-100% of LTHR
        expect(zones.zone4.minHR).toBe(150); // 160 * 0.94 = 150.4 → 150
        expect(zones.zone4.maxHR).toBe(160); // 160 * 1.0 = 160
    });

    it('should have Zone 1 recovery as lowest zone', () => {
        const zones = calculateZonesFromLTHR(160);

        expect(zones.zone1.minHR).toBe(0); // 160 * 0 = 0
        expect(zones.zone1.maxHR).toBe(130); // 160 * 0.81 = 129.6 → 130
    });

    it('should have Zone 5 above LTHR', () => {
        const zones = calculateZonesFromLTHR(160);

        expect(zones.zone5.minHR).toBeGreaterThan(160);
        expect(zones.zone5.maxHR).toBe(176); // 160 * 1.10 = 176
    });

    it('should include zone descriptions', () => {
        const zones = calculateZonesFromLTHR(160);

        expect(zones.zone1.description).toContain('recovery');
        expect(zones.zone2.description).toContain('aerobic');
        expect(zones.zone4.description).toContain('threshold');
    });
});

describe('calculateZonesFromAge', () => {
    it('should calculate zones for a 40-year-old', () => {
        const zones = calculateZonesFromAge(40);

        // MaxHR = 208 - 28 = 180
        expect(zones.maxHR).toBe(180);

        // LTHR = 180 * 0.89 = 160
        expect(zones.lthr).toBe(160);
    });

    it('should use default resting HR of 60 if not provided', () => {
        const zones = calculateZonesFromAge(40);
        expect(zones.restingHR).toBe(60);
    });

    it('should use provided resting HR', () => {
        const zones = calculateZonesFromAge(40, 55);
        expect(zones.restingHR).toBe(55);
    });
});

describe('calculateHeartRateZones', () => {
    it('should work with maxHR and restingHR (useLTHR = false)', () => {
        const zones = calculateHeartRateZones(180, 60, false);

        expect(zones.maxHR).toBe(180);
        expect(zones.restingHR).toBe(60);
        expect(zones.lthr).toBe(160); // 180 * 0.89
    });

    it('should work with LTHR directly (useLTHR = true)', () => {
        const zones = calculateHeartRateZones(0, 160, true);

        expect(zones.lthr).toBe(160);
        expect(zones.maxHR).toBe(180); // 160 / 0.89 ≈ 180
    });
});

describe('createDefaultProfile', () => {
    it('should create a profile with the given userId', () => {
        const profile = createDefaultProfile('user-123');

        expect(profile.userId).toBe('user-123');
        expect(profile.experienceLevel).toBe('beginner');
        expect(profile.injuries).toEqual([]);
    });

    it('should use default discipline split', () => {
        const profile = createDefaultProfile('user-123');

        expect(profile.disciplineSplit).toEqual(DEFAULT_DISCIPLINE_SPLIT);
        expect(profile.disciplineSplit.swim).toBe(20);
        expect(profile.disciplineSplit.bike).toBe(45);
        expect(profile.disciplineSplit.run).toBe(35);
    });

    it('should use default rest days', () => {
        const profile = createDefaultProfile('user-123');

        expect(profile.restDayPreferences).toEqual(DEFAULT_REST_DAYS);
        expect(profile.restDayPreferences).toContain('monday');
        expect(profile.restDayPreferences).toContain('friday');
    });
});
