/**
 * Workout Library Component
 * Browse and explore the workout library
 */

import { useState, useMemo } from 'react';
import { WORKOUT_LIBRARY } from '../data/workoutLibrary';
import type { LibraryWorkout, WorkoutVariation } from '../types/workoutLibrary';
import type { Discipline } from '../types/race';
import './WorkoutLibrary.css';

type CategoryFilter = 'all' | 'endurance' | 'intervals' | 'tempo' | 'technique' | 'test' | 'recovery' | 'speed' | 'strength';

const DISCIPLINE_FILTERS: { id: Discipline | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'swim', label: 'Swim', icon: '🏊‍♂️' },
    { id: 'bike', label: 'Bike', icon: '🚴‍♂️' },
    { id: 'run', label: 'Run', icon: '🏃‍♂️' },
    { id: 'brick', label: 'Brick', icon: '🔥' },
    { id: 'strength', label: 'Strength', icon: '💪' },
];

const CATEGORY_FILTERS: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All Types' },
    { id: 'endurance', label: 'Endurance' },
    { id: 'intervals', label: 'Intervals' },
    { id: 'tempo', label: 'Tempo' },
    { id: 'technique', label: 'Technique' },
    { id: 'test', label: 'Tests' },
    { id: 'recovery', label: 'Recovery' },
];

export function WorkoutLibrary() {
    const [disciplineFilter, setDisciplineFilter] = useState<Discipline | 'all'>('all');
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
    const [selectedVariation, setSelectedVariation] = useState<Record<string, string>>({});

    const filteredWorkouts = useMemo(() => {
        return WORKOUT_LIBRARY.filter(workout => {
            // Discipline filter
            if (disciplineFilter !== 'all' && workout.discipline !== disciplineFilter) {
                return false;
            }
            // Category filter
            if (categoryFilter !== 'all' && workout.category !== categoryFilter) {
                return false;
            }
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    workout.title.toLowerCase().includes(query) ||
                    workout.description.toLowerCase().includes(query)
                );
            }
            return true;
        });
    }, [disciplineFilter, categoryFilter, searchQuery]);

    const getDisciplineIcon = (discipline: string): string => {
        switch (discipline) {
            case 'swim': return '🏊‍♂️';
            case 'bike': return '🚴‍♂️';
            case 'run': return '🏃‍♂️';
            case 'brick': return '🔥';
            case 'strength': return '💪';
            default: return '📋';
        }
    };

    const getDifficultyColor = (difficulty: string): string => {
        switch (difficulty) {
            case 'beginner': return 'var(--success)';
            case 'intermediate': return 'var(--warning)';
            case 'advanced': return 'var(--error)';
            default: return 'var(--neutral-500)';
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
        if (expandedWorkout === workoutId) {
            setExpandedWorkout(null);
        } else {
            setExpandedWorkout(workoutId);
            // Set default variation if not already selected
            if (!selectedVariation[workoutId]) {
                const workout = WORKOUT_LIBRARY.find(w => w.id === workoutId);
                if (workout && workout.variations.length > 0) {
                    setSelectedVariation(prev => ({
                        ...prev,
                        [workoutId]: workout.variations[0].id
                    }));
                }
            }
        }
    };

    const getSelectedVariation = (workout: LibraryWorkout): WorkoutVariation | undefined => {
        const variationId = selectedVariation[workout.id];
        return workout.variations.find(v => v.id === variationId) || workout.variations[0];
    };

    return (
        <div className="workout-library">
            <header className="library-header">
                <h1>Workout Library</h1>
                <p>Explore professional triathlon workouts for all disciplines</p>
            </header>

            {/* Search Bar */}
            <div className="library-search">
                <input
                    type="text"
                    placeholder="Search workouts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Discipline Filters */}
            <div className="discipline-filters">
                {DISCIPLINE_FILTERS.map(filter => (
                    <button
                        key={filter.id}
                        className={`discipline-filter ${disciplineFilter === filter.id ? 'active' : ''}`}
                        onClick={() => setDisciplineFilter(filter.id)}
                    >
                        <span className="filter-icon">{filter.icon}</span>
                        <span className="filter-label">{filter.label}</span>
                    </button>
                ))}
            </div>

            {/* Category Filters */}
            <div className="category-filters">
                {CATEGORY_FILTERS.map(filter => (
                    <button
                        key={filter.id}
                        className={`category-filter ${categoryFilter === filter.id ? 'active' : ''}`}
                        onClick={() => setCategoryFilter(filter.id)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Results Count */}
            <div className="results-count">
                {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''} found
            </div>

            {/* Workout Grid */}
            <div className="workout-grid">
                {filteredWorkouts.map(workout => {
                    const variation = getSelectedVariation(workout);
                    const isExpanded = expandedWorkout === workout.id;

                    return (
                        <div
                            key={workout.id}
                            className={`library-workout-card ${workout.discipline} ${isExpanded ? 'expanded' : ''}`}
                        >
                            <button
                                className="workout-card-header"
                                onClick={() => toggleWorkout(workout.id)}
                            >
                                <div className="workout-card-title">
                                    <span className="discipline-icon">{getDisciplineIcon(workout.discipline)}</span>
                                    <div className="title-text">
                                        <h3>{workout.title}</h3>
                                        <span className="category-badge">{workout.category}</span>
                                    </div>
                                </div>
                                <div className="workout-card-meta">
                                    <span
                                        className="difficulty-badge"
                                        style={{ backgroundColor: getDifficultyColor(workout.difficulty) }}
                                    >
                                        {workout.difficulty}
                                    </span>
                                    <span className="duration-badge">
                                        {workout.variations.map(v => v.label).join(' / ')}
                                    </span>
                                    <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
                                </div>
                            </button>

                            {isExpanded && variation && (
                                <div className="workout-card-details">
                                    <p className="workout-description">{workout.description}</p>

                                    {/* Duration Variations */}
                                    {workout.variations.length > 1 && (
                                        <div className="variation-selector">
                                            <label>Duration:</label>
                                            <div className="variation-buttons">
                                                {workout.variations.map(v => (
                                                    <button
                                                        key={v.id}
                                                        className={`variation-btn ${selectedVariation[workout.id] === v.id ? 'active' : ''}`}
                                                        onClick={() => setSelectedVariation(prev => ({
                                                            ...prev,
                                                            [workout.id]: v.id
                                                        }))}
                                                    >
                                                        {v.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Workout Steps */}
                                    <div className="workout-steps">
                                        <h4>Workout Structure</h4>
                                        {variation.steps.map((step, idx) => (
                                            <div key={idx} className="step-item">
                                                <div className="step-header">
                                                    <span
                                                        className="step-intensity"
                                                        style={{ backgroundColor: getIntensityColor(step.intensity) }}
                                                    >
                                                        {step.intensity}
                                                    </span>
                                                    <span className="step-duration">{step.duration}</span>
                                                </div>
                                                <h5>{step.name}</h5>
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
                                        ))}
                                    </div>

                                    {/* Tips */}
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

                                    {/* Equipment */}
                                    {workout.equipment && workout.equipment.length > 0 && (
                                        <div className="workout-equipment">
                                            <h4>🏋️ Equipment Needed</h4>
                                            <div className="equipment-list">
                                                {workout.equipment.map((item, i) => (
                                                    <span key={i} className="equipment-badge">{item}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {filteredWorkouts.length === 0 && (
                <div className="no-results">
                    <p>No workouts found matching your filters.</p>
                    <button onClick={() => {
                        setDisciplineFilter('all');
                        setCategoryFilter('all');
                        setSearchQuery('');
                    }}>
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
