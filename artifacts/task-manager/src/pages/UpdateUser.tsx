import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export const UpdateUser = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/updaterole", { method: "PUT", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ email, role }) });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("User role updated successfully!", false);
    } catch (error: any) { showMsg(error.message, true); }
  };

  const inputStyle: React.CSSProperties = { width: "100%", height: "48px", borderRadius: "14px", border: "1px solid rgba(0,255,128,0.20)", background: "rgba(255,255,255,0.07)", color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "15px", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", color: "#caffdf", marginBottom: "8px", fontSize: "14px", fontWeight: "700" };
  const fieldStyle: React.CSSProperties = { marginBottom: "20px" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #07110d 0%, #0b1d15 50%, #08110c 100%)", padding: "30px" }}>
      {message && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ padding: "22px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.30)", color: isError ? "#ff9c9c" : "#60ff9c", fontWeight: "700", fontSize: "16px" }}>{message}</div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
        <button onClick={() => navigate("/admindashboard")} style={{ width: "46px", height: "46px", borderRadius: "14px", border: "1px solid rgba(0,255,140,0.2)", background: "rgba(0,255,140,0.08)", color: "#dffff0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaArrowLeft size={18} /></button>
        <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>Update User Role</h2>
      </div>
      <div style={{ maxWidth: "460px", padding: "32px", borderRadius: "24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.12)" }}>
        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}><label style={labelStyle}>User Email</label><input type="email" required style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter user email" /></div>
          <div style={fieldStyle}><label style={labelStyle}>New Role</label><select style={inputStyle} value={role} onChange={(e) => setRole(e.target.value)}><option value="user">User</option><option value="admin">Admin</option></select></div>
          <button type="submit" style={{ width: "100%", height: "50px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #00c853, #00e676)", color: "#08110c", fontSize: "16px", fontWeight: "800", cursor: "pointer" }}>Update Role</button>
        </form>
      </div>
    </div>
  );
};
