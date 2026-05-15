import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { TaskStructure } from "../components/TaskStructure";

export const MemberPage = () => {
  const { memberid } = useParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [noTasks, setNoTasks] = useState(false);
  const [memberName, setMemberName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemberTasks = async () => {
      try {
        const res = await fetch(`/api/tasks/membertasks/${memberid}`, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
        const data = await res.json();
        if (res.status === 404) setNoTasks(true);
        else if (res.status === 200) { setTasks(data.tasks || data); setMemberName(data.username || ""); }
      } catch { /* silent */ }
    };
    fetchMemberTasks();
  }, [memberid]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #07110d 0%, #0b1d15 50%, #08110c 100%)", padding: "30px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "46px", height: "46px", borderRadius: "14px", border: "1px solid rgba(0,255,140,0.2)", background: "rgba(0,255,140,0.08)", color: "#dffff0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaArrowLeft size={18} /></button>
        <div><h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>{memberName ? `${memberName}'s Tasks` : "Member Tasks"}</h2></div>
      </div>
      {noTasks && <h2 style={{ color: "#60ff9c", fontWeight: "800" }}>No Tasks Found</h2>}
      <div style={{ display: "grid", gap: "18px" }}>
        {tasks.map((task) => (
          <TaskStructure key={task._id} title={task.title} description={task.description} priority={task.priority} completed={task.isDone} isexpired={task.dueDate} completedat={task.completedAt} deletefun={() => {}} onChange={() => {}} taskid={task._id} starthour={task.starthour} endhour={task.endhour} />
        ))}
      </div>
    </div>
  );
};
