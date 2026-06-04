import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";

const doc = new PDFDocument({ margin: 60, size: "A4" });
doc.pipe(createWriteStream("TaskFlow-Progress-Report.pdf"));

const GREEN = "#1B5E20";
const BLACK = "#212121";
const W = 495;

const h1 = (text) => {
  doc.moveDown(0.6)
     .font("Helvetica-Bold").fontSize(14).fillColor(GREEN)
     .text(text)
     .moveDown(0.3);
};

const h2 = (text) => {
  doc.moveDown(0.4)
     .font("Helvetica-Bold").fontSize(12).fillColor(GREEN)
     .text(text)
     .moveDown(0.2);
};

const kv = (label, value) => {
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(GREEN).text(label + ": ", { continued: true })
     .font("Helvetica").fillColor(BLACK).text(value, { lineGap: 2 });
};

const bullet = (text, level = 0) => {
  const indent = 20 + level * 16;
  const mark = level === 0 ? "•" : "–";
  doc.font("Helvetica").fontSize(10.5).fillColor(BLACK)
     .text(`${mark}  ${text}`, { indent, lineGap: 2 });
};

const normal = (text, bold = false) => {
  doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(10.5).fillColor(BLACK)
     .text(text, { lineGap: 2 });
};

const check = (text) => {
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(GREEN).text("✔  ", { continued: true })
     .font("Helvetica").fillColor(BLACK).text(text, { lineGap: 2 });
};

const divider = () => {
  doc.moveDown(0.5);
  const y = doc.y;
  doc.moveTo(60, y).lineTo(555, y).strokeColor("#C8E6C9").lineWidth(1).stroke();
  doc.moveDown(0.6);
};

// ── Title ────────────────────────────────────────────────────────────
doc.font("Helvetica-Bold").fontSize(16).fillColor(GREEN)
   .text("Weekly Project Progress Report & Deployment Preparation", { align: "center" });
divider();

// ── 1. Project Overview ───────────────────────────────────────────────
h1("1. Project Overview");
kv("Project Title", "TaskFlow — Real-Time Collaborative Task Management Platform with Sentiment-Aware Feedback Analysis");
kv("Short Description", "TaskFlow is a full-stack MERN web application that enables users to manage personal and project-based tasks, collaborate with teammates in real time, track audit logs, and gain intelligent insights from user feedback through a built-in NLP sentiment analysis engine.");
kv("Current Completion", "100% — Fully deployed and live");
kv("Live URL", "https://github-publish.replit.app");
kv("Demo Video", "https://drive.google.com/file/d/1gp-gPlHlvm6GAQ9Tfdmhyx5xqWWj0YOj/view?usp=drivesdk");
divider();

// ── 2. Team Contributions ─────────────────────────────────────────────
h1("2. Team Contributions");

h2("Member 1: Mostafa Tfaily (120080)");
normal("Tasks Completed:", true);
bullet("Designed and implemented all Mongoose schemas (User, Task, Project, Friendship, Notification, Log, Feedback)", 1);
bullet("Built all backend routes: users, tasks, projects, friendship, notifications, logs, feedbacks", 1);
bullet("Implemented JWT authentication middleware and session security", 1);
bullet("Engineered real-time Socket.io server — room management, event emission for friend requests, project invitations, task assignments, and accepted requests", 1);
bullet("Implemented audit logging system for full traceability of all user and admin actions", 1);
bullet("Integrated Nodemailer for password reset and change-password confirmation emails", 1);
bullet("Implemented all API data fetching and integration on the frontend — connecting every page to its backend endpoint with proper error handling, loading states, and auth headers", 1);
bullet("Implemented the Sentiment Analysis engine from scratch in TypeScript (VADER-inspired weighted lexicon, negation detection, score normalization — no external library)", 1);
doc.moveDown(0.3);
normal("Contribution:", true);
normal("Full backend architecture, Socket.io real-time layer, audit logs, and all frontend API integration logic.");
doc.moveDown(0.5);

h2("Member 2: Wassem Abou Arab (120581)");
normal("Tasks Completed:", true);
bullet("Designed and implemented the full UI of all application pages using React, Tailwind CSS, and custom dark-theme styles", 1);
bullet("Built reusable frontend components: Navbar, Sidebar, Footer, TaskStructure, ProtectedRoute", 1);
bullet("Designed the friends interface, project dashboard UI, admin dashboard layout, and all form pages", 1);
bullet("Prepared the frontend project environment and component structure for backend integration", 1);
doc.moveDown(0.3);
normal("Contribution:", true);
normal("Frontend UI design and implementation — all visual layouts, component architecture, and user experience.");
divider();

