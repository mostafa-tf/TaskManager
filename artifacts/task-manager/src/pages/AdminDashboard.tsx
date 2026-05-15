import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaArrowLeft } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [noUsers, setNoUsers] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const fetchUsers = async () => {
    setNoUsers(false); setUsers([]);
    try {
      const res = await fetch("/api/users/allusers", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status === 404) setNoUsers(true);
      else if (res.status === 200) setUsers(data);
      else throw new Error(data.message);
    } catch (error: any) { showMsg(error.message, true); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async (userid: string) => {
    try {
      const res = await fetch(`/api/users/${userid}`, { method: "DELETE", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("User deleted successfully!", false); await fetchUsers();
    } catch (error: any) { showMsg(error.message, true); }
  };

  const rowStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 100px", gap: "12px", alignItems: "center", padding: "16px 20px", borderRadius: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,255,140,0.08)", marginBottom: "10px" };
  const cellStyle: React.CSSProperties = { color: "rgba(255,255,255,0.9)", fontSize: "14px", fontWeight: "600", wordBreak: "break-all" };
  const headerRowStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 100px", gap: "12px", padding: "10px 20px", marginBottom: "8px" };
  const headerCell: React.CSSProperties = { color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.8px" };
  const actionsBtns: React.CSSProperties = { display: "flex", gap: "8px", flexWrap: "wrap" };
  const btn = (col: string): React.CSSProperties => ({ height: "36px", padding: "0 12px", borderRadius: "10px", border: "none", background: col, color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #07110d 0%, #0b1d15 50%, #08110c 100%)", padding: "30px" }}>
      {message && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ padding: "22px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.30)", color: isError ? "#ff9c9c" : "#60ff9c", fontWeight: "700", fontSize: "16px" }}>{message}</div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
        <button onClick={() => navigate("/dashboard")} style={{ width: "46px", height: "46px", borderRadius: "14px", border: "1px solid rgba(0,255,140,0.2)", background: "rgba(0,255,140,0.08)", color: "#dffff0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaArrowLeft size={18} /></button>
        <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(0,255,140,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: "#dffff0" }}><FaUsers size={26} /></div>
        <div>
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>Admin Dashboard</h2>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>Manage all users and their accounts.</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "12px" }}>
          <button style={btn("linear-gradient(135deg,#1565c0,#1e88e5)")} onClick={() => navigate("feedbacks")}>View Feedbacks</button>
          <button style={btn("linear-gradient(135deg,#00c853,#00e676)")} onClick={() => navigate("updateuser")}>Update User</button>
        </div>
      </div>
      {noUsers && <h1 style={{ color: "#60ff9c", textAlign: "center", fontSize: "30px", fontWeight: "800" }}>No Users Found</h1>}
      {users.length > 0 && (
        <div style={{ borderRadius: "20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,255,140,0.10)", padding: "16px" }}>
          <div style={headerRowStyle}>
            <span style={headerCell}>Username</span>
            <span style={headerCell}>Email</span>
            <span style={headerCell}>Role</span>
            <span style={headerCell}>Actions</span>
          </div>
          {users.map((user) => (
            <div style={rowStyle} key={user._id}>
              <span style={cellStyle}>{user.username}</span>
              <span style={cellStyle}>{user.email}</span>
              <span style={{ ...cellStyle, color: user.role === "admin" ? "#ffe082" : "#dffff0" }}>{user.role}</span>
              <div style={actionsBtns}>
                <button style={btn("linear-gradient(135deg,#c62828,#e53935)")} onClick={() => deleteUser(user._id)}><MdDelete size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
