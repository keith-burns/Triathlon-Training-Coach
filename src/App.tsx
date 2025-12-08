import { useState, useEffect } from 'react';
import type { RaceDistance, RaceConfig, TrainingPlan, RaceDistanceId } from './types/race';
import type { AthleteProfile } from './types/athlete';
import { RACE_DISTANCES } from './types/race';
import { generateTrainingPlan } from './utils/generateTrainingPlan';
import { RaceConfigModal } from './components/RaceConfigModal';
import { TrainingPlanView } from './components/TrainingPlanView';
import { AuthModal } from './components/AuthModal';
import { AthleteProfileWizard } from './components/AthleteProfileWizard';
import { Dashboard } from './components/Dashboard';
import { ProfilePage } from './components/ProfilePage';
import { AppLayout } from './components/AppLayout';
import type { AppView } from './components/AppHeader';
import { useAuth } from './contexts/AuthContext';
import { useTrainingPlans } from './hooks/useTrainingPlans';
import { useAthleteProfile } from './hooks/useAthleteProfile';
import './App.css';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { savePlan, getPlans } = useTrainingPlans();
  const { profile, hasProfile, saveProfile } = useAthleteProfile();

  const [selectedDistance, setSelectedDistance] = useState<RaceDistance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showProfileWizard, setShowProfileWizard] = useState(false);
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(() => {
    // Initialize from localStorage if available
    const localPlan = localStorage.getItem('pendingPlan');
    if (localPlan) {
      try {
        return JSON.parse(localPlan) as TrainingPlan;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [_savedPlanId, setSavedPlanId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  // Load saved plan when user logs in
  useEffect(() => {
    const loadSavedPlan = async () => {
      if (user && !authLoading) {
        console.log('Loading saved plans for user:', user.id);
        const plans = await getPlans();
        console.log('Found plans:', plans.length, plans);
        if (plans.length > 0) {
          // Load the most recent plan
          const latestPlan = plans[0];
          console.log('Loading latest plan:', latestPlan);
          setTrainingPlan(latestPlan.plan_data);
          setSavedPlanId(latestPlan.id);
          setSaveStatus('saved');
        } else {
          console.log('No saved plans found');
        }
      }
    };
    loadSavedPlan();
  }, [user, authLoading]);

  // Sync localStorage plan to database when user logs in
  useEffect(() => {
    const syncLocalPlan = async () => {
      if (user && !authLoading) {
        const localPlanJson = localStorage.getItem('pendingPlan');
        if (localPlanJson) {
          try {
            const localPlan = JSON.parse(localPlanJson) as TrainingPlan;
            console.log('Found local plan, syncing to database:', localPlan);

            // Save to database
            const { id, error } = await savePlan(localPlan);
            if (!error && id) {
              console.log('Local plan synced successfully:', id);
              localStorage.removeItem('pendingPlan');
              setTrainingPlan(localPlan);
              setSavedPlanId(id);
              setSaveStatus('saved');
            } else {
              console.error('Failed to sync local plan:', error);
            }
          } catch (e) {
            console.error('Error parsing local plan:', e);
            localStorage.removeItem('pendingPlan');
          }
        }
      }
    };
    syncLocalPlan();
  }, [user, authLoading]);

  const handleSelectDistance = (distanceId: RaceDistanceId) => {
    setSelectedDistance(RACE_DISTANCES[distanceId]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDistance(null);
  };

  const handleSubmitConfig = (config: RaceConfig) => {
    const plan = generateTrainingPlan(config);
    setTrainingPlan(plan);
    setSavedPlanId(null);
    setSaveStatus('idle');
    setIsModalOpen(false);

    // Save to localStorage for anonymous users (will sync on login)
    if (!user) {
      localStorage.setItem('pendingPlan', JSON.stringify(plan));
      console.log('Plan saved to localStorage for later sync');
    } else {
      // Auto-save for logged-in users
      savePlan(plan).then(({ id, error }) => {
        if (!error && id) {
          setSavedPlanId(id);
          setSaveStatus('saved');
        }
      });
    }
  };

  const handleBackToLanding = () => {
    setTrainingPlan(null);
    setSelectedDistance(null);
    setSavedPlanId(null);
    setSaveStatus('idle');
  };

  const handleSavePlan = async () => {
    if (!trainingPlan || !user) {
      if (!user) {
        setIsAuthModalOpen(true);
      }
      return;
    }

    setSaveStatus('saving');
    const { id, error } = await savePlan(trainingPlan);

    if (error) {
      setSaveStatus('error');
      console.error('Failed to save plan:', error);
    } else {
      setSavedPlanId(id);
      setSaveStatus('saved');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setTrainingPlan(null);
    setSavedPlanId(null);
  };

  const handleProfileComplete = async (profileData: Partial<AthleteProfile>) => {
    await saveProfile(profileData);
    setShowProfileWizard(false);

    // If user has a current plan, regenerate it with new profile data
    if (trainingPlan) {
      const updatedPlan = generateTrainingPlan(trainingPlan.raceConfig);
      setTrainingPlan(updatedPlan);
      setSaveStatus('idle'); // Mark as needing save
    }
  };

  const handleProfileSkip = () => {
    setShowProfileWizard(false);
  };

  // Show profile wizard
  if (showProfileWizard) {
    return (
      <AthleteProfileWizard
        onComplete={handleProfileComplete}
        onSkip={handleProfileSkip}
        initialProfile={profile || undefined}
      />
    );
  }

  // Show authenticated app with layout for logged-in users with a plan
  if (user && trainingPlan) {
    return (
      <>
        <AppLayout
          currentView={currentView}
          onNavigate={setCurrentView}
          onSignOut={handleSignOut}
          userName={user.email?.split('@')[0]}
          raceName={trainingPlan.raceConfig.raceName}
          hasPlan={true}
        >
          {currentView === 'dashboard' && (
            <Dashboard
              plan={trainingPlan}
              userName={user.email?.split('@')[0]}
            />
          )}
          {currentView === 'plan' && (
            <TrainingPlanView
              plan={trainingPlan}
              onBack={() => setCurrentView('dashboard')}
              onSave={handleSavePlan}
              saveStatus={saveStatus}
              isLoggedIn={true}
              onLoginClick={() => { }}
            />
          )}
          {currentView === 'profile' && (
            <ProfilePage
              profile={profile}
              onSave={async (profileData) => {
                await saveProfile(profileData);
              }}
              onPlanRegenerate={() => {
                if (trainingPlan) {
                  const updatedPlan = generateTrainingPlan(trainingPlan.raceConfig);
                  setTrainingPlan(updatedPlan);
                  setSaveStatus('idle');
                }
              }}
            />
          )}
        </AppLayout>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setSaveStatus('idle')}
        />
      </>
    );
  }

  // Show full plan view for anonymous users with a plan
  if (trainingPlan) {
    return (
      <>
        <TrainingPlanView
          plan={trainingPlan}
          onBack={handleBackToLanding}
          onSave={handleSavePlan}
          saveStatus={saveStatus}
          isLoggedIn={false}
          onLoginClick={() => setIsAuthModalOpen(true)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setSaveStatus('idle')}
        />
      </>
    );
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="nav">
        <div className="container nav-container">
          <a href="/" className="nav-logo">
            <span className="logo-icon">🏊‍♂️🚴‍♂️🏃‍♂️</span>
            <span className="logo-text">TriCoach</span>
          </a>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#plans">Plans</a>
            <a href="#about">About</a>
            {authLoading ? (
              <span className="nav-loading">...</span>
            ) : user ? (
              <div className="nav-user">
                {trainingPlan ? (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {/* Already on plan view or will show */ }}
                  >
                    📋 My Plan
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    🎯 Create Plan
                  </button>
                )}
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowProfileWizard(true)}
                  title="Personalize your training"
                >
                  {hasProfile ? '⚙️ Profile' : '✨ Setup Profile'}
                </button>
                <span className="nav-email">{user.email?.split('@')[0]}</span>
                <button className="btn btn-outline btn-sm" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <p className="hero-eyebrow">Personalized Training Plans</p>
            <h1 className="hero-title">
              Train Smarter.<br />
              <span className="text-gradient">Race Faster.</span>
            </h1>
            <p className="hero-description">
              Create custom triathlon training plans tailored to your goals,
              schedule, and fitness level. Whether you're preparing for a Sprint,
              Olympic, 70.3, or full Ironman—we've got you covered.
            </p>
            <div className="hero-cta">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Build My Plan
                <span className="btn-arrow">→</span>
              </button>
              <button className="btn btn-outline btn-lg">
                Learn More
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">10K+</span>
                <span className="stat-label">Athletes</span>
              </div>
              <div className="stat">
                <span className="stat-value">50+</span>
                <span className="stat-label">Race Types</span>
              </div>
              <div className="stat">
                <span className="stat-value">4.9★</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card swim-card">
              <span className="card-icon">🏊‍♂️</span>
              <span className="card-label">Swim</span>
              <span className="card-stat">2.4 mi</span>
            </div>
            <div className="hero-card bike-card">
              <span className="card-icon">🚴‍♂️</span>
              <span className="card-label">Bike</span>
              <span className="card-stat">112 mi</span>
            </div>
            <div className="hero-card run-card">
              <span className="card-icon">🏃‍♂️</span>
              <span className="card-label">Run</span>
              <span className="card-stat">26.2 mi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Why TriCoach?</p>
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-description">
              From beginner to elite, our platform adapts to your unique needs.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Goal-Based Plans</h3>
              <p className="feature-description">
                Set your race date and distance. We'll create a periodized plan
                that peaks you at the perfect time.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Adaptive Training</h3>
              <p className="feature-description">
                Plans adjust based on your progress, recovery, and schedule
                changes. Life happens—your training adapts.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Structured Workouts</h3>
              <p className="feature-description">
                Every session has a purpose. Intervals, tempo, recovery—all
                designed to maximize your performance.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3 className="feature-title">Brick Sessions</h3>
              <p className="feature-description">
                Master race-day transitions with swim-to-bike and bike-to-run
                workouts built into your schedule.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3 className="feature-title">Progress Tracking</h3>
              <p className="feature-description">
                Visualize your improvement with detailed analytics across all
                three disciplines.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3 className="feature-title">Race Ready</h3>
              <p className="feature-description">
                Taper protocols, race-day nutrition guides, and pacing
                strategies to help you crush your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Distance Selector Section */}
      <section id="plans" className="plans">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Choose Your Challenge</p>
            <h2 className="section-title">What's Your Race Distance?</h2>
          </div>
          <div className="plans-grid">
            <div className="plan-card">
              <div className="plan-badge">Beginner Friendly</div>
              <h3 className="plan-name">Sprint</h3>
              <div className="plan-distances">
                <span>750m Swim</span>
                <span>20km Bike</span>
                <span>5km Run</span>
              </div>
              <button
                className="btn btn-outline btn-block"
                onClick={() => handleSelectDistance('sprint')}
              >
                Select Sprint
              </button>
            </div>
            <div className="plan-card">
              <div className="plan-badge">Popular</div>
              <h3 className="plan-name">Olympic</h3>
              <div className="plan-distances">
                <span>1.5km Swim</span>
                <span>40km Bike</span>
                <span>10km Run</span>
              </div>
              <button
                className="btn btn-outline btn-block"
                onClick={() => handleSelectDistance('olympic')}
              >
                Select Olympic
              </button>
            </div>
            <div className="plan-card featured">
              <div className="plan-badge">Challenge</div>
              <h3 className="plan-name">70.3</h3>
              <div className="plan-distances">
                <span>1.9km Swim</span>
                <span>90km Bike</span>
                <span>21.1km Run</span>
              </div>
              <button
                className="btn btn-primary btn-block"
                onClick={() => handleSelectDistance('half')}
              >
                Select 70.3
              </button>
            </div>
            <div className="plan-card">
              <div className="plan-badge">Ultimate</div>
              <h3 className="plan-name">Full Ironman</h3>
              <div className="plan-distances">
                <span>3.8km Swim</span>
                <span>180km Bike</span>
                <span>42.2km Run</span>
              </div>
              <button
                className="btn btn-outline btn-block"
                onClick={() => handleSelectDistance('full')}
              >
                Select Full
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-brand">
            <span className="logo-icon">🏊‍♂️🚴‍♂️🏃‍♂️</span>
            <span className="logo-text">TriCoach</span>
            <p>Train smarter. Race faster.</p>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#plans">Plans</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <p className="footer-copy">© 2024 TriCoach. All rights reserved.</p>
        </div>
      </footer>

      {/* Race Config Modal */}
      <RaceConfigModal
        isOpen={isModalOpen}
        distance={selectedDistance}
        onClose={handleCloseModal}
        onSubmit={handleSubmitConfig}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default App;