// ── 3. Work Completed ─────────────────────────────────────────────────
h1("3. Work Completed (Full Feature List)");
const features = [
  "User registration, login, and JWT-based authentication",
  "Forgot / reset password flow via email (Nodemailer)",
  "Change password from Profile with bcrypt verification and email confirmation",
  "Personal task CRUD — create, edit, delete with priority, due date, start/end time",
  "Done / Undone / All task views with priority filtering",
  "Project management with owner and member roles",
  "Assign tasks to project members with priority, description, and due date",
  "Friends system — send, accept, and block friend requests",
  "Real-time notifications via Socket.io (friend requests, project invitations, task assignments, accepted requests)",
  "Global Socket context wrapping the entire app for live event propagation",
  "Analytics dashboard with circular progress charts (react-circular-progressbar)",
  "Admin dashboard — manage users, update roles, ban/unban, delete accounts",
  "Admin username filter input for fast user lookup",
  "Registration Date column in admin user table",
  "Audit logs page — full traceability for both user and admin actions",
  "User feedback submission and admin review",
  "Sentiment Analysis on user feedback — VADER-inspired NLP algorithm with weighted lexicon (~60 words, −3 to +3), negation detection, score normalization, live badges, and summary panel",
  "Profile management — edit username and email",
  "Full deployment on Replit with MongoDB Atlas, environment secrets, and Socket.io proxying",
];
features.forEach((f) => bullet(f));
divider();

// ── 4. Demonstration ──────────────────────────────────────────────────
h1("4. Demonstration");
kv("Demo Video", "https://drive.google.com/file/d/1gp-gPlHlvm6GAQ9Tfdmhyx5xqWWj0YOj/view?usp=drivesdk");
divider();

// ── 5. Challenges ─────────────────────────────────────────────────────
h1("5. Challenges & Solutions");
doc.moveDown(0.3);

const challenges = [
  ["Challenge", "Resolution"],
  ["Socket.io rooms not receiving events cross-route", "Used a global SocketContext with useState so the socket instance persists across all pages via React context"],
  ["White dropdown popup in native <select> elements", "Applied solid hex #0b1a12 background with color-scheme: dark via global CSS — rgba falls back to white in native dropdowns"],
  ["Aggregation for audit logs and analytics", "Resolved using Mongoose populate + manual aggregation on backend routes"],
  ["Bi-directional friendship prevention", "Enforced in the addfriend route by checking both directions of the relation before inserting"],
  ["MongoDB Atlas connectivity from Replit", "Set Network Access to 0.0.0.0/0 in Atlas to allow all IPs"],
];

const colWidths = [220, 275];
const rowH = 36;
const startX = 60;
let tableY = doc.y;

challenges.forEach(([left, right], i) => {
  const isHeader = i === 0;
  const bg = isHeader ? GREEN : i % 2 === 0 ? "#FFFFFF" : "#E8F5E9";
  const fg = isHeader ? "#FFFFFF" : BLACK;

  doc.rect(startX, tableY, colWidths[0], rowH).fillAndStroke(bg, "#C8E6C9");
  doc.rect(startX + colWidths[0], tableY, colWidths[1], rowH).fillAndStroke(bg, "#C8E6C9");

  doc.font(isHeader ? "Helvetica-Bold" : "Helvetica").fontSize(9.5).fillColor(fg)
     .text(left, startX + 5, tableY + 6, { width: colWidths[0] - 10, lineGap: 1 });

  const textH = doc.heightOfString(right, { width: colWidths[1] - 10 });
  const cellY = tableY + Math.max(0, (rowH - textH) / 2);
  doc.font(isHeader ? "Helvetica-Bold" : "Helvetica").fontSize(9.5).fillColor(fg)
     .text(right, startX + colWidths[0] + 5, cellY, { width: colWidths[1] - 10, lineGap: 1 });

  tableY += rowH;
});

doc.y = tableY;
divider();

// ── 6. Deployment Checklist ───────────────────────────────────────────
h1("6. Deployment Checklist");
const checks = [
  "Application runs without errors",
  "MongoDB Atlas connected and seeded",
  "All environment variables configured (MONGODB_URI, JWT_KEY, SESSION_SECRET, MAIL_USER, MAIL_PASS)",
  "Backend deployed and serving at /api",
  "Frontend build deployed and serving at /",
  "Socket.io proxied correctly through /api/socket.io",
  "Full end-to-end testing completed",
  "Live at https://taskflow.replit.app",
];
checks.forEach(check);

doc.end();
console.log("Done: TaskFlow-Progress-Report.pdf");
