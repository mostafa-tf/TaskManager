import { useState, useEffect } from "react";
import { TaskStructure } from "../components/TaskStructure";
import { RiTaskLine } from "react-icons/ri";
import { FaFilter } from "react-icons/fa";
import { MdDateRange, MdLowPriority, MdErrorOutline } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const AllTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [notasks, setNoTasks] = useState(false);
  const [titlefilter, setTitleFilter] = useState("");
  const [calenderdate, setCalenderDate] = useState<Date | null>(null);
  const [priorityfilter, setPriorityFilter] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const showError = (message: string) => setErrorMsg(message || "Error From Server");

  useEffect(() => {
    if (errorMsg) { const timer = setTimeout(() => setErrorMsg(""), 3000); return () => clearTimeout(timer); }
  }, [errorMsg]);

  const filteredtasks = tasks.filter((task) => {
    const date = calenderdate ? calenderdate.toLocaleDateString("en-CA") : "";
    return task.title.startsWith(titlefilter) && task.dueDate.startsWith(date) && task.priority.startsWith(priorityfilter);
  });

  async function fetchalltasks() {
    setNoTasks(false); setTasks([]);
    try {
      const res = await fetch("/api/tasks", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      if (res.status === 404) { setNoTasks(true); }
      else if (res.status === 500) { throw new Error("Error From Server"); }
      else if (res.status === 200) { const tasksobj = await res.json(); setTasks(tasksobj); }
    } catch (error: any) { showError(error.message); }
  }

  useEffect(() => { fetchalltasks(); }, []);

  const switchcheckbox = async (taskid: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskid}`, { method: "PUT", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` } });
      const msg = await res.json();
      if (res.status !== 200) throw new Error(msg.message || "Error From Server");
      await fetchalltasks();
    } catch (error: any) { showError(error.message); }
  };

  const deletetask = async (taskid: string) => {
    try {
      const result = await fetch(`/api/tasks/${taskid}`, { method: "DELETE", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      if (result.status !== 200) { const data = await result.json(); throw new Error(data.message); }
      await fetchalltasks();
    } catch (error: any) { showError("Failed " + error.message); }
  };

  const pageStyle: React.CSSProperties = { width: "100%", minHeight: "100%", boxSizing: "border-box" };
  const headerStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", flexWrap: "wrap", marginBottom: "24px" };
  const titleWrap: React.CSSProperties = { display: "flex", alignItems: "center", gap: "12px" };
  const iconWrap: React.CSSProperties = { width: "52px", height: "52px", borderRadius: "16px", background: "rgba(0,255,140,0.10)", border: "1px solid rgba(0,255,140,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#dffff0" };
  const titleStyle: React.CSSProperties = { margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" };
  const subtitleStyle: React.CSSProperties = { margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "14px" };
  const filterdiv: React.CSSProperties = { marginBottom: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", padding: "20px", borderRadius: "20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,255,140,0.10)" };
  const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "8px" };
  const labelStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "8px", color: "#dffff0", fontSize: "14px", fontWeight: "700", letterSpacing: "0.2px" };
  const inputStyle: React.CSSProperties = { width: "100%", height: "46px", borderRadius: "14px", border: "1px solid rgba(0,255,140,0.16)", background: "rgba(255,255,255,0.07)", color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "14px", boxSizing: "border-box" };
  const tasksWrapper: React.CSSProperties = { display: "grid", gap: "18px" };
  const emptyState: React.CSSProperties = { textAlign: "center", color: "#60ff9c", fontSize: "34px", fontWeight: "800", margin: "34px 0" };
  const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 };
  const alertBox: React.CSSProperties = { width: "min(420px, 90%)", padding: "22px 24px", borderRadius: "22px", background: "linear-gradient(135deg, rgba(40,20,20,0.98), rgba(20,20,20,0.98))", border: "1px solid rgba(255,77,79,0.45)", boxShadow: "0 24px 60px rgba(0,0,0,0.55)", color: "#ffffff", display: "flex", alignItems: "center", gap: "14px" };
  const alertIconWrap: React.CSSProperties = { minWidth: "48px", height: "48px", borderRadius: "16px", background: "rgba(255,77,79,0.14)", border: "1px solid rgba(255,77,79,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ff6b6b" };

  return (
    <div style={pageStyle}>
      {errorMsg && (
        <div style={overlayStyle}>
          <div style={alertBox}>
            <div style={alertIconWrap}><MdErrorOutline size={28} /></div>
            <div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "17px", fontWeight: "800" }}>Something went wrong</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: "1.5" }}>{errorMsg}</p>
            </div>
          </div>
        </div>
      )}
      <div style={headerStyle}>
        <div style={titleWrap}>
          <div style={iconWrap}><RiTaskLine size={26} /></div>
          <div><h2 style={titleStyle}>All Tasks</h2><p style={subtitleStyle}>View, filter, complete, and manage all your tasks in one place.</p></div>
        </div>
      </div>
      {notasks && <h1 style={emptyState}>No Tasks Found</h1>}
      <div style={filterdiv}>
        <div style={fieldStyle}>
          <label style={labelStyle}><FaFilter />Search By Title</label>
          <input type="text" value={titlefilter} onChange={(e) => setTitleFilter(e.target.value)} style={inputStyle} placeholder="Enter task title" />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}><MdDateRange />Filter By Date</label>
          <DatePicker placeholderText="Select date" selected={calenderdate} dateFormat="yyyy-MM-dd" onChange={(d) => setCalenderDate(d)} className="custom-dark-datepicker" />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}><MdLowPriority />Filter By Priority</label>
          <select value={priorityfilter} onChange={(e) => setPriorityFilter(e.target.value)} style={inputStyle}>
            <option value="">Filter By Priority</option>
            <option value="low">low</option>
            <option value="med">medium</option>
            <option value="high">high</option>
          </select>
        </div>
      </div>
      <div style={tasksWrapper}>
        {filteredtasks.map((task) => (
          <TaskStructure key={task._id} title={task.title} description={task.description} priority={task.priority} completed={task.isDone} isexpired={task.dueDate} completedat={task.completedAt} deletefun={() => deletetask(task._id)} onChange={() => switchcheckbox(task._id)} taskid={task._id} starthour={task.starthour} endhour={task.endhour} />
        ))}
      </div>
    </div>
  );
};
