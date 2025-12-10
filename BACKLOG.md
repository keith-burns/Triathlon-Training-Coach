# Product Backlog

## Overview
This backlog tracks feature development for the Triathlon Training Coach application.

**Effort estimates assume AI-assisted development** using Claude Opus 4.5 (Thinking) + Antigravity IDE.

---

## 🎯 v1.0 Milestone: Friends & Family Release

Focused scope for initial production release:

| Item | Feature | Hours | Status |
|------|---------|-------|--------|
| B-027 | Production Deployment | 4-8 | ✅ Done |
| B-007 | Enhanced Preferences | 8-12 | Not Started |
| B-019 | Mobile PWA | 10-14 | Not Started |
| B-028 | Metric/Imperial | 6-10 | Not Started |
| B-029 | Automated Tests | 4-6 | ✅ Done |

**Total: ~32-50 hours** | **Progress: ~40% complete**

### Success Criteria
- [x] App deployed and accessible via URL → https://triathlontrainingcoach.vercel.app/
- [ ] 5+ friends/family actively testing
- [ ] Core features work on mobile
- [ ] No critical bugs reported

---

## 🏗️ B-000: Backend Infrastructure

| Field | Value |
|-------|-------|
| **Priority** | P1 - Critical |
| **Value** | ⭐⭐⭐⭐⭐ Very High |
| **Effort** | **8-12 hours** |
| **Status** | 🔶 Partial (Sprint 0.0 complete) |

### Description
Set up backend infrastructure required for OAuth integrations, secure API key storage, and webhooks.

### User Value
- Unlocks all external integrations (Garmin, Strava)
- Enables secure LLM API usage
- Foundation for real-time activity sync

### Acceptance Criteria

**Security & Auth:**
- [x] Move Supabase credentials to `.env` file (security fix) ✅ Sprint 0.0
- [x] Use `import.meta.env` for all environment variables ✅ Sprint 0.0
- [ ] Secure token handling for OAuth (encrypted storage, auto-refresh)
- [ ] Add "Forgot Password" UI flow (Supabase built-in)

**Infrastructure:**
- [x] Install and configure `react-router-dom` for proper navigation ✅ Sprint 0.0
- [ ] Supabase Edge Functions or Express API setup
- [ ] OAuth token storage (encrypted)
- [ ] Webhook endpoints for activity notifications
- [ ] CORS configuration for frontend
- [ ] Basic error logging

### Technical Notes
- Supabase Auth handles password hashing (bcrypt) and session management
- Can use Supabase Edge Functions (Deno) to stay in ecosystem
- Alternative: Vercel/Netlify serverless functions
- Must handle token refresh for OAuth providers
- React Router needed for bookmarkable URLs, back button, and PWA experience

### Dependencies
- None (this is the foundation)

---

## 🔌 B-001: Garmin Connect Integration

| Field | Value |
|-------|-------|
| **Priority** | P2 - High |
| **Value** | ⭐⭐⭐⭐⭐ Very High |
| **Effort** | **15-20 hours** |
| **Status** | Not Started |

### Description
Connect Garmin accounts to auto-sync training data, eliminating manual logging and providing real device metrics.

### User Value
- Eliminates manual data entry
- Real physiological data (HR, power, pace)
- VO2max and Training Status metrics
- Objective training load tracking

### Acceptance Criteria
- [ ] OAuth flow to connect Garmin account
- [ ] Recent activities (7 days) import on connection
- [ ] New activities sync automatically
- [ ] HR zones sync from Garmin if available
- [ ] User can disconnect account
- [ ] Graceful error handling

### Dependencies
- **B-000 (Backend Infrastructure)** - OAuth token storage
- Garmin Developer API credentials (business account approval ~1-2 weeks)

---

## 🚴 B-002: Strava Integration

| Field | Value |
|-------|-------|
| **Priority** | P2 - High |
| **Value** | ⭐⭐⭐⭐⭐ Very High |
| **Effort** | **8-12 hours** |
| **Status** | Not Started |

### Description
Connect Strava accounts to import workouts and compare planned vs actual execution.

### User Value
- Wider device compatibility
- Planned vs Actual comparison
- Social motivation features
- Historical data import

