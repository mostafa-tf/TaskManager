import { useState, useEffect } from "react";
import { TaskStructure } from "../components/TaskStructure";
import { MdPendingActions, MdErrorOutline, MdCheckCircleOutline, MdDateRange, MdLowPriority } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const UnDoneTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [notasks, setNoTasks] = useState(false);
  const [titlefilter, setTitleFilter] = useState("");
  const [calenderdate, setCalenderDate] = useState<Date | null>(null);
  const [priorityfilter, setPriorityFilter] = useState("");
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });

  const showBox = (type: string, title: string, message: string) => setMessageBox({ show: true, type, title, message });

  useEffect(() => {
    if (messageBox.show) { const timer = setTimeout(() => setMessageBox({ show: false, type: "", title: "", message: "" }), 3000); return () => clearTimeout(timer); }
  }, [messageBox.show]);

  const filteredtasks = tasks.filter((task) => {
    const date = calenderdate ? calenderdate.toLocaleDateString("en-CA") : "";
    return task.title.startsWith(titlefilter) && task.dueDate.startsWith(date) && task.priority.startsWith(priorityfilter);
  });

  async function fetchundonetasks() {
    setNoTasks(false); setTasks([]);
    try {
      const res = await fetch("/api/tasks/undone", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      if (res.status === 404) setNoTasks(true);
      else if (res.status === 200) { const t = await res.json(); setTasks(t); }
    } catch (error: any) { showBox("error", "Error", error.message); }
  }

  useEffect(() => { fetchundonetasks(); }, []);

  const switchcheckbox = async (taskid: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskid}`, { method: "PUT", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` } });
      const msg = await res.json();
      if (res.status !== 200) throw new Error(msg.message);
      await fetchundonetasks();
    } catch (error: any) { showBox("error", "Error", error.message); }
  };

  const deletetask = async (taskid: string) => {
    try {
      const result = await fetch(`/api/tasks/${taskid}`, { method: "DELETE", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      if (result.status !== 200) { const data = await result.json(); throw new Error(data.message); }
      await fetchundonetasks();
    } catch (error: any) { showBox("error", "Error", "Failed " + error.message); }
  };

  const isError = messageBox.type === "error";
  const inputStyle: React.CSSProperties = { width: "100%", height: "46px", borderRadius: "14px", border: "1px solid rgba(0,255,140,0.16)", background: "rgba(255,255,255,0.07)", color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "14px", boxSizing: "border-box" };

  return (
    <div style={{ width: "100%", minHeight: "100%", boxSizing: "border-box" }}>
      {messageBox.show && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ width: "min(430px, 90%)", padding: "22px", borderRadius: "24px", background: "linear-gradient(135deg, rgba(22,22,22,0.98), rgba(12,12,12,0.98))", border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.35)", boxShadow: "0 24px 70px rgba(0,0,0,0.55)", display: "flex", alignItems: "center", gap: "15px", color: "#fff" }}>
            <div style={{ minWidth: "52px", height: "52px", borderRadius: "18px", background: isError ? "rgba(255,77,79,0.14)" : "rgba(0,255,140,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: isError ? "#ff6b6b" : "#60ff9c" }}>
              {isError ? <MdErrorOutline size={30} /> : <MdCheckCircleOutline size={30} />}
            </div>
            <div><h3 style={{ margin: "0 0 5px", fontSize: "18px", fontWeight: "800" }}>{messageBox.title}</h3><p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.72)" }}>{messageBox.message}</p></div>
          </div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(0,255,140,0.10)", border: "1px solid rgba(0,255,140,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#dffff0" }}><MdPendingActions size={26} /></div>
        <div><h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>Pending Tasks</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>Review all pending tasks and filter them by title, date, and priority.</p></div>
      </div>
      {notasks && <h1 style={{ textAlign: "center", color: "#60ff9c", fontSize: "34px", fontWeight: "800", margin: "34px 0" }}>No Available Tasks Found</h1>}
      <div style={{ marginBottom: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", padding: "20px", borderRadius: "20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,255,140,0.10)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}><label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#dffff0", fontSize: "14px", fontWeight: "700" }}><FaFilter />Search By Title</label><input type="text" value={titlefilter} onChange={(e) => setTitleFilter(e.target.value)} style={inputStyle} placeholder="Enter task title" /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}><label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#dffff0", fontSize: "14px", fontWeight: "700" }}><MdDateRange />Filter By Date</label><DatePicker placeholderText="Select date" selected={calenderdate} dateFormat="yyyy-MM-dd" onChange={(d) => setCalenderDate(d)} className="custom-dark-datepicker" /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}><label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#dffff0", fontSize: "14px", fontWeight: "700" }}><MdLowPriority />Filter By Priority</label><select value={priorityfilter} onChange={(e) => setPriorityFilter(e.target.value)} style={inputStyle}><option value="">Filter By Priority</option><option value="low">low</option><option value="med">medium</option><option value="high">high</option></select></div>
      </div>
      <div style={{ display: "grid", gap: "18px" }}>
        {filteredtasks.map((task) => (
          <TaskStructure key={task._id} title={task.title} description={task.description} priority={task.priority} completed={task.isDone} isexpired={task.dueDate} completedat={task.completedAt} deletefun={() => deletetask(task._id)} onChange={() => switchcheckbox(task._id)} taskid={task._id} starthour={task.starthour} endhour={task.endhour} />
        ))}
      </div>
    </div>
  );
};
