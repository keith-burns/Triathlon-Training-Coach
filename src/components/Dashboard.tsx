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
    // const today = useMemo(() => getLocalToday(), []); 

    const { todayWorkouts, currentWeek, daysUntilRace, totalWeeks, weekProgress, complianceScore, racePrediction, predictionConfidence } = useMemo(() => {
        const raceDate = parseLocalDate(plan.raceConfig.raceDate);
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Normalize to start of day
        const daysUntil = Math.ceil((raceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const todayStr = getLocalToday();

        // Find current week and today's workouts
        let todayWork: Workout[] = [];
        let currWeekIdx = 0;

        let totalCompliancePoints = 0;
        let totalComplianceCount = 0;

        // Iterate all weeks/days to find today + calc compliance
        for (let weekIdx = 0; weekIdx < plan.weeks.length; weekIdx++) {
            const week = plan.weeks[weekIdx];
            for (const day of week.days) {
                // Check for Today
                if (day.date === todayStr) {
                    todayWork = day.workouts;
                    currWeekIdx = weekIdx;
                }

                // Compliance Calc: Only past & today, non-rest workouts
                if (day.date <= todayStr) {
                    for (const workout of day.workouts) {
                        if (workout.discipline !== 'rest') {
                            totalComplianceCount++;
                            const status = workout.completion?.status;
                            if (status === 'completed') {
                                totalCompliancePoints += 1;
                            } else if (status === 'partial') {
                                totalCompliancePoints += 0.75;
                            }
                            // skipped = 0, unlogged = 0
                        }
                    }
                }
            }
        }

        // Fallback for todayWork if not found (before/after plan)
        if (todayWork.length === 0 && plan.weeks.length > 0) {
            // Simple logic: if before start, show first day. If after, show last.
            // For now default to first if seemingly valid
            if (now < new Date(plan.weeks[0].days[0].date)) {
                currWeekIdx = 0;
                todayWork = plan.weeks[0].days[0].workouts;
            } else {
                // default to current flow or last week?
                // Existing logic fell back to week 0. Let's stick to week 0 or "today is empty".
            }
        }

        const compliance = totalComplianceCount > 0
            ? Math.round((totalCompliancePoints / totalComplianceCount) * 100)
            : 0;

        // Race Prediction Logic
        // With insufficient data (no Strava/external fitness), we default to TBD
        let prediction = "TBD";
        const confidence = "Low";

        const completed = Math.min(currWeekIdx, plan.weeks.length);
        const progress = plan.weeks.length > 0 ? Math.round((completed / plan.weeks.length) * 100) : 0;

        return {
            todayWorkouts: todayWork,
            currentWeek: currWeekIdx + 1,
            daysUntilRace: daysUntil,
            totalWeeks: plan.weeks.length,
            weekProgress: progress,
            complianceScore: compliance,
            racePrediction: prediction,
            predictionConfidence: confidence
        };
    }, [plan]);

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
                        <span className="progress-value">Week {currentWeek} of {totalWeeks}</span>
                        <span className="progress-label">Current Phase</span>
                    </div>
                    <div className="progress-card">
                        <span className="progress-value">{complianceScore}%</span>
                        <span className="progress-label">Compliance to Date</span>
                    </div>
                    <div className="progress-card">
                        <div className="progress-value-row">
                            <span className={racePrediction === 'TBD' ? "value-tbd" : "progress-value"}>
                                {racePrediction}
                            </span>
                            {racePrediction === 'TBD' ? (
                                <span className="confidence-badge low">Needs Data</span>
                            ) : (
                                <span className={`confidence-badge ${predictionConfidence.toLowerCase()}`}>
                                    {predictionConfidence === 'High' ? 'Strong' : 'Est.'}
                                </span>
                            )}
                        </div>
                        <span className="progress-label">Race Prediction</span>
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

                {
                    todayWorkouts.length === 0 ? (
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
                    )
                }
            </section >

            {/* Quick Stats */}
            < section className="stats-section" >
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
            </section >
        </div >
    );
}