### Acceptance Criteria
- [ ] OAuth 2.0 flow to connect Strava
- [ ] Activities import with type mapping
- [ ] Planned workout matched to actual activity
- [ ] Actual vs planned metrics display
- [ ] User can disconnect account

### Dependencies
- **B-000 (Backend Infrastructure)** - OAuth token refresh
- Strava API application (free tier)

---

## 🤖 B-003: AI-Powered Coaching - Rule-Based Expert System

| Field | Value |
|-------|-------|
| **Priority** | P3 - Medium |
| **Value** | ⭐⭐⭐⭐ High |
| **Effort** | **6-10 hours** |
| **Status** | Not Started |

### Description
Rule-based expert system analyzing training patterns and providing coaching insights.

### User Value
- Polarized training feedback (80/20 rule)
- Overtraining detection
- Periodization validation
- Weekly adjustment recommendations

### Acceptance Criteria
- [ ] Calculate weekly intensity distribution
- [ ] Alert if polarization violated (<75% Zone 1-2)
- [ ] Detect rising RPE trend (fatigue signal)
- [ ] Track completion rate and volume trends
- [ ] Generate weekly summary with recommendations
- [ ] Display on Analytics page

### Dependencies
- Workout completion data (RPE, actual vs planned)
- Minimum 2 weeks of training data

---

## 💬 B-004: AI-Powered Coaching - LLM Integration

| Field | Value |
|-------|-------|
| **Priority** | P4 - Low |
| **Value** | ⭐⭐⭐⭐ High |
| **Effort** | **12-18 hours** |
| **Status** | Not Started |

### Description
LLM integration for natural language coaching explanations and Q&A.

### User Value
- "Why this workout?" explanations
- Personalized weekly summaries
- Training Q&A chat interface
- Motivation and context

### Acceptance Criteria
- [ ] Workout explanation available for each workout
- [ ] Weekly narrative training summary
- [ ] Chat interface for questions
- [ ] Context-aware responses using profile + training
- [ ] Token usage tracking

### Dependencies
- **B-000 (Backend Infrastructure)** - API key security
- B-003 (Rule-Based System)
- OpenAI or Anthropic API account

---

## 🔄 B-005: Adaptive Plan Generation

| Field | Value |
|-------|-------|
| **Priority** | P5 - Future |
| **Value** | ⭐⭐⭐⭐⭐ Very High |
| **Effort** | **25-35 hours** |
| **Status** | Not Started |

### Description
Real-time plan adjustments based on performance, illness, travel, and race optimization.

### User Value
- Plans adapt to reality
- Illness recovery protocols
- Travel-friendly adjustments
- Optimal race taper
- Post-race recovery planning

### Acceptance Criteria
- [ ] Detect missed workouts and auto-adjust
- [ ] "Sick mode" triggers recovery protocol
- [ ] Travel dates adjust workout types
- [ ] Auto-generate taper for A-races
- [ ] Post-race recovery focus
- [ ] User can accept/reject adjustments

### Dependencies
- B-003 (Rule-Based System)
- B-004 (LLM Integration)
- B-001 or B-002 (actual performance data)

---

## ⬆️ B-006: Push Workouts to Garmin

| Field | Value |
|-------|-------|
| **Priority** | P2 - High |
| **Value** | ⭐⭐⭐⭐⭐ Very High |
| **Effort** | **14-20 hours** |
| **Status** | Not Started |

### Description
Send planned workouts to Garmin Connect so athletes can follow structured training on their watch with real-time targets, interval alerts, and automatic lap tracking.

### User Value
- Follow structured intervals on Garmin watch with real-time guidance
- Automatic pace/HR/power targets displayed during workout
- Audio/vibration alerts for interval transitions
- Seamless execution - no manual workout creation
- Works across swim/bike/run with sport-specific features

### Acceptance Criteria
- [ ] **Refactor `WorkoutStep` type to use structured data** (required for API)
- [ ] Map app workout format to Garmin Training API JSON schema
- [ ] Support all step types: warmup, interval, recovery, rest, cooldown
- [ ] Support targets: HR zone, power zone, pace range, open
- [ ] Handle swim workouts (pool length, stroke type, rest intervals)
- [ ] "Send to Garmin" button on workout detail view
- [ ] Bulk sync option for upcoming week
- [ ] Confirmation when workout successfully pushed
- [ ] Handle conflicts (workout already exists)

