# Hussain Hashmi — Personal Website

## Overview

A full-stack personal portfolio website for Hussain Hashmi, a CS student building with AI tools and freelancing. Built with React + Vite (frontend), Express 5 (backend), and PostgreSQL + Drizzle ORM (database).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/personal-site)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Styling**: Tailwind CSS + shadcn/ui, Framer Motion animations
- **Build**: esbuild (CJS bundle)

## Site Sections

- **Hero** — Name, tagline "I build software with AI.", CTAs
- **About** — Honest bio, CS student learning in public
- **Skills** — AI tools, React, Python, HTML/CSS/JS
- **Projects** — Live from DB via API, cards with tags and links
- **Contact** — Working form, saves to DB
- **Footer** — Social links

## Planned Future Sections

- **Chat** — AI chat agent where visitors can talk to an AI version of Hussain
- **Reviews** — Client testimonials

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/personal-site run dev` — run frontend locally

## Database Schema

- `contact_submissions` — stores messages sent via contact form (name, email, message, created_at)
- `projects` — portfolio projects (title, description, tags[], live_url, repo_url, image_url, featured, created_at)

## API Endpoints

- `GET /api/healthz` — health check
- `GET /api/projects` — list all projects (ordered: featured first, then newest)
- `POST /api/contact` — submit contact form message

## Architecture Notes

- OpenAPI spec lives in `lib/api-spec/openapi.yaml`
- Generated React Query hooks in `lib/api-client-react/src/generated/`
- Generated Zod schemas in `lib/api-zod/src/generated/`
- DB schema files in `lib/db/src/schema/`
- API routes in `artifacts/api-server/src/routes/`
- Frontend sections in `artifacts/personal-site/src/sections/`
