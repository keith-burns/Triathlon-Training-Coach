/**
 * App Layout Component
 * Wraps authenticated views with consistent header and navigation
 */

import type { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import './AppLayout.css';

interface AppLayoutProps {
    children: ReactNode;
    onSignOut: () => void;
    userName?: string;
    raceName?: string;
    hasPlan: boolean;
}

export function AppLayout({
    children,
    onSignOut,
    userName,
    raceName,
    hasPlan
}: AppLayoutProps) {
    return (
        <div className="app-layout">
            <AppHeader
                onSignOut={onSignOut}
                userName={userName}
                raceName={raceName}
                hasPlan={hasPlan}
            />
            <main className="app-main">
                {children}
            </main>
        </div>
    );
}
