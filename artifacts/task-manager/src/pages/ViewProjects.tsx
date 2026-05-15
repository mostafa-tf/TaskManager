import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaProjectDiagram, FaArrowLeft } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export const ViewProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [noProjects, setNoProjects] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const fetchProjects = async () => {
    setNoProjects(false); setProjects([]);
    try {
      const res = await fetch("/api/projects", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status === 404) setNoProjects(true);
      else if (res.status === 200) setProjects(data);
      else throw new Error(data.message);
    } catch (error: any) { showMsg(error.message, true); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const deleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("Project deleted!", false); await fetchProjects();
    } catch (error: any) { showMsg(error.message, true); }
  };

  const cardStyle: React.CSSProperties = { padding: "20px 24px", borderRadius: "18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.10)", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #07110d 0%, #0b1d15 50%, #08110c 100%)", padding: "30px" }}>
      {message && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}><div style={{ padding: "22px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.30)", color: isError ? "#ff9c9c" : "#60ff9c", fontWeight: "700", fontSize: "16px" }}>{message}</div></div>}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
        <button onClick={() => navigate("/projects")} style={{ width: "46px", height: "46px", borderRadius: "14px", border: "1px solid rgba(0,255,140,0.2)", background: "rgba(0,255,140,0.08)", color: "#dffff0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaArrowLeft size={18} /></button>
        <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(0,255,140,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: "#dffff0" }}><FaProjectDiagram size={24} /></div>
        <div><h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>My Projects</h2></div>
      </div>
      {noProjects && <h2 style={{ color: "#60ff9c", fontWeight: "800" }}>No Projects Found</h2>}
      {projects.map((p) => (
        <div style={cardStyle} key={p._id}>
          <div>
            <h3 style={{ margin: "0 0 4px", color: "#ffffff", fontSize: "18px", fontWeight: "800" }}>{p.title}</h3>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.60)", fontSize: "13px" }}>{p.description}</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <NavLink to={`${p._id}`} style={{ height: "36px", padding: "0 14px", borderRadius: "10px", background: "linear-gradient(135deg,#1565c0,#1e88e5)", color: "#fff", fontSize: "13px", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center" }}>View</NavLink>
            <button onClick={() => deleteProject(p._id)} style={{ height: "36px", width: "40px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#c62828,#e53935)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><MdDelete size={18} /></button>
          </div>
        </div>
      ))}
    </div>
  );
};
