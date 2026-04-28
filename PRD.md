# Titan HQ — Product Requirements Document (PRD)

**Product:** Titan HQ
**Owner:** Titan Automation
**Status:** v0.1 — MVP (local-only, mock data + localStorage)
**Date:** 2026-04-28

---

## 1. Overview

Titan HQ is the AI-driven command center for **Titan Automation**, a marketing/automation agency that helps local service businesses stop losing missed calls, follow up automatically, build more Google reviews, and turn more opportunities into booked jobs.

The app helps the founder manage agency growth: track prospects, generate outbound assets, build audits, send proposals, manage clients, and stay focused on revenue-producing actions. The north star is **$50,000/month MRR**.

The MVP is a self-contained, dark-mode, futuristic single-page web app that runs entirely in the browser. Real backends (Supabase, GHL, Claude/OpenAI, Twilio, Stripe) are deferred to later phases — every data hook is structured so it can be swapped without rewriting pages.

---

## 2. Goals & Non-Goals

### 2.1 Goals (MVP)
- Single command center with all agency operations in one place.
- Replace scattered spreadsheets, Google Docs, and notes apps.
- Prioritize daily focus around money-making actions.
- Generate outbound assets (scripts, audits, proposals, content) on demand.
- Capture institutional knowledge (offer, SOPs, scripts) inside the app.
- Persist data locally so the founder can use it immediately.
- Track every step of the funnel from prospect → active client.

### 2.2 Non-Goals (MVP)
- No external AI calls (Claude/OpenAI) — Jarvis uses local intent routing + templates.
- No backend / database — localStorage only.
- No GHL or Twilio integration — those are explicit Phase 2+.
- No multi-user / multi-device sync.
- No billing or auth.

---

## 3. Positioning & Branding

- **App name:** Titan HQ
- **Agency name:** Titan Automation
- **Positioning:** "We install lead capture and follow-up systems for local service businesses so missed calls, website leads, and review opportunities do not slip through the cracks."
- **Visual identity:** Dark mode, futuristic command-center aesthetic, blue and purple accents, sidebar navigation, card-based layout, mobile responsive, professional but not cluttered.

---

## 4. Target User

**Primary user:** the founder/operator of Titan Automation.

- Single user. Mobile + desktop.
- Wears every hat (sales, fulfillment, content, ops).
- Time-poor. Needs the app to surface the next best action without thinking.
- Comfortable using GHL, GBP, basic CRM tools.

---

## 5. Offer Reference (canonical pricing)

### Core Package
- **Setup:** $1,200
- **Monthly:** $400
- Professional website
- Missed call text back
- Google review automation
- Lead follow-up system
- Monthly performance report
- Ongoing management

### Optional add-on — AI Voice Agent
- **Setup:** $500
- **Monthly:** $200
- Answers calls 24/7
- Answers questions
- Helps quote services
- Helps book appointments

### Bundle (Core + AI Voice)
- $1,700 setup / $600 monthly

---

## 6. Target Niches

Detailers · Landscapers · Pressure Washing · Window Tint · Mobile Mechanics · Contractors · Roofers · Fencing · Concrete · Cleaning · Pest Control · Insurance Agencies · Med Spas

---

## 7. Information Architecture (Navigation)

Sidebar (in this order):

1. Dashboard
2. Jarvis
3. Contacts
4. Pipeline
5. Studio
6. Brain
7. Tasks
8. Clients
9. Agents
10. Settings

---

## 8. Page-by-Page Requirements

### 8.1 Dashboard
**Purpose:** at-a-glance command center.

