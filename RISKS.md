# Risk Assessment Report

**Last Updated**: December 9, 2024

This document tracks identified risks for the Triathlon Training Coach project and their mitigation strategies.

---

## 🚨 High-Risk Items

### R-001: Garmin API Access Approval Delay

| Attribute | Details |
|-----------|---------|
| **Probability** | High |
| **Impact** | High |
| **Blocks** | B-001, B-006, B-022, B-023 (~50+ hours of work) |
| **Status** | ⏳ Pending Action |

**Description**: Garmin Developer Program requires business account approval, which can take 2-4 weeks.

**Mitigation**:
- [ ] Apply for Garmin Developer access immediately (before you need it)
- [ ] Start with Strava integration (no approval barrier)
- [ ] Plan Garmin features for Phase 3+

**Action Required**: Apply by **December 10, 2024**

---

### R-002: Backlog Scope Overwhelm

| Attribute | Details |
|-----------|---------|
| **Probability** | Medium |
| **Impact** | High |
| **Blocks** | Project completion, motivation |
| **Status** | ✅ Mitigated |

**Description**: 29 items × 300-460 hours = could take 6-12 months. Risk of burnout or never "shipping".

**Mitigation**:
- [x] Defined v1.0 milestone with focused scope (32-50 hours)
- [x] Prioritized deployment early (B-027)
- [ ] Ship to users, gather feedback before building more
- [ ] Ruthlessly deprioritize features users don't ask for

---

### R-003: Backend Complexity Underestimation

| Attribute | Details |
|-----------|---------|
| **Probability** | Medium |
| **Impact** | Medium |
| **Blocks** | All integrations (B-001, B-002, B-004) |
| **Status** | ⏳ Pending |

**Description**: B-000 (Backend) is estimated at 8-12 hours, but OAuth is notoriously tricky. Token refresh, error handling, and security considerations add up.

**Mitigation**:
- [ ] Start with Strava OAuth 2.0 (simpler) before Garmin OAuth 1.0a
- [ ] Use Supabase Edge Functions to stay in ecosystem
- [ ] Budget extra time (1.5x estimate) for integration features

---

### R-004: No Automated Testing

| Attribute | Details |
|-----------|---------|
| **Probability** | Medium |
| **Impact** | Medium |
| **Blocks** | Confidence in releases, safe refactoring |
| **Status** | ✅ Mitigated |

**Description**: As codebase grows, regressions become likely. Breaking changes could affect users.

**Mitigation**:
- [x] Added B-029 (Automated Testing) to v1.0 milestone
- [ ] Target >50% coverage on critical paths
- [ ] Set up CI to run tests on push

---

## ⚠️ Medium-Risk Items

### R-005: LLM API Cost Accumulation

| Attribute | Details |
|-----------|---------|
| **Probability** | Low |
| **Impact** | Medium |
| **Blocks** | Budget |
| **Status** | ⏳ Future |

**Description**: If B-004 chat feature is popular, API costs could accumulate (~$0.01-0.05/query × many users).

**Mitigation**:
- [ ] Start with Claude Haiku (cheapest)
- [ ] Implement response caching for common questions
- [ ] Set per-user usage limits
- [ ] Monitor costs weekly

---

### R-006: Mobile Browser Compatibility

| Attribute | Details |
|-----------|---------|
| **Probability** | Medium |
| **Impact** | Low |
| **Blocks** | iOS user experience |
| **Status** | ⏳ Future |

**Description**: PWA features vary by browser. iOS Safari has limitations (no true push notifications, limited background sync).

**Mitigation**:
- [ ] Test on actual iPhones during B-019 development
- [ ] Document known iOS limitations
- [ ] Consider web push alternatives for iOS

---

### R-007: Workout Data Model Lock-in

| Attribute | Details |
|-----------|---------|
| **Probability** | Medium |
| **Impact** | Medium |
| **Blocks** | B-006, B-012, B-024 |
| **Status** | ⏳ Future |

**Description**: Current workout structure may not support all future needs (Garmin push, bricks, indoor/outdoor). Painful refactoring later.

**Mitigation**:
- [ ] Review workout data model BEFORE B-006 or B-012
- [ ] Design for extensibility (workout types, step structures)
- [ ] Document workout format specification

---

## 📋 Risk Action Items

| # | Action | Owner | Due Date | Status |
|---|--------|-------|----------|--------|
| 1 | Apply for Garmin Developer access | Keith | Dec 10, 2024 | ⏳ |
| 2 | Deploy to production (B-027) | - | Before v1.0 | ⏳ |
| 3 | Set up basic automated tests | - | During v1.0 | ⏳ |
| 4 | Review workout data model | - | Before B-006 | ⏳ |

---

## Risk Matrix

```
         │ Low Impact │ Med Impact │ High Impact
─────────┼────────────┼────────────┼────────────
High     │            │            │ R-001
Prob.    │            │            │
─────────┼────────────┼────────────┼────────────
Medium   │ R-006      │ R-003      │ R-002 ✓
Prob.    │            │ R-004 ✓    │
         │            │ R-007      │
─────────┼────────────┼────────────┼────────────
Low      │            │ R-005      │
Prob.    │            │            │
```

*✓ = Mitigated*
