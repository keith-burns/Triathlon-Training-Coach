/**
 * Workout Completion Modal
 * Mark workouts as completed/skipped with RPE and notes
 */

import { useState } from 'react';
import type { Workout, CompletionStatus, WorkoutCompletion } from '../types/race';
import './WorkoutCompletionModal.css';

interface WorkoutCompletionModalProps {
    workout: Workout;
    onSave: (completion: WorkoutCompletion) => void;
    onClose: () => void;
}

const RPE_LABELS: Record<number, { label: string; color: string }> = {
    1: { label: 'Very Light', color: 'var(--success)' },
    2: { label: 'Light', color: 'var(--success)' },
    3: { label: 'Moderate', color: '#84cc16' },
    4: { label: 'Somewhat Hard', color: '#84cc16' },
    5: { label: 'Hard', color: 'var(--warning)' },
    6: { label: 'Hard', color: 'var(--warning)' },
    7: { label: 'Very Hard', color: '#f97316' },
    8: { label: 'Very Hard', color: '#f97316' },
    9: { label: 'Extremely Hard', color: 'var(--error)' },
    10: { label: 'Maximum Effort', color: 'var(--error)' },
};

// Map workout intensity to target RPE
function getTargetRPE(workout: Workout): number {
    const mainIntensity = workout.steps.length > 0
        ? workout.steps.reduce((max, step) => {
            const intensityOrder = ['recovery', 'easy', 'moderate', 'tempo', 'threshold', 'intervals', 'race'];
            return intensityOrder.indexOf(step.intensity) > intensityOrder.indexOf(max) ? step.intensity : max;
        }, 'recovery')
        : 'easy';

    switch (mainIntensity) {
        case 'recovery': return 2;
        case 'easy': return 3;
        case 'moderate': return 4;
        case 'tempo': return 6;
        case 'threshold': return 7;
        case 'intervals': return 8;
        case 'race': return 9;
        default: return 5;
    }
}

export function WorkoutCompletionModal({ workout, onSave, onClose }: WorkoutCompletionModalProps) {
    const [status, setStatus] = useState<CompletionStatus>(
        workout.completion?.status || 'completed'
    );
    const [actualDuration, setActualDuration] = useState(
        workout.completion?.actualDuration || workout.totalDuration
    );
    const [perceivedEffort, setPerceivedEffort] = useState(
        workout.completion?.perceivedEffort || 5
    );
    const [notes, setNotes] = useState(workout.completion?.notes || '');

    const targetEffort = getTargetRPE(workout);
    const effortDiff = perceivedEffort - targetEffort;

    const handleSave = () => {
        const completion: WorkoutCompletion = {
            status,
            completedAt: new Date().toISOString(),
            actualDuration: status === 'skipped' ? 0 : actualDuration,
            perceivedEffort: status === 'skipped' ? undefined : perceivedEffort,
            targetEffort,
            notes: notes.trim() || undefined,
        };
        onSave(completion);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-content completion-modal">
                <div className="modal-header">
                    <h2>Log Workout</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {/* Workout Info */}
                    <div className="workout-info-banner">
                        <strong>{workout.title}</strong>
                        <span>{workout.totalDuration} min planned</span>
                    </div>

                    {/* Status Selection */}
                    <div className="status-selector">
                        <button
                            className={`status-btn completed ${status === 'completed' ? 'active' : ''}`}
                            onClick={() => setStatus('completed')}
                        >
                            <span className="status-icon">✓</span>
                            <span>Completed</span>
                        </button>
                        <button
                            className={`status-btn partial ${status === 'partial' ? 'active' : ''}`}
                            onClick={() => setStatus('partial')}
                        >
                            <span className="status-icon">◐</span>
                            <span>Partial</span>
                        </button>
                        <button
                            className={`status-btn skipped ${status === 'skipped' ? 'active' : ''}`}
                            onClick={() => setStatus('skipped')}
                        >
                            <span className="status-icon">⏭</span>
                            <span>Skipped</span>
                        </button>
                    </div>

                    {status !== 'skipped' && (
                        <>
                            {/* Duration */}
                            <div className="form-group">
                                <label>Actual Duration (minutes)</label>
                                <input
                                    type="number"
                                    value={actualDuration}
                                    onChange={(e) => setActualDuration(parseInt(e.target.value) || 0)}
                                    min={0}
                                    className="form-input"
                                />
                            </div>

                            {/* RPE Slider */}
                            <div className="form-group rpe-group">
                                <label>
                                    How hard did it feel? (RPE)
                                    <span className="target-rpe">Target: {targetEffort}</span>
                                </label>
                                <div className="rpe-slider-container">
                                    <input
                                        type="range"
                                        min={1}
                                        max={10}
                                        value={perceivedEffort}
                                        onChange={(e) => setPerceivedEffort(parseInt(e.target.value))}
                                        className="rpe-slider"
                                        style={{
                                            background: `linear-gradient(to right, ${RPE_LABELS[perceivedEffort].color} 0%, ${RPE_LABELS[perceivedEffort].color} ${(perceivedEffort - 1) * 11.1}%, var(--neutral-200) ${(perceivedEffort - 1) * 11.1}%)`
                                        }}
                                    />
                                    <div className="rpe-value" style={{ color: RPE_LABELS[perceivedEffort].color }}>
                                        <span className="rpe-number">{perceivedEffort}</span>
                                        <span className="rpe-label">{RPE_LABELS[perceivedEffort].label}</span>
                                    </div>
                                </div>

                                {/* Effort Feedback */}
                                {effortDiff >= 2 && (
                                    <div className="effort-feedback warning">
                                        ⚠️ This felt harder than expected. Consider recovery in upcoming workouts.
                                    </div>
                                )}
                                {effortDiff <= -2 && (
                                    <div className="effort-feedback success">
                                        💪 Great job! You might be ready for more intensity.
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Notes */}
                    <div className="form-group">
                        <label>Notes (optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="How did it go? Any observations..."
                            className="form-input"
                            rows={3}
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
