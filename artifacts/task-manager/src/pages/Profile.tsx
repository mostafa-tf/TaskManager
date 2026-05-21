import { useState, useEffect } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { MdCheckCircleOutline, MdErrorOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

export const Profile = () => {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [updated, setUpdated] = useState<{ username: string; email: string }>({ username: "", email: "" });
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });

  const [showChangePw, setShowChangePw] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);

  const showBox = (type: string, title: string, message: string) => {
    setMessageBox({ show: true, type, title, message });
    setTimeout(() => setMessageBox({ show: false, type: "", title: "", message: "" }), 4000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
        const data = await res.json();
        if (res.status !== 200) throw new Error(data.message);
        const profile = { username: data.username, email: data.email };
        setUser(profile); setUpdated(profile);
      } catch (error: any) { showBox("error", "Error", error.message); }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await fetch("/api/users/profile", { method: "PUT", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ username: updated.username, email: updated.email }) });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      const profile = { username: data.username, email: data.email };
      setUser(profile); setEditing(false); showBox("success", "Profile Updated", "Your profile has been saved successfully.");
    } catch (error: any) { showBox("error", "Update Failed", error.message); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showBox("error", "Mismatch", "New password and confirmation do not match."); return;
    }
    setPwLoading(true);
    try {
      const res = await fetch("/api/users/changepassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showBox("success", "Password Changed", "Your password was updated. A confirmation email has been sent.");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowChangePw(false);
    } catch (error: any) {
      showBox("error", "Failed", error.message);
    } finally {
      setPwLoading(false);
    }
  };

  const isError = messageBox.type === "error";

  const pageStyle: React.CSSProperties = {
    width: "100%", minHeight: "100%", display: "flex", flexDirection: "column",
    justifyContent: "center", alignItems: "center", padding: "40px 20px", boxSizing: "border-box",
    background: "radial-gradient(circle at top, rgba(0,255,140,0.08), transparent 28%), linear-gradient(135deg, #07110d 0%, #0b1d15 45%, #08110c 100%)",
    gap: "18px",
  };

  const cardStyle: React.CSSProperties = {
    width: "100%", maxWidth: "480px", borderRadius: "30px",
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(0,255,140,0.16)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.42)", backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)", padding: "36px 32px", boxSizing: "border-box",
  };

  const pwCardStyle: React.CSSProperties = {
    width: "100%", maxWidth: "480px", borderRadius: "24px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(100,160,255,0.18)",
    boxShadow: "0 14px 40px rgba(0,0,0,0.32)", backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)", padding: "28px 32px", boxSizing: "border-box",
  };

  const avatarStyle: React.CSSProperties = {
    width: "76px", height: "76px", borderRadius: "50%",
    background: "rgba(0,255,140,0.12)", border: "2px solid rgba(0,255,140,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 16px", color: "#dffff0",
  };

  const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" };
  const labelStyle: React.CSSProperties = { color: "#dffff0", fontSize: "13px", fontWeight: "700", letterSpacing: "0.3px" };

  const inputStyle = (disabled: boolean): React.CSSProperties => ({
    width: "100%", height: "48px", borderRadius: "14px",
    border: disabled ? "1px solid rgba(0,255,140,0.10)" : "1px solid rgba(0,255,140,0.25)",
    background: disabled ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)",
    color: disabled ? "rgba(255,255,255,0.5)" : "#ffffff",
    padding: "0 14px", outline: "none", fontSize: "15px", boxSizing: "border-box",
    cursor: disabled ? "not-allowed" : "text", transition: "all 0.2s ease",
  });

  const pwInputStyle: React.CSSProperties = {
    width: "100%", height: "48px", borderRadius: "14px",
    border: "1px solid rgba(100,160,255,0.22)", background: "rgba(255,255,255,0.07)",
    color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "15px", boxSizing: "border-box",
  };

  const boxOverlay: React.CSSProperties = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
  };

  const boxStyle: React.CSSProperties = {
    width: "min(420px, 90%)", padding: "22px", borderRadius: "24px",
    background: "linear-gradient(135deg, rgba(22,22,22,0.98), rgba(12,12,12,0.98))",
    border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.35)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.55)", display: "flex", alignItems: "center", gap: "15px", color: "#fff",
  };

  if (!user) return (
    <div style={pageStyle}>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px" }}>Loading profile...</p>
    </div>
  );

  return (
    <div style={pageStyle}>
      {messageBox.show && (
        <div style={boxOverlay}>
          <div style={boxStyle}>
            <div style={{ minWidth: "52px", height: "52px", borderRadius: "18px", background: isError ? "rgba(255,77,79,0.14)" : "rgba(0,255,140,0.12)", border: isError ? "1px solid rgba(255,77,79,0.25)" : "1px solid rgba(0,255,140,0.22)", display: "flex", alignItems: "center", justifyContent: "center", color: isError ? "#ff6b6b" : "#60ff9c" }}>
              {isError ? <MdErrorOutline size={28} /> : <MdCheckCircleOutline size={28} />}
            </div>
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: "800" }}>{messageBox.title}</h3>
              <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div style={cardStyle}>
        <div style={avatarStyle}><IoPersonSharp size={34} /></div>
        <h2 style={{ margin: 0, color: "#ffffff", fontSize: "26px", fontWeight: "800", textAlign: "center" }}>{user.username}</h2>
        <p style={{ margin: "8px 0 28px", color: "rgba(255,255,255,0.6)", fontSize: "14px", textAlign: "center" }}>{user.email}</p>
        <div style={{ width: "60px", height: "3px", borderRadius: "999px", background: "linear-gradient(90deg, #00c853, #b7ffd5)", margin: "0 auto 28px" }} />

        <div style={fieldStyle}>
          <label style={labelStyle}>Username</label>
          <input type="text" disabled={!editing} value={updated.username}
            onChange={(e) => setUpdated((p) => ({ ...p, username: e.target.value }))}
            style={inputStyle(!editing)} />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Email</label>
          <input type="email" disabled={!editing} value={updated.email}
            onChange={(e) => setUpdated((p) => ({ ...p, email: e.target.value }))}
            style={inputStyle(!editing)} />
        </div>

        <div style={{ marginTop: "8px" }}>
          {!editing
            ? <button style={{ width: "100%", height: "48px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #1565c0, #1e88e5)", color: "#ffffff", fontSize: "15px", fontWeight: "800", cursor: "pointer" }} onClick={() => setEditing(true)}>Edit Profile</button>
            : <div style={{ display: "flex", gap: "12px" }}>
              <button style={{ flex: 1, height: "48px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(255,255,255,0.7)", fontSize: "15px", fontWeight: "700", cursor: "pointer" }} onClick={() => { setEditing(false); setUpdated(user!); }}>Cancel</button>
              <button style={{ flex: 1, height: "48px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #00c853, #00e676)", color: "#08110c", fontSize: "15px", fontWeight: "800", cursor: "pointer" }} onClick={handleUpdate}>Save Changes</button>
            </div>
          }
        </div>
      </div>

      {/* Change Password Card */}
      <div style={pwCardStyle}>
        <button
          onClick={() => setShowChangePw((v) => !v)}
          style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: 0 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: "rgba(100,160,255,0.12)", border: "1px solid rgba(100,160,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", color: "#90caf9" }}>
              <RiLockPasswordLine size={18} />
            </div>
            <span style={{ color: "#ffffff", fontSize: "16px", fontWeight: "800" }}>Change Password</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "20px", fontWeight: "300", lineHeight: 1 }}>{showChangePw ? "−" : "+"}</span>
        </button>

        {showChangePw && (
          <form onSubmit={handleChangePassword} style={{ marginTop: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={fieldStyle}>
              <label style={{ ...labelStyle, color: "#a8c8ff" }}>Current Password</label>
              <input
                type="password"
                placeholder="Enter your current password"
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                style={pwInputStyle}
                required
              />
            </div>
            <div style={fieldStyle}>
              <label style={{ ...labelStyle, color: "#a8c8ff" }}>New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                style={pwInputStyle}
                required
                minLength={6}
              />
            </div>
            <div style={{ ...fieldStyle, marginBottom: 0 }}>
              <label style={{ ...labelStyle, color: "#a8c8ff" }}>Confirm New Password</label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                style={pwInputStyle}
                required
              />
            </div>
            <button
              type="submit"
              disabled={pwLoading}
              style={{ marginTop: "6px", height: "48px", borderRadius: "14px", border: "none", background: pwLoading ? "rgba(100,160,255,0.25)" : "linear-gradient(135deg, #1565c0, #42a5f5)", color: pwLoading ? "rgba(255,255,255,0.4)" : "#ffffff", fontSize: "15px", fontWeight: "800", cursor: pwLoading ? "not-allowed" : "pointer" }}
            >
              {pwLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
