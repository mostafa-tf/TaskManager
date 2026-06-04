import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, Table, TableRow, TableCell, WidthType,
  BorderStyle, ShadingType, TableLayoutType
} from "docx";
import { writeFileSync } from "fs";

const GREEN = "1B5E20";
const LIGHT_GREEN = "E8F5E9";
const DARK = "212121";

const h1 = (text) => new Paragraph({
  text,
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 320, after: 120 },
  run: { color: GREEN, bold: true },
});

const h2 = (text) => new Paragraph({
  text,
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 240, after: 80 },
  run: { color: GREEN },
});

const bullet = (text, bold = false) => new Paragraph({
  bullet: { level: 0 },
  spacing: { after: 60 },
  children: [new TextRun({ text, bold, color: DARK, size: 22 })],
});

const subbullet = (text) => new Paragraph({
  bullet: { level: 1 },
  spacing: { after: 40 },
  children: [new TextRun({ text, color: DARK, size: 21 })],
});

const normal = (text, bold = false) => new Paragraph({
  spacing: { after: 80 },
  children: [new TextRun({ text, bold, color: DARK, size: 22 })],
});

const kv = (label, value) => new Paragraph({
  spacing: { after: 80 },
  children: [
    new TextRun({ text: `${label}: `, bold: true, color: GREEN, size: 22 }),
    new TextRun({ text: value, color: DARK, size: 22 }),
  ],
});

const spacer = () => new Paragraph({ text: "", spacing: { after: 100 } });

const divider = () => new Paragraph({
  border: { bottom: { color: "C8E6C9", style: BorderStyle.SINGLE, size: 6 } },
  spacing: { after: 160 },
  text: "",
});

const challengeTable = () => new Table({
  layout: TableLayoutType.FIXED,
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          shading: { type: ShadingType.SOLID, color: GREEN },
          width: { size: 45, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "Challenge", bold: true, color: "FFFFFF", size: 22 })] })],
        }),
        new TableCell({
          shading: { type: ShadingType.SOLID, color: GREEN },
          width: { size: 55, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "Resolution", bold: true, color: "FFFFFF", size: 22 })] })],
        }),
      ],
    }),
    ...[
      ["Socket.io rooms not receiving events cross-route", "Used a global SocketContext with useState so the socket instance persists across all pages via React context"],
      ["White dropdown popup in native <select> elements", "Applied solid hex #0b1a12 background with color-scheme: dark via global CSS — rgba falls back to white in native dropdowns"],
      ["Aggregation for audit logs and analytics", "Resolved using Mongoose populate + manual aggregation on backend routes"],
      ["Bi-directional friendship prevention", "Enforced in the addfriend route by checking both directions of the relation before inserting"],
      ["MongoDB Atlas connectivity from Replit", "Set Network Access to 0.0.0.0/0 in Atlas to allow all IPs"],
    ].map((row, i) =>
      new TableRow({
        children: row.map((cell) =>
          new TableCell({
            shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "FFFFFF" : LIGHT_GREEN },
            children: [new Paragraph({ children: [new TextRun({ text: cell, color: DARK, size: 21 })] })],
          })
        ),
      })
    ),
  ],
});

