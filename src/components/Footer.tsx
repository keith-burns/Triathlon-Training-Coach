
import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-professional">
            <div className="footer-content">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-brand-col">
                        <div className="footer-logo">
                            <span>🏊‍♂️🚴‍♂️🏃‍♂️</span>
                            <span>TriCoach</span>
                        </div>
                        <p className="footer-tagline">
                            Adaptive triathlon training plans for every athlete. Train smarter, race faster.
                        </p>
                        <div className="footer-socials">
                            {/* Social Placeholders */}
                            <SocialIcon label="Twitter" />
                            <SocialIcon label="GitHub" />
                            <SocialIcon label="Strava" />
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="footer-heading">Product</h3>
                        <ul className="footer-links-list">
                            <li><a href="/#features">Features</a></li>
                            <li><a href="/#plans">Pricing</a></li>
                            <li><a href="/#testimonials">Success Stories</a></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="footer-heading">Resources</h3>
                        <ul className="footer-links-list">
                            <li><a href="#">Blog (Coming Soon)</a></li>
                            <li><a href="#">Training Guides</a></li>
                            <li><a href="#">Race Day Checklist</a></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div>
                        <h3 className="footer-heading">Legal</h3>
                        <ul className="footer-links-list">
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="#" style={{ opacity: 0.5, cursor: 'not-allowed' }}>Terms of Service</Link></li>
                            <li><a href="mailto:support@triathlontrainingcoach.com">Contact Support</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {currentYear} Triathlon Training Coach. All rights reserved.</p>
                    <p>Made with ❤️ for triathletes.</p>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ label }: { label: string }) {
    return (
        <a
            href="#"
            className="social-icon"
            title={label}
        >
            <span className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
                {label}
            </span>
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
        </a>
    );
}
