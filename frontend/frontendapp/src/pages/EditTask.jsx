import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";

export const EditTask = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setdueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [starthour, setStartHour] = useState("");
  const [endhour, setEndHour] = useState("");
  const [tasktime, setTaskTime] = useState("");

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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch task");
      }

      setTitle(data.title);
      setDescription(data.description);
      setdueDate(data.dueDate.split("T")[0]);
      setPriority(data.priority);
      setStartHour(data.starthour);
      setEndHour(data.endhour);
      setTaskTime(
        data.starthour == "00:00" && data.endhour == "23:59"
          ? "allday"
          : "time",
      );
    } catch (error) {
      showBox("error", "Fetch Failed", error.message);
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
          body: JSON.stringify({
            dueDate,
            description,
            priority,
            title,
            starthour,
            endhour,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      showBox("success", "Updated", "Task updated successfully");

      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error) {
      showBox("error", "Update Failed", error.message);
    }
  };

  useEffect(() => {
    fetchtaskinfo();
  }, []);

  const pageStyle = {
    width: "100%",
    minHeight: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    boxSizing: "border-box",
    background:
      "radial-gradient(circle at top, rgba(0,255,140,0.08), transparent 24%), linear-gradient(135deg, #07110d 0%, #0b1d15 45%, #08110c 100%)",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "500px",
    borderRadius: "30px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(0,255,140,0.16)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.42)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    padding: "36px 32px",
    boxSizing: "border-box",
  };

  const titleStyle = {
    margin: 0,
    color: "#ffffff",
    fontSize: "34px",
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: "0.4px",
  };

  const subtitleStyle = {
    marginTop: "10px",
    marginBottom: "28px",
    color: "rgba(255,255,255,0.72)",
    textAlign: "center",
    fontSize: "15px",
    lineHeight: "1.7",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "18px",
  };

  const labelStyle = {
    color: "#dffff0",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.3px",
  };

  const inputStyle = {
    width: "100%",
    height: "50px",
    borderRadius: "14px",
    border: "1px solid rgba(0,255,140,0.22)",
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    padding: "0 14px",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
    transition: "all 0.25s ease",
  };

  const textareaStyle = {
    width: "100%",
    minHeight: "120px",
    borderRadius: "14px",
    border: "1px solid rgba(0,255,140,0.22)",
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    padding: "14px",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
    resize: "none",
  };

  const radioWrapper = {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "18px",
    color: "#dffff0",
    fontWeight: "700",
  };

  const timeWrapper = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  };

  const buttonStyle = {
    width: "100%",
    height: "52px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #00c853, #00e676)",
    color: "#08110c",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 14px 30px rgba(0, 200, 83, 0.28)",
    transition: "all 0.3s ease",
    marginTop: "8px",
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

      <form style={cardStyle} onSubmit={handleSubmit}>
        <h2 style={titleStyle}>Edit Your Task</h2>

        <p style={subtitleStyle}>
          Update your task information in a clean and organized way.
        </p>

        <div
          style={{
            width: "80px",
            height: "4px",
            borderRadius: "999px",
            background: "linear-gradient(90deg, #00c853, #b7ffd5)",
            margin: "0 auto 26px",
          }}
        />

        <div style={fieldStyle}>
          <label style={labelStyle}>Task Title</label>
          <input
            type="text"
            required
            minLength={2}
            maxLength={15}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
            placeholder="Enter task title"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={inputStyle}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setdueDate(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={radioWrapper}>
          <span>Time</span>
          <input
            type="radio"
            checked={tasktime == "time"}
            onChange={() => setTaskTime("time")}
            value="time"
          />

          <span>All Day</span>
          <input
            type="radio"
            checked={tasktime == "allday"}
            onChange={() => {
              setTaskTime("allday");
              setStartHour("00:00");
              setEndHour("23:59");
            }}
            value="allday"
          />
        </div>

        {tasktime == "time" && (
          <div style={timeWrapper}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Start Hour</label>
              <input
                type="text"
                placeholder="HH:MM"
                pattern="^([01]\\d|2[0-3]):([0-5]\\d)$"
                required={true}
                value={starthour}
                onChange={(e) => setStartHour(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>End Hour</label>
              <input
                type="text"
                placeholder="HH:MM"
                pattern="^([01]\\d|2[0-3]):([0-5]\\d)$"
                required={true}
                value={endhour}
                onChange={(e) => setEndHour(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        )}

        <div style={fieldStyle}>
          <label style={labelStyle}>Description</label>
          <textarea
            cols={25}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={textareaStyle}
            placeholder="Write task description..."
          />
        </div>

        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 18px 34px rgba(0, 200, 83, 0.35)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 14px 30px rgba(0, 200, 83, 0.28)";
          }}
        >
          Update Task
        </button>
      </form>
    </div>
  );
};
