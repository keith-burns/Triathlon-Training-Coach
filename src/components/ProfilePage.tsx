/**
 * Profile Page Component
 * Displays and allows editing of athlete profile settings
 */

import { useState } from 'react';
import type {
    AthleteProfile,
    ExperienceLevel,
    DayOfWeek,
    Injury,
    Equipment,
    StrengthWeakness,
    Discipline
} from '../types/athlete';
import { calculateZonesFromAge, calculateZonesFromLTHR, DEFAULT_EQUIPMENT } from '../types/athlete';
import './ProfilePage.css';

interface ProfilePageProps {
    profile: AthleteProfile | null;
    onSave: (profile: Partial<AthleteProfile>) => Promise<void>;
    onPlanRegenerate: () => void;
}

const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
    beginner: 'Beginner (0-1 years)',
    intermediate: 'Intermediate (1-3 years)',
    advanced: 'Advanced (3-5 years)',
    elite: 'Elite (5+ years)',
};

const DAY_LABELS: Record<DayOfWeek, string> = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
};

export function ProfilePage({ profile, onSave, onPlanRegenerate }: ProfilePageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Edit state
    const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
        profile?.experienceLevel || 'intermediate'
    );
    const [swimCSS, setSwimCSS] = useState(profile?.swimCSS || '');
    const [bikeFTP, setBikeFTP] = useState(profile?.bikeFTP?.toString() || '');
    const [runThresholdPace, setRunThresholdPace] = useState(profile?.runThresholdPace || '');
    const [restDays, setRestDays] = useState<DayOfWeek[]>(
        profile?.restDayPreferences || ['monday', 'friday']
    );
    const [disciplineSplit, setDisciplineSplit] = useState(
        profile?.disciplineSplit || { swim: 20, bike: 45, run: 35 }
    );
    const [age, setAge] = useState(profile?.age?.toString() || '35');
    const [trainingYears, setTrainingYears] = useState(profile?.trainingYearsExperience?.toString() || '1');
    const [restingHR, setRestingHR] = useState('60');
    const [injuries, _setInjuries] = useState<Injury[]>(profile?.injuries || []);
    const [equipment, setEquipment] = useState<Equipment>(profile?.equipment || { ...DEFAULT_EQUIPMENT });
    const [strengthWeakness, setStrengthWeakness] = useState<StrengthWeakness>(
        profile?.strengthWeakness || { strongest: 'bike', weakest: 'swim' }
    );
    const [lthr, setLthr] = useState(profile?.lactateThresholdHR?.toString() || '');

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Calculate zones: prefer LTHR if provided, otherwise use age
            const parsedLthr = parseInt(lthr);
            const heartRateZones = parsedLthr > 0
                ? calculateZonesFromLTHR(parsedLthr)
                : calculateZonesFromAge(parseInt(age), parseInt(restingHR));
            await onSave({
                experienceLevel,
                swimCSS,
                bikeFTP: bikeFTP ? parseInt(bikeFTP) : undefined,
                runThresholdPace,
                restDayPreferences: restDays,
                disciplineSplit,
                heartRateZones,
                injuries,
                age: parseInt(age) || undefined,
                trainingYearsExperience: parseInt(trainingYears) || undefined,
                lactateThresholdHR: parsedLthr > 0 ? parsedLthr : undefined,
                equipment,
                strengthWeakness,
            });
            setIsEditing(false);
            onPlanRegenerate();
        } finally {
            setIsSaving(false);
        }
    };

    const toggleRestDay = (day: DayOfWeek) => {
        setRestDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const updateDisciplineSplit = (discipline: 'swim' | 'bike' | 'run', value: number) => {
        const others = Object.entries(disciplineSplit)
            .filter(([k]) => k !== discipline)
            .reduce((sum, [, v]) => sum + v, 0);

        const remaining = 100 - value;
        const ratio = others > 0 ? remaining / others : 0.5;

        const newSplit = { ...disciplineSplit };
        newSplit[discipline] = value;

        const otherKeys = Object.keys(newSplit).filter(k => k !== discipline) as ('swim' | 'bike' | 'run')[];
        otherKeys.forEach(k => {
            newSplit[k] = Math.round(disciplineSplit[k] * ratio);
        });

        // Normalize to 100
        const total = Object.values(newSplit).reduce((a, b) => a + b, 0);
        if (total !== 100) {
            newSplit[otherKeys[0]] += 100 - total;
        }

        setDisciplineSplit(newSplit);
    };

    if (!profile && !isEditing) {
        return (
            <div className="profile-page">
                <section className="profile-section">
                    <div className="empty-profile">
                        <span className="empty-icon">👤</span>
                        <h2>No Profile Yet</h2>
                        <p>Set up your athlete profile to get personalized training recommendations.</p>
                        <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                            Create Profile
                        </button>
                    </div>
                </section>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="profile-page">
                <section className="profile-section">
                    <div className="section-header">
                        <h2>Edit Profile</h2>
                        <div className="section-actions">
                            <button className="btn btn-outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save & Update Plan'}
                            </button>
                        </div>
                    </div>

                    {/* Experience Level */}
                    <div className="form-group">
                        <label>Experience Level</label>
                        <div className="experience-options">
                            {(['beginner', 'intermediate', 'advanced', 'elite'] as ExperienceLevel[]).map(level => (
                                <button
                                    key={level}
                                    className={`experience-btn ${experienceLevel === level ? 'active' : ''}`}
                                    onClick={() => setExperienceLevel(level)}
                                >
                                    {EXPERIENCE_LABELS[level]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="form-group">
                        <label>Performance Metrics (Optional)</label>
                        <div className="metrics-grid">
                            <div className="metric-input">
                                <span className="metric-label">🏊 Swim CSS</span>
                                <input
                                    type="text"
                                    placeholder="1:45/100m"
                                    value={swimCSS}
                                    onChange={e => setSwimCSS(e.target.value)}
                                />
                            </div>
                            <div className="metric-input">
                                <span className="metric-label">🚴 Bike FTP</span>
                                <input
                                    type="number"
                                    placeholder="250"
                                    value={bikeFTP}
                                    onChange={e => setBikeFTP(e.target.value)}
                                />
                                <span className="metric-unit">watts</span>
                            </div>
                            <div className="metric-input">
                                <span className="metric-label">🏃 Run Threshold</span>
                                <input
                                    type="text"
                                    placeholder="5:00/km"
                                    value={runThresholdPace}
                                    onChange={e => setRunThresholdPace(e.target.value)}
                                />
                            </div>
                            <div className="metric-input">
                                <span className="metric-label">❤️ LTHR (preferred for zones)</span>
                                <input
                                    type="number"
                                    placeholder="From 30-min test"
                                    value={lthr}
                                    onChange={e => setLthr(e.target.value)}
                                />
                                <span className="metric-unit">bpm</span>
                            </div>
                        </div>
                    </div>

                    {/* Rest Days */}
                    <div className="form-group">
                        <label>Preferred Rest Days</label>
                        <div className="rest-days-grid">
                            {(Object.keys(DAY_LABELS) as DayOfWeek[]).map(day => (
                                <button
                                    key={day}
                                    className={`day-btn ${restDays.includes(day) ? 'active' : ''}`}
                                    onClick={() => toggleRestDay(day)}
                                >
                                    {DAY_LABELS[day]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Discipline Split */}
                    <div className="form-group">
                        <label>Training Focus Split</label>
                        <div className="split-sliders">
                            <div className="split-row">
                                <span>🏊 Swim: {disciplineSplit.swim}%</span>
                                <input
                                    type="range"
                                    min="10"
                                    max="50"
                                    value={disciplineSplit.swim}
                                    onChange={e => updateDisciplineSplit('swim', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="split-row">
                                <span>🚴 Bike: {disciplineSplit.bike}%</span>
                                <input
                                    type="range"
                                    min="20"
                                    max="60"
                                    value={disciplineSplit.bike}
                                    onChange={e => updateDisciplineSplit('bike', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="split-row">
                                <span>🏃 Run: {disciplineSplit.run}%</span>
                                <input
                                    type="range"
                                    min="15"
                                    max="50"
                                    value={disciplineSplit.run}
                                    onChange={e => updateDisciplineSplit('run', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* HR Zones */}
                    <div className="form-group">
                        <label>Heart Rate Zones</label>
                        <div className="hr-inputs">
                            <div className="metric-input">
                                <span className="metric-label">Age</span>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={e => setAge(e.target.value)}
                                />
                            </div>
                            <div className="metric-input">
                                <span className="metric-label">Resting HR</span>
                                <input
                                    type="number"
                                    value={restingHR}
                                    onChange={e => setRestingHR(e.target.value)}
                                />
                                <span className="metric-unit">bpm</span>
                            </div>
                        </div>
                    </div>

                    {/* Training Experience */}
                    <div className="form-group">
                        <label>Training Background</label>
                        <div className="metrics-grid">
                            <div className="metric-input">
                                <span className="metric-label">Years of Training</span>
                                <input
                                    type="number"
                                    value={trainingYears}
                                    onChange={e => setTrainingYears(e.target.value)}
                                    min={0}
                                    max={50}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Equipment */}
                    <div className="form-group">
                        <label>Equipment Access</label>
                        <div className="equipment-grid">
                            {[
                                { key: 'hasPoolAccess', label: '🏊 Pool Access' },
                                { key: 'hasBikeTrainer', label: '🚴 Indoor Trainer' },
                                { key: 'hasGymAccess', label: '🏋️ Gym Access' },
                                { key: 'hasPowerMeter', label: '⚡ Power Meter' },
                                { key: 'hasHeartRateMonitor', label: '❤️ HR Monitor' },
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={`equipment-btn ${equipment[key as keyof Equipment] ? 'active' : ''}`}
                                    onClick={() => setEquipment({ ...equipment, [key]: !equipment[key as keyof Equipment] })}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Strength/Weakness */}
                    <div className="form-group">
                        <label>Self Assessment</label>
                        <div className="strength-grid">
                            <div className="strength-select">
                                <span className="strength-label">Strongest Discipline</span>
                                <div className="discipline-options">
                                    {(['swim', 'bike', 'run'] as Discipline[]).map(d => (
                                        <button
                                            key={d}
                                            type="button"
                                            className={`discipline-btn ${strengthWeakness.strongest === d ? 'active strongest' : ''}`}
                                            onClick={() => setStrengthWeakness({ ...strengthWeakness, strongest: d })}
                                        >
                                            {d === 'swim' ? '🏊' : d === 'bike' ? '🚴' : '🏃'} {d}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="strength-select">
                                <span className="strength-label">Weakest Discipline</span>
                                <div className="discipline-options">
                                    {(['swim', 'bike', 'run'] as Discipline[]).map(d => (
                                        <button
                                            key={d}
                                            type="button"
                                            className={`discipline-btn ${strengthWeakness.weakest === d ? 'active weakest' : ''}`}
                                            onClick={() => setStrengthWeakness({ ...strengthWeakness, weakest: d })}
                                        >
                                            {d === 'swim' ? '🏊' : d === 'bike' ? '🚴' : '🏃'} {d}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    // View mode
    return (
        <div className="profile-page">
            <section className="profile-section">
                <div className="section-header">
                    <h2>Athlete Profile</h2>
                    <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
                        ✏️ Edit Profile
                    </button>
                </div>

                <div className="profile-cards">
                    {/* Experience */}
                    <div className="profile-card">
                        <h3>Experience Level</h3>
                        <div className="profile-value">{EXPERIENCE_LABELS[profile?.experienceLevel || 'intermediate']}</div>
                    </div>

                    {/* Performance */}
                    <div className="profile-card">
                        <h3>Performance Metrics</h3>
                        <div className="metrics-display">
                            {profile?.swimCSS && (
                                <div className="metric-item">
                                    <span className="metric-icon">🏊</span>
                                    <span>CSS: {profile.swimCSS}</span>
                                </div>
                            )}
                            {profile?.bikeFTP && (
                                <div className="metric-item">
                                    <span className="metric-icon">🚴</span>
                                    <span>FTP: {profile.bikeFTP}W</span>
                                </div>
                            )}
                            {profile?.runThresholdPace && (
                                <div className="metric-item">
                                    <span className="metric-icon">🏃</span>
                                    <span>Threshold: {profile.runThresholdPace}</span>
                                </div>
                            )}
                            {!profile?.swimCSS && !profile?.bikeFTP && !profile?.runThresholdPace && (
                                <span className="no-data">Not set</span>
                            )}
                        </div>
                    </div>

                    {/* Rest Days */}
                    <div className="profile-card">
                        <h3>Rest Days</h3>
                        <div className="rest-days-display">
                            {(profile?.restDayPreferences || []).map(day => (
                                <span key={day} className="day-tag">{DAY_LABELS[day]}</span>
                            ))}
                            {(!profile?.restDayPreferences || profile.restDayPreferences.length === 0) && (
                                <span className="no-data">Not set</span>
                            )}
                        </div>
                    </div>

                    {/* Training Split */}
                    <div className="profile-card">
                        <h3>Training Focus</h3>
                        <div className="split-display">
                            <div className="split-bar">
                                <div
                                    className="split-segment swim"
                                    style={{ width: `${profile?.disciplineSplit?.swim || 20}%` }}
                                >
                                    🏊 {profile?.disciplineSplit?.swim || 20}%
                                </div>
                                <div
                                    className="split-segment bike"
                                    style={{ width: `${profile?.disciplineSplit?.bike || 45}%` }}
                                >
                                    🚴 {profile?.disciplineSplit?.bike || 45}%
                                </div>
                                <div
                                    className="split-segment run"
                                    style={{ width: `${profile?.disciplineSplit?.run || 35}%` }}
                                >
                                    🏃 {profile?.disciplineSplit?.run || 35}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HR Zones */}
                    {profile?.heartRateZones && (
                        <div className="profile-card wide">
                            <h3>Heart Rate Zones</h3>
                            <div className="hr-zones-display">
                                {(['zone1', 'zone2', 'zone3', 'zone4', 'zone5'] as const).map((zone) => {
                                    const zoneData = profile.heartRateZones![zone];
                                    return (
                                        <div key={zone} className="hr-zone-item">
                                            <span className="zone-name">{zoneData.name}</span>
                                            <span className="zone-range">{zoneData.minHR}-{zoneData.maxHR} bpm</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Injuries */}
                    {injuries.length > 0 && (
                        <div className="profile-card wide">
                            <h3>Injury Notes</h3>
                            <div className="injuries-display">
                                {injuries.map((injury, idx) => (
                                    <div key={idx} className={`injury-item ${injury.severity}`}>
                                        <span className="injury-part">{injury.bodyPart}</span>
                                        <span className="injury-severity">{injury.severity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Training Background */}
                    <div className="profile-card">
                        <h3>Training Background</h3>
                        <div className="metrics-display">
                            <div className="metric-item">
                                <span className="metric-icon">📅</span>
                                <span>{profile?.age || '-'} years old</span>
                            </div>
                            <div className="metric-item">
                                <span className="metric-icon">📈</span>
                                <span>{profile?.trainingYearsExperience || '-'} years training</span>
                            </div>
                        </div>
                    </div>

                    {/* Equipment */}
                    <div className="profile-card">
                        <h3>Equipment Access</h3>
                        <div className="equipment-display">
                            {profile?.equipment?.hasPoolAccess && <span className="equipment-tag">🏊 Pool</span>}
                            {profile?.equipment?.hasBikeTrainer && <span className="equipment-tag">🚴 Trainer</span>}
                            {profile?.equipment?.hasGymAccess && <span className="equipment-tag">🏋️ Gym</span>}
                            {profile?.equipment?.hasPowerMeter && <span className="equipment-tag">⚡ Power</span>}
                            {profile?.equipment?.hasHeartRateMonitor && <span className="equipment-tag">❤️ HR</span>}
                            {!profile?.equipment && <span className="no-data">Not set</span>}
                        </div>
                    </div>

                    {/* Self Assessment */}
                    <div className="profile-card">
                        <h3>Self Assessment</h3>
                        <div className="assessment-display">
                            <div className="assessment-item strongest">
                                <span className="assessment-label">Strongest</span>
                                <span className="assessment-value">
                                    {profile?.strengthWeakness?.strongest === 'swim' ? '🏊' :
                                        profile?.strengthWeakness?.strongest === 'bike' ? '🚴' : '🏃'} {profile?.strengthWeakness?.strongest || '-'}
                                </span>
                            </div>
                            <div className="assessment-item weakest">
                                <span className="assessment-label">Weakest</span>
                                <span className="assessment-value">
                                    {profile?.strengthWeakness?.weakest === 'swim' ? '🏊' :
                                        profile?.strengthWeakness?.weakest === 'bike' ? '🚴' : '🏃'} {profile?.strengthWeakness?.weakest || '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
