# Hussain Hashmi — Personal Website: Complete Code Guide

This file explains everything about how this project is built, what each file does, and what every technology is for. Written so you can read the code yourself and actually understand it.

---

## Table of Contents

1. [Project Structure — The Big Picture](#1-project-structure)
2. [The Frontend — What People See](#2-the-frontend)
3. [The Backend — The Server](#3-the-backend)
4. [The Database — Where Data Lives](#4-the-database)
5. [The API Layer — How Frontend Talks to Backend](#5-the-api-layer)
6. [The Admin Panel](#6-the-admin-panel)
7. [All Technologies Used](#7-all-technologies)
8. [How to Read the Code (Learning Path)](#8-learning-path)

---

## 1. Project Structure

```
workspace/
├── artifacts/
│   ├── personal-site/       ← The website (frontend)
│   └── api-server/          ← The server (backend)
├── lib/
│   ├── api-spec/            ← The API contract (openapi.yaml)
│   ├── api-client-react/    ← Auto-generated frontend hooks
│   ├── api-zod/             ← Auto-generated backend validators
│   └── db/                  ← Database connection and schema
├── GUIDE.md                 ← This file
├── replit.md                ← Project notes
└── pnpm-workspace.yaml      ← Workspace config
```

This structure is called a **monorepo** — one big folder that contains multiple separate projects (the website AND the server) that share some code between them.

---

## 2. The Frontend

**Location:** `artifacts/personal-site/src/`

This is everything the visitor sees in their browser.

### Entry Point

```
src/
├── main.tsx          ← The very first file that runs. Mounts React into the HTML page.
├── App.tsx           ← Sets up routing (which page to show at which URL)
├── index.css         ← Global styles, color theme variables (dark/light mode)
```

**`main.tsx`** — Think of this as "press start". It finds the `<div id="root">` in `index.html` and tells React to take over from there.

**`App.tsx`** — Decides what to show based on the URL:
- `/` → show the Home page
- `/admin` → show the Admin page
- anything else → show the Not Found page

Also wraps everything in providers (ThemeProvider for dark/light mode, QueryClientProvider for data fetching).

**`index.css`** — All the color variables are defined here. Things like `--primary: 24 95% 53%` (that orange color). Change these values to change the entire site's color scheme.

---

### Pages

```
src/pages/
├── home.tsx          ← The main single-page layout
├── admin.tsx         ← The admin panel page
└── not-found.tsx     ← The 404 page
```

**`home.tsx`** — Assembles all the sections in order: Navigation → Hero → About → Skills → Projects → Contact → Footer. It's like a table of contents.

**`admin.tsx`** — The full admin interface. Handles login (checks password), shows tabs for Projects/Messages, and renders the form modal. This is the most complex file in the project — good to study once you understand the basics.

---

### Sections (the parts of the homepage)

```
src/sections/
├── hero.tsx          ← The first thing visitors see (your name, tagline, CTAs)
├── about.tsx         ← The "About Me" section
├── skills.tsx        ← The skills/tools section
├── projects.tsx      ← The projects grid (fetches from database)
├── contact.tsx       ← The contact form (submits to database)
└── footer.tsx        ← The bottom footer
```

**`hero.tsx`** is the most technically interesting file. It contains:
- `CursorGlow` — tracks mouse/touch position and renders a glowing circle that follows it
- `FloatingParticles` — renders 22 tiny animated dots floating upward
- `ParallaxBlobs` — large blurred color blobs that shift slightly as you move the mouse (creates depth)
- `MagneticButton` — buttons that subtly lean toward your cursor
- `TypedText` — the cycling typewriter effect ("websites." → "tools." → etc.)
- `Hero` — the main component that assembles all the above

**`projects.tsx`** — Calls `useListProjects()` (an auto-generated hook) to fetch your projects from the database. Shows skeleton loading cards while waiting, then renders real data.

**`contact.tsx`** — Uses React Hook Form + Zod to validate inputs, then calls `useSubmitContact` mutation to POST the data to the server. Shows a success state after submission.

---

### Components

```
src/components/
├── navigation.tsx        ← The sticky top nav bar with dark mode toggle
├── theme-provider.tsx    ← Manages dark/light mode, saves preference to localStorage
├── loading-screen.tsx    ← The "H." loading animation shown on first visit
└── ui/                   ← shadcn/ui components (Button, Input, Badge, etc.)
                             These are pre-built. You don't need to edit them.
```

---

## 3. The Backend

**Location:** `artifacts/api-server/src/`

The server runs on Node.js and handles all incoming requests from the browser.

```
src/
├── index.ts          ← Starts the server, listens on a port
├── app.ts            ← Sets up Express, adds middleware, connects routes
├── routes/
│   ├── index.ts      ← Collects all route files and exports them
│   ├── health.ts     ← GET /api/healthz — just checks if server is alive
│   ├── projects.ts   ← GET /api/projects — returns all projects from database
│   ├── contact.ts    ← POST /api/contact — saves a contact form submission
│   └── admin.ts      ← All /api/admin/* routes — CRUD for projects, view messages
└── lib/
    └── logger.ts     ← Sets up structured logging with Pino
```

### How a request flows

Example: visitor submits the contact form.

```
Browser                   Server                    Database
  |                          |                          |
  |── POST /api/contact ───→ |                          |
  |   { name, email, msg }   |                          |
  |                          |── validate with Zod      |
  |                          |── INSERT into DB ───────→|
  |                          |←── returns saved row ───|
  |←── 201 { id, name... } ──|                          |
  |                          |                          |
```

**`app.ts`** — This is where Express is configured. Think of it like setting up a reception desk:
- `pinoHttp` middleware — logs every incoming request automatically
- `cors()` — allows the frontend (different port) to talk to this server
- `express.json()` — teaches Express to understand JSON request bodies
- `app.use("/api", router)` — all routes go under the `/api` path

**Route files** — Each file handles one domain of the app. `contact.ts` only handles contact stuff. `projects.ts` only handles projects. This keeps things organized.

---

## 4. The Database

**Location:** `lib/db/src/`

```
src/
├── index.ts          ← Connects to PostgreSQL using DATABASE_URL env variable
└── schema/
    ├── index.ts      ← Exports all tables
    ├── projects.ts   ← Defines the "projects" table
    └── contact.ts    ← Defines the "contact_submissions" table
```

### The tables

**`projects` table** (defined in `schema/projects.ts`):

| Column       | Type      | Description                                |
|--------------|-----------|--------------------------------------------|
| id           | integer   | Auto-incrementing unique ID                |
| title        | text      | Project name                               |
| description  | text      | What the project does                      |
| tags         | text[]    | Array of tags like ["React", "AI"]         |
| live_url     | text      | Link to the live site (can be null)        |
| repo_url     | text      | Link to GitHub (can be null)               |
| image_url    | text      | Project image URL (can be null)            |
| featured     | boolean   | Whether to show it first                   |
| created_at   | timestamp | When it was added                          |

**`contact_submissions` table** (defined in `schema/contact.ts`):

| Column     | Type      | Description                     |
|------------|-----------|---------------------------------|
| id         | integer   | Auto-incrementing unique ID     |
| name       | text      | Submitter's name                |
| email      | text      | Submitter's email               |
| message    | text      | Their message                   |
| created_at | timestamp | When it was submitted           |

Drizzle ORM lets you define these tables in TypeScript and it generates the SQL for you. Running `pnpm --filter @workspace/db run push` syncs your TypeScript definitions to the actual database.

---

## 5. The API Layer

**Location:** `lib/api-spec/` and `lib/api-client-react/`

This is the "contract" system that connects frontend to backend cleanly.

### How it works

```
1. You write the API spec in openapi.yaml
         ↓
2. You run codegen (pnpm --filter @workspace/api-spec run codegen)
         ↓
3. Orval reads the spec and auto-generates:
   - React hooks for the frontend (lib/api-client-react/src/generated/api.ts)
   - Zod validators for the backend (lib/api-zod/src/generated/api.ts)
```

**`lib/api-spec/openapi.yaml`** — The master spec. Written in YAML format. Defines every endpoint, what data it accepts, and what it returns. If you want to add a new API endpoint, you start here.

**`lib/api-client-react/src/generated/`** — Never edit these files manually. They're auto-generated. They give the frontend hooks like:
- `useListProjects()` — fetches all projects
- `useSubmitContact` — mutation to submit a contact form
- `useAdminCreateProject` — admin mutation to create a project

**`lib/api-zod/src/generated/`** — Also auto-generated. Used in the backend to validate incoming data. For example `SubmitContactBody` validates that name/email/message are all present before saving to the database.

---

## 6. The Admin Panel

**URL:** `/admin`

**How to access:**
1. Go to `yoursite.com/admin`
2. Enter the `ADMIN_PASSWORD` you set in Replit Secrets
3. You're in

**What you can do:**
- **Projects tab:** Add new projects (title, description, tags, links, featured toggle), edit existing ones, delete them
- **Messages tab:** Read all contact form submissions with timestamps

**How authentication works:** The admin page stores your password in `sessionStorage` (temporary browser memory, cleared when you close the tab). Every request to the admin API includes your password in the `x-admin-password` header. The server checks it against the `ADMIN_PASSWORD` environment variable. If they don't match, it returns 401 Unauthorized.

---

## 7. All Technologies

| Technology | What It Does | Where Used |
|------------|--------------|------------|
| **TypeScript** | JavaScript + type safety | Everywhere |
| **React** | UI component framework | Frontend |
| **Vite** | Build tool + dev server | Frontend |
| **Tailwind CSS** | Utility-first CSS framework | Frontend styling |
| **Framer Motion** | Animation library | Hero effects, page transitions |
| **shadcn/ui** | Pre-built UI components | Buttons, inputs, badges, modals |
| **Wouter** | Client-side routing | Page navigation |
| **TanStack React Query** | Data fetching + caching | All API calls |
| **React Hook Form** | Form state management | Contact form, admin form |
| **Zod** | Schema validation | Form validation + API validation |
| **Lucide React** | Icon library | All icons |
| **Node.js** | JavaScript runtime for server | Backend |
| **Express.js (v5)** | Web server framework | Backend routing |
| **PostgreSQL** | Relational database | Storing all data |
| **Drizzle ORM** | Type-safe database queries | All DB operations |
| **Pino** | Structured logging | Server logs |
| **pnpm** | Package manager | Installing all dependencies |
| **OpenAPI (YAML)** | API contract specification | API definition |
| **Orval** | Code generator from OpenAPI | Auto-generates hooks + validators |
| **esbuild** | Server bundler | Builds backend for production |
| **Replit** | Cloud platform | Hosting, database, environment |

---

## 8. Learning Path

If you want to understand this codebase from scratch, go in this order:

### Week 1 — Understand the basics
1. Read `artifacts/personal-site/src/main.tsx` — 10 lines, very simple
2. Read `artifacts/personal-site/src/App.tsx` — see how routing works
3. Read `artifacts/personal-site/src/pages/home.tsx` — see how sections compose
4. Read `artifacts/personal-site/src/sections/about.tsx` — simple static component

### Week 2 — React with data
5. Read `artifacts/personal-site/src/sections/projects.tsx` — see how data is fetched from the API and rendered
6. Read `artifacts/personal-site/src/sections/contact.tsx` — see how a form submits data
7. Read `lib/api-client-react/src/generated/api.ts` — see what the auto-generated hooks look like

### Week 3 — Animations
8. Read `artifacts/personal-site/src/sections/hero.tsx` — the most complex frontend file. Every effect explained in comments
9. Read `artifacts/personal-site/src/components/loading-screen.tsx` — simpler animation example

### Week 4 — The backend
10. Read `artifacts/api-server/src/app.ts` — how Express is set up
11. Read `artifacts/api-server/src/routes/projects.ts` — a simple GET route
12. Read `artifacts/api-server/src/routes/contact.ts` — a POST route with validation
13. Read `artifacts/api-server/src/routes/admin.ts` — a more complex route with auth

### Week 5 — Database and API contract
14. Read `lib/db/src/schema/projects.ts` — how a database table is defined
15. Read `lib/api-spec/openapi.yaml` — the API contract. Notice how everything in the frontend and backend traces back to this file
16. Run codegen yourself: `pnpm --filter @workspace/api-spec run codegen` and watch the generated files change

---

## Environment Variables

| Variable | Used In | Description |
|----------|---------|-------------|
| `DATABASE_URL` | Backend | PostgreSQL connection string. Set automatically by Replit |
| `ADMIN_PASSWORD` | Backend | Password for admin panel access. You set this |
| `SESSION_SECRET` | — | Reserved for future auth features |
| `PORT` | Both | Port number assigned by Replit. Never hardcode ports |
| `BASE_PATH` | Frontend | URL prefix the site runs at |

**Never commit passwords or API keys to code.** Always use environment variables (Replit Secrets tab) for anything sensitive.

---

## Common Commands

```bash
# Run the frontend dev server
pnpm --filter @workspace/personal-site run dev

# Run the backend dev server
pnpm --filter @workspace/api-server run dev

# Regenerate API hooks from openapi.yaml (run after changing the spec)
pnpm --filter @workspace/api-spec run codegen

# Push database schema changes to the actual database
pnpm --filter @workspace/db run push

# Typecheck everything
pnpm run typecheck
```

---

*This guide was written April 2026. The project may have grown since then — check replit.md for the latest notes.*
