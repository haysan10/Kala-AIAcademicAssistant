# Kala Development Plan - Audit & Enhancement
**Date**: 2026-01-18  
**Status**: In Progress  
**Version**: 2.0

---

## 📋 Executive Summary

Berdasarkan audit komprehensif, Kala AI Assignment Manager telah mencapai **70% feature coverage**. Dokumen ini menguraikan:

1. **Asset Separation Strategy** - Memisahkan graphics dari kode
2. **Feature Enhancement Plan** - Fitur baru dan perbaikan
3. **UI/UX Improvements** - Peningkatan desain dan aksesibilitas
4. **Performance Optimization** - Optimasi performa aplikasi

---

## 🎨 Part 1: Asset Separation & Graphics Management

### 1.1. Current Asset Status

**Asset yang Ditemukan:**
- `public/favicon.ico` - Icon utama aplikasi
- SVG icons dari dependencies (vendor, node_modules)
- Tidak ada folder dedicated untuk custom graphics

**Masalah:**
- ❌ Tidak ada sistem untuk manage custom graphics
- ❌ Tidak ada brand assets (logo, illustrations)
- ❌ Inline SVG di banyak komponen (hard to maintain)

### 1.2. Proposed Asset Structure

```
public/
├── assets/
│   ├── graphics/
│   │   ├── brand/
│   │   │   ├── logo.svg              # Kala logo
│   │   │   ├── logo-icon.svg         # Icon only
│   │   │   └── logo-white.svg        # White variant
│   │   ├── illustrations/
│   │   │   ├── empty-state.svg       # No assignments
│   │   │   ├── focus-mode.svg        # Focus illustration
│   │   │   ├── ai-tutor.svg          # AI character
│   │   │   └── celebration.svg       # Task completed
│   │   ├── icons/
│   │   │   ├── assignment.svg
│   │   │   ├── milestone.svg
│   │   │   ├── task.svg
│   │   │   └── chat.svg
│   │   └── backgrounds/
│   │       ├── hero-gradient.svg     # Landing page
│   │       ├── pattern-dots.svg      # Background patterns
│   │       └── mesh-gradient.svg     # Card backgrounds
│   └── images/
│       ├── onboarding/               # Tutorial images
│       └── screenshots/              # App previews
```

### 1.3. Asset Implementation Tasks

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Create Kala brand logo | P0 | 1h | ⬜ |
| Design custom illustrations | P1 | 3h | ⬜ |
| Create icon set | P1 | 2h | ⬜ |
| Extract inline SVG to files | P2 | 2h | ⬜ |
| Add image optimization pipeline | P2 | 1h | ⬜ |
| Create asset documentation | P2 | 30m | ⬜ |

---

## 🚀 Part 2: Feature Enhancement Plan

### 2.1. Priority 1: Critical Features (Must Have)

#### 2.1.1. Pre-Submission Checklist UI ✨ NEW
**PRD Reference**: 4.5 (P0)  
**Effort**: 3 hours  
**Impact**: HIGH - Completes P0 feature

**Implementation:**
```jsx
// New Component: ChecklistPanel.jsx
Features:
- AI-generated checklist display
- Manual checkbox toggle
- Custom item addition
- Completion percentage tracker
- Integration with Assignment Show page

API Endpoint:
- POST /assignments/{id}/checklist/generate
- PATCH /assignments/{id}/checklist/{item}/toggle
- POST /assignments/{id}/checklist/items (custom)
```

**Files to Create:**
- `resources/js/Components/Assignment/ChecklistPanel.jsx`
- `resources/js/Components/Assignment/ChecklistItem.jsx`
- `app/Http/Controllers/ChecklistController.php` (new)
- Migration: `create_checklist_items_table`

---

#### 2.1.2. Focus Mode ✨ NEW
**PRD Reference**: 4.3 (P0)  
**Effort**: 4 hours  
**Impact**: HIGH - Core workspace feature

**Design Concept:**
```
Full-screen overlay with:
- Single task in center
- AI Tutor sidebar (collapsible)
- Timer/Pomodoro (optional)
- Minimalist UI to reduce distractions
- Keyboard shortcuts (Esc to exit, Space to toggle)
```

**Implementation:**
```jsx
// New Component: FocusMode.jsx
Features:
- Full-screen modal layout
- Task title, description, context
- Progress indicator
- Integrated AI chat
- Timer functionality
- Keyboard navigation

Integration Points:
- TaskItem.jsx - Add "Focus" button
- Assignment/Show.jsx - Add "Focus Mode" toggle
```

**Files to Create:**
- `resources/js/Components/Assignment/FocusMode.jsx`
- `resources/js/Components/Assignment/FocusTimer.jsx`
- `resources/js/hooks/useFocusMode.js`

---

