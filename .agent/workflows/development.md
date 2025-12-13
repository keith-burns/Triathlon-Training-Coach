---
description: Recommended development order for backlog features
---

# Development Sequence

This document defines the **recommended order** for implementing features from `BACKLOG.md`. 

**For current status of each feature, see `BACKLOG.md`** (single source of truth).

---

## How to Use This File

1. **Check BACKLOG.md** for the current status of any feature
2. **Use this file** to determine what to work on next
3. **Follow the sequence** within each sprint for optimal dependency handling
4. **Reference the rationale** when deciding whether to skip or reorder items

---

## Sprint 0: Friends & Family MVP

**Goal:** Get a deployable, testable app to real users before building complex features.

| # | Feature | Backlog ID | Estimate | Dependencies |
|---|---------|------------|----------|--------------|
| 0.0 | Critical Infrastructure | (prereqs) | 2-4h | None |
| 0.1 | Production Deployment | B-027 | 4-8h | 0.0 |
| 0.2 | Automated Testing | B-029 | 4-6h | None |
| 0.3 | Enhanced Training Preferences | B-007 | 8-12h | None |
| 0.4 | Mobile PWA Optimization | B-019 | 10-14h | None |
| 0.5 | Metric/Imperial Units | B-028 | 6-10h | None |

**Sprint 0 Total: ~36-60 hours**

---

## Sprint 1: External Integrations Foundation

**Goal:** Connect to real data sources (Strava, Garmin) for automatic activity tracking.

| # | Feature | Backlog ID | Estimate | Dependencies |
|---|---------|------------|----------|--------------|
| 1.0 | Privacy Policy | B-032 | 2-4h | None (Blocker for 1.3) |
| 1.1 | Backend Infrastructure | B-000 | 10-14h | None |
| 1.2 | Strava Integration | B-002 | 8-12h | B-000 |
| 1.3 | Garmin Connect Integration | B-001 | 15-20h | B-000, B-032 |
| 1.4 | Strava Fitness Data Import | B-008 | 6-10h | B-002 |
| 1.5 | Push Workouts to Garmin | B-006 | 14-20h | B-001 |

**Sprint 1 Total: ~55-80 hours**

---

## Sprint 2: Dashboard & Analytics

**Goal:** Provide meaningful insights and a polished daily experience.

| # | Feature | Backlog ID | Estimate | Dependencies |
|---|---------|------------|----------|--------------|
| 2.0 | Improved Dashboard | B-009 | 10-14h | B-002 or B-001 |
| 2.1 | Enhanced Analytics | B-010 | 12-16h | B-009 |
| 2.2 | Race Time Predictor | B-011 | 10-14h | B-010 |
| 2.3 | Calendar Export | B-020 | 4-6h | None |

**Sprint 2 Total: ~36-50 hours**

---

## Sprint 3: Smart Training

**Goal:** Add intelligence to plan generation and adaptation.

| # | Feature | Backlog ID | Estimate | Dependencies |
|---|---------|------------|----------|--------------|
| 3.0 | Rule-Based Expert System | B-003 | 6-10h | None |
| 3.1 | Smarter Plan Generation | B-017 | 20-30h | B-003 |
| 3.2 | LLM Integration | B-004 | 12-18h | B-000 |
| 3.3 | Adaptive Plan Generation | B-005 | 25-35h | B-017, B-002/B-001 |

**Sprint 3 Total: ~63-93 hours**

---

## Sprint 4: Content & Features

**Goal:** Expand workout library and add race-specific features.

| # | Feature | Backlog ID | Estimate | Dependencies |
|---|---------|------------|----------|--------------|
| 4.0 | Expanded Workout Library | B-012 | 8-12h | None |
| 4.1 | Multiple Race Goals | B-013 | 15-20h | None |
| 4.2 | Brick Workout Support | B-024 | 4-6h | None |
| 4.3 | Indoor/Outdoor Bike Separation | B-016 | 6-10h | None |
| 4.4 | Open Water Swim Support | B-025 | 6-8h | None |

**Sprint 4 Total: ~39-56 hours**

---

## Sprint 5: Wellness & Recovery

**Goal:** Holistic training with nutrition, sleep, and recovery.

| # | Feature | Backlog ID | Estimate | Dependencies |
|---|---------|------------|----------|--------------|
| 5.0 | Weather Forecast Integration | B-015 | 6-10h | None |
| 5.1 | Sleep & Recovery Integration | B-022 | 10-15h | B-001 or B-002 |
| 5.2 | HRV Readiness | B-023 | 8-12h | B-022 |
| 5.3 | Nutrition Planning | B-014 | 20-30h | B-017 |

**Sprint 5 Total: ~44-67 hours**

---

## Sprint 6: Polish & Community

**Goal:** Final features and community building.

| # | Feature | Backlog ID | Estimate | Dependencies |
|---|---------|------------|----------|--------------|
| 6.0 | Non-Triathlon Events | B-018 | 15-20h | B-017 |
| 6.1 | Equipment Tracking | B-026 | 8-12h | B-002 |
| 6.2 | Social/Community Features | B-021 | 25-35h | None |
| 6.3 | Account Deletion | B-030 | 2-3h | None |
| 6.4 | Sentry Error Tracking | B-031 | 2-4h | B-027 |

**Sprint 6 Total: ~52-74 hours**

---

## Total Estimated Effort

| Sprint | Focus | Hours |
|--------|-------|-------|
| 0 | Friends & Family MVP | 36-60h |
| 1 | Integrations | 53-76h |
| 2 | Dashboard & Analytics | 36-50h |
| 3 | Smart Training | 63-93h |
| 4 | Content & Features | 39-56h |
| 5 | Wellness & Recovery | 44-67h |
| 6 | Polish & Community | 52-74h |
| **Total** | | **~323-476 hours** |

---

## Dependency Graph (Key Items)

```
B-000 (Backend) ─┬─→ B-001 (Garmin) ──→ B-006 (Push to Garmin)
                 │
                 └─→ B-002 (Strava) ──→ B-008 (Strava Fitness)
                 │
                 └─→ B-004 (LLM Integration)

B-003 (Rules) ───→ B-017 (Smarter Plans) ───→ B-005 (Adaptive Plans)

B-027 (Deploy) ──→ B-031 (Sentry)
```
