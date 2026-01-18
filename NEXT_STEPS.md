# Next Steps - Kala Development Roadmap
**Date**: 2026-01-18
**Based on**: PRD Gap Analysis & Audit Report

---

## Executive Summary

Aplikasi Kala sudah mencapai **70% feature coverage** dari PRD. Dokumen ini menguraikan langkah-langkah prioritas untuk mencapai production-readiness.

---

## 🔴 Priority 1: Critical Fixes (Required Before Deploy)

### 1.1. Fix Settings Page 404
**Effort**: 30 minutes
**Impact**: UX blocker

**Current Issue**: Link "Settings" di sidebar menghasilkan 404.

**Options**:
- **Option A**: Remove Settings link temporarily
  ```jsx
  // Sidebar.jsx - comment out Settings link
  ```
- **Option B**: Create Settings page with profile settings
  ```bash
  # Create SettingsController
  php artisan make:controller SettingsController
  # Create Settings page
  touch resources/js/Pages/Settings/Index.jsx
  ```

**Recommendation**: Option A for immediate deploy, Option B for next iteration.

---

### 1.2. Fix Landing Page Contrast
**Effort**: 15 minutes
**Impact**: Accessibility

**Current Issue**: Dark text on dark background makes content hard to read.

**Fix**:
```jsx
// Welcome.jsx
// Change text colors from dark grey to white/light grey
className="text-white" // instead of text-slate-900
className="text-white/60" // instead of text-slate-600
```

---

### 1.3. Implement Pre-Submission Checklist UI
**Effort**: 3 hours
**Impact**: Completes P0 PRD Feature (PRD 4.5)

**Current State**: `ChatController::generateChecklist()` exists but no UI.

**Implementation Plan**:

1. **Create ChecklistPanel Component**
   ```jsx
   // resources/js/Components/Assignment/ChecklistPanel.jsx
   - Fetch checklist from API
   - Display items with checkboxes
   - Track completion state
   - Show overall completion percentage
   ```

2. **Add to Assignment Show Page**
   ```jsx
   // resources/js/Pages/Assignment/Show.jsx
   - Add "Pre-Submit Checklist" section
   - OR add button to open checklist modal
   ```

3. **Update Route** (already exists)
   ```php
   // routes/web.php
   Route::post('/tasks/{task}/checklist', ...);
   // Consider: POST /assignments/{id}/checklist instead
   ```

---

## 🟡 Priority 2: High Impact Features

### 2.1. Implement Focus Mode
**Effort**: 4 hours
**Impact**: Core Workspace Feature (PRD 4.3 P0)

**Design**:
```
┌─────────────────────────────────────────┐
│ [←] Focus Mode                    [✕]   │
├─────────────────────────────────────────┤
│                                         │
│   📋 Current Task                       │
│   ─────────────────                     │
│   "Research climate change impacts"     │
│                                         │
│   ⏱️ Est: 30 minutes                    │
│   📝 Context: This is part of...        │
│                                         │
│   [ ] Mark Complete                     │
│                                         │
├─────────────────────────────────────────┤
│ 💬 Ask AI Tutor                         │
│ ┌─────────────────────────────────────┐ │
│ │ How should I approach this task?    │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Implementation**:
1. Create `FocusMode.jsx` component (full screen overlay)
2. Add "Focus" button to TaskItem
3. Pass task context to AI Tutor
4. Add keyboard shortcut (Esc to exit)

---

### 2.2. Enable Milestone Editing
**Effort**: 2 hours
**Impact**: User Flexibility (PRD 4.2 P1)

**Implementation**:
1. Add edit button to `MilestoneAccordion.jsx`
2. Create inline edit form or modal
3. Add `MilestoneController::update()` endpoint
4. Add route: `PATCH /milestones/{milestone}`

---

### 2.3. Add AI Mode Switching
**Effort**: 2 hours
**Impact**: Better AI Experience (PRD 4.4 P1)

**Modes to Add**:
```jsx
const AI_MODES = {
  guide: {
    label: 'Guide',
    icon: CompassIcon,
    description: 'Step-by-step help'
  },
  explain: {
    label: 'Explain',
    icon: AcademicCapIcon,
    description: 'Detailed explanations'
  },
  brainstorm: {
    label: 'Brainstorm',
    icon: LightBulbIcon,
    description: 'Ideation without writing'
  }
};
```

**Implementation**:
1. Add mode selector to TutorSidecar header
2. Pass mode to API request
3. Update TutorChat service with mode-specific prompts
4. Store user's preferred mode

---

### 2.4. Add Toast Notifications
**Effort**: 1 hour
**Impact**: User Feedback

**Implementation**:
1. Install react-hot-toast or similar
   ```bash
   npm install react-hot-toast
   ```
2. Add ToastProvider to AppLayout
3. Show toasts on:
   - Assignment created
   - Task toggled
   - Assignment deleted
   - AI chat error

---

## 🟢 Priority 3: Polish & Enhancement

### 3.1. Add Pagination to Dashboard
**Effort**: 1 hour

```php
// DashboardController.php
$assignments = Assignment::forUser(auth()->id())
    ->orderBy('due_date')
    ->paginate(10);
