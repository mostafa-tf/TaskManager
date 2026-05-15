import express, { type Express } from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger";
import { connectdb } from "./db";
import usersRouter from "./routes/users";
import tasksRouter from "./routes/tasks";
import feedbacksRouter from "./routes/feedbacks";
import friendshipRouter from "./routes/friendship";
import projectsRouter from "./routes/projects";
import notificationsRouter from "./routes/notifications";
import healthRouter from "./routes/health";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) { return { id: req.id, method: req.method, url: req.url?.split("?")[0] }; },
      res(res) { return { statusCode: res.statusCode }; },
    },
  }),
);

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", healthRouter);
app.use("/api/users", usersRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/feedbacks", feedbacksRouter);
app.use("/api/friendship", friendshipRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/notifications", notificationsRouter);

export const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: "*" },
  path: "/api/socket.io",
});

app.set("io", io);

io.on("connection", (socket) => {
  logger.info({ socketId: socket.id }, "socket connected");

  socket.on("joinUserRoom", (userId: string) => {
    socket.join(`${userId}`);
    logger.info({ userId }, "user joined room");
  });

  socket.on("disconnect", () => {
    logger.info({ socketId: socket.id }, "socket disconnected");
  });
});

export default app;
