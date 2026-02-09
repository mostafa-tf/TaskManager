const express = require("express");
const connectdb = require("./db.js");
const userspage = require("./routes/users.js");
const app = express();
const cors = require("cors");
const taskspage = require("./routes/tasks.js");

app.use(cors());
app.use(express.json());

connectdb();
app.use("/api/tasks", taskspage);
app.use("/api/users", userspage);
app.get("/", (req, res) => {
  res.json({ message: "welcome to express" });
});
app.listen(3000, () => console.log("connected to server at port 3000"));
