const express = require("express");
const connectdb = require("./db.js");
const userspage = require("./routes/users.js");
const http = require("http");

const app = express();
const cors = require("cors");
const { Server } = require("socket.io");

const taskspage = require("./routes/tasks.js");
const feedbackspage = require("./routes/feedbacks.js");
const friendshippage = require("./routes/friendship.js");
const projectspage = require("./routes/projects.js");
const notificationspage = require("./routes/notifications.js");

app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
app.set("io", io);
io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("joinUserRoom", (userId) => {
    socket.join(`${userId}`);
    console.log(`user joined room:${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});
connectdb();
app.use("/api/tasks", taskspage);
app.use("/api/feedbacks", feedbackspage);
app.use("/api/friendship", friendshippage);

app.use("/api/users", userspage);
app.use("/api/projects", projectspage);
app.use("/api/notifications", notificationspage);

app.get("/", (req, res) => {
  res.json({ message: "welcome to express" });
});
server.listen(3000, () => console.log("connected to server at port 3000"));
