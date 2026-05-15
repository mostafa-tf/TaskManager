# TaskFlow — Task Manager App

A full-stack task management web application reproduced from [mostafa-tf/TaskManager](https://github.com/mostafa-tf/TaskManager.git). Users can manage personal and project tasks, collaborate with friends, and track productivity via analytics.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at /api)
- `pnpm --filter @workspace/task-manager run dev` — run the frontend (port 18810, proxied at /)

## Stack

- pnpm workspaces, Node.js 24, TypeScript
- Frontend: React + Vite + react-router-dom v7
- Backend: Express 5 + MongoDB (Mongoose) + Socket.io
- Auth: JWT (stored in localStorage)
- UI: Custom dark theme CSS, react-icons, react-circular-progressbar, react-datepicker

## Where things live

- `artifacts/api-server/src/` — Express backend
  - `routes/` — users, tasks, feedbacks, friendship, projects, notifications
  - `models/` — Mongoose models
  - `middleware/` — JWT auth middleware
  - `db.ts` — MongoDB connection
  - `app.ts` — Express + Socket.io setup
- `artifacts/task-manager/src/` — React frontend
  - `pages/` — all page components
  - `components/` — shared components (navbar, aside, footer, etc.)
  - `App.tsx` — routes with react-router-dom BrowserRouter

## Architecture decisions

- All fetch calls use relative `/api/...` URLs; the Replit proxy routes `/api` to the backend.
- Socket.io uses path `/api/socket.io` and connects to `"/"` from the client.
- JWT stored in `localStorage`; auth header `Authorization: Bearer <token>` on every request.
- MongoDB connection is awaited before server starts listening (in `index.ts`).
- `connectdb()` moved out of `app.ts` into `index.ts` so the server only starts after DB is ready.

## Product

- User registration, login, forgot/reset password
- Personal task CRUD with priority, due date, start/end hours
- Done / undone task filters, analysis dashboard with progress charts
- Friends system: send/accept/block requests
- Project management with member roles
- Real-time notifications via Socket.io
- Admin dashboard for managing users and feedback
- Profile management

## Required Secrets

- `MONGODB_URI` — MongoDB Atlas connection string (mongodb+srv://...)
- `JWT_KEY` — Secret key for JWT signing
- `SESSION_SECRET` — Express session secret
- `MAIL_USER` — Email address for sending password reset emails
- `MAIL_PASS` — Email password/app password for nodemailer

## User preferences

- Reproduce the original GitHub repo exactly — functionally identical.

## Gotchas

- MongoDB Atlas must have Network Access set to allow all IPs (0.0.0.0/0) for Replit to connect.
- The frontend dev server must allow all hosts (`server.host: '0.0.0.0'` in vite.config.ts).
- Do NOT run `pnpm dev` at workspace root — use individual workflow commands.
