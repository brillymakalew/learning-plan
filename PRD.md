# PRD — Learning Roadmap Tracker (Web App)

Last updated: 2026-02-18  
Product owner: Brilly  
Tech stack: Next.js (App Router) + Postgres SQL + Tailwind CSS  
Architecture: Clean Architecture (Domain → Application → Infrastructure → UI)

---

## 1. Overview

### 1.1 Problem
As a Computer Science graduate transitioning into Management/Organization Studies, Brilly needs a structured way to:
1) monitor and complete a learning roadmap (what to learn, deliverables, checklists), and  
2) publicly show what has been learned and current capabilities, with credible progress visibility.

Current options (spreadsheets/notes) are hard to maintain, not easily shareable, and do not present capabilities clearly.

### 1.2 Solution
A simple, beautiful web app that:
- stores a learning roadmap as phases + items (each item has “what to learn”, “why”, deliverables, and evidence),
- provides checklist + progress tracking and a dashboard for phase completion,
- provides a public “capability profile” view (read-only) for others to see what Brilly has learned and current capability level,
- requires **no login**, while still allowing Brilly to update progress with a lightweight “Owner Edit Key”.

### 1.3 Target users
- **Primary:** Brilly (roadmap owner / editor)
- **Secondary:** Public viewers (potential supervisors, collaborators, peers) who want to understand Brilly’s learning journey and capabilities.

---

## 2. Goals & Success Metrics

### 2.1 Goals
G1. Make learning actionable: each roadmap item clearly states **what to learn, why it matters, and deliverables**.  
G2. Make progress visible: a dashboard shows **current phase, % completion, momentum**, and “what’s next”.  
G3. Make capabilities legible: public profile shows **completed skills + evidence + timeline**.  
G4. Keep it simple: **no account system**; minimal friction; clean UX.

### 2.2 Success metrics (MVP)
- Brilly can add/edit roadmap items and mark statuses in < 10 seconds per item.
- Dashboard accurately shows phase completion and overall completion.
- Public page loads fast and is readable on mobile and desktop.
- At least 80% of roadmap items have a deliverable defined.
- Evidence attachments are used for at least 30% of completed items (links to notes, papers, summaries, etc.).

---

## 3. Principles & UX Direction

### 3.1 UX principles
- **Clarity first:** roadmap items are readable; no dense walls of text.
- **Futuristic-minimal aesthetic:** modern, slightly sci-fi (glass/blur, subtle gradients), but not complex.
- **One-click progress updates:** status toggles and quick-add deliverables.
- **Public-readiness:** capability profile looks professional and trustworthy.
- **Content-led design:** the learning content is the hero, not the UI chrome.

### 3.2 Visual design guidelines (Tailwind)
- Dark mode default with optional light mode toggle.
- Large typographic hierarchy, generous whitespace.
- Glassmorphism panels (backdrop-blur), subtle gradients, soft shadows.
- Micro-interactions: hover states, smooth transitions (no heavy animations).

---

## 4. Personas & Key Use Cases

### 4.1 Personas
**P1 — Brilly (Owner)**
- Needs to track learning progress, manage roadmap items, attach evidence, and see phase completion.

**P2 — Public viewer**
- Wants to understand what Brilly knows, how far along he is, and what he can do now.

### 4.2 Primary use cases
UC1. Brilly reviews dashboard and sees current phase + next tasks.  
UC2. Brilly opens an item, reads what/why, completes deliverables, marks status “Done”, attaches evidence.  
UC3. Public viewer opens Brilly’s capability profile and sees completed capabilities + evidence.

---

## 5. Scope

### 5.1 In scope (MVP)
- Roadmap structure: phases → sections → items
- Item detail: what to learn, why, resources, deliverables
- Checklist: status per item + quick update
- Dashboard: phase progress, overall progress, “current phase”
- Public capability profile (read-only): completed items, skill map, evidence
- No login: editing via Owner Edit Key (simple “edit mode” gate)
- Postgres persistence, basic seed/import, export to Markdown

### 5.2 Out of scope (MVP)
- Multi-user accounts and collaboration
- Complex gamification
- Fully-fledged note editor / WYSIWYG
- Native mobile apps

---

## 6. Information Architecture

### 6.1 Pages
1) **Home / Dashboard** (`/`)
   - Overall progress, current phase, progress by phase, next items, momentum
