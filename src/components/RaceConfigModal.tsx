import { useState, useEffect } from 'react';
import type { RaceDistance, RaceConfig } from '../types/race';
import './RaceConfigModal.css';

interface RaceConfigModalProps {
    isOpen: boolean;
    distance: RaceDistance | null;
    onClose: () => void;
    onSubmit: (config: RaceConfig) => void;
}

export function RaceConfigModal({ isOpen, distance, onClose, onSubmit }: RaceConfigModalProps) {
    const [raceName, setRaceName] = useState('');
    const [raceDate, setRaceDate] = useState('');
    const [targetHours, setTargetHours] = useState(0);
    const [targetMinutes, setTargetMinutes] = useState(0);
    const [maxWeeklyHours, setMaxWeeklyHours] = useState(8);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Calculate minimum date (1 week from today)
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 7);
    const minDateString = minDate.toISOString().split('T')[0];

    // Reset form when modal opens with new distance
    useEffect(() => {
        if (isOpen && distance) {
            setRaceName('');
            setRaceDate('');
            setTargetHours(0);
            setTargetMinutes(0);
            setMaxWeeklyHours(8);
            setErrors({});

            // Set default target time based on distance
            const defaultTime = distance.typicalTimes.intermediate;
            const [h, m] = defaultTime.split(':').map(Number);
            setTargetHours(h);
            setTargetMinutes(m);
        }
    }, [isOpen, distance]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!raceName.trim()) {
            newErrors.raceName = 'Race name is required';
        }

        if (!raceDate) {
            newErrors.raceDate = 'Race date is required';
        } else {
            const selectedDate = new Date(raceDate);
            if (selectedDate < minDate) {
                newErrors.raceDate = 'Race date must be at least 1 week from today';
            }
        }

        if (targetHours === 0 && targetMinutes === 0) {
            newErrors.targetTime = 'Target finish time is required';
        }

        if (maxWeeklyHours < 3 || maxWeeklyHours > 30) {
            newErrors.maxWeeklyHours = 'Weekly hours must be between 3 and 30';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate() || !distance) return;

        const config: RaceConfig = {
            distance,
            raceName: raceName.trim(),
            raceDate,
            targetTime: {
                hours: targetHours,
                minutes: targetMinutes,
            },
            maxWeeklyHours,
        };

        onSubmit(config);
    };

    if (!isOpen || !distance) return null;

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close modal">
                    ×
                </button>

                <div className="modal-header">
                    <div className="modal-distance-badge">
                        {distance.name}
                    </div>
                    <h2 id="modal-title" className="modal-title">Configure Your Race</h2>
                    <p className="modal-subtitle">
                        {distance.swim} Swim • {distance.bike} Bike • {distance.run} Run
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {/* Race Name */}
                    <div className="form-group">
                        <label htmlFor="raceName" className="form-label">
                            Race Name
                        </label>
                        <input
                            type="text"
                            id="raceName"
                            className={`form-input ${errors.raceName ? 'form-input-error' : ''}`}
                            placeholder="e.g., Ironman Arizona 2025"
                            value={raceName}
                            onChange={(e) => setRaceName(e.target.value)}
                            autoFocus
                        />
                        {errors.raceName && <span className="form-error">{errors.raceName}</span>}
                    </div>

                    {/* Race Date */}
                    <div className="form-group">
                        <label htmlFor="raceDate" className="form-label">
                            Race Date
                        </label>
                        <input
                            type="date"
                            id="raceDate"
                            className={`form-input ${errors.raceDate ? 'form-input-error' : ''}`}
                            min={minDateString}
                            value={raceDate}
                            onChange={(e) => setRaceDate(e.target.value)}
                        />
                        {errors.raceDate && <span className="form-error">{errors.raceDate}</span>}
                        <span className="form-hint">Must be at least 1 week from today</span>
                    </div>

                    {/* Target Finish Time */}
                    <div className="form-group">
                        <label className="form-label">
                            Target Finish Time
                        </label>
                        <div className="time-inputs">
                            <div className="time-input-group">
                                <input
                                    type="number"
                                    id="targetHours"
                                    className={`form-input time-input ${errors.targetTime ? 'form-input-error' : ''}`}
                                    min="0"
                                    max="20"
                                    value={targetHours}
                                    onChange={(e) => setTargetHours(Math.max(0, parseInt(e.target.value) || 0))}
                                />
                                <span className="time-label">hours</span>
                            </div>
                            <span className="time-separator">:</span>
                            <div className="time-input-group">
                                <input
                                    type="number"
                                    id="targetMinutes"
                                    className={`form-input time-input ${errors.targetTime ? 'form-input-error' : ''}`}
                                    min="0"
                                    max="59"
                                    value={targetMinutes}
                                    onChange={(e) => setTargetMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                                />
                                <span className="time-label">min</span>
                            </div>
                        </div>
                        {errors.targetTime && <span className="form-error">{errors.targetTime}</span>}
                        <span className="form-hint">
                            Typical times: Beginner {distance.typicalTimes.beginner} •
                            Intermediate {distance.typicalTimes.intermediate} •
                            Advanced {distance.typicalTimes.advanced}
                        </span>
                    </div>

                    {/* Max Weekly Hours */}
                    <div className="form-group">
                        <label htmlFor="maxWeeklyHours" className="form-label">
                            Maximum Weekly Training Hours
                            <span className="form-label-sub">(Peak week volume)</span>
                        </label>
                        <div className="range-input-container">
                            <input
                                type="range"
                                id="maxWeeklyHours"
                                className="form-range"
                                min="3"
                                max="25"
                                step="1"
                                value={maxWeeklyHours}
                                onChange={(e) => setMaxWeeklyHours(parseInt(e.target.value))}
                            />
                            <span className="range-value">{maxWeeklyHours} hrs/week</span>
                        </div>
                        {errors.maxWeeklyHours && <span className="form-error">{errors.maxWeeklyHours}</span>}
                        <span className="form-hint">
                            {maxWeeklyHours <= 6 ? 'Beginner level' :
                                maxWeeklyHours <= 10 ? 'Intermediate level' :
                                    maxWeeklyHours <= 15 ? 'Advanced level' : 'Elite level'}
                        </span>
                    </div>

                    {/* Submit Button */}
                    <div className="modal-actions">
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Generate Training Plan
                            <span className="btn-arrow">→</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
