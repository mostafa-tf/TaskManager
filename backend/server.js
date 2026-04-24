const express = require("express");
const connectdb = require("./db.js");
const userspage = require("./routes/users.js");
const app = express();
const cors = require("cors");
const taskspage = require("./routes/tasks.js");
const feedbackspage = require("./routes/feedbacks.js");
const friendshippage = require("./routes/friendship.js");
const projectspage = require("./routes/projects.js");
app.use(cors());
app.use(express.json());

connectdb();
app.use("/api/tasks", taskspage);
app.use("/api/feedbacks", feedbackspage);
app.use("/api/friendship", friendshippage);

app.use("/api/users", userspage);
app.use("/api/projects", projectspage);
app.get("/", (req, res) => {
  res.json({ message: "welcome to express" });
});
app.listen(3000, () => console.log("connected to server at port 3000"));
