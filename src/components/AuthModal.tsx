/**
 * Auth Modal Component
 * Login and signup forms with validation
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

type AuthMode = 'login' | 'signup';

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const { signIn, signUp } = useAuth();
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError(null);
        setSuccess(null);
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        resetForm();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation
        if (!email.trim() || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (mode === 'signup') {
            if (password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
        }

        setLoading(true);

        try {
            if (mode === 'signup') {
                const { error } = await signUp(email, password);
                if (error) {
                    setError(error.message);
                } else {
                    // Clear form fields but keep success visible
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setError(null);
                    setSuccess('Account created! Check your email to confirm your account.');
                }
            } else {
                const { error } = await signIn(email, password);
                if (error) {
                    setError(error.message);
                } else {
                    onSuccess?.();
                    onClose();
                }
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="auth-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div className="auth-container" onClick={(e) => e.stopPropagation()}>
                <button className="auth-close" onClick={onClose} aria-label="Close">
                    ×
                </button>

                <div className="auth-header">
                    <div className="auth-logo">🏊‍♂️🚴‍♂️🏃‍♂️</div>
                    <h2 className="auth-title">
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="auth-subtitle">
                        {mode === 'login'
                            ? 'Sign in to access your training plans'
                            : 'Start your triathlon training journey'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="auth-error">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {success && (
                        <div className="auth-success">
                            <span>✅</span> {success}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="athlete@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        />
                    </div>

                    {mode === 'signup' && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="form-input"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-block auth-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="auth-loading">Loading...</span>
                        ) : (
                            mode === 'login' ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                        <button type="button" className="auth-toggle" onClick={toggleMode}>
                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