#### 2.1.3. Settings Page 🔧 FIX
**Current Issue**: 404 error  
**Effort**: 1 hour  
**Impact**: HIGH - UX blocker

**Features to Include:**
```jsx
Settings Categories:
1. Profile Settings
   - Personal info (from Profile)
   - Avatar upload
   
2. AI Preferences
   - Default AI mode
   - Response verbosity
   - Guardrails intensity
   
3. Workspace Preferences
   - Default view (grid/list)
   - Task grouping
   - Notification preferences
   
4. API Settings
   - xAI Grok API key (encrypted display)
   - API usage stats
```

**Files to Create:**
- `resources/js/Pages/Settings/Index.jsx`
- `app/Http/Controllers/SettingsController.php`
- Route: `GET /settings`

---

### 2.2. Priority 2: Enhancement Features

#### 2.2.1. AI Mode Switching ✨ NEW
**PRD Reference**: 4.4 (P1)  
**Effort**: 2 hours  
**Impact**: MEDIUM - Better AI experience

**Modes:**
```javascript
const AI_MODES = {
  guide: {
    label: "Study Guide",
    icon: "🎯",
    systemPrompt: "Act as a step-by-step tutor...",
    color: "emerald"
  },
  explain: {
    label: "Explainer",
    icon: "💡",
    systemPrompt: "Provide detailed explanations...",
    color: "blue"
  },
  brainstorm: {
    label: "Brainstorm",
    icon: "💭",
    systemPrompt: "Help generate ideas without solving...",
    color: "purple"
  },
  review: {
    label: "Peer Review (NEW)",
    icon: "✅",
    systemPrompt: "Review work critically but constructively...",
    color: "amber"
  }
};
```

**Implementation:**
- Mode selector in TutorSidecar header
- Pass mode to chat API
- Update TutorChat service with mode prompts
- Store user preference in localStorage

---

#### 2.2.2. Milestone Editing 🔧 FIX
**PRD Reference**: 4.2 (P1)  
**Effort**: 2 hours  
**Impact**: MEDIUM - User flexibility

**Features:**
- Inline edit for milestone title
- Edit description in modal
- Reorder milestones (drag & drop)
- Delete milestone (with confirmation)

**Files to Modify:**
- `resources/js/Components/Milestone/MilestoneAccordion.jsx`
- Create: `app/Http/Controllers/MilestoneController.php`
- Routes: `PUT/PATCH/DELETE /milestones/{id}`

---

#### 2.2.3. Advanced Dashboard Features ✨ NEW
**Effort**: 4 hours  
**Impact**: MEDIUM - Better UX

**Features:**

**a) Search & Filter:**
```jsx
- Search by assignment title
- Filter by:
  - Status (Active, Completed, At Risk)
  - Due date range
  - Subject/category
- Sort by:
  - Due date (ascending/descending)
  - Created date
  - Progress (%)
```

**b) Pagination:**
```php
// 10 assignments per page
$assignments = Assignment::forUser(auth()->id())
    ->filter($request)
    ->orderBy('due_date')
    ->paginate(10);
```

**c) View Modes:**
- Grid view (current)
- List view (compact)
- Calendar view (timeline)

---

#### 2.2.4. Toast Notifications 🔧 NEW
**Effort**: 1 hour  
**Impact**: MEDIUM - User feedback

**Implementation:**
```bash
npm install react-hot-toast
```

**Toast Triggers:**
- ✅ Assignment created successfully
- ✅ Assignment updated
- ❌ Assignment deleted
- ✅ Task completed
- ✅ Milestone progress updated
- ❌ AI chat error
- ⚠️ Approaching deadline

---

### 2.3. Priority 3: Polish Features

#### 2.3.1. Onboarding & Tutorial ✨ NEW
**Effort**: 3 hours  
**Impact**: LOW - First-time UX

**Features:**
- Welcome modal on first login
- Interactive tutorial (joyride/shepherd)
- Step-by-step feature introduction
- Skip option

---

#### 2.3.2. Keyboard Shortcuts ✨ NEW
**Effort**: 2 hours  
**Impact**: LOW - Power user feature

**Shortcuts:**
```
Global:
- Cmd/Ctrl + K: Quick command palette
- Cmd/Ctrl + N: New assignment
- Cmd/Ctrl + /: Toggle AI chat

Assignment Page:
- F: Enter focus mode
- T: Toggle current task
- C: Open checklist
- Esc: Close modals/focus mode
```

---

#### 2.3.3. Export & Sharing ✨ NEW
**Effort**: 3 hours  
**Impact**: LOW - Utility feature

**Features:**
- Export assignment plan as PDF
- Share checklist as Markdown
- Print-friendly view
- Copy task list to clipboard

---

## 🎨 Part 3: UI/UX Improvements

### 3.1. Design System Refinement