### Dependencies
- B-001 (Garmin Connect Integration) - OAuth already established
- Garmin Training API access (part of Connect Developer Program)

### Technical Notes
- Current `WorkoutStep.duration` uses free-text strings - must convert to structured format
- API accepts JSON, Garmin handles FIT file generation internally
- Different Garmin models support different workout features
- Swim workouts require sport-specific step structure
- Need to test on actual Garmin devices for full validation

---

## ⚙️ B-007: Enhanced Training Preferences

| Field | Value |
|-------|-------|
| **Priority** | P2 - High |
| **Value** | ⭐⭐⭐⭐ High |
| **Effort** | **8-12 hours** |
| **Status** | Not Started |

### Description
Additional user preferences that meaningfully impact training plan generation.

### User Value
- Plans that fit real-life schedule
- Respect for workout timing preferences
- Control over training frequency by discipline

### Acceptance Criteria
- [ ] Preferred long run day (e.g., Saturday)
- [ ] Preferred long bike day (e.g., Sunday)
- [ ] Workouts per week: swim, bike, run, strength
- [ ] Preferred workout time of day (morning/lunch/evening)
- [ ] Avoid back-to-back hard days toggle
- [ ] Max consecutive training days before forced rest
- [ ] Preferences reflected in generated plan

### Dependencies
- Update AthleteProfile type
- Modify generateTrainingPlan logic

---

## 📊 B-008: Strava Fitness Data Import

| Field | Value |
|-------|-------|
| **Priority** | P2 - High |
| **Value** | ⭐⭐⭐⭐⭐ Very High |
| **Effort** | **6-10 hours** |
| **Status** | Not Started |

### Description
Import Strava fitness/freshness data to inform training advisor of current fitness level.

### User Value
- Plans based on actual current fitness, not estimates
- Smarter starting point for training
- Better volume progression recommendations

### Acceptance Criteria
- [ ] Import Strava Fitness (CTL) and Fatigue (ATL) scores
- [ ] Display current fitness trend on dashboard
- [ ] Use fitness data to set initial training load
- [ ] Warn if planned load exceeds sustainable ramp rate

### Dependencies
- B-002 (Strava Integration)

---

## 🏠 B-009: Improved Dashboard

| Field | Value |
|-------|-------|
| **Priority** | P2 - High |
| **Value** | ⭐⭐⭐⭐ High |
| **Effort** | **10-14 hours** |
| **Status** | Not Started |

### Description
Enhanced dashboard with key metrics, today's focus, and quick actions.

### Improvements Needed
- Today's workout prominent with "Start" action
- Week at a glance with completion status
- Training load trend (TSS/hours)
- Countdown to race day
- Quick stats: streak, compliance %, weekly hours
- Upcoming key workouts preview
- Motivational elements (progress milestones)

### Acceptance Criteria
- [ ] Today's workout card with full details
- [ ] Weekly calendar strip with status indicators
- [ ] Training load chart (last 6 weeks)
- [ ] Race countdown with phase indicator
- [ ] Compliance percentage this week/month
- [ ] Current training streak

### Dependencies
- Workout completion tracking data

---

## 📈 B-010: Enhanced Analytics & Progress

| Field | Value |
|-------|-------|
| **Priority** | P2 - High |
| **Value** | ⭐⭐⭐⭐ High |
| **Effort** | **12-16 hours** |
| **Status** | Not Started |

### Description
Comprehensive analytics showing race readiness, plan compliance, and training distribution.

### Improvements Needed
- Race readiness score (% of planned volume completed)
- Plan compliance by discipline
- Time/distance in each discipline (pie chart)
- Volume trend vs plan (chart)
- Intensity distribution (polarization check)
- Projected vs actual peak fitness timing
- Weak areas identification

### Acceptance Criteria
- [ ] Race readiness gauge (0-100%)
- [ ] Compliance chart by week and discipline
- [ ] Time in discipline breakdown
- [ ] Intensity zone distribution chart
- [ ] Volume trend with plan overlay
- [ ] Key insights summary

