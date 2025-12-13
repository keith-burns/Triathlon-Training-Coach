/**
 * Dashboard Component
 * Main view for logged-in users showing today's workout and progress
 */

import { useMemo, useState } from 'react';
import type { TrainingPlan, Workout } from '../types/race';
import { getLocalToday, parseLocalDate } from '../utils/dateUtils';
import './Dashboard.css';

interface DashboardProps {
    plan: TrainingPlan;
    userName?: string;
}

export function Dashboard({ plan, userName }: DashboardProps) {
    const [expandedWorkout, setExpandedWorkout] = useState<number | null>(null);

    // Calculate today's date and find today's workouts
    const today = useMemo(() => getLocalToday(), []);

    const { todayWorkouts, currentWeek, daysUntilRace, completedWeeks, totalWeeks, weekProgress } = useMemo(() => {
        const raceDate = parseLocalDate(plan.raceConfig.raceDate);
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Normalize to start of day
        const daysUntil = Math.ceil((raceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Find current week and today's workouts
        let todayWork: Workout[] = [];
        let currWeek = 0;

        for (let weekIdx = 0; weekIdx < plan.weeks.length; weekIdx++) {
            const week = plan.weeks[weekIdx];
            for (const day of week.days) {
                if (day.date === today) {
                    todayWork = day.workouts;
                    currWeek = weekIdx;
                    break;
                }
            }
        }

        // If no exact match, find closest week
        if (todayWork.length === 0 && plan.weeks.length > 0) {
            currWeek = 0;
            todayWork = plan.weeks[0].days[0]?.workouts || [];
        }

        const completed = Math.min(currWeek, plan.weeks.length);
        const progress = plan.weeks.length > 0 ? Math.round((completed / plan.weeks.length) * 100) : 0;

        return {
            todayWorkouts: todayWork,
            currentWeek: currWeek + 1,
            daysUntilRace: daysUntil,
            completedWeeks: completed,
            totalWeeks: plan.weeks.length,
            weekProgress: progress,
        };
    }, [plan, today]);

    const getWorkoutIcon = (type: string): string => {
        switch (type) {
            case 'swim': return '🏊';
            case 'bike': return '🚴';
            case 'run': return '🏃';
            case 'brick': return '🔥';
            case 'strength': return '💪';
            case 'rest': return '😴';
            default: return '🏋️';
        }
    };

    const getIntensityColor = (intensity: string): string => {
        switch (intensity) {
            case 'recovery': return 'var(--neutral-400)';
            case 'easy': return 'var(--success)';
            case 'moderate': return 'var(--primary-500)';
            case 'tempo': return 'var(--accent-500)';
            case 'threshold': return 'var(--warning)';
            case 'intervals': return 'var(--error)';
            case 'race': return 'var(--bike-color)';
            default: return 'var(--neutral-500)';
        }
    };

    const formatDuration = (mins: number): string => {
        if (mins >= 60) {
            const hours = Math.floor(mins / 60);
            const remaining = mins % 60;
            return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
        }
        return `${mins}m`;
    };

    const toggleWorkout = (idx: number) => {
        setExpandedWorkout(expandedWorkout === idx ? null : idx);
    };

    const totalTodayMinutes = todayWorkouts.reduce((sum, w) => sum + w.totalDuration, 0);

    return (
        <div className="dashboard">
            {/* Welcome Section */}
            <section className="welcome-section">
                <h1>Welcome back{userName ? `, ${userName}` : ''}! 👋</h1>
                <p className="race-countdown">
                    <strong>{daysUntilRace}</strong> days until <strong>{plan.raceConfig.raceName}</strong>
                </p>
            </section>

            {/* Progress Overview */}
            <section className="progress-section">
                <h2>Training Progress</h2>
                <div className="progress-cards">
                    <div className="progress-card">
                        <span className="progress-value">{currentWeek}</span>
                        <span className="progress-label">Current Week</span>
                    </div>
                    <div className="progress-card">
                        <span className="progress-value">{completedWeeks}/{totalWeeks}</span>
                        <span className="progress-label">Weeks Complete</span>
                    </div>
                    <div className="progress-card">
                        <span className="progress-value">{weekProgress}%</span>
                        <span className="progress-label">Progress</span>
                    </div>
                </div>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${weekProgress}%` }}></div>
                </div>
            </section>

            {/* Today's Workouts */}
            <section className="today-section">
                <div className="today-header">
                    <h2>Today's Training</h2>
                    {totalTodayMinutes > 0 && (
                        <span className="today-total">{formatDuration(totalTodayMinutes)} total</span>
                    )}
                </div>

                {todayWorkouts.length === 0 ? (
                    <div className="rest-day-card">
                        <span className="rest-icon">😴</span>
                        <h3>Rest Day</h3>
                        <p>Take it easy today - recovery is part of training!</p>
                    </div>
                ) : (
                    <div className="today-workouts">
                        {todayWorkouts.map((workout, idx) => (
                            <div key={idx} className={`workout-card-large ${workout.discipline} ${expandedWorkout === idx ? 'expanded' : ''}`}>
                                <button
                                    className="workout-card-header"
                                    onClick={() => toggleWorkout(idx)}
                                    aria-expanded={expandedWorkout === idx}
                                >
                                    <span className="workout-type-icon">{getWorkoutIcon(workout.discipline)}</span>
                                    <div className="workout-card-info">
                                        <h3>{workout.title}</h3>
                                        <span className="workout-duration">{formatDuration(workout.totalDuration)}</span>
                                    </div>
                                    <span className={`workout-expand-icon ${expandedWorkout === idx ? 'expanded' : ''}`}>
                                        ▼
                                    </span>
                                </button>

                                {expandedWorkout === idx ? (
                                    <div className="workout-details">
                                        <p className="workout-description">{workout.description}</p>

                                        {workout.steps && workout.steps.length > 0 && (
                                            <div className="workout-steps">
                                                <h4>Workout Structure</h4>
                                                {workout.steps.map((step, stepIdx) => (
                                                    <div key={stepIdx} className="workout-step">
                                                        <div className="step-header">
                                                            <span
                                                                className="step-intensity"
                                                                style={{ backgroundColor: getIntensityColor(step.intensity) }}
                                                            >
                                                                {step.intensity}
                                                            </span>
                                                            <span className="step-duration">{step.duration}</span>
                                                        </div>
                                                        <div className="step-content">
                                                            <strong>{step.name}</strong>
                                                            <p>{step.instructions}</p>
                                                            {(step.targetHeartRateZone || step.targetPace || step.cadence) && (
                                                                <div className="step-targets">
                                                                    {step.targetHeartRateZone && (
                                                                        <span className="target-badge">❤️ Zone {step.targetHeartRateZone}</span>
                                                                    )}
                                                                    {step.targetPace && (
                                                                        <span className="target-badge">⏱️ {step.targetPace}</span>
                                                                    )}
                                                                    {step.cadence && (
                                                                        <span className="target-badge">🔄 {step.cadence}</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {workout.tips && workout.tips.length > 0 && (
                                            <div className="workout-tips">
                                                <h4>💡 Tips</h4>
                                                <ul>
                                                    {workout.tips.map((tip, i) => (
                                                        <li key={i}>{tip}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <p className="workout-description">{workout.description}</p>
                                        {workout.steps && workout.steps.length > 0 && (
                                            <div className="workout-preview">
                                                <strong>Workout Structure:</strong>
                                                <ul>
                                                    {workout.steps.slice(0, 3).map((step, stepIdx) => (
                                                        <li key={stepIdx}>
                                                            {step.name} - {step.duration}
                                                        </li>
                                                    ))}
                                                    {workout.steps.length > 3 && (
                                                        <li className="more-steps">+ {workout.steps.length - 3} more steps</li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Quick Stats */}
            <section className="stats-section">
                <h2>Race Details</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-icon">🏁</span>
                        <div>
                            <div className="stat-value">{plan.raceConfig.distance.name}</div>
                            <div className="stat-label">Distance</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">🎯</span>
                        <div>
                            <div className="stat-value">
                                {plan.raceConfig.targetTime.hours}h {plan.raceConfig.targetTime.minutes}m
                            </div>
                            <div className="stat-label">Target Time</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">📅</span>
                        <div>
                            <div className="stat-value">
                                {(() => {
                                    // Parse date string as local date to avoid timezone issues
                                    const [year, month, day] = plan.raceConfig.raceDate.split('-').map(Number);
                                    const date = new Date(year, month - 1, day);
                                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                })()}
                            </div>
                            <div className="stat-label">Race Day</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">⏱️</span>
                        <div>
                            <div className="stat-value">{plan.raceConfig.maxWeeklyHours}h</div>
                            <div className="stat-label">Peak Weekly Hours</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