#### 3.1.1. Color Contrast Fixes 🔧 CRITICAL
**Effort**: 30 minutes  
**Impact**: HIGH - Accessibility

**Issues Found:**
- Dark text on dark background (Welcome.jsx)
- Low contrast on Dashboard "Welcome back"
- Button hover states too subtle

**Fixes:**
```css
/* Before */
color: rgb(15, 23, 42); /* slate-900 */

/* After */
color: rgb(248, 250, 252); /* slate-50 */

/* Ensure WCAG AA compliance: 4.5:1 contrast ratio */
```

---

#### 3.1.2. Typography Enhancement ✨
**Effort**: 1 hour  
**Impact**: MEDIUM - Visual polish

**Improvements:**
- Add Google Font: "Inter" (primary) + "JetBrains Mono" (code)
- Refine heading hierarchy
- Improve line-height for readability
- Add font-weight variations

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

#### 3.1.3. Micro-Animations ✨ NEW
**Effort**: 2 hours  
**Impact**: MEDIUM - Premium feel

**Animations to Add:**
```jsx
// Task completion animation
- Checkbox check with scale + confetti
- Progress bar smooth transition
- Milestone collapse/expand with ease

// Page transitions
- Fade in on load
- Slide up for modals
- Skeleton loading states

// Hover effects
- Card lift on hover
- Button press feedback
- Icon bounce on action
```

---

#### 3.1.4. Empty States ✨ NEW
**Effort**: 1.5 hours  
**Impact**: MEDIUM - Better UX

**Empty States to Create:**
```jsx
1. No Assignments
   - Illustration
   - "Get started by creating your first assignment"
   - CTA button

2. No Tasks Today
   - Celebration message
   - "All caught up! Take a break 🎉"

3. No Chat History
   - "Ask me anything about this task"
   - Suggested questions

4. No Milestones
   - Error state with retry button
```

---

### 3.2. Component Enhancements

#### 3.2.1. Enhanced AssignmentCard ✨
**New Features:**
- Quick actions menu (⋮)
  - Edit
  - Duplicate
  - Archive
  - Delete
- Status badge with tooltip
- Progress bar animation
- Hover preview (truncated description)

---

#### 3.2.2. Improved TaskItem ✨
**New Features:**
- Drag handle for reordering
- Due date inline editor
- Time estimate editor
- Notes/comments icon
- Subtask indicator

---

#### 3.2.3. Enhanced AI Chat ✨
**New Features:**
- Message reactions (👍 👎)
- Copy message button
- Regenerate response
- Clear chat confirmation
- Export conversation

---

## ⚡ Part 4: Performance Optimization

### 4.1. Code Splitting
**Effort**: 1 hour  
**Impact**: HIGH - Faster load times

```jsx
// Lazy load heavy components
const TutorSidecar = lazy(() => import('@/Components/AI/TutorSidecar'));
const FocusMode = lazy(() => import('@/Components/Assignment/FocusMode'));

// Route-based code splitting
const AssignmentShow = lazy(() => import('@/Pages/Assignment/Show'));
```

---

### 4.2. Image Optimization
**Effort**: 1 hour  
**Impact**: MEDIUM - Bandwidth savings

```bash
# Install optimization tools
npm install sharp imagemin

# Auto-optimize on build
# Convert to WebP where supported
# Lazy load images
```

---

### 4.3. Database Query Optimization
**Effort**: 2 hours  
**Impact**: MEDIUM - Faster responses

**Optimizations:**
- Add indexes to frequently queried columns
- Implement query result caching (Redis)
- Optimize N+1 queries with eager loading
- Add database query logging in dev

---

## 📊 Part 5: Analytics & Monitoring (NEW)

### 5.1. User Analytics ✨
**Effort**: 3 hours  
**Impact**: MEDIUM - Product insights

**Metrics to Track:**
```javascript
Event Tracking:
- assignment_created
- task_completed
- ai_chat_sent
- focus_mode_entered
- checklist_generated

User Properties:
- Total assignments
- Completion rate
- Average session time
- AI usage frequency
```

**Implementation:**
- Google Analytics 4 OR
- Plausible (privacy-friendly) OR
- Custom event logger

---

### 5.2. Error Tracking ✨
**Effort**: 1 hour  
**Impact**: HIGH - Better debugging

**Tools:**
- Sentry for production errors
- Console error boundary in React
- Laravel log monitoring

---

## 🧪 Part 6: Testing Strategy (NEW)

### 6.1. Backend Tests
**Effort**: 6 hours  
**Impact**: HIGH - Code reliability

```php
// Feature Tests
- AssignmentCreationTest
- TaskToggleTest
- ChatIntegrationTest
- AuthenticationTest

// Unit Tests
- AssignmentParserTest
- PlanGeneratorTest
- TutorChatTest
```

---

### 6.2. Frontend Tests
**Effort**: 4 hours  
**Impact**: MEDIUM - UI reliability

