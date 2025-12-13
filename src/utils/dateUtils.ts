/**
 * Date Utilities
 * Centralized date handling to ensure consistent local time behavior
 * throughout the application.
 */

/**
 * Days of the week in standard order (Sunday = 0 to Saturday = 6)
 */
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Parses an ISO date string (YYYY-MM-DD) as local midnight.
 * This avoids UTC timezone issues that occur with new Date(string).
 */
export function parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Formats a Date object to an ISO date string (YYYY-MM-DD) in local time.
 */
export function formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Returns today's date as an ISO string (YYYY-MM-DD) in local time.
 */
export function getLocalToday(): string {
    return formatLocalDate(new Date());
}

/**
 * Returns the day of the week for a given date.
 * @returns Full day name, e.g., "Monday"
 */
export function getDayOfWeek(date: Date): string {
    return DAYS_OF_WEEK[date.getDay()];
}

/**
 * Adds a number of days to a date and returns a new Date object.
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Calculates the number of weeks between two dates.
 */
export function getWeeksBetween(start: Date, end: Date): number {
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.floor(diffDays / 7));
}

/**
 * Format a date for display (e.g., "Dec 13")
 */
export function formatDisplayDate(date: Date | string): string {
    const d = typeof date === 'string' ? parseLocalDate(date) : date;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format a date for display with year (e.g., "Dec 13, 2025")
 */
export function formatDisplayDateWithYear(date: Date | string): string {
    const d = typeof date === 'string' ? parseLocalDate(date) : date;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
