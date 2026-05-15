import { useState, useEffect } from "react";
import { IoPersonSharp } from "react-icons/io5";

export const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [updated, setUpdated] = useState<any>({});
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
        const data = await res.json();
        if (res.status !== 200) throw new Error(data.message);
        setUser(data); setUpdated(data);
      } catch (error: any) { showMsg(error.message, true); }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await fetch("/api/users/profile", { method: "PUT", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify(updated) });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      setUser(data); setEditing(false); showMsg("Profile updated!", false);
    } catch (error: any) { showMsg(error.message, true); }
  };

  const inputStyle: React.CSSProperties = { width: "100%", height: "46px", borderRadius: "12px", border: "1px solid rgba(0,255,128,0.20)", background: "rgba(255,255,255,0.07)", color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "15px", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", color: "#caffdf", marginBottom: "6px", fontSize: "13px", fontWeight: "700" };
  const fieldStyle: React.CSSProperties = { marginBottom: "16px" };
  const buttonStyle = (col: string): React.CSSProperties => ({ height: "46px", padding: "0 24px", borderRadius: "12px", border: "none", background: col, color: "#ffffff", fontSize: "15px", fontWeight: "700", cursor: "pointer" });

  if (!user) return <p style={{ color: "#fff" }}>Loading profile...</p>;

  return (
    <div style={{ width: "100%", minHeight: "100%", boxSizing: "border-box" }}>
      {message && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ padding: "22px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.30)", color: isError ? "#ff9c9c" : "#60ff9c", fontWeight: "700", fontSize: "16px" }}>{message}</div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(0,255,140,0.10)", border: "1px solid rgba(0,255,140,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#dffff0" }}><IoPersonSharp size={26} /></div>
        <div><h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>Profile</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>Manage your account information.</p></div>
      </div>
      <div style={{ maxWidth: "500px", padding: "32px", borderRadius: "24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.12)" }}>
        <div style={fieldStyle}><label style={labelStyle}>Username</label><input type="text" style={inputStyle} disabled={!editing} value={updated.username || ""} onChange={(e) => setUpdated((p: any) => ({ ...p, username: e.target.value }))} /></div>
        <div style={fieldStyle}><label style={labelStyle}>Email</label><input type="email" style={inputStyle} disabled={!editing} value={updated.email || ""} onChange={(e) => setUpdated((p: any) => ({ ...p, email: e.target.value }))} /></div>
        <div style={fieldStyle}><label style={labelStyle}>Phone</label><input type="text" style={inputStyle} disabled={!editing} value={updated.phone || ""} onChange={(e) => setUpdated((p: any) => ({ ...p, phone: e.target.value }))} /></div>
        <div style={fieldStyle}><label style={labelStyle}>Location</label><input type="text" style={inputStyle} disabled={!editing} value={updated.location || ""} onChange={(e) => setUpdated((p: any) => ({ ...p, location: e.target.value }))} /></div>
        <div style={fieldStyle}><label style={labelStyle}>Bio</label><textarea style={{ ...inputStyle, height: "70px", padding: "10px 14px", resize: "vertical" }} disabled={!editing} value={updated.bio || ""} onChange={(e) => setUpdated((p: any) => ({ ...p, bio: e.target.value }))} /></div>
        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          {!editing
            ? <button style={buttonStyle("linear-gradient(135deg,#1565c0,#1e88e5)")} onClick={() => setEditing(true)}>Edit Profile</button>
            : <>
              <button style={buttonStyle("linear-gradient(135deg,#00c853,#00e676)")} onClick={handleUpdate}>Save Changes</button>
              <button style={buttonStyle("rgba(255,255,255,0.12)")} onClick={() => { setEditing(false); setUpdated(user); }}>Cancel</button>
            </>
          }
        </div>
      </div>
    </div>
  );
};
