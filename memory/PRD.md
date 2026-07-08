# Fresh Deep Cleaning Service — PRD

## Original Problem Statement
Professional deep-cleaning service lead-generation website. Navy/Green/White premium theme. Homepage with hero (before/after slider), 8 services, room showcase, gallery with tabs, why-choose-us + counters, testimonials, 4-step process. Booking form emails owner and saves lead. Admin dashboard for lead management. WhatsApp button + sticky mobile CTA. SEO meta. No pricing, no timelines.

## Architecture
- **Frontend**: React 19 + React Router v7 + Tailwind + shadcn/ui + framer-motion + sonner (toasts) + lucide-react.
- **Backend**: FastAPI (Motor async MongoDB) with JWT admin auth (bcrypt hashed), Resend for transactional email.
- **DB**: MongoDB collections — `users`, `leads`. Indexes: users.email (unique), leads.created_at.
- **Env**: `MONGO_URL`, `DB_NAME`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `SENDER_EMAIL`, `OWNER_EMAIL`.

## API
- Public: `POST /api/leads`
- Admin: `POST /api/admin/login`, `GET /api/admin/me`, `GET /api/admin/leads`, `PATCH /api/admin/leads/{id}`, `GET /api/admin/leads/stats`

## User personas
- Homeowner / office manager seeking a deep-clean vendor → submits enquiry.
- Business owner (admin) → manages leads and updates statuses.

## What's been implemented (2026-07-08)
- Full marketing site: Home, Services, About, Gallery (tabs + BA slider), Reviews, Contact.
- Interactive Before/After sliders (hero + gallery items).
- Booking form with 9 fields, validation, toast + success card.
- Resend email to owner (`vinaykvg12@gmail.com`) on new lead — verified sending.
- Admin login (JWT) + dashboard: stats, table, search, status filter, per-row status change, detail dialog, logout.
- Floating WhatsApp FAB (`+91 9902608075`) + mobile sticky Book Now.
- SEO meta title & description.
- Testing subagent: backend 20/20, frontend 12/13 → 1 bug fixed (service pre-select via URL query param).

## Prioritized backlog
- **P1**: Migrate JWT from localStorage → httpOnly cookies for XSS safety.
- **P1**: Tighten CORS to explicit frontend origin (currently `*`).
- **P2**: Fire-and-forget the Resend send with `asyncio.create_task` so response is instant.
- **P2**: Optional CAPTCHA on lead form to reduce spam.
- **P2**: Rate-limit `/api/leads` per IP.
- **P3**: Admin lead search debounce + pagination when >1000 leads.
- **P3**: Export leads as CSV; date-range filters.
