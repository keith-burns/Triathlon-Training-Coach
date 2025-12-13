import { useState } from 'react';
import type { TrainingPlan, Workout, Discipline, WorkoutCompletion } from '../types/race';
import { recalculateWeekSummary } from '../utils/trainingPlanLogic';
import { formatDisplayDate, getDayOfWeek, parseLocalDate } from '../utils/dateUtils';
import { WorkoutEditModal } from './WorkoutEditModal';
import { WorkoutCompletionModal } from './WorkoutCompletionModal';
import { getCompletionIcon, getCompletionColor } from '../utils/trainingAdvisor';
import './TrainingPlanView.css';

interface TrainingPlanViewProps {
    plan: TrainingPlan;
    onBack: () => void;
    onSave?: () => void;
    saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
    isLoggedIn?: boolean;
    onLoginClick?: () => void;
    onPlanUpdate?: (updatedPlan: TrainingPlan) => void;
    onRegenerate?: () => void;
}

interface EditingWorkout {
    workout: Workout;
    discipline: Discipline;
    weekIndex: number;
    dayIndex: number;
    workoutIndex: number;
}

export function TrainingPlanView({
    plan,
    onBack,
    onSave,
    saveStatus = 'idle',
    isLoggedIn = false,
    onLoginClick,
    onPlanUpdate,
    onRegenerate
}: TrainingPlanViewProps) {
    const [selectedWeek, setSelectedWeek] = useState(0);
    const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
    const [editingWorkout, setEditingWorkout] = useState<EditingWorkout | null>(null);
    const [showRegenConfirm, setShowRegenConfirm] = useState(false);
    const [completingWorkout, setCompletingWorkout] = useState<{
        workout: Workout;
        weekIndex: number;
        dayIndex: number;
        workoutIndex: number;
    } | null>(null);

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

    const handleEditClick = (
        workout: Workout,
        discipline: Discipline,
        weekIndex: number,
        dayIndex: number,
        workoutIndex: number
    ) => {
        setEditingWorkout({ workout, discipline, weekIndex, dayIndex, workoutIndex });
    };

    const handleEditSave = (newWorkout: Workout, _libraryWorkoutId: string, _variationId: string) => {
        if (!editingWorkout || !onPlanUpdate) return;

        const { weekIndex, dayIndex, workoutIndex } = editingWorkout;

        // Create a deep copy of the plan
        const updatedPlan = { ...plan };
        updatedPlan.weeks = [...plan.weeks];
        updatedPlan.weeks[weekIndex] = { ...plan.weeks[weekIndex] };
        updatedPlan.weeks[weekIndex].days = [...plan.weeks[weekIndex].days];
        updatedPlan.weeks[weekIndex].days[dayIndex] = {
            ...plan.weeks[weekIndex].days[dayIndex]
        };
        updatedPlan.weeks[weekIndex].days[dayIndex].workouts = [
            ...plan.weeks[weekIndex].days[dayIndex].workouts
        ];
        updatedPlan.weeks[weekIndex].days[dayIndex].workouts[workoutIndex] = newWorkout;

        // Recalculate totals for this week
        updatedPlan.weeks[weekIndex] = recalculateWeekSummary(updatedPlan.weeks[weekIndex]);

        onPlanUpdate(updatedPlan);
        setEditingWorkout(null);
    };

    const handleCompletionSave = (completion: WorkoutCompletion) => {
        if (!completingWorkout || !onPlanUpdate) return;

        const { weekIndex, dayIndex, workoutIndex } = completingWorkout;

        const updatedPlan = { ...plan };
        updatedPlan.weeks = [...plan.weeks];
        updatedPlan.weeks[weekIndex] = { ...plan.weeks[weekIndex] };
        updatedPlan.weeks[weekIndex].days = [...plan.weeks[weekIndex].days];
        updatedPlan.weeks[weekIndex].days[dayIndex] = {
            ...plan.weeks[weekIndex].days[dayIndex]
        };
        updatedPlan.weeks[weekIndex].days[dayIndex].workouts = [
            ...plan.weeks[weekIndex].days[dayIndex].workouts
        ];
        updatedPlan.weeks[weekIndex].days[dayIndex].workouts[workoutIndex] = {
            ...completingWorkout.workout,
            completion
        };

        // Recalculate totals for this week
        updatedPlan.weeks[weekIndex] = recalculateWeekSummary(updatedPlan.weeks[weekIndex]);

        onPlanUpdate(updatedPlan);
        setCompletingWorkout(null);
    };

    // --- Drag and Drop Handlers ---
    const handleDragStart = (e: React.DragEvent, weekIdx: number, dayIdx: number, workoutIdx: number, workout: Workout) => {
        // Prevent drag if logged
        if (workout.completion?.status) {
            e.preventDefault();
            return;
        }

        // Store indices to identify source
        const data = JSON.stringify({ weekIdx, dayIdx, workoutIdx });
        e.dataTransfer.setData('application/json', data);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetWeekIdx: number, targetDayIdx: number) => {
        e.preventDefault();
        const dataStr = e.dataTransfer.getData('application/json');
        if (!dataStr) return;

        try {
            const { weekIdx: srcWeekIdx, dayIdx: srcDayIdx, workoutIdx: srcWorkoutIdx } = JSON.parse(dataStr);

            // Don't do anything if dropped on same day
            if (srcWeekIdx === targetWeekIdx && srcDayIdx === targetDayIdx) return;

            // Move Logic
            if (!onPlanUpdate) return;

            const updatedPlan = { ...plan };
            // Copy weeks array (and the specific weeks involved)
            updatedPlan.weeks = [...plan.weeks];

            // Ensure deep copies of source and target weeks/days
            // (If src and target are same week, we only copy once, but logic below handles it safely by index)
            if (srcWeekIdx === targetWeekIdx) {
                updatedPlan.weeks[srcWeekIdx] = { ...plan.weeks[srcWeekIdx] };
                updatedPlan.weeks[srcWeekIdx].days = [...plan.weeks[srcWeekIdx].days];
            } else {
                updatedPlan.weeks[srcWeekIdx] = { ...plan.weeks[srcWeekIdx] };
                updatedPlan.weeks[srcWeekIdx].days = [...plan.weeks[srcWeekIdx].days];
                updatedPlan.weeks[targetWeekIdx] = { ...plan.weeks[targetWeekIdx] };
                updatedPlan.weeks[targetWeekIdx].days = [...plan.weeks[targetWeekIdx].days];
            }

            const srcDay = updatedPlan.weeks[srcWeekIdx].days[srcDayIdx];
            const targetDay = updatedPlan.weeks[targetWeekIdx].days[targetDayIdx];

            // Get the workout
            const workoutToMove = srcDay.workouts[srcWorkoutIdx];

            // Remove from source
            srcDay.workouts = srcDay.workouts.filter((_, idx) => idx !== srcWorkoutIdx);

            // Add to target
            targetDay.workouts = [...targetDay.workouts, workoutToMove];

            // Update rest day flags if moving workouts implies status change? 
            // For now, we trust the user. If they drag a workout to a rest day, it becomes a training day.
            if (targetDay.isRestDay && targetDay.workouts.length > 0) {
                targetDay.isRestDay = false;
            }
            if (!srcDay.isRestDay && srcDay.workouts.length === 0) {
                srcDay.isRestDay = true;
            }

            // Recalculate summaries
            updatedPlan.weeks[srcWeekIdx] = recalculateWeekSummary(updatedPlan.weeks[srcWeekIdx]);
            if (srcWeekIdx !== targetWeekIdx) {
                updatedPlan.weeks[targetWeekIdx] = recalculateWeekSummary(updatedPlan.weeks[targetWeekIdx]);
            }

            onPlanUpdate(updatedPlan);

        } catch (err) {
            console.error('Failed to parse drag data', err);
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
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {onRegenerate && (
                        <button
                            className="btn btn-outline"
                            onClick={() => setShowRegenConfirm(true)}
                        >
                            🔄 Regenerate Plan
                        </button>
                    )}
                    <button
                        className={`btn save-btn ${saveStatus === 'saved' ? 'btn-success' : saveStatus === 'error' ? 'btn-error' : 'btn-primary'}`}
                        onClick={isLoggedIn ? onSave : onLoginClick}
                        disabled={saveStatus === 'saving'}
                    >
                        {getSaveButtonText()}
                    </button>
                </div>
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
                {currentWeek.days.map((day, dayIndex) => (
                    <div
                        key={day.date}
                        className={`day-card ${day.isRestDay ? 'rest-day' : ''}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, selectedWeek, dayIndex)}
                    >
                        <div className="day-header">
                            <span className="day-name">{getDayOfWeek(parseLocalDate(day.date))}</span>
                            <span className="day-date">{formatDisplayDate(day.date)}</span>
                        </div>

                        <div className="day-workouts">
                            {day.workouts.map((workout, workoutIndex) => (
                                <div
                                    key={workout.id}
                                    className={`workout-card ${workout.completion?.status ? `status-${workout.completion.status}` : ''}`}
                                    draggable={!workout.completion?.status}
                                    onDragStart={(e) => handleDragStart(e, selectedWeek, dayIndex, workoutIndex, workout)}
                                    style={{ cursor: !workout.completion?.status ? 'grab' : 'default' }}
                                >
                                    <button
                                        className="workout-summary"
                                        onClick={() => toggleWorkout(workout.id)}
                                        aria-expanded={expandedWorkout === workout.id}
                                    >
                                        <span className="workout-icon">{getDisciplineIcon(workout.discipline)}</span>
                                        {workout.completion && (
                                            <span
                                                className="completion-indicator"
                                                style={{ backgroundColor: getCompletionColor(workout) }}
                                            >
                                                {getCompletionIcon(workout)}
                                            </span>
                                        )}
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
                                            {/* Edit/Swap Buttons */}
                                            {onPlanUpdate && (
                                                <div className="workout-actions">
                                                    {workout.discipline !== 'rest' && !workout.completion && (
                                                        <button
                                                            className="action-btn edit-btn"
                                                            onClick={() => handleEditClick(
                                                                workout,
                                                                workout.discipline,
                                                                selectedWeek,
                                                                dayIndex,
                                                                workoutIndex
                                                            )}
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                    )}
                                                    {workout.discipline !== 'rest' && day.date <= new Date().toISOString().split('T')[0] && (
                                                        <button
                                                            className={`action-btn log-btn ${workout.completion?.status === 'completed' ? 'completed' : ''}`}
                                                            onClick={() => setCompletingWorkout({
                                                                workout,
                                                                weekIndex: selectedWeek,
                                                                dayIndex,
                                                                workoutIndex
                                                            })}
                                                        >
                                                            {workout.completion ? '📝 Update Log' : '✓ Log Workout'}
                                                        </button>
                                                    )}
                                                </div>
                                            )}

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

            {/* Edit Modal */}
            {editingWorkout && (
                <WorkoutEditModal
                    currentWorkout={editingWorkout.workout}
                    discipline={editingWorkout.discipline}
                    onSave={handleEditSave}
                    onClose={() => setEditingWorkout(null)}
                />
            )}

            {/* Completion Modal */}
            {completingWorkout && (
                <WorkoutCompletionModal
                    workout={completingWorkout.workout}
                    onSave={handleCompletionSave}
                    onClose={() => setCompletingWorkout(null)}
                />
            )}

            {/* Regenerate Confirmation Modal */}
            {showRegenConfirm && (
                <div className="modal-overlay" onClick={() => setShowRegenConfirm(false)}>
                    <div className="modal-content regen-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>🔄 Regenerate Training Plan?</h2>
                            <button className="modal-close" onClick={() => setShowRegenConfirm(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p><strong>This will update all future workouts.</strong></p>
                            <p className="warning-text">
                                Any custom modifications to future workouts will be replaced with newly generated workouts.
                            </p>
                            <p className="success-text">
                                <span className="success-icon">✓</span> Logged workouts will be preserved.
                            </p>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="btn btn-outline"
                                onClick={() => setShowRegenConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setShowRegenConfirm(false);
                                    onRegenerate?.();
                                }}
                            >
                                Regenerate Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
