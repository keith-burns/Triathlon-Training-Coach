---
description: Recommended development order for backlog features
---

# Development Workflow

This workflow provides the recommended order for developing features from BACKLOG.md.

## Phase 1: Foundation (Sprint Zero)

Complete these **before** starting any integration or AI features.

### 1.1 Backend Infrastructure (B-000)
// turbo
```bash
# Set up Supabase Edge Functions
supabase functions new oauth-callback
supabase functions new webhook-handler
```

1. Create Supabase Edge Functions project structure
2. Set up secure environment variables
3. Create OAuth token storage table (encrypted)
4. Test CORS configuration
5. Deploy and verify endpoints

**Estimated: 8-12 hours**

---

### 1.2 Enhanced Training Preferences (B-007)

1. Update `AthleteProfile` type with new preference fields
2. Add preferences step to `AthleteProfileWizard`
3. Update `ProfilePage` to display/edit preferences
4. Modify `generateTrainingPlan` to use preferences
5. Test preference-based plan generation

**Estimated: 8-12 hours**

---

## Phase 2: Quick Wins

High-value, standalone features with no external dependencies.

### 2.0 Production Deployment (B-027) ⭐ RECOMMENDED FIRST

1. Deploy to Vercel (works well with Vite)
2. Configure environment variables
3. Test all features in production
4. Set up basic error tracking
5. Invite friends/family to test

**Estimated: 4-8 hours**

---

### 2.1 Mobile PWA Optimization (B-019)

1. Create service worker for offline support
2. Add manifest.json for installability
3. Implement offline workout caching
4. Set up push notification service
5. Test on mobile devices

**Estimated: 10-14 hours**

---

### 2.2 Calendar Export (B-020)

1. Create iCal generation utility
2. Add export button to training plan view
3. Generate subscribe URL for live sync
4. Test with Google Calendar

**Estimated: 4-6 hours**

---

### 2.3 Rule-Based Expert System (B-003)

1. Extend `trainingAdvisor.ts` with new rules
2. Add intensity distribution calculation
3. Implement fatigue detection (RPE trends)
4. Create weekly summary generator
5. Display insights on Analytics page

**Estimated: 6-10 hours**

---

## Phase 3: Integrations

**Requires B-000 (Backend) to be complete.**

### 3.1 Strava Integration (B-002)

1. Set up Strava API application
2. Implement OAuth 2.0 flow via backend
3. Create activity import handler
4. Map Strava activities to app format
5. Build connected account UI

**Estimated: 8-12 hours**

---

### 3.2 Strava Fitness Import (B-008)

1. Fetch fitness/freshness data from Strava
2. Display fitness trend on dashboard
3. Use CTL to inform starting training load
4. Add ramp rate warnings

**Estimated: 6-10 hours**

---

### 3.3 Garmin Connect Integration (B-001)

1. Apply for Garmin Developer API access
2. Implement OAuth 1.0a flow (more complex)
3. Create activity sync handler
4. Set up webhook for real-time sync
5. Import HR zones from Garmin

**Estimated: 15-20 hours**

---

### 3.4 Push Workouts to Garmin (B-006)

1. Map workout format to Garmin Training API schema
2. Handle swim/bike/run specific structures
3. Create "Send to Garmin" button
4. Implement bulk sync for upcoming week
5. Test on actual Garmin devices

**Estimated: 14-20 hours**

---

## Phase 4: Dashboard & Analytics

### 4.1 Improved Dashboard (B-009)

1. Design new dashboard layout
2. Add today's workout card
3. Create weekly calendar strip
4. Implement training load chart
5. Add race countdown and compliance %

**Estimated: 10-14 hours**

---

### 4.2 Enhanced Analytics (B-010)

1. Create race readiness gauge
2. Build compliance chart by discipline
3. Add time-in-zone distribution
4. Implement volume trend visualization
5. Generate key insights summary

**Estimated: 12-16 hours**

---

## Phase 5: AI & Intelligence

### 5.1 LLM Integration (B-004)

1. Set up LLM API access via backend
2. Create system prompts for coaching context
3. Implement "Why this workout?" explainer
4. Build weekly summary generator
5. Add chat interface for Q&A

**Estimated: 12-18 hours**

---

### 5.2 Smarter Plan Generation (B-017)

1. Implement proper mesocycle structure
2. Add key workout placement logic
3. Schedule brick workouts appropriately
4. Auto-schedule recovery weeks
5. Calculate distance-appropriate taper

**Estimated: 20-30 hours**

---

### 5.3 Adaptive Plan Generation (B-005)

1. Detect missed workouts
2. Implement "sick mode" recovery protocol
3. Add travel date handling
4. Create A-race taper algorithm
5. Build adjustment acceptance UI

**Estimated: 25-35 hours**

---

## Phase 6: Enhancements

Lower priority features to add once core is solid.

- B-028: Metric/Imperial Unit Preferences (6-10 hours) ⭐ For Canadian users
- B-012: Expanded Workout Library (8-12 hours)
- B-013: Multiple Race Goals (15-20 hours)
- B-016: Indoor/Outdoor Bike Separation (6-10 hours)
- B-024: Brick Workout Support (4-6 hours)
- B-011: Race Time Predictor (10-14 hours)

---

## Notes

- **Effort estimates assume AI-assisted development** with Claude Opus 4.5 + Antigravity IDE
- Update BACKLOG.md status as you complete features
- Commit after each feature completion
- Test thoroughly before moving to dependent features
