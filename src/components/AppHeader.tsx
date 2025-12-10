/**
 * App Header Component
 * Shared navigation header for all authenticated screens
 */

import { Link, useLocation } from 'react-router-dom';
import './AppHeader.css';

export type AppView = 'dashboard' | 'goals' | 'plan' | 'analytics' | 'profile' | 'library';

// Map routes to view names
const routeToView: Record<string, AppView> = {
    '/dashboard': 'dashboard',
    '/goals': 'goals',
    '/plan': 'plan',
    '/analytics': 'analytics',
    '/profile': 'profile',
    '/library': 'library',
};

interface AppHeaderProps {
    onSignOut: () => void;
    userName?: string;
    raceName?: string;
    hasPlan: boolean;
}

export function AppHeader({
    onSignOut,
    userName,
    raceName,
    hasPlan
}: AppHeaderProps) {
    const location = useLocation();
    const currentView = routeToView[location.pathname] || 'dashboard';

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
                    <Link
                        to="/dashboard"
                        className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''} ${!hasPlan ? 'disabled' : ''}`}
                        onClick={(e) => !hasPlan && e.preventDefault()}
                    >
                        <span className="tab-icon">🏠</span>
                        <span className="tab-label">Dashboard</span>
                    </Link>
                    <Link
                        to="/goals"
                        className={`nav-tab ${currentView === 'goals' ? 'active' : ''} ${!hasPlan ? 'disabled' : ''}`}
                        onClick={(e) => !hasPlan && e.preventDefault()}
                    >
                        <span className="tab-icon">🎯</span>
                        <span className="tab-label">Goals</span>
                    </Link>
                    <Link
                        to="/plan"
                        className={`nav-tab ${currentView === 'plan' ? 'active' : ''} ${!hasPlan ? 'disabled' : ''}`}
                        onClick={(e) => !hasPlan && e.preventDefault()}
                    >
                        <span className="tab-icon">📋</span>
                        <span className="tab-label">Plan</span>
                    </Link>
                    <Link
                        to="/analytics"
                        className={`nav-tab ${currentView === 'analytics' ? 'active' : ''} ${!hasPlan ? 'disabled' : ''}`}
                        onClick={(e) => !hasPlan && e.preventDefault()}
                    >
                        <span className="tab-icon">📊</span>
                        <span className="tab-label">Analytics</span>
                    </Link>
                    <Link
                        to="/library"
                        className={`nav-tab ${currentView === 'library' ? 'active' : ''}`}
                    >
                        <span className="tab-icon">📚</span>
                        <span className="tab-label">Library</span>
                    </Link>
                    <Link
                        to="/profile"
                        className={`nav-tab ${currentView === 'profile' ? 'active' : ''}`}
                    >
                        <span className="tab-icon">⚙️</span>
                        <span className="tab-label">Profile</span>
                    </Link>
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

