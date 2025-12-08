/**
 * Workout Edit Modal
 * Edit workout details including title, description, date, and steps
 */

import { useState } from 'react';
import type { Workout, WorkoutStep } from '../types/race';
import './WorkoutEditModal.css';

interface WorkoutEditModalProps {
    workout: Workout;
    date: string;
    onSave: (updatedWorkout: Workout, newDate: string) => void;
    onClose: () => void;
}

export function WorkoutEditModal({ workout, date, onSave, onClose }: WorkoutEditModalProps) {
    const [title, setTitle] = useState(workout.title);
    const [description, setDescription] = useState(workout.description);
    const [workoutDate, setWorkoutDate] = useState(date);
    const [totalDuration, setTotalDuration] = useState(workout.totalDuration);
    const [steps, setSteps] = useState<WorkoutStep[]>([...workout.steps]);

    const handleStepChange = (index: number, field: keyof WorkoutStep, value: string | number) => {
        const newSteps = [...steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setSteps(newSteps);
    };

    const handleSave = () => {
        const updatedWorkout: Workout = {
            ...workout,
            title,
            description,
            totalDuration,
            steps,
        };
        onSave(updatedWorkout, workoutDate);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-content edit-modal">
                <div className="modal-header">
                    <h2>Edit Workout</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="workout-title">Title</label>
                        <input
                            id="workout-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="workout-description">Description</label>
                        <textarea
                            id="workout-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-input"
                            rows={2}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="workout-date">Date</label>
                            <input
                                id="workout-date"
                                type="date"
                                value={workoutDate}
                                onChange={(e) => setWorkoutDate(e.target.value)}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="workout-duration">Duration (min)</label>
                            <input
                                id="workout-duration"
                                type="number"
                                value={totalDuration}
                                onChange={(e) => setTotalDuration(parseInt(e.target.value) || 0)}
                                className="form-input"
                                min={0}
                            />
                        </div>
                    </div>

                    <div className="steps-editor">
                        <h3>Workout Steps</h3>
                        {steps.map((step, index) => (
                            <div key={index} className="step-edit-card">
                                <div className="step-edit-header">
                                    <span className="step-number">{index + 1}</span>
                                    <input
                                        type="text"
                                        value={step.name}
                                        onChange={(e) => handleStepChange(index, 'name', e.target.value)}
                                        className="step-name-input"
                                        placeholder="Step name"
                                    />
                                    <input
                                        type="text"
                                        value={step.duration}
                                        onChange={(e) => handleStepChange(index, 'duration', e.target.value)}
                                        className="step-duration-input"
                                        placeholder="Duration"
                                    />
                                </div>
                                <textarea
                                    value={step.instructions}
                                    onChange={(e) => handleStepChange(index, 'instructions', e.target.value)}
                                    className="step-instructions-input"
                                    placeholder="Instructions"
                                    rows={2}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