Must display:
- Current MRR (sum of all clients' monthly retainers)
- Monthly goal: $50,000 (with % progress bar)
- Active clients count
- Prospects count
- Calls booked count
- Proposals sent count
- Follow-ups due today count
- Tasks due today count
- Closed won this month count
- Estimated pipeline value (rolling 12-month value of mid-funnel prospects)
- Today's top 3 money-making actions (computed: overdue tasks → today's calls → ready-to-send proposals → today's follow-ups → fallback to outbound prospecting)
- Recent prospects table (jump to detail)

### 8.2 Jarvis
**Purpose:** chat-style internal assistant.

- Bubble UI (user / bot), persists chat history in localStorage.
- Pre-seeded suggestion chips.
- Local intent router answers:
  - "Who should I follow up with today?"
  - "Give me today's top 3 actions."
  - "What prospects are closest to closing?"
  - "How am I tracking to $50k MRR?"
  - "Create a cold call script for {prospect}."
  - "Create an audit script for {prospect}."
  - "Create a proposal for {prospect}."
  - "Create a Facebook/LinkedIn post about missed calls."
- Generation requests reuse the Studio templates and pull prospect data when matched by name.
- "Clear" button wipes history.
- **Phase 2:** swap the local intent router for Claude API tool-use — the message in/out shape stays identical.

### 8.3 Contacts (Prospects)
**Purpose:** CRM-style prospect management.

Fields per prospect:
- Business name (required)
- Owner name
- Phone
- Email
- Website
- Niche (dropdown — see §6)
- City
- State
- Google review count
- Current website status
- Problem found
- Audit status (Needed / In Progress / Sent / Reviewed)
- Last contacted date
- Next follow-up date
- Package recommended
- Notes
- Pipeline stage (auto-managed; see §8.4)

Required actions:
- Add prospect (modal form)
- Edit prospect
- Delete prospect (cascades to delete linked tasks)
- Filter by niche / city / audit status
- Search by business name or owner
- Click row → full detail modal with "Open in Studio" deep link

### 8.4 Pipeline
**Purpose:** Kanban view of every prospect.

Stages (left → right):
1. New Prospect
2. Audit Needed
3. Audit Sent
4. Contacted
5. Call Booked
6. Proposal Sent
7. Closed Won
8. Closed Lost
9. Onboarding
10. Active Client

- Drag and drop to move a prospect between stages.
- Each card shows: business name, niche · city, problem found, recommended package, next follow-up.
- Click a card to open the prospect detail.

### 8.5 Studio
**Purpose:** template-based generators for outbound + content + ops.

Generators (10):
1. Cold Call Script
2. Follow-Up Text
3. Follow-Up Email
4. Website Audit Script
5. Sales Proposal
6. Facebook Post
7. LinkedIn Post
8. GHL Workflow Map
9. Client Monthly Report
10. Objection Handling Response

Each generator:
- Has a focused form (different fields per generator, exactly as specified).
- Outputs a professional, direct, sales-focused result.
- Output is copy-able to clipboard.
- Can be deep-linked from a prospect (`/studio?prospect=<id>`) to prefill the form.
- **Phase 2:** swap template render with a Claude prompt for higher-quality output.

### 8.6 Brain
**Purpose:** the agency's knowledge base.

Pre-seeded notes (categories):
- Offer (current offer text)
- Pricing
- Niches
- Scripts (universal cold call script)
- Objections
- SOPs (GHL setup, existing-website integration, missed call text back, Google review automation)
- Onboarding (client onboarding checklist)
- Reports (monthly report template)
- Content (content ideas)

Required actions:
- Add note
- Edit note
- Delete note
- Save (persisted to localStorage)
- Filter / list by category badge

### 8.7 Tasks
**Purpose:** the daily to-do.

Fields per task:
- Task title
- Description
- Related prospect (optional FK)
- Due date
- Priority (High / Medium / Low)
- Status (Open / In Progress / Done)
- Type (Call / Follow-Up / Audit / Proposal / Onboarding / Client Work / Content)

Required actions:
- Create / edit / delete task
- Mark complete (single-click checkbox)
- Filter by today
- Filter by overdue
- Filter by prospect
- Filter by task type

### 8.8 Clients
**Purpose:** post-sale client portfolio.

Fields per client:
- Business name
- Owner name
- Package (Core / Core + AI Voice / Custom)
- Monthly retainer
- Setup fee
- Start date
- Services included
- Website status (Not Started / In Progress / Live / Paused)
- GHL status
- Review automation status
- Missed call text back status
- Monthly report status
- Notes

Required actions:
- Card grid view with status badges
- Detail modal
- Add / edit / delete
- Header shows total active clients, total MRR, total lifetime setup revenue

### 8.9 Agents
**Purpose:** roadmap surface for future AI agents.

Six placeholder cards (Coming Soon):
1. **Sales Scout Agent** — finds high-fit prospects by niche/city.
2. **Audit Agent** — generates personalized audits + walkthrough scripts.
3. **Content Agent** — drafts daily Titan Automation content.
4. **Proposal Agent** — builds tailored proposals + packages.
5. **GHL Agent** — generates workflow maps + setup steps.
6. **Client Success Agent** — writes monthly reports + proactive client updates.

Each card has: icon, name, description, "Coming Soon" button. Roadmap card explains the four-phase rollout.

### 8.10 Settings
**Purpose:** configuration + data tools.

- Edit app name, agency name, positioning statement, monthly goal.
- Read-only summary of offer + pricing (editable in Brain).
- Target niches list.
- Data tools: Export JSON, Import JSON, Reset to seed (with confirm).
- Future integrations panel: Supabase, GoHighLevel, OpenAI / Claude, Twilio, Stripe, Google Business — all marked "Not connected".

---

## 9. Data Model (MVP)

Persisted as a single JSON object in `localStorage` under key `titan_hq_v1`:

```jsonc
{
  "settings": {
    "appName": "Titan HQ",
    "agencyName": "Titan Automation",
    "monthlyGoal": 50000,
    "positioning": "...",
    "targetNiches": ["Detailers", "Landscapers", ...],
    "offer": {
      "core":  { "name": "Titan Core Package", "setup": 1200, "monthly": 400, "includes": [...] },
      "addon": { "name": "AI Voice Agent",     "setup":  500, "monthly": 200, "includes": [...] }
    }
  },

  "prospects": [
    {
      "id": "p_001", "createdAt": "ISO",
      "businessName": "...", "ownerName": "...", "phone": "...", "email": "...",
      "website": "...", "niche": "...", "city": "...", "state": "...",
      "googleReviews": 38, "websiteStatus": "...", "problemFound": "...",
      "auditStatus": "Needed|In Progress|Sent|Reviewed",
      "lastContacted": "YYYY-MM-DD", "nextFollowUp": "YYYY-MM-DD",
      "packageRecommended": "...", "stage": "New Prospect|...|Active Client",
      "notes": "..."
    }
  ],

  "tasks": [
    {
      "id": "t_001", "createdAt": "ISO",
      "title": "...", "description": "...", "prospectId": "p_001|''",
      "dueDate": "YYYY-MM-DD",
      "priority": "High|Medium|Low",
      "status":   "Open|In Progress|Done",
      "type":     "Call|Follow-Up|Audit|Proposal|Onboarding|Client Work|Content"
    }
  ],

  "clients": [
    {
      "id": "c_001", "createdAt": "ISO",
      "businessName": "...", "ownerName": "...",
      "package": "Core|Core + AI Voice|Custom",
      "monthlyRetainer": 400, "setupFee": 1200,
      "startDate": "YYYY-MM-DD",
      "services": "...",
      "websiteStatus": "Not Started|In Progress|Live|Paused",
      "ghlStatus": "...", "reviewAutoStatus": "...",
      "mctbStatus": "...", "monthlyReportStatus": "...",
      "notes": "..."
    }
  ],

  "notes": [
    {
      "id": "n_001", "updatedAt": "ISO",
      "category": "Offer|Pricing|Niches|Scripts|Objections|SOPs|Onboarding|Reports|Content|General",
      "title": "...", "body": "..."
    }
  ],

  "jarvisHistory": [
    { "role": "user|bot", "text": "...", "ts": 1714291200000 }
  ]
}
```

---

## 10. Tech Stack (MVP)

- **Frontend:** vanilla HTML / CSS / ES Modules. No framework, no build step.
- **Routing:** hash router (`#/path?key=value`).
- **State:** in-memory + localStorage with pub/sub for re-render.
- **Styling:** hand-rolled CSS variables theme system; dark mode only.
- **Persistence:** localStorage (key `titan_hq_v1`).
- **No external dependencies** — opens straight in any modern browser.

### File map
```
index.html
styles/main.css
js/
  app.js                     entry — boots store, sidebar, routes
  router.js                  hash router (route, navigate, startRouter)
  store.js                   localStorage + pub/sub + CRUD helpers
  seed.js                    initial mock data
  ui.js                      escapeHtml, fmtMoney, fmtDate, openModal, toast, confirm
  constants.js               PIPELINE_STAGES, STAGE_COLOR, TASK_TYPES, AUDIT_STATUSES, NICHES
  components/sidebar.js      branded sidebar + nav
  generators/templates.js    10 Studio generator templates
  pages/dashboard.js
  pages/contacts.js
  pages/pipeline.js
  pages/studio.js
  pages/brain.js
  pages/jarvis.js
  pages/tasks.js
  pages/clients.js
  pages/agents.js
  pages/settings.js
```

---

## 11. UX Requirements

- Dark mode, futuristic feel, blue (#3b82f6) + purple (#8b5cf6) gradient accents.
- Card-based layout, rounded corners, subtle glow on primary actions.
- Sidebar navigation (collapses behind a hamburger on mobile).
- Mobile responsive at ≤960px (single column) and ≤480px (compact).
- Modals for add/edit forms.
- Toasts for success/error feedback.
- Confirm dialogs for destructive actions.
- Empty states for every list.

---

## 12. Success Metrics

**Leading indicators (daily):**
- Top 3 actions surfaced and acted on.
- Follow-ups due today completed.
- Tasks due today closed.

**Lagging indicators (monthly):**
- MRR / 50k goal % each week.
- New clients closed.
- Proposals sent → won ratio.
- Pipeline value vs realized revenue.

---

## 13. Roadmap

### Phase 1 — MVP (✅ shipped)
Local-only, mock data, template generators, 10 pages.

### Phase 2 — AI
- Wire Claude API into Jarvis with tool-use (create tasks, move stages, draft outreach).
- Replace generator templates with model-authored variants (templates remain as fallback).
- Activate Agents page (Sales Scout first).

### Phase 3 — Backend
- Move state from localStorage to Supabase. Keep the `Store` interface.
- Add magic-link auth.
- Multi-device sync.

### Phase 4 — Integrations
- GoHighLevel: pull contacts/pipeline, push tasks/notes, sync stage changes, missed-call events.
- Twilio: send SMS from Studio + Jarvis.
- Stripe: invoice setup + monthly retainers.
- Google Business: live review counts on prospects.

### Phase 5 — Scale
- Activity timelines per prospect/client.
- Calendar view of tasks + follow-ups.
- Charts on Dashboard (MRR over time, conversion by stage, response rate by niche).
- Loom-style audit recorder built in.
- Scheduled agent runs (daily content, weekly outreach).

---

## 14. Open Questions

- Do we want a "deals" object separate from prospects, or keep stage on the prospect (current approach)?
- Should Jarvis have memory across sessions once Claude is wired in, or per-session by default?
- When GHL integrates, is GHL the source of truth for pipeline, or does Titan HQ remain authoritative?
- Should clients show churn risk / health score (Phase 5 candidate)?

---

## 15. How to Run Locally

The app uses native ES modules, so it must be served over HTTP — not opened directly from `file://`.

```bash
# from the repo root
python3 -m http.server 5173
# then open http://localhost:5173

# or with Node:
npx serve .
```

Data persists in browser localStorage under `titan_hq_v1`. Use **Settings → Reset to seed** to wipe and reload, or **Export JSON** to back up.
