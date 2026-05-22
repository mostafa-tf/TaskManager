import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";

export const AddTasks = () => {
  const [taskinfo, setTaskInfo] = useState({
    title: "",
    priority: "",
    dueDate: "",
    description: "",
    starthour: "00:00",
    endhour: "23:59",
  });

  const [tasktime, setTaskTime] = useState("allday");
  const [messageBox, setMessageBox] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  const showBox = (type: string, title: string, message: string) => {
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

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(taskinfo),
      });
      const data = await res.json();
      if (res.status !== 201) throw new Error(data.message);
      showBox("success", "Task Added", "Task inserted to the database successfully");
    } catch (error: any) {
      showBox("error", "Insert Failed", error.message || "Error From Server");
    }
  };

  const refreshhour = () => {
    setTaskInfo((prev) => ({ ...prev, starthour: "00:00", endhour: "23:59" }));
  };

  const pageStyle: React.CSSProperties = {
    display: "flex",
    width: "100%",
    minHeight: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    boxSizing: "border-box",
    background:
      "radial-gradient(circle at top, rgba(0,255,140,0.10), transparent 28%), linear-gradient(135deg, #07110d 0%, #0b1d15 45%, #08110c 100%)",
  };

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "720px",
    borderRadius: "30px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(0,255,140,0.16)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.42)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    padding: "34px 32px",
    boxSizing: "border-box",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    color: "#ffffff",
    fontSize: "34px",
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: "0.4px",
  };

  const subtitleStyle: React.CSSProperties = {
    marginTop: "10px",
    marginBottom: "28px",
    color: "rgba(255,255,255,0.72)",
    textAlign: "center",
    fontSize: "15px",
    lineHeight: "1.7",
  };

  const formStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px 18px",
  };

  const fullWidth: React.CSSProperties = {
    gridColumn: "1 / -1",
  };

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const labelStyle: React.CSSProperties = {
    color: "#dffff0",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.3px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "48px",
    borderRadius: "14px",
    border: "1px solid rgba(0,255,140,0.20)",
    background: "rgba(255,255,255,0.07)",
    color: "#ffffff",
    padding: "0 14px",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: "pointer",
    backgroundColor: "#0b1a12",
    colorScheme: "dark",
  };

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "140px",
    borderRadius: "16px",
    border: "1px solid rgba(0,255,140,0.20)",
    background: "rgba(255,255,255,0.07)",
    color: "#ffffff",
    padding: "14px",
    outline: "none",
    fontSize: "15px",
    resize: "none",
    boxSizing: "border-box",
    lineHeight: "1.7",
  };

  const radioWrapper: React.CSSProperties = {
    ...fullWidth,
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
    padding: "10px 14px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,255,140,0.12)",
    color: "#eafff4",
  };

  const timeFieldsWrapper: React.CSSProperties = {
    ...fullWidth,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    height: "54px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #00c853, #00e676)",
    color: "#08110c",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 14px 30px rgba(0, 200, 83, 0.28)",
    transition: "all 0.3s ease",
  };

  const boxOverlay: React.CSSProperties = {
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

  const boxStyle: React.CSSProperties = {
    width: "min(430px, 90%)",
    padding: "22px",
    borderRadius: "24px",
    background: "linear-gradient(135deg, rgba(22,22,22,0.98), rgba(12,12,12,0.98))",
    border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.35)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    color: "#fff",
  };

  const boxIcon: React.CSSProperties = {
    minWidth: "52px",
    height: "52px",
    borderRadius: "18px",
    background: isError ? "rgba(255,77,79,0.14)" : "rgba(0,255,140,0.12)",
    border: isError ? "1px solid rgba(255,77,79,0.25)" : "1px solid rgba(0,255,140,0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: isError ? "#ff6b6b" : "#60ff9c",
  };

  const boxTitle: React.CSSProperties = { margin: "0 0 5px", fontSize: "18px", fontWeight: "800" };
  const boxMessage: React.CSSProperties = { margin: 0, fontSize: "14px", lineHeight: "1.5", color: "rgba(255,255,255,0.72)" };

  return (
    <div style={pageStyle}>
      {messageBox.show && (
        <div style={boxOverlay}>
          <div style={boxStyle}>
            <div style={boxIcon}>
              {isError ? <MdErrorOutline size={30} /> : <MdCheckCircleOutline size={30} />}
            </div>
            <div>
              <h3 style={boxTitle}>{messageBox.title}</h3>
              <p style={boxMessage}>{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={titleStyle}>Add Your Task</h2>
        <p style={subtitleStyle}>
          Create a new task, set its priority, due date, and manage the time in a clean and organized way.
        </p>

        <div style={{ width: "80px", height: "4px", borderRadius: "999px", background: "linear-gradient(90deg, #00c853, #b7ffd5)", margin: "0 auto 26px" }} />

        <form onSubmit={handlesubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Task Title</label>
            <input
              type="text"
              value={taskinfo.title}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, title: e.target.value }))}
              required
              minLength={2}
              maxLength={15}
              style={inputStyle}
              placeholder="Enter task title"
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Task Priority</label>
            <select
              value={taskinfo.priority}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, priority: e.target.value }))}
              style={selectStyle}
            >
              <option value="" style={{ backgroundColor: "#0b1a12", color: "#ffffff" }}>Select Priority</option>
              <option value="low" style={{ backgroundColor: "#0b1a12", color: "#ffffff" }}>Low Priority</option>
              <option value="medium" style={{ backgroundColor: "#0b1a12", color: "#ffffff" }}>Medium Priority</option>
              <option value="high" style={{ backgroundColor: "#0b1a12", color: "#ffffff" }}>High Priority</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Due Date</label>
            <input
              type="date"
              value={taskinfo.dueDate}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, dueDate: e.target.value }))}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Task Type</label>
            <div style={radioWrapper}>
              <span style={{ fontWeight: "700" }}>Time</span>
              <input
                type="radio"
                value="time"
                checked={tasktime === "time"}
                onChange={(e) => setTaskTime(e.target.value)}
              />
              <span style={{ fontWeight: "700" }}>All Day</span>
              <input
                type="radio"
                checked={tasktime === "allday"}
                value="allday"
                onChange={(e) => { setTaskTime(e.target.value); refreshhour(); }}
              />
            </div>
          </div>

          {tasktime === "time" && (
            <div style={timeFieldsWrapper}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Start Hour</label>
                <input
                  type="text"
                  placeholder="HH:MM"
                  pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                  required
                  value={taskinfo.starthour}
                  onChange={(e) => setTaskInfo((prev) => ({ ...prev, starthour: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>End Hour</label>
                <input
                  type="text"
                  placeholder="HH:MM"
                  pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                  required
                  value={taskinfo.endhour}
                  onChange={(e) => setTaskInfo((prev) => ({ ...prev, endhour: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          <div style={{ ...fieldStyle, ...fullWidth }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={taskinfo.description}
              rows={5}
              cols={25}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, description: e.target.value }))}
              style={textareaStyle}
              placeholder="Write task description..."
            />
          </div>

          <div style={fullWidth}>
            <button
              type="submit"
              style={buttonStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 18px 34px rgba(0, 200, 83, 0.35)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 14px 30px rgba(0, 200, 83, 0.28)";
              }}
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
