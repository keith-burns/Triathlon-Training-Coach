/**
 * Athlete Profile Wizard
 * Multi-step onboarding for personalized training plans
 */

import { useState } from 'react';
import type {
    AthleteProfile,
    ExperienceLevel,
    DayOfWeek,
    Injury,
    DisciplineSplit,
    RaceTimeBreakdown,
    HeartRateZones,
    Equipment,
    StrengthWeakness,
    Discipline
} from '../types/athlete';
import {
    DEFAULT_DISCIPLINE_SPLIT,
    DEFAULT_REST_DAYS,
    DEFAULT_EQUIPMENT,
    calculateZonesFromLTHR,
    calculateZonesFromAge
} from '../types/athlete';
import './AthleteProfileWizard.css';

interface AthleteProfileWizardProps {
    onComplete: (profile: Partial<AthleteProfile>) => void;
    onSkip: () => void;
    initialProfile?: Partial<AthleteProfile>;
}

type WizardStep = 'about-you' | 'fitness' | 'injuries' | 'race-times' | 'preferences';

const STEPS: WizardStep[] = ['about-you', 'fitness', 'injuries', 'race-times', 'preferences'];
const STEP_TITLES: Record<WizardStep, string> = {
    'about-you': 'About You',
    'fitness': 'Fitness Level',
    'injuries': 'Injury History',
    'race-times': 'Race Time Goals',
    'preferences': 'Training Preferences',
};

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function AthleteProfileWizard({ onComplete, onSkip, initialProfile }: AthleteProfileWizardProps) {
    const [currentStep, setCurrentStep] = useState<WizardStep>('about-you');

    // Step 0: About You (Demographics, Equipment)
    const [age, setAge] = useState<number | ''>(initialProfile?.age || 35);
    const [trainingYears, setTrainingYears] = useState<number | ''>(initialProfile?.trainingYearsExperience || 1);
    const [equipment, setEquipment] = useState<Equipment>(initialProfile?.equipment || { ...DEFAULT_EQUIPMENT });
    const [strengthWeakness, setStrengthWeakness] = useState<StrengthWeakness>(
        initialProfile?.strengthWeakness || { strongest: 'bike', weakest: 'swim' }
    );

    // Step 1: Fitness Level
    const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
        initialProfile?.experienceLevel || 'beginner'
    );
    const [swimCSS, setSwimCSS] = useState(initialProfile?.swimCSS || '');
    const [bikeFTP, setBikeFTP] = useState<number | ''>(initialProfile?.bikeFTP || '');
    const [runThresholdPace, setRunThresholdPace] = useState(initialProfile?.runThresholdPace || '');

    // Step 2: Injuries
    const [injuries, setInjuries] = useState<Injury[]>(initialProfile?.injuries || []);
    const [newInjury, setNewInjury] = useState<{ bodyPart: string; severity: 'minor' | 'moderate' | 'severe'; notes: string }>({ bodyPart: '', severity: 'minor', notes: '' });

    // Step 3: Race Time Breakdown
    const [raceTimeBreakdown, setRaceTimeBreakdown] = useState<RaceTimeBreakdown>(
        initialProfile?.raceTimeBreakdown || {
            swimMinutes: 30,
            t1Minutes: 3,
            bikeMinutes: 150,
            t2Minutes: 2,
            runMinutes: 120,
        }
    );

    // Step 4: Preferences
    const [restDays, setRestDays] = useState<DayOfWeek[]>(
        initialProfile?.restDayPreferences || DEFAULT_REST_DAYS
    );
    const [disciplineSplit, setDisciplineSplit] = useState<DisciplineSplit>(
        initialProfile?.disciplineSplit || { ...DEFAULT_DISCIPLINE_SPLIT }
    );
    const [restingHR, setRestingHR] = useState<number | ''>(60);
    const [lthr, setLthr] = useState<number | ''>(initialProfile?.lactateThresholdHR || '');
    const [hrZones, setHrZones] = useState<HeartRateZones | null>(null);

    const currentStepIndex = STEPS.indexOf(currentStep);
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === STEPS.length - 1;

    const goNext = () => {
        if (!isLastStep) {
            setCurrentStep(STEPS[currentStepIndex + 1]);
        }
    };

    const goBack = () => {
        if (!isFirstStep) {
            setCurrentStep(STEPS[currentStepIndex - 1]);
        }
    };

    const calculateZones = () => {
        if (typeof lthr === 'number' && lthr > 0) {
            // Preferred: Use LTHR if provided
            const zones = calculateZonesFromLTHR(lthr);
            setHrZones(zones);
        } else if (typeof age === 'number' && typeof restingHR === 'number') {
            // Fallback: Estimate from age using Tanaka formula
            const zones = calculateZonesFromAge(age, restingHR);
            setHrZones(zones);
        }
    };

    const addInjury = () => {
        if (newInjury.bodyPart.trim()) {
            setInjuries([
                ...injuries,
                {
                    id: Date.now().toString(),
                    bodyPart: newInjury.bodyPart.trim(),
                    severity: newInjury.severity,
                    isActive: true,
                    notes: newInjury.notes,
                }
            ]);
            setNewInjury({ bodyPart: '', severity: 'minor', notes: '' });
        }
    };

    const removeInjury = (id: string) => {
        setInjuries(injuries.filter(i => i.id !== id));
    };

    const toggleRestDay = (day: DayOfWeek) => {
        if (restDays.includes(day)) {
            setRestDays(restDays.filter(d => d !== day));
        } else {
            setRestDays([...restDays, day]);
        }
    };

    const updateDisciplineSplit = (discipline: keyof DisciplineSplit, value: number) => {
        const newSplit = { ...disciplineSplit, [discipline]: value };
        // Normalize to 100%
        const total = newSplit.swim + newSplit.bike + newSplit.run;
        if (total !== 100) {
            const others = Object.keys(newSplit).filter(k => k !== discipline) as (keyof DisciplineSplit)[];
            const remaining = 100 - value;
            const currentOtherTotal = others.reduce((sum, k) => sum + disciplineSplit[k], 0);
            if (currentOtherTotal > 0) {
                others.forEach(k => {
                    newSplit[k] = Math.round((disciplineSplit[k] / currentOtherTotal) * remaining);
                });
            }
        }
        setDisciplineSplit(newSplit);
    };

    const handleComplete = () => {
        const profile: Partial<AthleteProfile> = {
            age: typeof age === 'number' ? age : undefined,
            trainingYearsExperience: typeof trainingYears === 'number' ? trainingYears : undefined,
            equipment,
            strengthWeakness,
            experienceLevel,
            swimCSS: swimCSS || undefined,
            bikeFTP: typeof bikeFTP === 'number' ? bikeFTP : undefined,
            runThresholdPace: runThresholdPace || undefined,
            injuries,
            raceTimeBreakdown,
            restDayPreferences: restDays,
            disciplineSplit,
            heartRateZones: hrZones || undefined,
        };
        onComplete(profile);
    };

    const getTotalRaceTime = () => {
        const total = raceTimeBreakdown.swimMinutes +
            raceTimeBreakdown.t1Minutes +
            raceTimeBreakdown.bikeMinutes +
            raceTimeBreakdown.t2Minutes +
            raceTimeBreakdown.runMinutes;
        const hours = Math.floor(total / 60);
        const mins = total % 60;
        return `${hours}h ${mins}m`;
    };

    const formatMinutes = (mins: number) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    return (
        <div className="wizard-overlay">
            <div className="wizard-container">
                {/* Header */}
                <div className="wizard-header">
                    <h2>Personalize Your Training</h2>
                    <p>Help us create a plan tailored to your goals and fitness level.</p>
                    <button className="wizard-skip" onClick={onSkip}>
                        Skip for now →
                    </button>
                </div>

                {/* Progress */}
                <div className="wizard-progress">
                    {STEPS.map((step, index) => (
                        <div
                            key={step}
                            className={`progress-step ${index <= currentStepIndex ? 'active' : ''} ${index < currentStepIndex ? 'complete' : ''}`}
                        >
                            <div className="progress-dot">{index < currentStepIndex ? '✓' : index + 1}</div>
                            <span className="progress-label">{STEP_TITLES[step]}</span>
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="wizard-content">
                    {/* Step 0: About You */}
                    {currentStep === 'about-you' && (
                        <div className="wizard-step">
                            <h3>Tell us about yourself</h3>

                            {/* Demographics */}
                            <div className="about-section">
                                <div className="demographics-grid">
                                    <div className="metric-input">
                                        <label>Age</label>
                                        <input
                                            type="number"
                                            placeholder="35"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                                            min={18}
                                            max={99}
                                        />
                                    </div>
                                    <div className="metric-input">
                                        <label>Years of Training</label>
                                        <input
                                            type="number"
                                            placeholder="1"
                                            value={trainingYears}
                                            onChange={(e) => setTrainingYears(e.target.value ? parseInt(e.target.value) : '')}
                                            min={0}
                                            max={50}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Equipment */}
                            <h4>Equipment Access</h4>
                            <p className="hint">What training equipment do you have?</p>
                            <div className="equipment-grid">
                                {[
                                    { key: 'hasPoolAccess', label: '🏊 Pool Access', icon: '🏊' },
                                    { key: 'hasBikeTrainer', label: '🚴 Indoor Trainer', icon: '🎡' },
                                    { key: 'hasGymAccess', label: '🏋️ Gym Access', icon: '🏋️' },
                                    { key: 'hasPowerMeter', label: '⚡ Power Meter', icon: '⚡' },
                                    { key: 'hasHeartRateMonitor', label: '❤️ HR Monitor', icon: '❤️' },
                                ].map(({ key, label }) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`equipment-btn ${equipment[key as keyof Equipment] ? 'selected' : ''}`}
                                        onClick={() => setEquipment({ ...equipment, [key]: !equipment[key as keyof Equipment] })}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Strength/Weakness */}
                            <h4>Self Assessment</h4>
                            <div className="strength-grid">
                                <div className="strength-select">
                                    <label>Your Strongest Discipline</label>
                                    <div className="discipline-options">
                                        {(['swim', 'bike', 'run'] as Discipline[]).map(d => (
                                            <button
                                                key={d}
                                                type="button"
                                                className={`discipline-btn ${strengthWeakness.strongest === d ? 'selected strongest' : ''}`}
                                                onClick={() => setStrengthWeakness({ ...strengthWeakness, strongest: d })}
                                            >
                                                {d === 'swim' ? '🏊' : d === 'bike' ? '🚴' : '🏃'} {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="strength-select">
                                    <label>Your Weakest Discipline</label>
                                    <div className="discipline-options">
                                        {(['swim', 'bike', 'run'] as Discipline[]).map(d => (
                                            <button
                                                key={d}
                                                type="button"
                                                className={`discipline-btn ${strengthWeakness.weakest === d ? 'selected weakest' : ''}`}
                                                onClick={() => setStrengthWeakness({ ...strengthWeakness, weakest: d })}
                                            >
                                                {d === 'swim' ? '🏊' : d === 'bike' ? '🚴' : '🏃'} {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Fitness Level */}
                    {currentStep === 'fitness' && (
                        <div className="wizard-step">
                            <h3>What's your experience level?</h3>
                            <div className="experience-grid">
                                {(['beginner', 'intermediate', 'advanced', 'elite'] as ExperienceLevel[]).map(level => (
                                    <button
                                        key={level}
                                        className={`experience-card ${experienceLevel === level ? 'selected' : ''}`}
                                        onClick={() => setExperienceLevel(level)}
                                    >
                                        <span className="experience-icon">
                                            {level === 'beginner' ? '🌱' :
                                                level === 'intermediate' ? '🌿' :
                                                    level === 'advanced' ? '🌳' : '🏆'}
                                        </span>
                                        <span className="experience-name">{level}</span>
                                    </button>
                                ))}
                            </div>

                            <h4>Performance Metrics <span className="optional-badge">Optional</span></h4>
                            <p className="hint">If you know these, they help us create better workouts.</p>

                            <div className="metrics-grid">
                                <div className="metric-input">
                                    <label>Swim CSS (per 100m)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 1:45"
                                        value={swimCSS}
                                        onChange={(e) => setSwimCSS(e.target.value)}
                                    />
                                </div>
                                <div className="metric-input">
                                    <label>Bike FTP (watts)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g., 200"
                                        value={bikeFTP}
                                        onChange={(e) => setBikeFTP(e.target.value ? parseInt(e.target.value) : '')}
                                    />
                                </div>
                                <div className="metric-input">
                                    <label>Run Threshold (per km)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 5:30"
                                        value={runThresholdPace}
                                        onChange={(e) => setRunThresholdPace(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Injuries */}
                    {currentStep === 'injuries' && (
                        <div className="wizard-step">
                            <h3>Any injuries or limitations?</h3>
                            <p className="hint">We'll adjust your plan to work around these.</p>

                            <div className="add-injury-form">
                                <input
                                    type="text"
                                    placeholder="Body part (e.g., left knee)"
                                    value={newInjury.bodyPart}
                                    onChange={(e) => setNewInjury({ ...newInjury, bodyPart: e.target.value })}
                                />
                                <select
                                    value={newInjury.severity}
                                    onChange={(e) => {
                                        const severity = e.target.value as 'minor' | 'moderate' | 'severe';
                                        setNewInjury({ ...newInjury, severity });
                                    }}
                                >
                                    <option value="minor">Minor</option>
                                    <option value="moderate">Moderate</option>
                                    <option value="severe">Severe</option>
                                </select>
                                <button className="btn btn-outline" onClick={addInjury}>Add</button>
                            </div>

                            {injuries.length > 0 ? (
                                <div className="injuries-list">
                                    {injuries.map(injury => (
                                        <div key={injury.id} className={`injury-item severity-${injury.severity}`}>
                                            <span className="injury-part">{injury.bodyPart}</span>
                                            <span className="injury-severity">{injury.severity}</span>
                                            <button
                                                className="injury-remove"
                                                onClick={() => removeInjury(injury.id)}
                                            >×</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-injuries">
                                    <span>🎉</span>
                                    <p>No injuries - great! Click "Next" to continue.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Race Time Breakdown */}
                    {currentStep === 'race-times' && (
                        <div className="wizard-step">
                            <h3>Break down your target race time</h3>
                            <p className="hint">Adjust each segment to refine your goal.</p>

                            <div className="total-time">
                                <span>Total Race Time:</span>
                                <strong>{getTotalRaceTime()}</strong>
                            </div>

                            <div className="race-breakdown">
                                <div className="breakdown-item">
                                    <label>🏊 Swim</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="120"
                                        value={raceTimeBreakdown.swimMinutes}
                                        onChange={(e) => setRaceTimeBreakdown({ ...raceTimeBreakdown, swimMinutes: parseInt(e.target.value) })}
                                    />
                                    <span className="breakdown-value">{formatMinutes(raceTimeBreakdown.swimMinutes)}</span>
                                </div>
                                <div className="breakdown-item small">
                                    <label>T1</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={raceTimeBreakdown.t1Minutes}
                                        onChange={(e) => setRaceTimeBreakdown({ ...raceTimeBreakdown, t1Minutes: parseInt(e.target.value) })}
                                    />
                                    <span className="breakdown-value">{raceTimeBreakdown.t1Minutes}m</span>
                                </div>
                                <div className="breakdown-item">
                                    <label>🚴 Bike</label>
                                    <input
                                        type="range"
                                        min="30"
                                        max="360"
                                        value={raceTimeBreakdown.bikeMinutes}
                                        onChange={(e) => setRaceTimeBreakdown({ ...raceTimeBreakdown, bikeMinutes: parseInt(e.target.value) })}
                                    />
                                    <span className="breakdown-value">{formatMinutes(raceTimeBreakdown.bikeMinutes)}</span>
                                </div>
                                <div className="breakdown-item small">
                                    <label>T2</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={raceTimeBreakdown.t2Minutes}
                                        onChange={(e) => setRaceTimeBreakdown({ ...raceTimeBreakdown, t2Minutes: parseInt(e.target.value) })}
                                    />
                                    <span className="breakdown-value">{raceTimeBreakdown.t2Minutes}m</span>
                                </div>
                                <div className="breakdown-item">
                                    <label>🏃 Run</label>
                                    <input
                                        type="range"
                                        min="15"
                                        max="300"
                                        value={raceTimeBreakdown.runMinutes}
                                        onChange={(e) => setRaceTimeBreakdown({ ...raceTimeBreakdown, runMinutes: parseInt(e.target.value) })}
                                    />
                                    <span className="breakdown-value">{formatMinutes(raceTimeBreakdown.runMinutes)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Preferences */}
                    {currentStep === 'preferences' && (
                        <div className="wizard-step">
                            <h3>Training Preferences</h3>

                            {/* Rest Days */}
                            <div className="preference-section">
                                <h4>Preferred Rest Days</h4>
                                <div className="rest-days-grid">
                                    {DAYS.map(day => (
                                        <button
                                            key={day}
                                            className={`rest-day-btn ${restDays.includes(day) ? 'selected' : ''}`}
                                            onClick={() => toggleRestDay(day)}
                                        >
                                            {day.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Discipline Split */}
                            <div className="preference-section">
                                <h4>Training Time Split</h4>
                                <p className="hint">How to divide your training focus.</p>
                                <div className="split-sliders">
                                    <div className="split-item">
                                        <label>🏊 Swim: {disciplineSplit.swim}%</label>
                                        <input
                                            type="range"
                                            min="10"
                                            max="50"
                                            value={disciplineSplit.swim}
                                            onChange={(e) => updateDisciplineSplit('swim', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="split-item">
                                        <label>🚴 Bike: {disciplineSplit.bike}%</label>
                                        <input
                                            type="range"
                                            min="20"
                                            max="60"
                                            value={disciplineSplit.bike}
                                            onChange={(e) => updateDisciplineSplit('bike', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="split-item">
                                        <label>🏃 Run: {disciplineSplit.run}%</label>
                                        <input
                                            type="range"
                                            min="15"
                                            max="50"
                                            value={disciplineSplit.run}
                                            onChange={(e) => updateDisciplineSplit('run', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Heart Rate Zones */}
                            <div className="preference-section">
                                <h4>Heart Rate Zones</h4>
                                <p className="hint">We'll auto-calculate based on your age. Update with actual values for better accuracy.</p>
                                <div className="hr-inputs">
                                    <div className="hr-input">
                                        <label>Age</label>
                                        <input
                                            type="number"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                                        />
                                    </div>
                                    <div className="hr-input">
                                        <label>Resting HR</label>
                                        <input
                                            type="number"
                                            value={restingHR}
                                            onChange={(e) => setRestingHR(e.target.value ? parseInt(e.target.value) : '')}
                                        />
                                    </div>
                                    <div className="hr-input lthr-input">
                                        <label>LTHR (optional, preferred)</label>
                                        <input
                                            type="number"
                                            placeholder="From 30-min test"
                                            value={lthr}
                                            onChange={(e) => setLthr(e.target.value ? parseInt(e.target.value) : '')}
                                        />
                                        <span className="hint">Most accurate if known</span>
                                    </div>
                                    <button type="button" className="btn btn-outline" onClick={calculateZones}>
                                        Calculate Zones
                                    </button>
                                </div>
                                {hrZones && (
                                    <div className="hr-zones-preview">
                                        <div className="zone zone-1">Z1: {hrZones.zone1.minHR}-{hrZones.zone1.maxHR} bpm</div>
                                        <div className="zone zone-2">Z2: {hrZones.zone2.minHR}-{hrZones.zone2.maxHR} bpm</div>
                                        <div className="zone zone-3">Z3: {hrZones.zone3.minHR}-{hrZones.zone3.maxHR} bpm</div>
                                        <div className="zone zone-4">Z4: {hrZones.zone4.minHR}-{hrZones.zone4.maxHR} bpm</div>
                                        <div className="zone zone-5">Z5: {hrZones.zone5.minHR}-{hrZones.zone5.maxHR} bpm</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="wizard-nav">
                    <button
                        className="btn btn-outline"
                        onClick={goBack}
                        disabled={isFirstStep}
                    >
                        ← Back
                    </button>
                    {isLastStep ? (
                        <button className="btn btn-primary" onClick={handleComplete}>
                            Complete Setup ✓
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={goNext}>
                            Next →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
