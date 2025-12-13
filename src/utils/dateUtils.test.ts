/**
 * Tests for Date Utilities
 * These tests ensure consistent local time handling to prevent timezone-related bugs.
 */

import { describe, it, expect } from 'vitest';
import {
    parseLocalDate,
    formatLocalDate,
    getDayOfWeek,
    addDays,
    getWeeksBetween,
    formatDisplayDate,
    formatDisplayDateWithYear
} from './dateUtils';

describe('Date Utilities', () => {
    describe('parseLocalDate', () => {
        it('should parse ISO date string as local midnight', () => {
            // This is the core function that prevents UTC timezone issues
            const date = parseLocalDate('2025-12-13');

            // The date should be December 13, not December 12 (which would happen with UTC parsing)
            expect(date.getDate()).toBe(13);
            expect(date.getMonth()).toBe(11); // December is month 11 (0-indexed)
            expect(date.getFullYear()).toBe(2025);
        });

        it('should handle edge case: first day of month', () => {
            const date = parseLocalDate('2025-01-01');
            expect(date.getDate()).toBe(1);
            expect(date.getMonth()).toBe(0); // January
        });

        it('should handle edge case: last day of month', () => {
            const date = parseLocalDate('2025-01-31');
            expect(date.getDate()).toBe(31);
        });

        it('should handle leap year February 29', () => {
            const date = parseLocalDate('2024-02-29');
            expect(date.getDate()).toBe(29);
            expect(date.getMonth()).toBe(1); // February
        });
    });

    describe('formatLocalDate', () => {
        it('should format date as ISO string YYYY-MM-DD', () => {
            const date = new Date(2025, 11, 13); // December 13, 2025
            expect(formatLocalDate(date)).toBe('2025-12-13');
        });

        it('should zero-pad single digit months and days', () => {
            const date = new Date(2025, 0, 5); // January 5, 2025
            expect(formatLocalDate(date)).toBe('2025-01-05');
        });
    });

    describe('parseLocalDate + formatLocalDate round-trip', () => {
        it('should preserve date through parse and format cycle', () => {
            const original = '2025-12-13';
            const parsed = parseLocalDate(original);
            const formatted = formatLocalDate(parsed);
            expect(formatted).toBe(original);
        });

        it('should preserve date across all months', () => {
            const dates = [
                '2025-01-15', '2025-02-15', '2025-03-15', '2025-04-15',
                '2025-05-15', '2025-06-15', '2025-07-15', '2025-08-15',
                '2025-09-15', '2025-10-15', '2025-11-15', '2025-12-15'
            ];

            dates.forEach(dateStr => {
                const parsed = parseLocalDate(dateStr);
                const formatted = formatLocalDate(parsed);
                expect(formatted).toBe(dateStr);
            });
        });
    });

    describe('getDayOfWeek', () => {
        it('should return correct day name for known dates', () => {
            // December 2025 calendar:
            // Dec 7 = Sunday, Dec 8 = Monday, Dec 13 = Saturday
            expect(getDayOfWeek(parseLocalDate('2025-12-07'))).toBe('Sunday');
            expect(getDayOfWeek(parseLocalDate('2025-12-08'))).toBe('Monday');
            expect(getDayOfWeek(parseLocalDate('2025-12-09'))).toBe('Tuesday');
            expect(getDayOfWeek(parseLocalDate('2025-12-10'))).toBe('Wednesday');
            expect(getDayOfWeek(parseLocalDate('2025-12-11'))).toBe('Thursday');
            expect(getDayOfWeek(parseLocalDate('2025-12-12'))).toBe('Friday');
            expect(getDayOfWeek(parseLocalDate('2025-12-13'))).toBe('Saturday');
        });

        it('should work correctly with new Date() for today', () => {
            const today = new Date();
            const dayName = getDayOfWeek(today);

            // Verify it returns a valid day name
            const validDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            expect(validDays).toContain(dayName);
        });
    });

    describe('addDays', () => {
        it('should add days correctly', () => {
            const start = parseLocalDate('2025-12-13');
            const result = addDays(start, 5);
            expect(formatLocalDate(result)).toBe('2025-12-18');
        });

        it('should subtract days with negative values', () => {
            const start = parseLocalDate('2025-12-13');
            const result = addDays(start, -5);
            expect(formatLocalDate(result)).toBe('2025-12-08');
        });

        it('should handle month boundaries', () => {
            const endOfMonth = parseLocalDate('2025-12-31');
            const nextMonth = addDays(endOfMonth, 1);
            expect(formatLocalDate(nextMonth)).toBe('2026-01-01');
        });

        it('should handle year boundaries', () => {
            const endOfYear = parseLocalDate('2025-12-31');
            const nextYear = addDays(endOfYear, 1);
            expect(nextYear.getFullYear()).toBe(2026);
        });
    });

    describe('getWeeksBetween', () => {
        it('should calculate weeks correctly', () => {
            const start = parseLocalDate('2025-01-01');
            const end = parseLocalDate('2025-01-29'); // 28 days later
            expect(getWeeksBetween(start, end)).toBe(4);
        });

        it('should return at least 1 week for very short periods', () => {
            const start = parseLocalDate('2025-01-01');
            const end = parseLocalDate('2025-01-03'); // Only 2 days
            expect(getWeeksBetween(start, end)).toBe(1);
        });
    });

    describe('formatDisplayDate', () => {
        it('should format date for display (e.g., "Dec 13")', () => {
            const result = formatDisplayDate('2025-12-13');
            expect(result).toMatch(/Dec\s*13/);
        });

        it('should accept Date objects', () => {
            const date = new Date(2025, 11, 13);
            const result = formatDisplayDate(date);
            expect(result).toMatch(/Dec\s*13/);
        });
    });

    describe('formatDisplayDateWithYear', () => {
        it('should include year in display format', () => {
            const result = formatDisplayDateWithYear('2025-12-13');
            expect(result).toMatch(/Dec\s*13.*2025/);
        });
    });
});