2) **Roadmap** (`/roadmap`)
   - Browse phases, sections, items; filter/sort; bulk checklist view
3) **Item Detail** (`/roadmap/items/[id]`)
   - What/Why, deliverables, evidence, resources, status history
4) **Capabilities Profile (Public)** (`/profile`)
   - Capability summary, completion %, strengths, evidence highlights, timeline
5) **Evidence Gallery (Public)** (`/evidence`)
   - Optional: curated evidence list (papers, docs, repos)
6) **Settings (Owner-only)** (`/settings`)
   - Owner Edit Key gate, import/export, roadmap metadata, theme toggle

### 6.2 Navigation
- Top nav: Dashboard | Roadmap | Profile
- Context panel (right): “Next up” and “Recently updated” for owner

---

## 7. Core Features (Detailed Requirements)

> **Must-have requirements from user:**
> - detail on what to learn ✔
> - deliverables ✔
> - checklist functionality ✔
> - no login ✔
> - dashboard: phases, completion %, current phase ✔
> - beautiful UI, futuristic but not complex ✔
> - clean architecture ✔
> - supports public view for others to know what Brilly learned & capabilities ✔

### 7.1 Roadmap Content Model
A roadmap is organized as:
- **Phase** (e.g., Foundations → Theory Core → Methods → Writing & Publishing)
- **Section** inside phase (optional grouping, e.g., “Legitimacy”, “Process Research”)
- **Item** (atomic checklist unit)

Each **Item** contains:
- Title
- “What to learn” (bullet list)
- “Why it matters” (1–3 paragraphs, concise)
- Recommended resources (optional list)
- Deliverables list (each deliverable has type + expected output)
- Status (Not started / In progress / Done / Blocked)
- Dates (created, updated, done_at)
- Evidence links (optional but encouraged)

### 7.2 Checklist Functionality
**Owner** can:
- Toggle item status quickly from list view
- Bulk update statuses in a phase/section
- See completion % per phase and per section
- View “streak” / momentum (simple metric: count of items updated in last 7 days)

**Public** can:
- See read-only statuses and completion summary

Rules:
- Completion % = Done / Total (items excluding “Archived”)
- “Current phase” = first phase that is not 100% done (or manually set override)

### 7.3 Item Detail View (Deep Work Screen)
The Item Detail is designed for “do the learning now”:
- Top: title + phase/section breadcrumb + progress indicator
- Tabs (simple, not overloaded):
  - Overview (What/Why)
  - Deliverables
  - Evidence
  - Resources
- CTA: “Mark as Done” and “Add evidence link”
- Status history (timestamped)

### 7.4 Deliverables
Deliverables make learning concrete. Each deliverable includes:
- Deliverable title
- Type (e.g., “1-page summary”, “reading notes”, “concept map”, “literature synthesis”, “mini-essay”, “methods memo”, “presentation slide”, “replication exercise”)
- Acceptance criteria (short checklist)
- Optional link to artifact (Google Doc link, PDF link, GitHub link, etc.)
- Completion status (pending/done)

**Owner** can mark deliverables done; item can be marked Done even if some deliverables remain, but UI warns if deliverables incomplete.

### 7.5 Dashboard
Dashboard modules:
1) **Overall completion** (big number + progress ring)
2) **Current phase** (label + completion)
3) **Progress by phase** (list with bars)
4) **Next up** (top 5 items by priority and status)
5) **Recently updated** (last 10 changes)
6) **Momentum** (simple: updates last 7/30 days)

### 7.6 Public Capability Profile
Public-facing, professional “capability map”:
- Header: Brilly’s learning mission + overall completion
- “Strengths so far” (top completed sections/phases)
- Capability tags/areas derived from roadmap taxonomy (e.g., “Org Theory”, “Qual Methods”, “Quant Methods”, “Academic Writing”)
- Evidence highlights (curated list)
- Timeline (optional simple list of milestones)
- Footer: “Currently learning next” (non-sensitive)

### 7.7 No Login (Editing without Accounts)
To satisfy “no login” but still allow editing:
- App supports **Owner Edit Mode** activated by an **Owner Edit Key**.
- Owner Edit Key is stored as an environment variable `OWNER_EDIT_KEY` on server.
- Owner enters the key in `/settings`, which sets an **httpOnly cookie** `owner_mode=1` (server sets cookie only if key matches).
- Public users never see edit controls.
- This is not a full auth system—just a lightweight gate.

