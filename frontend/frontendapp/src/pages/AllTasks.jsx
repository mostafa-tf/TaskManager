import { useState, useEffect } from "react";
import { TaskStructure } from "../components/TaskStructure";
import { RiTaskLine } from "react-icons/ri";

export const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [notasks, setNoTasks] = useState(false);
  async function fetchalltasks() {
    setNoTasks(false);
    setTasks([]);
    try {
      const res = await fetch("http://localhost:3000/api/tasks", {
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
    fetchalltasks();
  }, []);
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
    await fetchalltasks();
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
      await fetchalltasks();
    } catch (error) {
      alert("Failed " + error.message);
    }
  };
  return (
    <>
      <div>
        {notasks && (
          <h1 style={{ color: "green", marginLeft: "40%" }}>No Tasks Found</h1>
        )}
        {tasks.map((task, index) => {
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
            />
          );
        })}
      </div>
    </>
  );
};
