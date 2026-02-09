const mongoose = require("mongoose");

async function connectdb() {
  try {
    await mongoose.connect("mongodb://localhost:27017/TasksProject");
    console.log("connected to Db sucessfully ");
  } catch (err) {
    console.log("failed to connected to DB ");
    process.exit(1);
  }
}
module.exports = connectdb;