Security notes:
- Rate limit `/api/owner/unlock` endpoint.
- Do not store the key in localStorage.
- Editing endpoints require `owner_mode` cookie.

---

## 8. Recommended Features (Keep Simple)

These are recommended because they improve the two goals without adding heavy complexity.

### 8.1 Smart Filters & Views (Owner)
- Filter by phase, status, priority
- “Only show in-progress”
- “Show next deliverable due”

### 8.2 Export & Share
- Export roadmap or a phase to Markdown (`/export/roadmap.md`)
- Export profile to PDF (later) — out of MVP, but “export to markdown” is MVP

### 8.3 Evidence credibility
- “Evidence type” tag: note / summary / memo / slide / paper / repo
- Optional “reviewed by” field (if you want to show supervisor feedback later)

### 8.4 Import seed
- Seed roadmap from a JSON file (owner-only) to avoid manual entry.

---

## 9. Functional Requirements (MVP)

### 9.1 Owner requirements
- Create/edit/delete phases, sections, items
- Update item status
- Create/edit deliverables and mark them done
- Attach evidence links
- Import/export roadmap (JSON and Markdown)
- Dashboard progress view

### 9.2 Public requirements
- View roadmap (read-only)
- View capability profile (read-only)
- View evidence highlights (read-only)
- All pages fast and mobile friendly

---

## 10. Non-Functional Requirements

### 10.1 Performance
- LCP < 2.5s on typical mobile connection (optimize SSR/DB queries)
- Use caching for public pages where possible.

### 10.2 Accessibility
- Keyboard navigable
- High contrast, readable fonts
- Proper semantics for lists, headings, and forms

### 10.3 Reliability
- DB migrations versioned
- Safe deletes: “archive” instead of hard delete for items

### 10.4 Security (no-login context)
- Owner key not exposed client-side
- Owner cookie httpOnly, secure in production
- Minimal attack surface: only a few owner endpoints

---

## 11. Data Model (Postgres)

### 11.1 Tables

**roadmaps**
- id (uuid, pk)
- title (text)
- description (text)
- created_at (timestamptz)
- updated_at (timestamptz)

**phases**
- id (uuid, pk)
- roadmap_id (uuid, fk → roadmaps.id)
- title (text)
- order_index (int)
- description (text, nullable)
- created_at, updated_at

**sections**
- id (uuid, pk)
- phase_id (uuid, fk → phases.id)
- title (text)
- order_index (int)
- created_at, updated_at

**items**
- id (uuid, pk)
- section_id (uuid, fk → sections.id)
- title (text)
- what_to_learn (jsonb) — array of bullets
- why_it_matters (text)
- priority (text) — High/Medium/Low
- status (text) — NotStarted/InProgress/Done/Blocked/Archived
- tags (text[]) — capability taxonomy
- created_at, updated_at, done_at (nullable)

**deliverables**
- id (uuid, pk)
- item_id (uuid, fk → items.id)
- title (text)
- type (text)
- acceptance_criteria (jsonb)
- status (text) — Pending/Done
- artifact_url (text, nullable)
- created_at, updated_at, done_at (nullable)

**evidence**
- id (uuid, pk)
- item_id (uuid, fk → items.id)
- title (text)
- type (text) — note/summary/memo/slide/paper/repo/other
- url (text)
- description (text, nullable)
- created_at

**status_history**
- id (uuid, pk)
- item_id (uuid, fk → items.id)
- from_status (text)
- to_status (text)
- changed_at (timestamptz)
- note (text, nullable)

**profile_settings**
- id (uuid, pk)
- roadmap_id (uuid, fk → roadmaps.id)
- headline (text)
- about (text)
- public_highlights (jsonb) — list of evidence ids or item ids
- updated_at (timestamptz)

### 11.2 Progress calculations
- Item completion: status == Done
- Section completion: Done items / total items (excluding Archived)
- Phase completion: same aggregated across sections
- Roadmap completion: same aggregated across phases

---

## 12. API (Next.js Route Handlers)