### Dependencies
- Workout completion data
- B-003 (Rule-Based Expert System)

---

## 🎯 B-011: Race Time Predictor

| Field | Value |
|-------|-------|
| **Priority** | P3 - Medium |
| **Value** | ⭐⭐⭐ Medium |
| **Effort** | **10-14 hours** |
| **Status** | Not Started |

### Description
LLM-powered race time prediction based on training history, fitness metrics, and course characteristics.

### User Value
- Realistic goal setting
- Pacing strategy recommendations
- Confidence in race day targets

### Acceptance Criteria
- [ ] Predict finish time based on training data
- [ ] Account for race distance and course profile
- [ ] Factor in historical race results
- [ ] Provide confidence interval (best/expected/worst)
- [ ] Explain prediction factors
- [ ] Update prediction as training progresses

### Dependencies
- B-003 or B-004 (AI Coaching)
- Sufficient training history (8+ weeks)

---

## 📚 B-012: Expanded Workout Library

| Field | Value |
|-------|-------|
| **Priority** | P3 - Medium |
| **Value** | ⭐⭐⭐⭐ High |
| **Effort** | **8-12 hours** |
| **Status** | Not Started |

### Description
Larger library of structured workouts with search, filter, and favorites.

### User Value
- Variety in training
- Find workouts for specific goals
- Swap planned workout for alternatives

### Acceptance Criteria
- [ ] 50+ swim workouts (drills, intervals, endurance)
- [ ] 50+ bike workouts (sweet spot, threshold, VO2max)
- [ ] 50+ run workouts (tempo, intervals, long runs)
- [ ] 20+ strength/mobility workouts
- [ ] Search by type, duration, intensity
- [ ] Favorite workouts
- [ ] Swap workout in plan with library alternative

### Dependencies
- None (standalone feature)

---

## 🏁 B-013: Multiple Race Goals

| Field | Value |
|-------|-------|
| **Priority** | P3 - Medium |
| **Value** | ⭐⭐⭐⭐ High |
| **Effort** | **15-20 hours** |
| **Status** | Not Started |

### Description
Support multiple races (A, B, C priority) with intelligent periodization across events.

### User Value
- Plan for race season, not just one event
- Proper recovery between races
- Peak for A races, maintain for B/C

### Acceptance Criteria
- [ ] Add multiple races with A/B/C priority
- [ ] Plan builds to A-race peak
- [ ] Reduced taper for B-races
- [ ] Minimal taper for C-races
- [ ] Recovery weeks scheduled after races
- [ ] Visual race calendar

### Dependencies
- Major changes to plan generation logic

---

## 🥗 B-014: Nutrition Planning

| Field | Value |
|-------|-------|
| **Priority** | P4 - Low |
| **Value** | ⭐⭐⭐ Medium |
| **Effort** | **20-30 hours** |
| **Status** | Not Started |

### Description
Basic nutrition guidance for training and race day.

### User Value
- Fueling for long workouts
- Race day nutrition strategy
- Daily calorie/macro targets

### Acceptance Criteria
- [ ] Daily calorie estimate based on training load
- [ ] Fueling recommendations for workouts >90min
- [ ] Race day nutrition timeline
- [ ] Hydration reminders
- [ ] Food log integration (optional)

### Dependencies
- Significant new domain (large scope)

---

## 🌤️ B-015: Weather Forecast Integration

| Field | Value |
|-------|-------|
| **Priority** | P4 - Low |
| **Value** | ⭐⭐⭐ Medium |
| **Effort** | **6-10 hours** |
| **Status** | Not Started |

### Description
Weather forecast for upcoming outdoor workouts.

### User Value
- Plan outdoor vs indoor decisions
- Dress appropriately
- Avoid dangerous conditions

### Acceptance Criteria
- [ ] Weather forecast on today's workout
- [ ] 7-day forecast for planned workouts
- [ ] Suggest indoor alternative if bad weather
- [ ] Heat/cold alerts for safety

### Dependencies
- Weather API (OpenWeatherMap or similar)
- User location permission

---

## 🚴‍♂️ B-016: Indoor/Outdoor Bike Separation

