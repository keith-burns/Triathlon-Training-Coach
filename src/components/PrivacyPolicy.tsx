
import { Link } from 'react-router-dom';
import { Footer } from './Footer';
import './PrivacyPolicy.css';

export function PrivacyPolicy() {
    return (
        <div className="privacy-page">
            {/* Hero Section */}
            <div className="privacy-hero">
                <div className="container">
                    {/* Navigation */}
                    <nav className="privacy-nav">
                        <Link to="/" className="privacy-back-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Home
                        </Link>
                        <span className="privacy-label">Legal</span>
                    </nav>

                    {/* Header Content */}
                    <div className="privacy-header-content">
                        <h1 className="privacy-title">Privacy Policy</h1>
                        <p className="privacy-subtitle">
                            We believe in transparency. Here's exactly how we handle your data,
                            maintain your privacy, and strictly adhere to API partner requirements.
                        </p>
                        <p className="privacy-date">
                            Last Updated: December 9, 2024
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Card */}
            <main className="privacy-main">
                <div className="privacy-card">
                    <article className="privacy-content">

                        <section>
                            <h2>1. Introduction</h2>
                            <p>
                                Triathlon Training Coach ("we," "our," or "us") respects your privacy and is committed to protecting it.
                                This Privacy Policy explains how we collect, use, and share information about you when you use our website
                                and training platform (the "Service").
                            </p>
                        </section>

                        <section>
                            <h2>2. Information We Collect</h2>
                            <div className="section-block">
                                <h3>A. Information You Provide</h3>
                                <ul>
                                    <li><strong>Account Information:</strong> Name, email address, and password.</li>
                                    <li><strong>Profile Data:</strong> Age, experience level, race goals, and training preferences.</li>
                                    <li><strong>Health Data:</strong> Heart rate zones, injuries, and perceived exertion levels (RPE).</li>
                                </ul>
                            </div>

                            <h3>B. Information from Connected Services</h3>
                            <p>
                                If you choose to connect third-party services like Garmin Connect or Strava, we collect data strictly
                                in accordance with their API terms:
                            </p>

                            {/* Important API Disclosure Box */}
                            <div className="api-disclosure">
                                <div className="api-disclosure-header">
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary-700)' }}>
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                    </svg>
                                    <h4 className="api-disclosure-title">Garmin Connect Integration</h4>
                                </div>
                                <p>We use the Garmin Connect API to:</p>
                                <ul>
                                    <li>Read your completed activities (Swim, Bike, Run) to track plan compliance.</li>
                                    <li>Write structured workouts to your device training calendar.</li>
                                    <li>Read health metrics (Resting HR) to adjust training intensity.</li>
                                </ul>
                                <p className="api-disclosure-note">
                                    Data Usage Commitment: We do not share your Garmin data with any third parties.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2>3. How We Use Your Information</h2>
                            <ul>
                                <li>To generate personalized triathlon training plans.</li>
                                <li>To analyze your training progress and adapt future workouts.</li>
                                <li>To provide customer support and respond to your inquiries.</li>
                                <li>To send you transactional emails (e.g., password resets).</li>
                            </ul>
                        </section>

                        <section>
                            <h2>4. Data Sharing and Disclosure</h2>
                            <p>
                                <strong>We do not sell your personal data.</strong> We only share data in the following limited circumstances:
                            </p>
                            <ul>
                                <li><strong>Service Providers:</strong> We use Supabase (database) and Vercel (hosting) to operate the Service.</li>
                                <li><strong>Legal Requirements:</strong> If required by law or to protect our rights.</li>
                            </ul>
                        </section>

                        <section>
                            <h2>5. Data Retention and Deletion</h2>
                            <p>
                                We retain your data only as long as your account is active. You may request full account deletion
                                at any time.
                            </p>
                            <p>
                                To request deletion, please contact us at <a href="mailto:privacy@triathlontrainingcoach.com">privacy@triathlontrainingcoach.com</a>.
                            </p>
                        </section>

                        <section>
                            <h2>6. Security</h2>
                            <p>
                                We implement appropriate technical and organizational measures to protect your personal data against
                                unauthorized access, alteration, disclosure, or destruction.
                            </p>
                        </section>

                        <section style={{ paddingTop: '2rem', borderTop: '1px solid var(--neutral-200)' }}>
                            <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>
                                Have questions? <a href="mailto:support@triathlontrainingcoach.com">Contact Support</a>
                            </p>
                        </section>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}