### 12.1 Public endpoints
- `GET /api/roadmap` — roadmap tree (phases → sections → items)
- `GET /api/items/:id` — item detail including deliverables/evidence
- `GET /api/profile` — public profile payload (summary + highlights)
- `GET /api/dashboard` — public dashboard summary (read-only)

### 12.2 Owner endpoints (require owner cookie)
- `POST /api/owner/unlock` — submit Owner Edit Key; set owner cookie
- `POST /api/phases` | `PATCH /api/phases/:id` | `DELETE /api/phases/:id`
- `POST /api/sections` | `PATCH /api/sections/:id` | `DELETE /api/sections/:id`
- `POST /api/items` | `PATCH /api/items/:id` | `DELETE /api/items/:id` (prefer archive)
- `POST /api/items/:id/status` — update status + write status_history
- `POST /api/items/:id/deliverables` | `PATCH /api/deliverables/:id`
- `POST /api/items/:id/evidence` | `DELETE /api/evidence/:id`
- `POST /api/import` — import JSON seed
- `GET /api/export/markdown` — export roadmap as markdown

---

## 13. Clean Architecture (Required)

### 13.1 Layers
**Domain (core)**
- Entities: Roadmap, Phase, Section, Item, Deliverable, Evidence
- Value objects: Status, Priority, Tag
- Domain services: ProgressCalculator

**Application (use cases)**
- Use cases:
  - GetRoadmapTree
  - UpdateItemStatus
  - UpsertItem
  - AddEvidence
  - UpsertDeliverable
  - GetDashboardSummary
  - ExportRoadmapMarkdown
- DTOs and validation (zod)

**Infrastructure**
- Postgres repositories (e.g., Prisma or Drizzle)
- Migration tooling
- Owner gate (cookie setter/verifier)

**UI (Next.js)**
- App Router pages
- Server components for public read pages when useful
- Client components only for interactive checklist editing

### 13.2 Folder structure (suggested)
```
/src
  /domain
    /entities
    /services
    /value-objects
  /application
    /use-cases
    /dto
    /ports
  /infrastructure
    /db
    /repositories
    /auth-lite
  /ui
    /app
    /components
    /styles
```

---

## 14. UI/UX Specs (Futuristic but simple)

### 14.1 Dashboard
- Hero card: overall progress ring + “current phase”
- Phase list: progress bars + “Open phase”
- Next up: cards with quick actions (owner only)
- Recently updated: compact list

### 14.2 Roadmap list
- Left: phase/section tree
- Right: item list with:
  - status chip
  - title
  - priority
  - quick toggle
  - “open” action
- Top bar: filters (status, priority) + search

### 14.3 Item detail
- Title + breadcrumb
- Overview shows What/Why in separate blocks
- Deliverables: checklist with acceptance criteria
- Evidence: link cards with type icons
- Sticky footer actions (owner): “Mark done”, “Add evidence”

### 14.4 Profile (public)
- Clean landing section (headline + completion)
- Capability areas grid (derived from tags)
- Evidence highlights
- “Currently learning next” module

---

## 15. Content Taxonomy (Capabilities)

Items should include 1–3 tags from a controlled set:
- OrgTheory
- Legitimacy
- Sociomateriality
- ProcessResearch
- QualMethods
- QuantMethods
- AcademicWriting
- ResearchDesign
- HigherEdContext
- EthicsGovernance
- PublishingStrategy

These tags power the profile “capability map”.

---

## 16. Milestones

### MVP (2–4 sprints)
1) DB schema + seed import + roadmap read views
2) Checklist + item detail + status updates (owner edit mode)
3) Dashboard + progress calculations
4) Public profile + evidence highlights + export markdown
5) UI polish + performance + accessibility

---

## 17. Acceptance Criteria (MVP)

- No login screens exist.
- Owner can unlock edit mode with an Owner Edit Key and update checklist.
- Roadmap item detail includes “what to learn” and “why it matters”.
- Items can have deliverables; deliverables can be checked off.
- Dashboard shows current phase and progress by phase and overall.
- Public profile shows completion and capability areas and evidence highlights.
- App uses Next.js + Postgres + Tailwind and follows clean architecture folder separation.

---

## 18. Open Questions (optional, not blocking MVP)
- Should public roadmap list show all “why” text or keep it on item detail only?
- Should there be a “manual current phase override” toggle in settings?
- Should evidence links be optionally marked “private” (hidden from public)?