```

```jsx
// Dashboard.jsx
<Pagination links={assignments.links} />
```

---

### 3.2. Add Search & Filter
**Effort**: 2 hours

**Features**:
- Search by title
- Filter by status (all, active, completed, at-risk)
- Sort by due date, created date

---

### 3.3. Improve Accessibility
**Effort**: 2 hours

**Fixes**:
- Improve color contrast (WCAG AA)
- Add ARIA labels to interactive elements
- Ensure focus indicators visible
- Add keyboard navigation

---

### 3.4. Add Code Splitting
**Effort**: 1 hour

**Current Issue**: `Show.js` bundle is 225KB

**Fix**:
```jsx
// Lazy load heavy components
const TutorSidecar = lazy(() => import('@/Components/AI/TutorSidecar'));

<Suspense fallback={<Loading />}>
  <TutorSidecar />
</Suspense>
```

---

## 📅 Implementation Timeline

### Week 1 (Before Deploy)
| Day | Task | Effort |
|-----|------|--------|
| 1 | Fix Settings 404 + Contrast | 1 hour |
| 1 | Fix React console warning | 15 min |
| 1-2 | Implement Checklist UI | 3 hours |
| 2 | Add Toast Notifications | 1 hour |
| 2 | Testing & Bug Fixes | 2 hours |

### Week 2 (Post-Deploy Iteration)
| Day | Task | Effort |
|-----|------|--------|
| 1-2 | Implement Focus Mode | 4 hours |
| 2 | Milestone Editing | 2 hours |
| 3 | AI Mode Switching | 2 hours |
| 3 | Polish & Testing | 2 hours |

### Week 3 (Enhancement)
| Day | Task | Effort |
|-----|------|--------|
| 1 | Pagination | 1 hour |
| 1 | Search & Filter | 2 hours |
| 2 | Accessibility Improvements | 2 hours |
| 2 | Code Splitting | 1 hour |
| 3 | Full QA & Bug Fixes | 4 hours |

---

## 🎯 Target Metrics Post-Implementation

| Metric | Current | Target |
|--------|---------|--------|
| PRD Feature Coverage | 70% | 90% |
| P0 Features Complete | 12/14 | 14/14 |
| P1 Features Complete | 3/8 | 6/8 |
| A11y Score | ~60 | 85+ |
| Performance Score | - | 90+ |

---

## 🔧 Technical Debt to Address

1. **Tests** - No automated tests exist
   - Add PHPUnit tests for controllers
   - Add Jest tests for React components

2. **TypeScript** - Currently all JavaScript
   - Consider migrating to TypeScript for better DX

3. **Error Handling** - Basic try-catch
   - Add error boundary for React
   - Add structured error logging

4. **Documentation** - Limited inline docs
   - Add JSDoc to components
   - Add PHPDoc to services

---

## 📋 Quick Start Commands

```bash
# Development
php artisan serve
npm run dev

# Build & Test
npm run build
php artisan test

# Database
php artisan migrate:fresh --seed
php artisan tinker

# Deployment
vercel --prod
```

---

## 🚀 Ready to Deploy Checklist

Before deploying to production:

- [ ] All Priority 1 fixes completed
- [ ] Build passes without errors
- [ ] No console errors in browser
- [ ] All pages accessible and functional
- [ ] Environment variables configured
- [ ] Database migration ready
- [ ] GROK_API_KEY set in production

---

*Next Steps document generated by AI Agent*
*Date: 2026-01-18*