| Field | Value |
|-------|-------|
| **Priority** | P3 - Medium |
| **Value** | ⭐⭐⭐⭐ High |
| **Effort** | **6-10 hours** |
| **Status** | Not Started |

### Description
Separate indoor trainer workouts from outdoor rides, linked to equipment profile.

### User Value
- Power-based workouts for indoor (if trainer has power)
- RPE/HR-based for outdoor (if no outdoor power meter)
- Proper equipment tracking

### Acceptance Criteria
- [ ] Profile: Indoor power meter (yes/no)
- [ ] Profile: Outdoor power meter (yes/no)
- [ ] Workouts tagged as indoor/outdoor capable
- [ ] Power targets shown only when power available
- [ ] Suggest indoor when weather bad + trainer available

### Dependencies
- Update Equipment in AthleteProfile

---

## 🧠 B-017: Smarter Plan Generation

| Field | Value |
|-------|-------|
| **Priority** | P2 - High |
| **Value** | ⭐⭐⭐⭐⭐ Very High |
| **Effort** | **20-30 hours** |
| **Status** | Not Started |

### Description
More intelligent training plan generation with periodization science.

### Improvements Needed
- Proper mesocycle structure (3:1 or 2:1 load:recovery)
- Key workout placement (not random)
- Brick workouts in build/peak phases
- Sport-specific focus by phase
- Recovery week auto-scheduling
- Taper calculation based on race distance
- Consider athlete's limiters

### Acceptance Criteria
- [ ] Recognizable mesocycle structure
- [ ] Key workouts on preferred days
- [ ] Brick workouts scheduled appropriately
- [ ] Recovery weeks every 3-4 weeks
- [ ] Taper length matches race distance
- [ ] Plan addresses athlete's weakest discipline

### Dependencies
- B-007 (Enhanced Preferences)
- Significant refactor of generateTrainingPlan

---

## 🏃 B-018: Non-Triathlon Events

| Field | Value |
|-------|-------|
| **Priority** | P4 - Low |
| **Value** | ⭐⭐⭐ Medium |
| **Effort** | **15-20 hours** |
| **Status** | Not Started |

### Description
Support single-sport events (marathon, century ride, open water swim).

### User Value
- Athletes who race both tri and single-sport
- Focused training blocks for key events
- Proper event-specific preparation

### Acceptance Criteria
- [ ] Event types: marathon, half-marathon, 5K/10K
- [ ] Event types: century, gran fondo
- [ ] Event types: open water swim
- [ ] Single-sport focused training blocks
- [ ] Maintain fitness in other disciplines
- [ ] Transition back to triathlon training

### Dependencies
- B-013 (Multiple Race Goals)

---

## 📱 B-019: Mobile PWA Optimization

| Field | Value |
|-------|-------|
| **Priority** | P2 - High |
| **Value** | ⭐⭐⭐⭐⭐ Very High |
| **Effort** | **10-14 hours** |
| **Status** | Not Started |

### Description
Progressive Web App enhancements for mobile experience.

### User Value
- Use app like native mobile app
- Offline access to today's workout
- Push notifications for reminders

### Acceptance Criteria
- [ ] Add to Home Screen prompt
- [ ] Offline workout viewing
- [ ] Push notifications (workout reminders)
- [ ] Mobile-optimized UI refinements
- [ ] App-like navigation

### Dependencies
- Service worker setup
- Push notification service

---

## 📅 B-020: Calendar Export

| Field | Value |
|-------|-------|
| **Priority** | P4 - Low |
| **Value** | ⭐⭐⭐ Medium |
| **Effort** | **4-6 hours** |
| **Status** | Not Started |

### Description
Export training plan to external calendars.

### User Value
- See workouts in Google Calendar
- Block time for training
- Sync with work/life schedule

### Acceptance Criteria
- [ ] Export to iCal format
- [ ] Subscribe URL for live sync
- [ ] Include workout details in event
- [ ] Google Calendar integration

### Dependencies
- None (standalone feature)

---

## 👥 B-021: Social/Community Features

| Field | Value |
|-------|-------|
| **Priority** | P5 - Future |
| **Value** | ⭐ Low |
| **Effort** | **25-35 hours** |
| **Status** | Not Started |