```javascript
// Component Tests (Jest + React Testing Library)
- AssignmentCard.test.jsx
- TaskItem.test.jsx
- TutorSidecar.test.jsx

// Integration Tests
- Assignment creation flow
- Task completion flow
- AI chat interaction
```

---

### 6.3. E2E Tests
**Effort**: 4 hours  
**Impact**: HIGH - Full flow validation

```javascript
// Cypress or Playwright
- User registration → Create assignment → Complete task
- AI chat interaction
- Focus mode workflow
```

---

## 🗂️ Implementation Roadmap

### Phase 1: Critical Fixes (Week 1)
**Total Effort: 8 hours**

| Day | Task | Hours |
|-----|------|-------|
| 1 | Create asset structure | 1h |
| 1 | Design & add Kala logo | 1h |
| 1-2 | Fix Settings page | 1h |
| 2 | Fix contrast issues | 0.5h |
| 2-3 | Implement Checklist UI | 3h |
| 3 | Add toast notifications | 1h |
| 3 | Testing & bug fixes | 0.5h |

---

### Phase 2: Major Features (Week 2)
**Total Effort: 16 hours**

| Day | Task | Hours |
|-----|------|-------|
| 1-2 | Implement Focus Mode | 4h |
| 2 | AI Mode Switching | 2h |
| 3 | Milestone Editing | 2h |
| 3-4 | Dashboard enhancements | 4h |
| 4 | Create custom illustrations | 3h |
| 5 | Testing | 1h |

---

### Phase 3: Polish & Optimization (Week 3)
**Total Effort: 14 hours**

| Day | Task | Hours |
|-----|------|-------|
| 1 | Micro-animations | 2h |
| 1 | Empty states | 1.5h |
| 2 | Typography enhancement | 1h |
| 2 | Code splitting | 1h |
| 3 | Keyboard shortcuts | 2h |
| 3 | Component enhancements | 3h |
| 4 | Analytics setup | 3h |
| 5 | Final QA | 0.5h |

---

### Phase 4: Testing & Documentation (Week 4)
**Total Effort: 16 hours**

| Day | Task | Hours |
|-----|------|-------|
| 1-2 | Backend tests | 6h |
| 2-3 | Frontend tests | 4h |
| 3-4 | E2E tests | 4h |
| 5 | Documentation | 2h |

---

## 📈 Success Metrics

### Before (Current State)
- PRD Coverage: **70%**
- P0 Features: **12/14** (86%)
- P1 Features: **3/8** (38%)
- A11y Score: **60/100**
- Performance: **Not measured**

### After (Target State)
- PRD Coverage: **95%**
- P0 Features: **14/14** (100%)
- P1 Features: **7/8** (88%)
- A11y Score: **90/100**
- Performance: **90+/100**
- Test Coverage: **70%+**

---

## 🎯 Quick Start: Next Actions

### Today (Immediate)
```bash
# 1. Create asset structure
mkdir -p public/assets/{graphics/{brand,illustrations,icons,backgrounds},images}

# 2. Fix contrast issues
# Edit: resources/js/Pages/Welcome.jsx
# Change dark colors to light variants

# 3. Fix Settings page
# Edit: routes/web.php (add route)
# Create: resources/js/Pages/Settings/Index.jsx
```

### This Week
1. ✅ Complete checklist UI implementation
2. ✅ Design Kala brand logo
3. ✅ Implement focus mode
4. ✅ Add toast notifications

### Next Week
1. ✅ AI mode switching
2. ✅ Dashboard enhancements
3. ✅ Create custom illustrations
4. ✅ Performance optimization

---

## 📚 Resources Needed

### Design Assets
- [ ] Logo design (AI-generated with refinement)
- [ ] Illustration set (4-6 illustrations)
- [ ] Icon set (custom or Heroicons extended)
- [ ] Background patterns/gradients

### Dependencies to Install
```bash
# Toast notifications
npm install react-hot-toast

# Keyboard shortcuts
npm install react-hotkeys-hook

# Drag & drop
npm install @dnd-kit/core @dnd-kit/sortable

# Testing
npm install -D @testing-library/react @testing-library/jest-dom vitest

# Analytics (optional)
npm install @vercel/analytics
```

### Documentation
- [ ] Component documentation (Storybook?)
- [ ] API documentation (Swagger/Scribe)
- [ ] User guide
- [ ] Deployment guide

---

## 🚨 Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AI API rate limits | Medium | High | Implement caching, request throttling |
| Large bundle size | Low | Medium | Code splitting, lazy loading |
| Database performance | Low | Medium | Query optimization, caching |
| Cross-browser issues | Low | Low | Test on major browsers |

---

*Development Plan created by AI Agent*  
*Date: 2026-01-18*  
*Next Review: After Phase 1 completion*
