# TaskFlow — Task Manager App

A full-stack task management web application reproduced from [mostafa-tf/TaskManager](https://github.com/mostafa-tf/TaskManager.git). Users can manage personal and project tasks, collaborate with friends, track activity audit logs, and monitor productivity via analytics.

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
  - `routes/` — users, tasks, feedbacks, friendship, projects, notifications, logs
  - `models/` — Mongoose models (Notification enum includes: `friend request`, `friend request accepted`, `assigned task`, `assigned project`, `task expiration`)
  - `middleware/` — JWT auth middleware
  - `db.ts` — MongoDB connection
  - `app.ts` — Express + Socket.io setup
- `artifacts/task-manager/src/` — React frontend
  - `pages/` — all page components
  - `components/` — shared components (navbar, aside, footer, TaskStructure, etc.)
  - `contexts/SocketContext.tsx` — global Socket.io context (wraps entire app)
  - `App.tsx` — routes with react-router-dom BrowserRouter; wraps app in SocketProvider

## Architecture decisions

- All fetch calls use relative `/api/...` URLs; the Replit proxy routes `/api` to the backend.
- Socket.io uses path `/api/socket.io` and connects to `"/"` from the client.
- JWT stored in `localStorage`; auth header `Authorization: Bearer <token>` on every request.
- JWT payload: `{ id, role }`. Frontend decodes with `atob(token.split('.')[1])` to get userId for `joinUserRoom`.
- MongoDB connection is awaited before server starts listening (in `index.ts`).
- `connectdb()` moved out of `app.ts` into `index.ts` so the server only starts after DB is ready.
- Lebanon timezone is UTC+3; `completedAt` adds 3 hours manually for display; task expiration uses local Date constructor with `endhour`/`endminute` fields.
- All `<select>` dropdowns use `backgroundColor: "#0b1a12"` + `colorScheme: "dark"` with matching option styles to prevent white dropdown popup in browsers.

## Product

- User registration, login, forgot/reset password (nodemailer)
- **Change password** from Profile page — verifies current password, updates hash, sends confirmation email
- Personal task CRUD with priority, due date, start/end hours
- Done / undone / all task views with priority filter (dark-styled select)
- Analysis dashboard with progress charts (react-circular-progressbar)
- Friends system: send/accept/block requests; sending a request creates a DB notification + emits `friend_request` socket event
- Project management with member roles (owner/member); owners can add friends as contributors directly from ViewProject
- Assign tasks to project members with priority, description, due date
- Real-time notifications via Socket.io — 4 event types: `friend_request`, `request_accepted`, `project_invitation`, `assigned_task`
- Admin dashboard: manage users (ban/unban/delete), view feedbacks, Registration Date column
- Profile management: edit username/email, change password with email notification
- Audit Logs to ensure safety and traceability

## Real-time Notifications

- `SocketContext.tsx` uses `useState` (not `useRef`) so socket instance propagates via React context
- `joinUserRoom` emitted on connect using decoded JWT userId
- `Notifications.tsx` consumes shared socket and handles all 4 event types live
- Backend `addfriend` route creates DB notification + emits `friend_request` to recipient's room
- `POST /:projectid/members` sends notification + emits `project_invitation`

## API Endpoints (notable additions)

- `PUT /api/users/changepassword` — verifies current password (bcrypt), updates hash, sends nodemailer email
- `PUT /api/users/toggleblock/:useremail` — admin ban/unban
- `POST /api/projects/:projectid/members` — add member by `userId` or `email`, emits socket event
- `POST /api/friendship/addfriend` — sends request + creates notification + emits socket event

## Required Secrets

- `MONGODB_URI` — MongoDB Atlas connection string (`mongodb+srv://user:pass@cluster0.xxx.mongodb.net/taskmanager`)
- `JWT_KEY` — Secret key for JWT signing
- `SESSION_SECRET` — Express session secret
- `MAIL_USER` — Gmail address for sending password reset / change emails
- `MAIL_PASS` — Gmail App Password for nodemailer

## User preferences

- Reproduce the original GitHub repo exactly — functionally identical.
- Admin account: mostafatf97@gmail.com (role: "admin" in MongoDB)

## Gotchas

- MongoDB Atlas must have Network Access set to allow all IPs (0.0.0.0/0) for Replit to connect.
- The frontend dev server must allow all hosts (`server.host: '0.0.0.0'` in vite.config.ts).
- Do NOT run `pnpm dev` at workspace root — use individual workflow commands.
- Git commands (`git add .`, `git commit`, `git push`) run from `~/workspace` (project root).
- `rgba` backgrounds on `<select>` fall back to white in native dropdowns — always use solid hex colors on `<select>` and `<option>` elements.