### Description
Social features for motivation and community.

### User Value
- Train with friends
- Accountability partners
- Share achievements

### Acceptance Criteria
- [ ] Follow other athletes
- [ ] Share training plans
- [ ] Group challenges
- [ ] Leaderboards (optional)
- [ ] Comments/kudos on workouts

### Dependencies
- Significant backend infrastructure

---

## 😴 B-022: Sleep & Recovery Integration

| Field | Value |
|-------|-------|
| **Priority** | P4 - Low |
| **Value** | ⭐⭐⭐⭐ High |
| **Effort** | **10-15 hours** |
| **Status** | Not Started |

### Description
Import sleep/recovery data from wearables to adjust training.

### User Value
- Train based on recovery status
- Avoid overtraining
- Optimize adaptation

### Acceptance Criteria
- [ ] Import Garmin sleep/Body Battery
- [ ] Display recovery status
- [ ] Suggest intensity adjustment when low recovery
- [ ] Track sleep trends

### Dependencies
- B-001 (Garmin Integration)

---

## 💓 B-023: HRV Readiness

| Field | Value |
|-------|-------|
| **Priority** | P4 - Low |
| **Value** | ⭐⭐⭐⭐ High |
| **Effort** | **8-12 hours** |
| **Status** | Not Started |

### Description
HRV-based daily readiness to adjust training intensity.

### User Value
- Objective readiness measurement
- Train hard when ready, easy when fatigued
- Reduce injury/illness risk

### Acceptance Criteria
- [ ] Manual HRV entry option
- [ ] Import HRV from Garmin/Oura
- [ ] Display readiness score
- [ ] Suggest workout modification based on HRV

### Dependencies
- B-001 or compatible integration

---

## 🧱 B-024: Brick Workout Support

| Field | Value |
|-------|-------|
| **Priority** | P3 - Medium |
| **Value** | ⭐⭐⭐ Medium |
| **Effort** | **4-6 hours** |
| **Status** | Not Started |

### Description
Proper bike-to-run transition workouts.

### User Value
- Practice race-day transitions
- Adapt to running on tired legs
- Build race-specific fitness

### Acceptance Criteria
- [ ] Brick workout type in library
- [ ] Scheduled in build/peak phases
- [ ] Progressive brick duration
- [ ] Track T2 simulation

### Dependencies
- B-012 (Expanded Workout Library)

---

## 🏊 B-025: Open Water Swim Support

| Field | Value |
|-------|-------|
| **Priority** | P4 - Low |
| **Value** | ⭐⭐ Low |
| **Effort** | **6-8 hours** |
| **Status** | Not Started |

### Description
Open water swim workouts and tracking.

### User Value
- Race-specific swim preparation
- Sighting practice
- Different pacing than pool

### Acceptance Criteria
- [ ] Open water workout type
- [ ] Scheduled when weather permits
- [ ] Sighting and navigation focus
- [ ] GPS-based distance tracking

### Dependencies
- B-015 (Weather Integration) helpful

---

## 🔧 B-026: Equipment Tracking

| Field | Value |
|-------|-------|
| **Priority** | P5 - Future |
| **Value** | ⭐⭐ Low |
| **Effort** | **8-12 hours** |
| **Status** | Not Started |

### Description
Track equipment usage for maintenance reminders.

### User Value
- Know when to replace shoes
- Track tire wear
- Manage multiple bikes/shoes

### Acceptance Criteria
- [ ] Add equipment items
- [ ] Auto-track usage from workouts
- [ ] Maintenance reminders
- [ ] Retirement tracking

### Dependencies
- None (nice-to-have feature)

---

## 🚀 B-027: Production Deployment

| Field | Value |
|-------|-------|
| **Priority** | P2 - High |
| **Value** | ⭐⭐⭐⭐⭐ Very High |
| **Effort** | **4-8 hours** |
| **Status** | ✅ Done (2024-12-09) |

### Description
Deploy the application to production so it can be shared with friends and family for real-world testing.

### User Value
- Share app with friends and family
- Real-world testing and feedback
- Accessible from any device

