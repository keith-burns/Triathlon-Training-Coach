---
description: How to deploy code from development to production
---

# Deployment Workflow: Dev to Prod

This workflow describes how to promote code from development to production.

## Repository Setup

| Remote | URL | Purpose |
|--------|-----|---------|
| `origin` | `github.com/keith-burns/triathlon_training_coach` | **Primary repo** (Vercel deploys from here) |
| `backup` | `github.com/keith-burns/Triathlon-Training-Coach` | **Backup repo** (archived dev repo) |

## Branch Strategy

| Branch | Purpose | Vercel Deployment |
|--------|---------|-------------------|
| `develop` | Active development, daily work | Preview deployments |
| `main` | Production-ready code | **Production deployment** |

## Daily Development Workflow

1. **Work on `develop` branch** (your default branch)
   ```bash
   git checkout develop
   # make changes
   git add .
   git commit -m "your message"
   git push
   ```

2. **Test locally** before committing
   ```bash
   npm run dev      # Local development
   npm run test     # Run tests
   npm run build    # Verify build works
   ```

## Deploying to Production

// turbo
### Option 1: GitHub Pull Request (Recommended)

1. Go to GitHub: https://github.com/keith-burns/triathlon_training_coach
2. Click **"Compare & pull request"** or create a new PR
3. Set base: `main` ← compare: `develop`
4. Review the changes
5. **Merge the PR**
6. Vercel automatically deploys to production

### Option 2: Command Line

// turbo
1. **Merge develop into main locally:**
   ```bash
   git checkout main
   git pull origin main
   git merge develop
   git push origin main
   ```

2. **Return to develop branch:**
   ```bash
   git checkout develop
   ```

## Pre-Deploy Checklist

Before deploying to production, verify:

- [ ] All tests pass: `npm run test`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in browser
- [ ] Critical features tested manually
- [ ] Environment variables set in Vercel (if new ones added)

## Rollback (If Needed)

If production has issues after deployment:

// turbo
1. **Revert via GitHub:**
   - Go to the merged PR on GitHub
   - Click **"Revert"** to create a revert PR
   - Merge the revert PR

// turbo
2. **Or revert via command line:**
   ```bash
   git checkout main
   git revert HEAD
   git push origin main
   ```

## Backup Sync (Optional)

To keep the backup repo in sync:

```bash
git push backup develop:main
```

## Vercel Configuration

Vercel should be configured to:
- **Production Branch:** `main`
- **Preview Branches:** `develop` (and any feature branches)

Check Vercel dashboard: https://vercel.com/dashboard
