import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { GiThreeFriends } from "react-icons/gi";

export const FriendsDashboard = () => {
  const navigate = useNavigate();

  const navStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    padding: "10px 18px", borderRadius: "12px", textDecoration: "none",
    color: isActive ? "#00ff9d" : "#dffff0", fontWeight: "700", fontSize: "14px",
    background: isActive ? "rgba(0,255,140,0.12)" : "rgba(255,255,255,0.05)",
    border: isActive ? "1px solid rgba(0,255,140,0.22)" : "1px solid rgba(255,255,255,0.06)",
    transition: "all 0.2s ease",
  });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #07110d 0%, #0b1d15 50%, #08110c 100%)", padding: "30px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
        <button onClick={() => navigate("/dashboard")} style={{ width: "46px", height: "46px", borderRadius: "14px", border: "1px solid rgba(0,255,140,0.2)", background: "rgba(0,255,140,0.08)", color: "#dffff0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaArrowLeft size={18} /></button>
        <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(0,255,140,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: "#dffff0" }}><GiThreeFriends size={26} /></div>
        <div><h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>Friends</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>Manage your friends and requests.</p></div>
      </div>
      <nav style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px", padding: "16px", borderRadius: "18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,255,140,0.08)" }}>
        <NavLink to="" end style={navStyle}>Add Friend</NavLink>
        <NavLink to="viewfriends" style={navStyle}>View Friends</NavLink>
        <NavLink to="incomingrequests" style={navStyle}>Incoming Requests</NavLink>
        <NavLink to="outgoingrequests" style={navStyle}>Outgoing Requests</NavLink>
        <NavLink to="blockedusers" style={navStyle}>Blocked Users</NavLink>
      </nav>
      <Outlet />
    </div>
  );
};