### Acceptance Criteria
- [x] Deploy to Vercel or Netlify → Deployed to https://triathlontrainingcoach.vercel.app/
- [x] Configure environment variables → Supabase URL and key configured
- [ ] Set up custom domain (optional) → Deferred, using Vercel subdomain
- [ ] Enable basic error tracking (Sentry or similar) → Deferred to B-031
- [x] Test all features in production → Auth, plan generation, navigation work
- [x] Invite initial testers → Ready for friends/family testing

### Dependencies
- None (can deploy current state)

---

## 📏 B-028: Metric/Imperial Unit Preferences

| Field | Value |
|-------|-------|
| **Priority** | P3 - Medium |
| **Value** | ⭐⭐⭐⭐ High |
| **Effort** | **6-10 hours** |
| **Status** | Not Started |

### Description
Allow users to choose metric or imperial units for distances, paces, and measurements.

### User Value
- Canadian/European users see km, min/km
- US users see miles, min/mile
- Pool lengths in meters or yards
- Temperature in °C or °F

### Acceptance Criteria
- [ ] User preference in profile (metric/imperial)
- [ ] Distance display conversion (km ↔ miles)
- [ ] Pace display conversion (min/km ↔ min/mile)
- [ ] Pool length options (25m, 50m, 25yd)
- [ ] Consistent throughout all views
- [ ] Default based on locale

### Dependencies
- None (standalone feature)

---

## 🧪 B-029: Automated Testing

| Field | Value |
|-------|-------|
| **Priority** | P2 - High |
| **Value** | ⭐⭐⭐⭐ High |
| **Effort** | **4-6 hours** |
| **Status** | ✅ Done (2024-12-09) |

### Description
Add automated test coverage for critical paths to catch regressions as features are added.

### User Value
- Confidence in releases
- Catch bugs before users do
- Enable safe refactoring

### Acceptance Criteria
- [x] Vitest or Jest configured ✅ Sprint 0.0
- [x] Tests for plan generation logic ✅ 21 tests
- [x] Tests for HR zone calculation ✅ 17 tests
- [x] Tests for date/time utilities ✅ (tested via plan generation)
- [x] CI integration (run on push) ✅ GitHub Actions
- [x] >50% coverage on critical paths ✅ 41 total tests

### Dependencies
- None (can start anytime)

---

## 🗑️ B-030: Account Deletion

| Field | Value |
|-------|-------|
| **Priority** | P5 - Future |
| **Value** | ⭐⭐ Low |
| **Effort** | **2-3 hours** |
| **Status** | Not Started |

### Description
Allow users to delete their account and all associated data (GDPR-like compliance).

### User Value
- Control over personal data
- Privacy assurance
- Right to be forgotten

### Acceptance Criteria
- [ ] "Delete Account" option in settings
- [ ] Confirmation dialog with clear warning
- [ ] Delete all user data (profile, plans, completions)
- [ ] Revoke OAuth tokens for connected services
- [ ] Send confirmation email after deletion

### Dependencies
- None (Supabase handles cascade delete with proper RLS)

---

## 🐛 B-031: Sentry Error Tracking

| Field | Value |
|-------|-------|
| **Priority** | P3 - Medium |
| **Value** | ⭐⭐⭐ Medium |
| **Effort** | **2-4 hours** |
| **Status** | Not Started |

### Description
Integrate Sentry for production error tracking and monitoring. Captures JavaScript errors, performance issues, and user context for debugging.

### User Value
- Faster bug identification and resolution
- Proactive error detection before users report issues
- Performance monitoring and insights

### Acceptance Criteria
- [ ] Sentry SDK installed and configured
- [ ] Error boundary wraps app in production
- [ ] Source maps uploaded for readable stack traces
- [ ] User context attached to error reports (anonymized)
- [ ] Performance monitoring enabled
- [ ] Alerts configured for critical errors

### Dependencies
- B-027 (Production Deployment) - need production environment first

---

## Effort Legend
| Hours | Complexity |
|-------|------------|
| 4-8 | Small - single feature, minimal dependencies |
| 8-15 | Medium - multiple components, some integration |
| 15-25 | Large - external APIs, backend work |
| 25+ | Very Large - core system changes, many edge cases |

*Estimates assume AI-assisted development with Claude Opus 4.5 + Antigravity IDE*
