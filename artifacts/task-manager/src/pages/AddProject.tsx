import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export const AddProject = () => {
  const [data, setData] = useState({ title: "", description: "", memberEmail: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify(data) });
      const resdata = await res.json();
      if (res.status !== 201) throw new Error(resdata.message);
      showMsg("Project created!", false);
      setData({ title: "", description: "", memberEmail: "" });
    } catch (error: any) { showMsg(error.message, true); }
  };

  const inputStyle: React.CSSProperties = { width: "100%", height: "48px", borderRadius: "14px", border: "1px solid rgba(0,255,128,0.20)", background: "rgba(255,255,255,0.07)", color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "15px", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", color: "#caffdf", marginBottom: "8px", fontSize: "14px", fontWeight: "700" };
  const fieldStyle: React.CSSProperties = { marginBottom: "20px" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #07110d 0%, #0b1d15 50%, #08110c 100%)", padding: "30px" }}>
      {message && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}><div style={{ padding: "22px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.30)", color: isError ? "#ff9c9c" : "#60ff9c", fontWeight: "700", fontSize: "16px" }}>{message}</div></div>}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
        <button onClick={() => navigate("/projects")} style={{ width: "46px", height: "46px", borderRadius: "14px", border: "1px solid rgba(0,255,140,0.2)", background: "rgba(0,255,140,0.08)", color: "#dffff0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaArrowLeft size={18} /></button>
        <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>Create Project</h2>
      </div>
      <div style={{ maxWidth: "500px", padding: "32px", borderRadius: "24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.12)" }}>
        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}><label style={labelStyle}>Project Title</label><input type="text" required minLength={2} maxLength={50} style={inputStyle} value={data.title} onChange={(e) => setData(p => ({ ...p, title: e.target.value }))} placeholder="Project title" /></div>
          <div style={fieldStyle}><label style={labelStyle}>Description</label><textarea required style={{ ...inputStyle, height: "80px", padding: "10px 14px", resize: "vertical" }} value={data.description} onChange={(e) => setData(p => ({ ...p, description: e.target.value }))} placeholder="Describe the project" /></div>
          <div style={fieldStyle}><label style={labelStyle}>Member Email</label><input type="email" style={inputStyle} value={data.memberEmail} onChange={(e) => setData(p => ({ ...p, memberEmail: e.target.value }))} placeholder="Add a member by email (optional)" /></div>
          <button type="submit" style={{ width: "100%", height: "50px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #00c853, #00e676)", color: "#08110c", fontSize: "16px", fontWeight: "800", cursor: "pointer" }}>Create Project</button>
        </form>
      </div>
    </div>
  );
};
