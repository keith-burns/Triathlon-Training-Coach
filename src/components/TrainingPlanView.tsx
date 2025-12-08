import { useState } from 'react';
import type { TrainingPlan } from '../types/race';
import './TrainingPlanView.css';

interface TrainingPlanViewProps {
    plan: TrainingPlan;
    onBack: () => void;
    onSave?: () => void;
    saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
    isLoggedIn?: boolean;
    onLoginClick?: () => void;
}

export function TrainingPlanView({ plan, onBack, onSave, saveStatus = 'idle', isLoggedIn = false, onLoginClick }: TrainingPlanViewProps) {
    const [selectedWeek, setSelectedWeek] = useState(0);
    const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

    const currentWeek = plan.weeks[selectedWeek];

    const getPhaseColor = (phase: string): string => {
        switch (phase) {
            case 'base': return 'var(--primary-500)';
            case 'build': return 'var(--accent-500)';
            case 'peak': return 'var(--error)';
            case 'taper': return 'var(--success)';
            default: return 'var(--neutral-500)';
        }
    };

    const getDisciplineIcon = (discipline: string): string => {
        switch (discipline) {
            case 'swim': return '🏊‍♂️';
            case 'bike': return '🚴‍♂️';
            case 'run': return '🏃‍♂️';
            case 'brick': return '🔥';
            case 'strength': return '💪';
            case 'rest': return '😴';
            default: return '📋';
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

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const toggleWorkout = (workoutId: string) => {
        setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
    };

    const getSaveButtonText = () => {
        if (!isLoggedIn) return 'Sign in to Save';
        switch (saveStatus) {
            case 'saving': return 'Saving...';
            case 'saved': return '✓ Saved';
            case 'error': return 'Error - Try Again';
            default: return 'Save Plan';
        }
    };

    return (
        <div className="plan-view">
            {/* Header */}
            <header className="plan-header">
                <button className="back-button" onClick={onBack}>
                    ← Back
                </button>
                <div className="plan-header-content">
                    <h1 className="plan-title">{plan.raceConfig.raceName}</h1>
                    <p className="plan-meta">
                        {plan.raceConfig.distance.name} • {new Date(plan.raceConfig.raceDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                    <p className="plan-meta">
                        Target: {plan.raceConfig.targetTime.hours}h {plan.raceConfig.targetTime.minutes}m •
                        Peak volume: {plan.raceConfig.maxWeeklyHours} hrs/week
                    </p>
                </div>
                <button
                    className={`btn save-btn ${saveStatus === 'saved' ? 'btn-success' : saveStatus === 'error' ? 'btn-error' : 'btn-primary'}`}
                    onClick={isLoggedIn ? onSave : onLoginClick}
                    disabled={saveStatus === 'saving'}
                >
                    {getSaveButtonText()}
                </button>
            </header>

            {/* Phase Overview */}
            <div className="phase-overview">
                <div className="phase-bar">
                    {Object.entries(plan.phases).map(([phase, weeks]) => (
                        <div
                            key={phase}
                            className="phase-segment"
                            style={{
                                flex: weeks,
                                backgroundColor: getPhaseColor(phase),
                            }}
                        >
                            <span className="phase-name">{phase}</span>
                            <span className="phase-weeks">{weeks}w</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Week Selector */}
            <div className="week-selector">
                <div className="week-nav">
                    <button
                        className="week-nav-btn"
                        onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
                        disabled={selectedWeek === 0}
                    >
                        ←
                    </button>
                    <div className="week-info">
                        <span className="week-number">Week {currentWeek.weekNumber} of {plan.totalWeeks}</span>
                        <span
                            className="week-phase"
                            style={{ backgroundColor: getPhaseColor(currentWeek.phase) }}
                        >
                            {currentWeek.phase.toUpperCase()} Phase
                        </span>
                    </div>
                    <button
                        className="week-nav-btn"
                        onClick={() => setSelectedWeek(Math.min(plan.weeks.length - 1, selectedWeek + 1))}
                        disabled={selectedWeek === plan.weeks.length - 1}
                    >
                        →
                    </button>
                </div>
                <p className="week-focus">{currentWeek.focus}</p>
                <p className="week-hours">📊 Total: {currentWeek.totalHours.toFixed(1)} hours this week</p>
            </div>

            {/* Week Thumbnails */}
            <div className="week-thumbnails">
                {plan.weeks.map((week, index) => (
                    <button
                        key={week.weekNumber}
                        className={`week-thumb ${index === selectedWeek ? 'active' : ''}`}
                        onClick={() => setSelectedWeek(index)}
                        style={{
                            borderColor: index === selectedWeek ? getPhaseColor(week.phase) : 'transparent',
                            backgroundColor: index === selectedWeek ? `${getPhaseColor(week.phase)}15` : undefined
                        }}
                    >
                        {week.weekNumber}
                    </button>
                ))}
            </div>

            {/* Days Grid */}
            <div className="days-grid">
                {currentWeek.days.map((day) => (
                    <div
                        key={day.date}
                        className={`day-card ${day.isRestDay ? 'rest-day' : ''}`}
                    >
                        <div className="day-header">
                            <span className="day-name">{day.dayOfWeek}</span>
                            <span className="day-date">{formatDate(day.date)}</span>
                        </div>

                        <div className="day-workouts">
                            {day.workouts.map((workout) => (
                                <div key={workout.id} className="workout-card">
                                    <button
                                        className="workout-summary"
                                        onClick={() => toggleWorkout(workout.id)}
                                        aria-expanded={expandedWorkout === workout.id}
                                    >
                                        <span className="workout-icon">{getDisciplineIcon(workout.discipline)}</span>
                                        <div className="workout-info">
                                            <span className="workout-title">{workout.title}</span>
                                            {workout.totalDuration > 0 && (
                                                <span className="workout-duration">{workout.totalDuration} min</span>
                                            )}
                                        </div>
                                        <span className={`workout-expand ${expandedWorkout === workout.id ? 'expanded' : ''}`}>
                                            ▼
                                        </span>
                                    </button>

                                    {expandedWorkout === workout.id && (
                                        <div className="workout-details">
                                            <p className="workout-description">{workout.description}</p>

                                            <div className="workout-steps">
                                                {workout.steps.map((step, stepIndex) => (
                                                    <div key={stepIndex} className="step-card">
                                                        <div className="step-header">
                                                            <span
                                                                className="step-intensity"
                                                                style={{ backgroundColor: getIntensityColor(step.intensity) }}
                                                            >
                                                                {step.intensity}
                                                            </span>
                                                            <span className="step-duration">{step.duration}</span>
                                                        </div>
                                                        <h4 className="step-name">{step.name}</h4>
                                                        <p className="step-instructions">{step.instructions}</p>
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
                                                ))}
                                            </div>

                                            {workout.tips && workout.tips.length > 0 && (
                                                <div className="workout-tips">
                                                    <h5>💡 Tips</h5>
                                                    <ul>
                                                        {workout.tips.map((tip, i) => (
                                                            <li key={i}>{tip}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
