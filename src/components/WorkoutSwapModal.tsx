/**
 * Workout Swap Modal
 * Swap a workout in the plan with one from the library
 */

import { useState, useMemo } from 'react';
import { WORKOUT_LIBRARY } from '../data/workoutLibrary';
import type { Workout, Discipline } from '../types/race';
import type { LibraryWorkout, WorkoutVariation } from '../types/workoutLibrary';
import './WorkoutSwapModal.css';

interface WorkoutSwapModalProps {
    currentWorkout: Workout;
    discipline: Discipline;
    onSwap: (newWorkout: Workout, libraryWorkoutId: string, variationId: string) => void;
    onClose: () => void;
}

export function WorkoutSwapModal({ currentWorkout, discipline, onSwap, onClose }: WorkoutSwapModalProps) {
    const [selectedWorkout, setSelectedWorkout] = useState<LibraryWorkout | null>(null);
    const [selectedVariation, setSelectedVariation] = useState<WorkoutVariation | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    // Get workouts for the same discipline
    const availableWorkouts = useMemo(() => {
        return WORKOUT_LIBRARY.filter(w => {
            if (w.discipline !== discipline) return false;
            if (categoryFilter !== 'all' && w.category !== categoryFilter) return false;
            return true;
        });
    }, [discipline, categoryFilter]);

    // Get unique categories for this discipline
    const categories = useMemo(() => {
        const cats = new Set(
            WORKOUT_LIBRARY
                .filter(w => w.discipline === discipline)
                .map(w => w.category)
        );
        return Array.from(cats);
    }, [discipline]);

    const getDisciplineIcon = (d: string): string => {
        switch (d) {
            case 'swim': return '🏊‍♂️';
            case 'bike': return '🚴‍♂️';
            case 'run': return '🏃‍♂️';
            case 'brick': return '🔥';
            case 'strength': return '💪';
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
            default: return 'var(--neutral-500)';
        }
    };

    const handleSelectWorkout = (workout: LibraryWorkout) => {
        setSelectedWorkout(workout);
        setSelectedVariation(workout.variations[0]);
    };

    const handleConfirmSwap = () => {
        if (!selectedWorkout || !selectedVariation) return;

        const newWorkout: Workout = {
            id: currentWorkout.id, // Keep the same ID for position
            discipline: selectedWorkout.discipline,
            title: selectedWorkout.title,
            description: selectedWorkout.description,
            totalDuration: selectedVariation.duration,
            steps: selectedVariation.steps,
            tips: selectedWorkout.tips,
        };

        onSwap(newWorkout, selectedWorkout.id, selectedVariation.id);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-content swap-modal">
                <div className="modal-header">
                    <div className="modal-header-info">
                        <h2>Swap Workout</h2>
                        <span className="discipline-badge">
                            {getDisciplineIcon(discipline)} {discipline.charAt(0).toUpperCase() + discipline.slice(1)} Workouts
                        </span>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {/* Current Workout */}
                    <div className="current-workout-section">
                        <h3>Currently Assigned</h3>
                        <div className="current-workout-card">
                            <strong>{currentWorkout.title}</strong>
                            <span>{currentWorkout.totalDuration} min</span>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="swap-category-filter">
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

                    {/* Workout List */}
                    <div className="swap-workout-list">
                        {availableWorkouts.map(workout => (
                            <button
                                key={workout.id}
                                className={`swap-workout-item ${selectedWorkout?.id === workout.id ? 'selected' : ''}`}
                                onClick={() => handleSelectWorkout(workout)}
                            >
                                <div className="swap-workout-info">
                                    <strong>{workout.title}</strong>
                                    <span className="workout-category">{workout.category}</span>
                                </div>
                                <span className="workout-duration">
                                    {workout.variations.map(v => v.label).join(' / ')}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Selected Workout Preview */}
                    {selectedWorkout && selectedVariation && (
                        <div className="swap-preview">
                            <h3>Preview: {selectedWorkout.title}</h3>

                            {/* Variation Selector */}
                            {selectedWorkout.variations.length > 1 && (
                                <div className="variation-selector">
                                    <label>Duration:</label>
                                    <div className="variation-buttons">
                                        {selectedWorkout.variations.map(v => (
                                            <button
                                                key={v.id}
                                                className={`variation-btn ${selectedVariation.id === v.id ? 'active' : ''}`}
                                                onClick={() => setSelectedVariation(v)}
                                            >
                                                {v.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className="preview-description">{selectedWorkout.description}</p>

                            <div className="preview-steps">
                                {selectedVariation.steps.slice(0, 3).map((step, idx) => (
                                    <div key={idx} className="preview-step">
                                        <span
                                            className="step-intensity"
                                            style={{ backgroundColor: getIntensityColor(step.intensity) }}
                                        >
                                            {step.intensity}
                                        </span>
                                        <span className="step-name">{step.name}</span>
                                        <span className="step-duration">{step.duration}</span>
                                    </div>
                                ))}
                                {selectedVariation.steps.length > 3 && (
                                    <p className="more-steps">
                                        +{selectedVariation.steps.length - 3} more steps...
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleConfirmSwap}
                        disabled={!selectedWorkout || !selectedVariation}
                    >
                        Swap Workout
                    </button>
                </div>
            </div>
        </div>
    );
}
