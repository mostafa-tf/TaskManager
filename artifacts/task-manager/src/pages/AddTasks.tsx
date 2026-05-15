import { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const AddTasks = () => {
  const [data, setData] = useState({ title: "", description: "", priority: "low", dueDate: "", starthour: "", endhour: "" });
  const [calenderdate, setCalenderDate] = useState<Date | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calenderdate) { showMsg("Please select a due date", true); return; }
    const dueDate = calenderdate.toLocaleDateString("en-CA");
    try {
      const res = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ ...data, dueDate }) });
      const resdata = await res.json();
      if (res.status !== 201) throw new Error(resdata.message);
      showMsg("Task added successfully!", false);
      setData({ title: "", description: "", priority: "low", dueDate: "", starthour: "", endhour: "" });
      setCalenderDate(null);
    } catch (error: any) { showMsg(error.message, true); }
  };

  const inputStyle: React.CSSProperties = { width: "100%", height: "48px", borderRadius: "14px", border: "1px solid rgba(0,255,128,0.20)", background: "rgba(255,255,255,0.07)", color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "15px", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", color: "#caffdf", marginBottom: "8px", fontSize: "14px", fontWeight: "700" };
  const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", marginBottom: "20px" };
  const buttonStyle: React.CSSProperties = { width: "100%", height: "50px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #00c853, #00e676)", color: "#08110c", fontSize: "16px", fontWeight: "800", cursor: "pointer", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" };

  return (
    <div style={{ width: "100%", minHeight: "100%", boxSizing: "border-box" }}>
      {message && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ padding: "22px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.30)", color: isError ? "#ff9c9c" : "#60ff9c", fontWeight: "700", fontSize: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            {message}
          </div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(0,255,140,0.10)", border: "1px solid rgba(0,255,140,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#dffff0" }}><IoIosAddCircle size={28} /></div>
        <div><h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>Add New Task</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>Create a task and stay on top of your goals.</p></div>
      </div>
      <div style={{ maxWidth: "600px", padding: "32px", borderRadius: "24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.12)", boxShadow: "0 18px 50px rgba(0,0,0,0.30)" }}>
        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}><label style={labelStyle}>Title</label><input type="text" required minLength={2} maxLength={25} style={inputStyle} value={data.title} onChange={(e) => setData(p => ({ ...p, title: e.target.value }))} placeholder="Task title" /></div>
          <div style={fieldStyle}><label style={labelStyle}>Description</label><textarea required minLength={5} maxLength={200} style={{ ...inputStyle, height: "80px", padding: "10px 14px", resize: "vertical" }} value={data.description} onChange={(e) => setData(p => ({ ...p, description: e.target.value }))} placeholder="Task description" /></div>
          <div style={fieldStyle}><label style={labelStyle}>Priority</label><select style={inputStyle} value={data.priority} onChange={(e) => setData(p => ({ ...p, priority: e.target.value }))}><option value="low">Low</option><option value="med">Medium</option><option value="high">High</option></select></div>
          <div style={fieldStyle}><label style={labelStyle}>Due Date</label><DatePicker placeholderText="Select due date" selected={calenderdate} dateFormat="yyyy-MM-dd" onChange={(d) => setCalenderDate(d)} className="custom-dark-datepicker" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={fieldStyle}><label style={labelStyle}>Start Hour</label><input type="time" style={inputStyle} value={data.starthour} onChange={(e) => setData(p => ({ ...p, starthour: e.target.value }))} required /></div>
            <div style={fieldStyle}><label style={labelStyle}>End Hour</label><input type="time" style={inputStyle} value={data.endhour} onChange={(e) => setData(p => ({ ...p, endhour: e.target.value }))} required /></div>
          </div>
          <button type="submit" style={buttonStyle}><IoIosAddCircle size={20} />Add Task</button>
        </form>
      </div>
    </div>
  );
};
