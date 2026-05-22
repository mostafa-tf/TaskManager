import { useState, useEffect } from "react";
import { TiPencil } from "react-icons/ti";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const EditTask = () => {
  const [task, setTask] = useState<any>(null);
  const [calenderdate, setCalenderDate] = useState<Date | null>(null);
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });

  const showBox = (type: string, title: string, message: string) => {
    setMessageBox({ show: true, type, title, message });
    setTimeout(() => setMessageBox({ show: false, type: "", title: "", message: "" }), 3000);
  };

  useEffect(() => {
    const fetchTask = async () => {
      const taskid = localStorage.getItem("taskid");
      if (!taskid) return;
      try {
        const res = await fetch(`/api/tasks/singletask/${taskid}`, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
        const data = await res.json();
        if (res.status !== 200) throw new Error(data.message);
        setTask(data);
        if (data.dueDate) setCalenderDate(new Date(data.dueDate));
      } catch (error: any) { showBox("error", "Load Failed", error.message); }
    };
    fetchTask();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const taskid = localStorage.getItem("taskid");
    if (!calenderdate || !taskid) return;
    const dueDate = calenderdate.toLocaleDateString("en-CA");
    try {
      const res = await fetch(`/api/tasks/edittask/${taskid}`, { method: "PUT", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ ...task, dueDate }) });
      const resdata = await res.json();
      if (res.status !== 200) throw new Error(resdata.message);
      showBox("success", "Task Updated", "Task details saved successfully.");
    } catch (error: any) { showBox("error", "Update Failed", error.message); }
  };

  const pageStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    boxSizing: "border-box",
    background: "radial-gradient(circle at top, rgba(0,255,140,0.10), transparent 28%), linear-gradient(135deg, #07110d 0%, #0b1d15 45%, #08110c 100%)",
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
    margin: 0, color: "#ffffff", fontSize: "34px", fontWeight: "800", textAlign: "center", letterSpacing: "0.4px",
  };

  const subtitleStyle: React.CSSProperties = {
    marginTop: "10px", marginBottom: "28px",
    color: "rgba(255,255,255,0.72)", textAlign: "center", fontSize: "15px", lineHeight: "1.7",
  };

  const dividerStyle: React.CSSProperties = {
    width: "80px", height: "4px", borderRadius: "999px",
    background: "linear-gradient(90deg, #00c853, #b7ffd5)", margin: "0 auto 26px",
  };

  const formStyle: React.CSSProperties = {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 18px",
  };

  const fullWidth: React.CSSProperties = { gridColumn: "1 / -1" };

  const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "8px" };

  const labelStyle: React.CSSProperties = {
    color: "#dffff0", fontSize: "14px", fontWeight: "700", letterSpacing: "0.3px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", height: "48px", borderRadius: "14px",
    border: "1px solid rgba(0,255,140,0.20)", background: "rgba(255,255,255,0.07)",
    color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "15px", boxSizing: "border-box",
  };

  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer", backgroundColor: "#0b1a12", colorScheme: "dark" };

  const textareaStyle: React.CSSProperties = {
    width: "100%", minHeight: "120px", borderRadius: "16px",
    border: "1px solid rgba(0,255,140,0.20)", background: "rgba(255,255,255,0.07)",
    color: "#ffffff", padding: "14px", outline: "none", fontSize: "15px",
    resize: "none", boxSizing: "border-box", lineHeight: "1.7",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%", height: "54px", borderRadius: "16px", border: "none",
    background: "linear-gradient(135deg, #00c853, #00e676)", color: "#08110c",
    fontSize: "16px", fontWeight: "800", cursor: "pointer",
    boxShadow: "0 14px 30px rgba(0, 200, 83, 0.28)", transition: "all 0.3s ease",
  };

  const boxOverlay: React.CSSProperties = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
  };

  const isError = messageBox.type === "error";

  const boxStyle: React.CSSProperties = {
    width: "min(430px, 90%)", padding: "22px", borderRadius: "24px",
    background: "linear-gradient(135deg, rgba(22,22,22,0.98), rgba(12,12,12,0.98))",
    border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.35)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.55)", display: "flex", alignItems: "center", gap: "15px", color: "#fff",
  };

  const boxIcon: React.CSSProperties = {
    minWidth: "52px", height: "52px", borderRadius: "18px",
    background: isError ? "rgba(255,77,79,0.14)" : "rgba(0,255,140,0.12)",
    border: isError ? "1px solid rgba(255,77,79,0.25)" : "1px solid rgba(0,255,140,0.22)",
    display: "flex", alignItems: "center", justifyContent: "center", color: isError ? "#ff6b6b" : "#60ff9c",
  };

  if (!task) return (
    <div style={pageStyle}>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px" }}>Loading task...</p>
    </div>
  );

  return (
    <div style={pageStyle}>
      {messageBox.show && (
        <div style={boxOverlay}>
          <div style={boxStyle}>
            <div style={boxIcon}>
              {isError ? <MdErrorOutline size={30} /> : <MdCheckCircleOutline size={30} />}
            </div>
            <div>
              <h3 style={{ margin: "0 0 5px", fontSize: "18px", fontWeight: "800" }}>{messageBox.title}</h3>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "rgba(255,255,255,0.72)" }}>{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
          <div style={{ width: "58px", height: "58px", borderRadius: "18px", background: "rgba(0,255,140,0.10)", border: "1px solid rgba(0,255,140,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#dffff0" }}>
            <TiPencil size={30} />
          </div>
        </div>

        <h2 style={titleStyle}>Edit Task</h2>
        <p style={subtitleStyle}>Update your task details below.</p>
        <div style={dividerStyle} />

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Task Title</label>
            <input type="text" required minLength={2} maxLength={25} style={inputStyle}
              value={task.title || ""}
              onChange={(e) => setTask((p: any) => ({ ...p, title: e.target.value }))} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Priority</label>
            <select style={selectStyle} value={task.priority || "low"}
              onChange={(e) => setTask((p: any) => ({ ...p, priority: e.target.value }))}>
              <option value="low" style={{ backgroundColor: "#0b1a12", color: "#ffffff" }}>Low Priority</option>
              <option value="med" style={{ backgroundColor: "#0b1a12", color: "#ffffff" }}>Medium Priority</option>
              <option value="high" style={{ backgroundColor: "#0b1a12", color: "#ffffff" }}>High Priority</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Due Date</label>
            <DatePicker
              placeholderText="Select due date"
              selected={calenderdate}
              dateFormat="yyyy-MM-dd"
              onChange={(d: Date | null) => setCalenderDate(d)}
              className="custom-dark-datepicker"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Start Hour</label>
              <input type="time" style={inputStyle}
                value={task.starthour || ""}
                onChange={(e) => setTask((p: any) => ({ ...p, starthour: e.target.value }))} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>End Hour</label>
              <input type="time" style={inputStyle}
                value={task.endhour || ""}
                onChange={(e) => setTask((p: any) => ({ ...p, endhour: e.target.value }))} />
            </div>
          </div>

          <div style={{ ...fieldStyle, ...fullWidth }}>
            <label style={labelStyle}>Description</label>
            <textarea required minLength={5} maxLength={200} style={textareaStyle}
              value={task.description || ""}
              onChange={(e) => setTask((p: any) => ({ ...p, description: e.target.value }))} />
          </div>

          <div style={fullWidth}>
            <button type="submit" style={buttonStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 18px 34px rgba(0, 200, 83, 0.35)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 14px 30px rgba(0, 200, 83, 0.28)";
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
