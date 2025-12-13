/**
 * Goals Page Component
 * Edit race goals and regenerate training plan
 */

import { useState, useEffect } from 'react';
import type { RaceConfig, RaceDistanceId } from '../types/race';
import { RACE_DISTANCES } from '../types/race';
import './GoalsPage.css';

interface GoalsPageProps {
    currentConfig: RaceConfig;
    onSave: (config: RaceConfig) => void;
}

export function GoalsPage({ currentConfig, onSave }: GoalsPageProps) {
    const [distanceId, setDistanceId] = useState<RaceDistanceId>(currentConfig.distance.id);
    const [raceName, setRaceName] = useState(currentConfig.raceName);
    const [raceDate, setRaceDate] = useState(currentConfig.raceDate);
    const [targetHours, setTargetHours] = useState(currentConfig.targetTime.hours);
    const [targetMinutes, setTargetMinutes] = useState(currentConfig.targetTime.minutes);
    const [maxWeeklyHours, setMaxWeeklyHours] = useState(currentConfig.maxWeeklyHours);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [hasChanges, setHasChanges] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    const distance = RACE_DISTANCES[distanceId];

    // Calculate minimum date (1 week from today)
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 7);
    const minDateString = minDate.toISOString().split('T')[0];

    // Track changes
    useEffect(() => {
        const changed =
            distanceId !== currentConfig.distance.id ||
            raceName !== currentConfig.raceName ||
            raceDate !== currentConfig.raceDate ||
            targetHours !== currentConfig.targetTime.hours ||
            targetMinutes !== currentConfig.targetTime.minutes ||
            maxWeeklyHours !== currentConfig.maxWeeklyHours;
        setHasChanges(changed);
        if (changed) {
            setSaveMessage(null);
        }
    }, [distanceId, raceName, raceDate, targetHours, targetMinutes, maxWeeklyHours, currentConfig]);

    // Update default target time when distance changes
    useEffect(() => {
        if (distanceId !== currentConfig.distance.id) {
            const newDistance = RACE_DISTANCES[distanceId];
            const defaultTime = newDistance.typicalTimes.intermediate;
            const [h, m] = defaultTime.split(':').map(Number);
            setTargetHours(h);
            setTargetMinutes(m);
        }
    }, [distanceId, currentConfig.distance.id]);

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

        if (!validate()) return;

        const config: RaceConfig = {
            distance: RACE_DISTANCES[distanceId],
            raceName: raceName.trim(),
            raceDate,
            targetTime: {
                hours: targetHours,
                minutes: targetMinutes,
            },
            maxWeeklyHours,
        };

        onSave(config);
        setSaveMessage('Goals updated! Your training plan has been regenerated. Logged workouts are preserved.');
        setHasChanges(false);
    };

    const handleReset = () => {
        setDistanceId(currentConfig.distance.id);
        setRaceName(currentConfig.raceName);
        setRaceDate(currentConfig.raceDate);
        setTargetHours(currentConfig.targetTime.hours);
        setTargetMinutes(currentConfig.targetTime.minutes);
        setMaxWeeklyHours(currentConfig.maxWeeklyHours);
        setErrors({});
        setSaveMessage(null);
    };

    return (
        <div className="goals-page">
            <header className="goals-header">
                <h1>🎯 Race Goals</h1>
                <p>Edit your race details to update your training plan</p>
            </header>

            <form onSubmit={handleSubmit} className="goals-form">
                {/* Distance Selection */}
                <div className="form-section">
                    <h2>Race Distance</h2>
                    <div className="distance-selector">
                        {Object.entries(RACE_DISTANCES).map(([id, dist]) => (
                            <button
                                key={id}
                                type="button"
                                className={`distance-option ${distanceId === id ? 'active' : ''}`}
                                onClick={() => setDistanceId(id as RaceDistanceId)}
                            >
                                <span className="distance-name">{dist.name}</span>
                                <span className="distance-details">
                                    {dist.swim} • {dist.bike} • {dist.run}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Race Details */}
                <div className="form-section">
                    <h2>Race Details</h2>

                    <div className="form-group">
                        <label htmlFor="raceName" className="form-label">Race Name</label>
                        <input
                            type="text"
                            id="raceName"
                            className={`form-input ${errors.raceName ? 'form-input-error' : ''}`}
                            placeholder="e.g., Ironman Arizona 2025"
                            value={raceName}
                            onChange={(e) => setRaceName(e.target.value)}
                        />
                        {errors.raceName && <span className="form-error">{errors.raceName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="raceDate" className="form-label">Race Date</label>
                        <input
                            type="date"
                            id="raceDate"
                            className={`form-input ${errors.raceDate ? 'form-input-error' : ''}`}
                            min={minDateString}
                            value={raceDate}
                            onChange={(e) => setRaceDate(e.target.value)}
                        />
                        {errors.raceDate && <span className="form-error">{errors.raceDate}</span>}
                    </div>
                </div>

                {/* Target Time */}
                <div className="form-section">
                    <h2>Target Finish Time</h2>

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
                        Typical {distance.name} times: Beginner {distance.typicalTimes.beginner} •
                        Intermediate {distance.typicalTimes.intermediate} •
                        Advanced {distance.typicalTimes.advanced}
                    </span>
                </div>

                {/* Weekly Hours */}
                <div className="form-section">
                    <h2>Training Volume</h2>

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
                            {maxWeeklyHours <= 6 ? '🌱 Beginner level' :
                                maxWeeklyHours <= 10 ? '💪 Intermediate level' :
                                    maxWeeklyHours <= 15 ? '🔥 Advanced level' : '🏆 Elite level'}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="goals-actions">
                    {saveMessage && (
                        <div className="save-message success">
                            ✓ {saveMessage}
                        </div>
                    )}
                    <div className="action-buttons">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleReset}
                            disabled={!hasChanges}
                        >
                            Reset Changes
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!hasChanges}
                        >
                            {hasChanges ? 'Update Goals' : 'No Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
