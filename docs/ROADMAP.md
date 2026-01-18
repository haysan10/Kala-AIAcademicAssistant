# Kala - Strategic Roadmap & MVP Features

This document outlines the strategic roadmap for Kala's evolution from a simple assignment tracker to a comprehensive **AI Academic Companion**.

## 🎯 Strategic Vision

Transform Kala into a "Smart Workspace" that not only tells students **what** to do, but provides the **materials, tools, and schedule** to actually get it done.

---

## 🚀 3 Core MVP Features (Phase 2 Development)

### 1. 📁 Smart Study Materials Manager
**"Organize, Link & Access - All in One Place"**

**The Problem:** Students waste time finding files across multiple platforms ("Where is that lecture slide?", "Where is the reading material for this task?").
**The Solution:** A centralized material hub linked directly to tasks and milestones.

#### Development Roadmap
- **Phase 1 (Foundation):**
  - Upload & organize files per course/assignment (PDF, DOCX, Images).
  - Link materials to specific tasks or milestones.
  - Inline Quick Preview using PDF.js/Mammoth.js.
- **Phase 2 (Intelligence):**
  - **AI Auto-tagging** (Gemini): Automatically extract keywords and topics.
  - Smart categorization (Lectures vs Readings vs References).
  - Contextual Suggestions: "Working on Task A? Here are the relevant slides."
- **Phase 3 (Advanced):**
  - Version Control for assignment drafts (v1, v2, Final).
  - AI Summarization of study materials.
  - Cross-referencing materials across different assignments.

**Key Tech:** Cloudflare R2/Supabase Storage, Gemini (Analysis), Laravel Scout (Search).

---

### 2. 🧠 Multi-AI Smart Router
**"Right AI, Right Task, Zero Cost Waste"**

**The Strategy:** Leverage the unique strengths of different AI models to optimize speed, cost, and quality. Redundancy is built-in.

#### Routing Logic
| Task Type | Selected AI | Reason |
|-----------|-------------|--------|
| **Quick Chat** | **Groq** (Llama 3) | Sub-second response time. |
| **PDF Extraction** | **Gemini** (1.5 Flash) | Large context window + native multimodal. |
| **Complex Planning** | **xAI Grok** | Superior reasoning for milestones. |
| **Concept Explanation** | **xAI Grok** | Deep understanding of academic concepts. |

#### Development Roadmap
- **Phase 1:** Integrate Groq & Gemini APIs alongside Grok.
- **Phase 2:** Implement Smart Router logic and fallback mechanisms (if one AI is down, switch to another).
- **Phase 3:** Cost analytics and A/B testing for response quality.

---

### 3. 📅 AI Study Session Planner
**"From Chaos to Calendar - Automatically"**

**The Problem:** Students know *what* to do, but struggle with *when* to do it, leading to cramming.
**The Solution:** AI that automatically schedules work blocks based on deadlines and energy levels.

#### Development Roadmap
- **Phase 1 (Manual):** Drag-and-drop tasks into a calendar view.
- **Phase 2 (Auto-Scheduling):**
  - AI analyzes deadline urgency + task complexity.
  - Automatically fills available time slots with optimal study blocks.
  - Conflict detection.
- **Phase 3 (Adaptive):**
  - Learns from user behavior (e.g., "User works best at night").
  - Auto-reschedule missed tasks to ensure deadlines are still met.

**Key Tech:** FullCalendar.js, Constraint Satisfaction Algorithms (CSP).

---

## 📈 Development Timeline Strategy

### Parallel Execution (6 Weeks)

| Week | Focus | Key Deliverables |
|------|-------|------------------|
| **1-2** | **Foundation** | File uploads, Basic Calendar UI, Multi-AI Setup. |
| **3-4** | **Intelligence** | AI Tagging, Auto-Scheduler Algorithm, Smart Routing. |
| **5-6** | **Polish** | Adaptive Learning, Optimization, Beta Testing. |

### ⚡ Quick Win Priority
If we must launch fast, the **Smart Study Materials Manager** is the priority. It solves the most immediate pain point (file organization) without requiring complex AI logic initially.
