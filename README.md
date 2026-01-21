# Faculty Insights Hub

## Overview

**Faculty Insights Hub** is a **multi-college, role-based Faculty Feedback System** built entirely as a **frontend-only React application** using **localStorage** as its data store.

The system is designed for **academic institutions** to collect **anonymous and authenticated student feedback**, analyze faculty performance, and generate rich analytics — **without any backend dependency**.

This updated architecture replaces the concept of rigid **Feedback Cycles** with a more **open, flexible, and academic-friendly concept called `Feedback Sessions`**.

A **Feedback Session** represents a real classroom context:

> **One Faculty + One Subject + One Batch + One Academic Context**

Each session generates a **unique feedback link**, allowing students to submit feedback seamlessly.

---

## Key Architectural Shift (IMPORTANT)

### ❌ Old Concept

* Feedback Cycles (Semester-based, rigid)

### ✅ New Concept (Final)

* **Feedback Sessions** (Open, simple, real-world aligned)

### A Feedback Session is created by selecting:

* **Course / Program** (Engineering, MBA, MCA, etc.)
* **Academic Year** (1st Year, 2nd Year, etc.)
* **Department** (CSE, IT, Finance, etc.)
* **Subject**
* **Batch** (A, B, C, D)
* **Faculty**

Once created:

* A **unique anonymous feedback URL** is generated
* Session can be **activated / deactivated** anytime
* Submissions are tied **only to that session**

This makes the system:

* More intuitive for colleges
* Easier to scale
* Easier to analyze at micro & macro levels

---

## Tech Stack

| Layer           | Technology                            |
| --------------- | ------------------------------------- |
| UI              | React (Functional Components + Hooks) |
| Styling         | Tailwind CSS                          |
| Routing         | React Router DOM                      |
| State & Caching | React Query                           |
| Charts          | Recharts                              |
| Icons           | lucide-react                          |
| Dates           | date-fns                              |
| Notifications   | sonner                                |
| Persistence     | localStorage                          |

---

## Core Design Principles

* **Frontend-only (No Backend)**
* **Academic-first data model**
* **Role-based access control**
* **Multi-college isolation**
* **Accessible & keyboard-friendly UI**
* **Professional academic look**

---

## Color Palette

* **Primary:** `#01224E` (Deep Navy Blue)
* **Secondary:** `#f5f5f5 / #f8f9fa`
* **Success:** `#10b981`
* **Warning:** `#f59e0b`
* **Error:** `#ef4444`
* **White:** `#ffffff`

---

## Application Routes

### Public

* `/` – Landing Page
* `/feedback/anonymous/:sessionId` – Anonymous Feedback Form

### Authenticated

* `/login` – Admin / Staff Login

### Role-Based Dashboards

* `/super-admin` – System Owner
* `/admin/dashboard` – College Admin
* `/admin/sessions` – Feedback Session Management
* `/admin/faculty` – Faculty Management
* `/admin/departments` – Department Management
* `/admin/questions` – Question Bank
* `/admin/reports` – Reports & Analytics
* `/admin/settings` – College Settings
* `/hod/dashboard` – Department-Level View
* `/faculty/dashboard` – Faculty Personal Dashboard

---

## Feedback Session Lifecycle

1. **College Admin creates a Session**
2. Selects academic context:

   * Course / Program
   * Academic Year
   * Department
   * Subject
   * Batch
   * Faculty
3. System generates:

   * `uniqueSessionId`
   * `anonymousFeedbackURL`
4. Session is activated
5. Students submit feedback anonymously
6. Faculty & Admin view analytics

---

## Roles & Permissions

### Super Admin

* Manage colleges
* Create college admins
* Reset demo data
* View system-wide analytics

### College Admin

* Manage departments & faculty
* Create feedback sessions
* Manage question bank
* View full college reports

### HOD

* Department-only access
* View faculty performance
* Department analytics

### Faculty

* View own feedback only
* Trend analysis
* Anonymous comments
* Download reports

---

## Feedback Form Structure

### Question Categories

* Teaching Effectiveness
* Communication Skills
* Subject Knowledge
* Course Materials
* Overall Feedback

### Response Types

* Rating (1–5)
* Text
* Rating + Comment
* Select Dropdown
* Boolean (Yes/No)

### Features

* Multi-step form
* Auto-save every 30 seconds
* Progress indicator
* Accessibility compliant

---

## Updated localStorage Data Model

### Colleges

```js
ffs_colleges
```

### Users

```js
ffs_users
```

### Departments

```js
ffs_departments
```

### Faculty

```js
ffs_faculty
```

### Feedback Sessions (NEW CORE ENTITY)

```js
ffs_feedback_sessions: [
  {
    id: 'session-1',
    collegeId: '1',
    departmentId: '1',
    facultyId: '1',

    course: 'Engineering',
    academicYear: '2nd Year',
    subject: 'Data Structures',
    batch: 'A',

    accessMode: 'anonymous',
    uniqueUrl: 'feedback-session-abc123',
    isActive: true,

    createdAt: '2024-02-01T10:00:00',
    expiresAt: '2024-02-15T23:59:59'
  }
]
```

### Questions

```js
ffs_questions
```

### Feedback Submissions

```js
ffs_feedback_submissions: [
  {
    id: 'sub-1',
    sessionId: 'session-1',
    facultyId: '1',
    collegeId: '1',
    responses: [
      { questionId: 'q1', rating: 4 },
      { questionId: 'q2', comment: 'Very clear teaching' }
    ],
    submittedAt: '2024-02-05T14:30:00'
  }
]
```

---

## Reports & Analytics

### Admin / HOD

* Department-wise averages
* Faculty comparisons
* Subject-wise performance
* Batch-wise trends
* Response rates

### Faculty

* Personal score trends
* Category radar chart
* Anonymous student comments
* Percentile comparison

### Charts Used

* Bar Chart
* Line Chart
* Pie Chart
* Radar Chart

---

## UX & Accessibility

* WCAG AA color contrast
* Keyboard navigation
* ARIA labels
* Screen-reader friendly tables
* Focus indicators
* Skip-to-content link

---

## Demo & Mock Data

Includes:

* 2 Colleges (ICEM, IGSB)
* 10–15 Faculty
* Multiple departments
* 20+ questions
* 100+ feedback submissions

---

## Utilities & Helpers

* `localStorageService.js`
* `authService.js`
* `sessionService.js`
* `reportService.js`
* Simulated API delay (200–500ms)

---

## Reset Demo Data

Available for:

* Super Admin
* College Admin

Resets all localStorage keys safely.

---

## Success Criteria

✔ Multi-college support
✔ Session-based architecture
✔ Fully frontend-only
✔ Professional academic UI
✔ Accessible & responsive
✔ Realistic demo-ready system

---

## Branding

**Gryphon Academy Pvt Ltd**

---

> This README represents the **final, production-grade architecture** for the Faculty Insights Hub using a **Session-first academic model**.
