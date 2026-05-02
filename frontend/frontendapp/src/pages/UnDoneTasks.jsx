import { useState, useEffect } from "react";
import { TaskStructure } from "../components/TaskStructure";
import { FaFilter } from "react-icons/fa";
import {
  MdDateRange,
  MdLowPriority,
  MdPendingActions,
  MdErrorOutline,
  MdCheckCircleOutline,
} from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const UnDoneTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [notasks, setNoTasks] = useState(false);
  const [titlefilter, setTitleFilter] = useState("");
  const [calenderdate, setCalenderDate] = useState(null);
  const [priorityfilter, setPriorityFilter] = useState("");
  const [messageBox, setMessageBox] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  const showBox = (type, title, message) => {
    setMessageBox({ show: true, type, title, message });
  };

  useEffect(() => {
    if (messageBox.show) {
      const timer = setTimeout(() => {
        setMessageBox({ show: false, type: "", title: "", message: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [messageBox.show]);

  const changepriorityfilter = (e) => {
    setPriorityFilter(e.target.value);
  };

  const filteredtasks = tasks.filter((task) => {
    const date = calenderdate ? calenderdate.toLocaleDateString("en-CA") : "";
    return (
      task.title.startsWith(titlefilter) &&
      task.dueDate.startsWith(date) &&
      task.priority.startsWith(priorityfilter)
    );
  });

  async function fetchundonetasks() {
    setNoTasks(false);
    setTasks([]);

    try {
      const res = await fetch("http://localhost:3000/api/tasks/undone", {
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
      showBox("error", "Server Error", error.message || "Error From Server");
    }
  }

  useEffect(() => {
    fetchundonetasks();
  }, []);

  const handlecalenderchange = (d) => {
    setCalenderDate(d);
  };

  const switchcheckbox = async (taskid) => {
    try {
      const res = await fetch(`http://localhost:3000/api/tasks/${taskid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const msg = await res.json();

      if (res.status !== 200) {
        throw new Error(msg.message || "Error From Server");
      }

      showBox(
        "success",
        "Task Updated",
        msg.message || "Task updated successfully",
      );
      fetchundonetasks();
    } catch (error) {
      showBox(
        "error",
        "Update Failed",
        error.message || "Something went wrong",
      );
    }
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

      showBox("success", "Task Deleted", "Task deleted successfully");
      fetchundonetasks();
    } catch (error) {
      showBox(
        "error",
        "Delete Failed",
        error.message || "Failed to delete task",
      );
    }
  };

  const pageStyle = {
    width: "100%",
    minHeight: "100%",
    boxSizing: "border-box",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "24px",
  };

  const titleWrap = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const iconWrap = {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background: "rgba(0,255,140,0.10)",
    border: "1px solid rgba(0,255,140,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#dffff0",
  };

  const titleStyle = {
    margin: 0,
    color: "#ffffff",
    fontSize: "30px",
    fontWeight: "800",
    letterSpacing: "0.3px",
  };

  const subtitleStyle = {
    margin: "4px 0 0 0",
    color: "rgba(255,255,255,0.68)",
    fontSize: "14px",
  };

  const filterdiv = {
    width: "100%",
    marginBottom: "28px",
    padding: "18px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,255,140,0.12)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    boxSizing: "border-box",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#dffff0",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.2px",
  };

  const inputStyle = {
    width: "100%",
    height: "46px",
    borderRadius: "14px",
    border: "1px solid rgba(0,255,140,0.16)",
    background: "rgba(255,255,255,0.07)",
    color: "#ffffff",
    padding: "0 14px",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const tasksWrapper = {
    display: "grid",
    gap: "18px",
  };

  const emptyState = {
    textAlign: "center",
    color: "#60ff9c",
    fontSize: "34px",
    fontWeight: "800",
    margin: "34px 0",
  };

  const boxOverlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };

  const isError = messageBox.type === "error";

  const boxStyle = {
    width: "min(430px, 90%)",
    padding: "22px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, rgba(22,22,22,0.98), rgba(12,12,12,0.98))",
    border: isError
      ? "1px solid rgba(255,77,79,0.45)"
      : "1px solid rgba(0,255,140,0.35)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    color: "#fff",
  };

  const boxIcon = {
    minWidth: "52px",
    height: "52px",
    borderRadius: "18px",
    background: isError ? "rgba(255,77,79,0.14)" : "rgba(0,255,140,0.12)",
    border: isError
      ? "1px solid rgba(255,77,79,0.25)"
      : "1px solid rgba(0,255,140,0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: isError ? "#ff6b6b" : "#60ff9c",
  };

  const boxTitle = {
    margin: "0 0 5px",
    fontSize: "18px",
    fontWeight: "800",
  };

  const boxMessage = {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.5",
    color: "rgba(255,255,255,0.72)",
  };

  return (
    <div style={pageStyle}>
      {messageBox.show && (
        <div style={boxOverlay}>
          <div style={boxStyle}>
            <div style={boxIcon}>
              {isError ? (
                <MdErrorOutline size={30} />
              ) : (
                <MdCheckCircleOutline size={30} />
              )}
            </div>

            <div>
              <h3 style={boxTitle}>{messageBox.title}</h3>
              <p style={boxMessage}>{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

      <div style={headerStyle}>
        <div style={titleWrap}>
          <div style={iconWrap}>
            <MdPendingActions size={26} />
          </div>

          <div>
            <h2 style={titleStyle}>Pending Tasks</h2>
            <p style={subtitleStyle}>
              Review all pending tasks and filter them by title, date, and
              priority.
            </p>
          </div>
        </div>
      </div>

      {notasks && <h1 style={emptyState}>No Available Tasks Found</h1>}

      <div style={filterdiv}>
        <div style={fieldStyle}>
          <label style={labelStyle}>
            <FaFilter />
            Search By Title
          </label>
          <input
            type="text"
            value={titlefilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            style={inputStyle}
            placeholder="Enter task title"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>
            <MdDateRange />
            Filter By Date
          </label>
          <div>
            <DatePicker
              placeholderText="Select date"
              selected={calenderdate}
              dateFormat="yyyy-MM-dd"
              onChange={handlecalenderchange}
              className="custom-dark-datepicker"
            />
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>
            <MdLowPriority />
            Filter By Priority
          </label>
          <select
            value={priorityfilter}
            onChange={changepriorityfilter}
            style={inputStyle}
          >
            <option value="">Filter By Priority</option>
            <option value="low">low</option>
            <option value="med">medium</option>
            <option value="high">high</option>
          </select>
        </div>
      </div>

      <div style={tasksWrapper}>
        {filteredtasks.map((task) => {
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
    </div>
  );
};
