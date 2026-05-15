import { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export const ViewProject = () => {
  const { projectid } = useParams();
  const [project, setProject] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const navigate = useNavigate();

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectid}`, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      setProject(data);
    } catch (error: any) { showMsg(error.message, true); }
  };

  useEffect(() => { fetchProject(); }, [projectid]);

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/projects/${projectid}/members`, { method: "POST", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ email: addEmail }) });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("Member added!", false); setAddEmail(""); await fetchProject();
    } catch (error: any) { showMsg(error.message, true); }
  };

  const removeMember = async (memberid: string) => {
    try {
      const res = await fetch(`/api/projects/${projectid}/members/${memberid}`, { method: "DELETE", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("Member removed!", false); await fetchProject();
    } catch (error: any) { showMsg(error.message, true); }
  };

  const inputStyle: React.CSSProperties = { height: "44px", borderRadius: "12px", border: "1px solid rgba(0,255,128,0.20)", background: "rgba(255,255,255,0.07)", color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "15px", flex: 1 };
  const cardStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", padding: "14px 18px", borderRadius: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.08)", marginBottom: "10px" };

  if (!project) return <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #07110d 0%, #0b1d15 50%, #08110c 100%)", padding: "30px", color: "#fff" }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #07110d 0%, #0b1d15 50%, #08110c 100%)", padding: "30px" }}>
      {message && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}><div style={{ padding: "22px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.30)", color: isError ? "#ff9c9c" : "#60ff9c", fontWeight: "700", fontSize: "16px" }}>{message}</div></div>}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
        <button onClick={() => navigate("/projects/viewprojects")} style={{ width: "46px", height: "46px", borderRadius: "14px", border: "1px solid rgba(0,255,140,0.2)", background: "rgba(0,255,140,0.08)", color: "#dffff0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaArrowLeft size={18} /></button>
        <div><h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>{project.title}</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>{project.description}</p></div>
      </div>
      <div style={{ maxWidth: "600px" }}>
        <h3 style={{ color: "#dffff0", fontWeight: "800", marginBottom: "16px" }}>Members</h3>
        <form onSubmit={addMember} style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
          <input type="email" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} style={inputStyle} placeholder="Add member by email" />
          <button type="submit" style={{ height: "44px", padding: "0 18px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #00c853, #00e676)", color: "#08110c", fontWeight: "800", cursor: "pointer" }}>Add</button>
        </form>
        {(project.members || []).map((m: any) => (
          <div style={cardStyle} key={m._id}>
            <div>
              <p style={{ margin: 0, color: "#fff", fontWeight: "700" }}>{m.username}</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>{m.email}</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <NavLink to={`/projects/projectmember/${m._id}`} style={{ height: "36px", padding: "0 12px", borderRadius: "10px", background: "linear-gradient(135deg,#1565c0,#1e88e5)", color: "#fff", fontSize: "13px", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center" }}>View Tasks</NavLink>
              <button onClick={() => removeMember(m._id)} style={{ width: "36px", height: "36px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#c62828,#e53935)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><MdDelete size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
