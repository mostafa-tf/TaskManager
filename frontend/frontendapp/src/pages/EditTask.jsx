import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const EditTask = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setdueDate] = useState("");
  const [priority, setPriority] = useState("");

  const divstyle = {
    width: "100%",
    height: "100%",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const formstyle = {
    height: "100%",
    width: "280px",
    backgroundColor: "green",

    display: "flex",
    flexDirection: "column",
  };
  const fetchtaskinfo = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/tasks/${localStorage.getItem("taskid")}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.status != 200) {
        throw new Error(msg.message);
      }
      const taskinfo = await res.json();
      setTitle(taskinfo.title);
      setDescription(taskinfo.description);
      setdueDate(taskinfo.dueDate.split("T")[0]);
      setPriority(taskinfo.priority);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:3000/api/tasks/updatetask/${localStorage.getItem("taskid")}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ dueDate, description, priority, title }),
        },
      );
      if (res.status != 200) {
        const data = await res.json();
        throw new Error(data.message);
      }

      navigate(-1);
    } catch (error) {
      alert(error.message);
    }
  };
  useEffect(() => {
    fetchtaskinfo();
  }, []);
  return (
    <div style={divstyle}>
      <form style={formstyle} onSubmit={handleSubmit}>
        <h2 style={{ marginLeft: "60px" }}>Edit Your Task</h2>
        title{" "}
        <input
          type="text"
          required
          minLength={2}
          value={title}
          maxLength={15}
          onChange={(e) => setTitle(e.target.value)}
        />
        priority
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        DueDate{" "}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setdueDate(e.target.value)}
          required
        />
        Description{" "}
        <textarea
          cols={25}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};
