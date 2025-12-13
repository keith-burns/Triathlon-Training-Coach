/**
 * Analytics Page
 * Training data visualization with Recharts
 */

import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
    LineChart, Line,
} from 'recharts';
import type { TrainingPlan } from '../types/race';
import { calculateTrainingStats, calculateComplianceStats, getWeekStats, generateRecommendations } from '../utils/trainingAdvisor';
import './AnalyticsPage.css';

interface AnalyticsPageProps {
    plan: TrainingPlan;
}

const DISCIPLINE_COLORS = {
    swim: '#0ea5e9',
    bike: '#22c55e',
    run: '#f59e0b',
    brick: '#ef4444',
    strength: '#8b5cf6',
};

const INTENSITY_COLORS = {
    recovery: '#94a3b8',
    easy: '#22c55e',
    moderate: '#3b82f6',
    tempo: '#f59e0b',
    threshold: '#ef4444',
    intervals: '#dc2626',
    race: '#7c3aed',
};

export function AnalyticsPage({ plan }: AnalyticsPageProps) {
    const stats = useMemo(() => calculateTrainingStats(plan), [plan]);
    const compliance = useMemo(() => calculateComplianceStats(plan), [plan]);
    const recommendations = useMemo(() => generateRecommendations(plan), [plan]);

    // Weekly volume data for bar chart
    const weeklyVolumeData = useMemo(() => {
        return plan.weeks.map(week => {
            const volumes: Record<string, number> = {
                week: week.weekNumber,
                swim: 0,
                bike: 0,
                run: 0,
                strength: 0,
            };

            week.days.forEach(day => {
                day.workouts.forEach(workout => {
                    if (workout.discipline === 'rest') return;
                    const key = workout.discipline === 'brick' ? 'bike' : workout.discipline;
                    if (volumes[key] !== undefined) {
                        volumes[key] += workout.totalDuration;
                    }
                });
            });

            return volumes;
        });
    }, [plan]);

    // Intensity distribution for pie chart
    const intensityData = useMemo(() => {
        const counts: Record<string, number> = {};

        plan.weeks.forEach(week => {
            week.days.forEach(day => {
                day.workouts.forEach(workout => {
                    if (workout.discipline === 'rest') return;
                    workout.steps.forEach(step => {
                        counts[step.intensity] = (counts[step.intensity] || 0) + 1;
                    });
                });
            });
        });

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [plan]);

    // RPE trend data for line chart
    const rpeTrendData = useMemo(() => {
        return plan.weeks.map(week => {
            const weekStats = getWeekStats(week);
            return {
                week: week.weekNumber,
                actualRPE: weekStats.averageRPE > 0 ? weekStats.averageRPE.toFixed(1) : null,
                completionRate: weekStats.completionRate,
            };
        }).filter(w => w.actualRPE !== null);
    }, [plan]);

    const formatMinutes = (mins: number) => {
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    return (
        <div className="analytics-page">
            <header className="analytics-header">
                <h1>📊 Training Analytics</h1>
                <p>Track your progress and training patterns</p>
            </header>

            {/* Summary Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-icon">🎯</span>
                    <div className="stat-info">
                        <span className="stat-value">{Math.round(stats.completionRate)}%</span>
                        <span className="stat-label">Completion to Date</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">⭐</span>
                    <div className="stat-info">
                        <span className="stat-value">{Math.round(compliance.complianceScore)}%</span>
                        <span className="stat-label">Compliance to Date</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">✅</span>
                    <div className="stat-info">
                        <span className="stat-value">{stats.completedWorkouts}</span>
                        <span className="stat-label">Workouts Completed</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">💪</span>
                    <div className="stat-info">
                        <span className="stat-value">{stats.averageRPE > 0 ? stats.averageRPE.toFixed(1) : '-'}</span>
                        <span className="stat-label">Avg RPE</span>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="recommendations-section">
                    <h2>🧠 Training Insights</h2>
                    <div className="recommendations-grid">
                        {recommendations.slice(0, 3).map((rec, i) => (
                            <div key={i} className={`recommendation-card ${rec.type}`}>
                                <h3>{rec.title}</h3>
                                <p>{rec.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Weekly Volume Chart */}
            <div className="chart-section">
                <h2>Weekly Training Volume</h2>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyVolumeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-200)" />
                            <XAxis dataKey="week" stroke="var(--neutral-500)" />
                            <YAxis stroke="var(--neutral-500)" tickFormatter={(v) => `${v}m`} />
                            <Tooltip
                                formatter={(value: number) => formatMinutes(value)}
                                contentStyle={{
                                    background: 'white',
                                    border: '1px solid var(--neutral-200)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="swim" name="Swim" fill={DISCIPLINE_COLORS.swim} stackId="a" />
                            <Bar dataKey="bike" name="Bike" fill={DISCIPLINE_COLORS.bike} stackId="a" />
                            <Bar dataKey="run" name="Run" fill={DISCIPLINE_COLORS.run} stackId="a" />
                            <Bar dataKey="strength" name="Strength" fill={DISCIPLINE_COLORS.strength} stackId="a" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Intensity Distribution */}
            <div className="charts-row">
                <div className="chart-section half">
                    <h2>Intensity Mix</h2>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={intensityData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="40%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                >
                                    {intensityData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={INTENSITY_COLORS[entry.name as keyof typeof INTENSITY_COLORS] || '#94a3b8'}
                                            stroke="none"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    verticalAlign="middle"
                                    align="right"
                                    layout="vertical"
                                    iconType="circle"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* RPE Trend */}
                {rpeTrendData.length > 1 && (
                    <div className="chart-section half">
                        <h2>RPE Trend</h2>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={rpeTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-200)" />
                                    <XAxis dataKey="week" stroke="var(--neutral-500)" />
                                    <YAxis domain={[1, 10]} stroke="var(--neutral-500)" />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'white',
                                            border: '1px solid var(--neutral-200)',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="actualRPE"
                                        name="Avg RPE"
                                        stroke="var(--primary-500)"
                                        strokeWidth={2}
                                        dot={{ fill: 'var(--primary-500)' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* No Data State */}
            {stats.completedWorkouts === 0 && (
                <div className="no-data-message">
                    <span className="no-data-icon">📝</span>
                    <h3>No Completed Workouts Yet</h3>
                    <p>Start logging your workouts to see your training analytics here!</p>
                </div>
            )}
        </div>
    );
}
