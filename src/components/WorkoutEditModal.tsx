/**
 * Workout Edit Modal
 * Modern 2-column layout: Library on left, Editor on right.
 */

import { useState, useMemo, useEffect } from 'react';
import { WORKOUT_LIBRARY } from '../data/workoutLibrary';
import type { Workout, Discipline, WorkoutStep } from '../types/race';
import type { LibraryWorkout, WorkoutVariation } from '../types/workoutLibrary';
import './WorkoutEditModal.css';

interface WorkoutEditModalProps {
    currentWorkout: Workout;
    discipline: Discipline;
    onSave: (newWorkout: Workout, libraryWorkoutId: string, variationId: string) => void;
    onClose: () => void;
}

export function WorkoutEditModal({ currentWorkout, discipline, onSave, onClose }: WorkoutEditModalProps) {
    // Mode: 'custom' (editing current) or 'library' (selected from library)
    const [mode, setMode] = useState<'custom' | 'library'>('custom');

    // Selection state
    const [selectedWorkout, setSelectedWorkout] = useState<LibraryWorkout | null>(null);
    const [selectedVariation, setSelectedVariation] = useState<WorkoutVariation | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    // Editor state (initialized from currentWorkout)
    const [customTitle, setCustomTitle] = useState(currentWorkout.title);

    // Reset title when switching selections
    useEffect(() => {
        if (mode === 'library' && selectedWorkout) {
            setCustomTitle(selectedWorkout.title);
        } else if (mode === 'custom') {
            setCustomTitle(currentWorkout.title);
        }
    }, [mode, selectedWorkout, currentWorkout]);

    // Available workouts map
    const availableWorkouts = useMemo(() => {
        return WORKOUT_LIBRARY.filter(w => {
            if (w.discipline !== discipline) return false;
            // Also filter out 'test' category if user is beginner? No, let them see it.
            if (categoryFilter !== 'all' && w.category !== categoryFilter) return false;
            return true;
        });
    }, [discipline, categoryFilter]);

    // Unique categories
    const categories = useMemo(() => {
        const cats = new Set(
            WORKOUT_LIBRARY
                .filter(w => w.discipline === discipline)
                .map(w => w.category)
        );
        return Array.from(cats);
    }, [discipline]);

    // Helpers
    const getDisciplineIcon = (d: string) => {
        switch (d) {
            case 'swim': return '🏊‍♂️';
            case 'bike': return '🚴‍♂️';
            case 'run': return '🏃‍♂️';
            case 'brick': return '🔥';
            case 'strength': return '💪';
            default: return '📋';
        }
    };

    const getIntensityColor = (intensity: string) => {
        switch (intensity) {
            case 'recovery': return '#94a3b8'; // gray-400
            case 'easy': return '#22c55e'; // green-500
            case 'moderate': return '#3b82f6'; // blue-500
            case 'tempo': return '#eab308'; // yellow-500
            case 'threshold': return '#f97316'; // orange-500
            case 'intervals': return '#ef4444'; // red-500
            default: return '#cbd5e1'; // slate-300
        }
    };

    const parseDuration = (durStr: string): number => {
        const match = durStr.match(/(\d+)/);
        return match ? parseInt(match[1]) : 1;
    };

    const getVisualSegments = (steps: WorkoutStep[]) => {
        const parsedSteps = steps.map(s => ({
            color: getIntensityColor(s.intensity),
            duration: parseDuration(s.duration)
        }));
        const totalDuration = parsedSteps.reduce((acc, s) => acc + s.duration, 0);

        return parsedSteps.map(s => ({
            color: s.color,
            width: totalDuration > 0 ? (s.duration / totalDuration) * 100 : 0
        }));
    };

    const handleLibrarySelect = (workout: LibraryWorkout) => {
        setMode('library');
        setSelectedWorkout(workout);
        setSelectedVariation(workout.variations[0]);
    };

    const handleSave = () => {
        // Construct the new workout object
        let newWorkout: Workout;

        if (mode === 'custom') {
            // Keep existing structure, just update title
            newWorkout = {
                ...currentWorkout,
                title: customTitle,
            };
            // Pass empty IDs for library tracking
            onSave(newWorkout, '', '');
        } else {
            // Build from library selection
            if (!selectedWorkout || !selectedVariation) return;

            newWorkout = {
                id: currentWorkout.id,
                discipline: selectedWorkout.discipline,
                title: customTitle, // User might have renamed the library workout
                description: selectedWorkout.description,
                totalDuration: selectedVariation.duration,
                steps: selectedVariation.steps,
                tips: selectedWorkout.tips,
                // Preserve completion status if it exists
                completion: currentWorkout.completion
            };
            onSave(newWorkout, selectedWorkout.id, selectedVariation.id);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    // Data for the preview pane
    const previewData = useMemo(() => {
        if (mode === 'custom') {
            return {
                description: currentWorkout.description,
                steps: currentWorkout.steps,
                duration: currentWorkout.totalDuration,
                variations: [] as WorkoutVariation[] // No variations for custom
            };
        } else if (selectedWorkout && selectedVariation) {
            return {
                description: selectedWorkout.description,
                steps: selectedVariation.steps,
                duration: selectedVariation.duration,
                variations: selectedWorkout.variations
            };
        }
        return null;
    }, [mode, currentWorkout, selectedWorkout, selectedVariation]);

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-content edit-modal">
                {/* Header */}
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h2>Edit Workout</h2>
                        <span className="discipline-badge">
                            {getDisciplineIcon(discipline)} {discipline.charAt(0).toUpperCase() + discipline.slice(1)}
                        </span>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="edit-modal-body">
                    {/* Left: Library */}
                    <div className="library-column">
                        <div className="library-filters">
                            <button
                                className={`category-btn ${categoryFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setCategoryFilter('all')}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`category-btn ${categoryFilter === cat ? 'active' : ''}`}
                                    onClick={() => setCategoryFilter(cat)}
                                >
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="library-list">
                            {/* Current Workout Item (Top of list) */}
                            <div
                                className={`library-item ${mode === 'custom' ? 'selected' : ''}`}
                                onClick={() => setMode('custom')}
                            >
                                <div className="item-main">
                                    <strong>Current Workout</strong>
                                    <div className="workout-mini-viz">
                                        {getVisualSegments(currentWorkout.steps).map((seg, idx) => (
                                            <div
                                                key={idx}
                                                className="viz-segment"
                                                style={{ backgroundColor: seg.color, width: `${seg.width}%` }}
                                            />
                                        ))}
                                    </div>
                                    <p className="library-desc">Keep current steps and settings, just edit title.</p>
                                </div>
                                <div className="item-meta">
                                    <span>Existing</span>
                                    <span>{currentWorkout.totalDuration} min</span>
                                </div>
                            </div>

                            {availableWorkouts.map(workout => (
                                <div
                                    key={workout.id}
                                    className={`library-item ${mode === 'library' && selectedWorkout?.id === workout.id ? 'selected' : ''}`}
                                    onClick={() => handleLibrarySelect(workout)}
                                >
                                    <div className="item-main">
                                        <strong>{workout.title}</strong>
                                        {/* Visual Intensity Bar */}
                                        <div className="workout-mini-viz">
                                            {getVisualSegments(workout.variations[0].steps).map((seg, idx) => (
                                                <div
                                                    key={idx}
                                                    className="viz-segment"
                                                    style={{ backgroundColor: seg.color, width: `${seg.width}%` }}
                                                />
                                            ))}
                                        </div>
                                        <p className="library-desc">{workout.description}</p>
                                    </div>
                                    <div className="item-meta">
                                        <span>{workout.category}</span>
                                        <span>{workout.variations.map(v => v.label).join(' / ')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Editor */}
                    <div className="editor-column">
                        <div className="editor-card">
                            {previewData ? (
                                <>
                                    <div className="editor-section">
                                        <label>Workout Title</label>
                                        <input
                                            type="text"
                                            className="title-input"
                                            value={customTitle}
                                            onChange={(e) => setCustomTitle(e.target.value)}
                                            placeholder="Enter title..."
                                        />
                                    </div>

                                    {/* Duration/Variation Selector */}
                                    {mode === 'library' && previewData.variations.length > 1 && (
                                        <div className="editor-section">
                                            <label>Duration / Variation</label>
                                            <div className="variation-tabs">
                                                {previewData.variations.map(v => (
                                                    <button
                                                        key={v.id}
                                                        className={`variation-tab ${selectedVariation?.id === v.id ? 'active' : ''}`}
                                                        onClick={() => setSelectedVariation(v)}
                                                    >
                                                        {v.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {mode === 'custom' && (
                                        <div className="editor-section">
                                            <label>Duration</label>
                                            <div style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--neutral-800)' }}>
                                                {currentWorkout.totalDuration} min
                                            </div>
                                        </div>
                                    )}

                                    <div className="editor-section">
                                        <label>Description</label>
                                        <p className="description-text">{previewData.description}</p>
                                    </div>

                                    <div className="editor-section">
                                        <label>Steps</label>
                                        <div className="steps-list">
                                            {previewData.steps.map((step, idx) => (
                                                <div key={idx} className="step-row">
                                                    <div className="step-header">
                                                        <span
                                                            className="step-intensity"
                                                            style={{ backgroundColor: getIntensityColor(step.intensity) }}
                                                        >
                                                            {step.intensity}
                                                        </span>
                                                        <span className="step-name">{step.name}</span>
                                                        <span className="step-duration">{step.duration}</span>
                                                    </div>
                                                    <div className="step-details">
                                                        <p className="step-instructions">{step.instructions}</p>
                                                        <div className="step-metrics">
                                                            {step.targetHeartRateZone && (
                                                                <span className="metric-tag">❤️ Zone {step.targetHeartRateZone}</span>
                                                            )}
                                                            {step.targetPace && (
                                                                <span className="metric-tag">⚡ {step.targetPace}</span>
                                                            )}
                                                            {step.cadence && (
                                                                <span className="metric-tag">🔄 {step.cadence}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--neutral-400)' }}>
                                    Select a workout to view details
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        {mode === 'custom' ? 'Save Changes' : 'Swap & Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}
