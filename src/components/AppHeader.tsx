/**
 * App Header Component
 * Shared navigation header for all authenticated screens
 */

import './AppHeader.css';

export type AppView = 'dashboard' | 'goals' | 'plan' | 'analytics' | 'profile' | 'library';

interface AppHeaderProps {
    currentView: AppView;
    onNavigate: (view: AppView) => void;
    onSignOut: () => void;
    userName?: string;
    raceName?: string;
    hasPlan: boolean;
}

export function AppHeader({
    currentView,
    onNavigate,
    onSignOut,
    userName,
    raceName,
    hasPlan
}: AppHeaderProps) {
    return (
        <header className="app-header">
            <div className="header-container">
                {/* Logo */}
                <div className="header-brand">
                    <span className="header-logo">🏊‍♂️🚴‍♂️🏃‍♂️</span>
                    <span className="header-title">TriCoach</span>
                    {raceName && <span className="header-race">{raceName}</span>}
                </div>

                {/* Navigation Tabs */}
                <nav className="header-nav">
                    <button
                        className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''}`}
                        onClick={() => onNavigate('dashboard')}
                        disabled={!hasPlan}
                    >
                        <span className="tab-icon">🏠</span>
                        <span className="tab-label">Dashboard</span>
                    </button>
                    <button
                        className={`nav-tab ${currentView === 'goals' ? 'active' : ''}`}
                        onClick={() => onNavigate('goals')}
                        disabled={!hasPlan}
                    >
                        <span className="tab-icon">🎯</span>
                        <span className="tab-label">Goals</span>
                    </button>
                    <button
                        className={`nav-tab ${currentView === 'plan' ? 'active' : ''}`}
                        onClick={() => onNavigate('plan')}
                        disabled={!hasPlan}
                    >
                        <span className="tab-icon">📋</span>
                        <span className="tab-label">Plan</span>
                    </button>
                    <button
                        className={`nav-tab ${currentView === 'analytics' ? 'active' : ''}`}
                        onClick={() => onNavigate('analytics')}
                        disabled={!hasPlan}
                    >
                        <span className="tab-icon">📊</span>
                        <span className="tab-label">Analytics</span>
                    </button>
                    <button
                        className={`nav-tab ${currentView === 'library' ? 'active' : ''}`}
                        onClick={() => onNavigate('library')}
                    >
                        <span className="tab-icon">📚</span>
                        <span className="tab-label">Library</span>
                    </button>
                    <button
                        className={`nav-tab ${currentView === 'profile' ? 'active' : ''}`}
                        onClick={() => onNavigate('profile')}
                    >
                        <span className="tab-icon">⚙️</span>
                        <span className="tab-label">Profile</span>
                    </button>
                </nav>

                {/* User Menu */}
                <div className="header-user">
                    {userName && <span className="user-name">{userName}</span>}
                    <button className="btn btn-outline btn-sm" onClick={onSignOut}>
                        Sign Out
                    </button>
                </div>
            </div>
        </header>
    );
}