const checkItem = (text) => new Paragraph({
  spacing: { after: 60 },
  children: [
    new TextRun({ text: "✔  ", bold: true, color: GREEN, size: 22 }),
    new TextRun({ text, color: DARK, size: 22 }),
  ],
});

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22, color: DARK },
        paragraph: { spacing: { line: 276 } },
      },
    },
  },
  sections: [{
    children: [
      // Title
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: "Weekly Project Progress Report & Deployment Preparation", bold: true, size: 32, color: GREEN })],
      }),

      divider(),

      // 1. Project Overview
      h1("1. Project Overview"),
      kv("Project Title", "TaskFlow — Real-Time Collaborative Task Management Platform with Sentiment-Aware Feedback Analysis"),
      kv("Short Description", "TaskFlow is a full-stack MERN web application that enables users to manage personal and project-based tasks, collaborate with teammates in real time, track audit logs, and gain intelligent insights from user feedback through a built-in NLP sentiment analysis engine."),
      kv("Current Completion", "100% — Fully deployed and live"),
      kv("Live URL", "https://taskflow.replit.app"),
      kv("Demo Video", "https://drive.google.com/file/d/1gp-gPlHlvm6GAQ9Tfdmhyx5xqWWj0YOj/view?usp=drivesdk"),
      divider(),

      // 2. Team Contributions
      h1("2. Team Contributions"),

      h2("Member 1: Mostafa Tfaily (120080)"),
      normal("Tasks Completed:", true),
      subbullet("Designed and implemented all Mongoose schemas (User, Task, Project, Friendship, Notification, Log, Feedback)"),
      subbullet("Built all backend routes: users, tasks, projects, friendship, notifications, logs, feedbacks"),
      subbullet("Implemented JWT authentication middleware and session security"),
      subbullet("Engineered real-time Socket.io server — room management, event emission for friend requests, project invitations, task assignments, and accepted requests"),
      subbullet("Implemented audit logging system for full traceability of all user and admin actions"),
      subbullet("Integrated Nodemailer for password reset and change-password confirmation emails"),
      subbullet("Implemented all API data fetching and integration on the frontend — connecting every page to its backend endpoint with proper error handling, loading states, and auth headers"),
      subbullet("Implemented the Sentiment Analysis engine from scratch in TypeScript (VADER-inspired weighted lexicon, negation detection, score normalization — no external library)"),
      spacer(),
      normal("Contribution:", true),
      normal("Full backend architecture, Socket.io real-time layer, audit logs, and all frontend API integration logic."),
      spacer(),

      h2("Member 2: Wassem Abou Arab (120581)"),
      normal("Tasks Completed:", true),
      subbullet("Designed and implemented the full UI of all application pages using React, Tailwind CSS, and custom dark-theme styles"),
      subbullet("Built reusable frontend components: Navbar, Sidebar, Footer, TaskStructure, ProtectedRoute"),
      subbullet("Designed the friends interface, project dashboard UI, admin dashboard layout, and all form pages"),
      subbullet("Prepared the frontend project environment and component structure for backend integration"),
      spacer(),
      normal("Contribution:", true),
      normal("Frontend UI design and implementation — all visual layouts, component architecture, and user experience."),
      divider(),

      // 3. Work Completed
      h1("3. Work Completed (Full Feature List)"),
      bullet("User registration, login, and JWT-based authentication"),
      bullet("Forgot / reset password flow via email (Nodemailer)"),
      bullet("Change password from Profile with bcrypt verification and email confirmation"),
      bullet("Personal task CRUD — create, edit, delete with priority, due date, start/end time"),
      bullet("Done / Undone / All task views with priority filtering"),
      bullet("Project management with owner and member roles"),
      bullet("Assign tasks to project members with priority, description, and due date"),
      bullet("Friends system — send, accept, and block friend requests"),
      bullet("Real-time notifications via Socket.io (friend requests, project invitations, task assignments, accepted requests)"),
      bullet("Global Socket context wrapping the entire app for live event propagation"),
      bullet("Analytics dashboard with circular progress charts (react-circular-progressbar)"),
      bullet("Admin dashboard — manage users, update roles, ban/unban, delete accounts"),
      bullet("Admin username filter input for fast user lookup"),
      bullet("Registration Date column in admin user table"),
      bullet("Audit logs page — full traceability for both user and admin actions"),
      bullet("User feedback submission and admin review"),
      bullet("Sentiment Analysis on user feedback — VADER-inspired NLP algorithm with weighted lexicon (~60 words, −3 to +3), negation detection, score normalization, live badges, and summary panel"),
      bullet("Profile management — edit username and email"),
      bullet("Full deployment on Replit with MongoDB Atlas, environment secrets, and Socket.io proxying"),
      divider(),

      // 4. Demonstration
      h1("4. Demonstration"),
      normal("Screenshots — key pages: Home, Login, All Tasks, Profile, Feedback + Sentiment Analysis, Project Dashboard, Done Tasks, Pending Tasks, Add Task, Analysis Dashboard, Friends Dashboard, Sign Up, Admin Dashboard, Logs.", true),
      spacer(),
      kv("Demo Video", "https://drive.google.com/file/d/1gp-gPlHlvm6GAQ9Tfdmhyx5xqWWj0YOj/view?usp=drivesdk"),
      divider(),

      // 5. Challenges
      h1("5. Challenges & Solutions"),
      spacer(),
      challengeTable(),
      divider(),

      // 6. Deployment Checklist
      h1("6. Deployment Checklist"),
      checkItem("Application runs without errors"),
      checkItem("MongoDB Atlas connected and seeded"),
      checkItem("All environment variables configured (MONGODB_URI, JWT_KEY, SESSION_SECRET, MAIL_USER, MAIL_PASS)"),
      checkItem("Backend deployed and serving at /api"),
      checkItem("Frontend build deployed and serving at /"),
      checkItem("Socket.io proxied correctly through /api/socket.io"),
      checkItem("Full end-to-end testing completed"),
      checkItem("Live at https://taskflow.replit.app"),
    ],
  }],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync("TaskFlow-Progress-Report.docx", buffer);
console.log("Done: TaskFlow-Progress-Report.docx");
