import { useState, useEffect } from "react";
import { TaskStructure } from "../components/TaskStructure";
import { RiTaskLine } from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const DoneTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [notasks, setNoTasks] = useState(false);
  const [titlefilter, setTitleFilter] = useState("");
  const [calenderdate, setCalenderDate] = useState(null);
  const [priorityfilter, setPriorityFilter] = useState("");
  const changepriorityfilter = (e) => {
    setPriorityFilter(e.target.value);
  };

  const filteredtasks = tasks.filter((task) => {
    const date = calenderdate
      ? calenderdate.toLocaleDateString("en-CA") // يعطي YYYY-MM-DD
      : "";
    return (
      task.title.startsWith(titlefilter) &&
      task.dueDate.startsWith(date) &&
      task.priority.startsWith(priorityfilter)
    );
  });
  const filterdiv = {};
  async function fetchdonetasks() {
    setNoTasks(false);
    setTasks([]);
    try {
      const res = await fetch("http://localhost:3000/api/tasks/done", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status == 404) {
        setNoTasks(true);
      } else if (res.status == 500) {
        throw new Error("Error From Server");
      } else if (res.status == 200) {
        const tasksobj = await res.json();
        setTasks(tasksobj);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    fetchdonetasks();
  }, []);
  const handlecalenderchange = (d) => {
    setCalenderDate(d);
  };
  const switchcheckbox = async (taskid) => {
    alert(taskid);

    const res = await fetch(`http://localhost:3000/api/tasks/${taskid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const msg = await res.json();
    alert(msg.message);
    fetchdonetasks();
  };
  const deletetask = async (taskid) => {
    try {
      const result = await fetch(`http://localhost:3000/api/tasks/${taskid}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      let data;
      if (result.status != 200) {
        data = await result.json();
        throw new Error(data.message);
      }
      fetchdonetasks();
    } catch (error) {
      alert("Failed " + error.message);
    }
  };
  return (
    <>
      <div>
        {notasks && (
          <h1 style={{ color: "green", marginLeft: "40%" }}>
            No Available Tasks Found
          </h1>
        )}
        <div style={filterdiv}>
          {" "}
          Search By Title
          <input
            type="text"
            value={titlefilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          />
          <DatePicker
            placeholderText="Select date"
            selected={calenderdate}
            dateFormat="yyyy-MM-dd"
            onChange={handlecalenderchange}
          />
          Filter By Priority{" "}
          <select value={priorityfilter} onChange={changepriorityfilter}>
            <option value="">Filter By Priority</option>
            <option value="low">low</option>
            <option value="med">medium</option>
            <option value="high">high</option>
          </select>
        </div>
        {filteredtasks.map((task, index) => {
          return (
            <TaskStructure
              key={task._id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              completed={task.isDone}
              isexpired={task.dueDate}
              completedat={task.completedAt}
              deletefun={() => deletetask(task._id)}
              onChange={() => switchcheckbox(task._id)}
              taskid={task._id}
              starthour={task.starthour}
              endhour={task.endhour}
            />
          );
        })}
      </div>
    </>
  );
};