describe('Date Timezone Regression Tests', () => {
    /**
     * These tests specifically verify the issues we fixed:
     * - Dates should not shift backwards due to UTC parsing
     * - Day of week should match the actual calendar date
     */

    it('should not shift dates backwards (UTC bug regression)', () => {
        // The original bug: new Date('2025-12-08') in UTC-7 timezone
        // would show as December 7 because UTC midnight is Dec 7, 5PM local

        // parseLocalDate should NOT have this problem
        const date = parseLocalDate('2025-12-08');
        expect(date.getDate()).toBe(8); // NOT 7
        expect(getDayOfWeek(date)).toBe('Monday'); // Dec 8, 2025 is Monday
    });

    it('should correctly identify Saturday as Saturday, not Sunday', () => {
        // This was the user's specific issue: Dec 13, 2025 showed as Sunday
        const dec13 = parseLocalDate('2025-12-13');
        expect(getDayOfWeek(dec13)).toBe('Saturday');
    });

    it('should maintain date-dayOfWeek consistency for a full week', () => {
        // Verify an entire week to catch any off-by-one errors
        const weekDates = [
            { date: '2025-12-08', expectedDay: 'Monday' },
            { date: '2025-12-09', expectedDay: 'Tuesday' },
            { date: '2025-12-10', expectedDay: 'Wednesday' },
            { date: '2025-12-11', expectedDay: 'Thursday' },
            { date: '2025-12-12', expectedDay: 'Friday' },
            { date: '2025-12-13', expectedDay: 'Saturday' },
            { date: '2025-12-14', expectedDay: 'Sunday' },
        ];

        weekDates.forEach(({ date, expectedDay }) => {
            const parsed = parseLocalDate(date);
            const actualDay = getDayOfWeek(parsed);
            expect(actualDay).toBe(expectedDay);
        });
    });
});
