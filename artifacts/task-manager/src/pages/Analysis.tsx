import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FcStatistics } from "react-icons/fc";
import { FaArrowLeft } from "react-icons/fa";

export const Analysis = () => {
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/tasks/analysis", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
        const data = await res.json();
        if (res.status === 200) setStats(data);
      } catch (error) { /* silent */ }
    };
    fetchStats();
  }, []);

  const pct = stats ? Math.round((stats.done / (stats.total || 1)) * 100) : 0;

  const cardStyle = (border: string): React.CSSProperties => ({
    flex: "1", minWidth: "160px", padding: "24px 20px", borderRadius: "22px",
    background: "rgba(255,255,255,0.05)", border: `1px solid ${border}`,
    textAlign: "center", boxShadow: "0 12px 35px rgba(0,0,0,0.25)",
  });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #07110d 0%, #0b1d15 50%, #08110c 100%)", padding: "30px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <button onClick={() => navigate("/dashboard")} style={{ width: "46px", height: "46px", borderRadius: "14px", border: "1px solid rgba(0,255,140,0.2)", background: "rgba(0,255,140,0.08)", color: "#dffff0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaArrowLeft size={18} /></button>
        <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(0,255,140,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}><FcStatistics size={28} /></div>
        <div><h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>Task Analysis</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>Overview of your task completion progress.</p></div>
      </div>
      {!stats ? <p style={{ color: "#fff" }}>Loading...</p> : (
        <div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "36px" }}>
            <div style={{ width: "200px", height: "200px" }}>
              <CircularProgressbar value={pct} text={`${pct}%`} styles={buildStyles({ textColor: "#ffffff", pathColor: "#00e676", trailColor: "rgba(255,255,255,0.1)", textSize: "22px" })} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={cardStyle("rgba(0,255,140,0.2)")}><p style={{ color: "#dffff0", fontWeight: "700", marginBottom: "8px" }}>Total Tasks</p><h2 style={{ color: "#00e676", margin: 0, fontSize: "40px", fontWeight: "800" }}>{stats.total}</h2></div>
            <div style={cardStyle("rgba(0,230,118,0.2)")}><p style={{ color: "#dffff0", fontWeight: "700", marginBottom: "8px" }}>Completed</p><h2 style={{ color: "#00e676", margin: 0, fontSize: "40px", fontWeight: "800" }}>{stats.done}</h2></div>
            <div style={cardStyle("rgba(255,193,7,0.2)")}><p style={{ color: "#dffff0", fontWeight: "700", marginBottom: "8px" }}>Pending</p><h2 style={{ color: "#ffe082", margin: 0, fontSize: "40px", fontWeight: "800" }}>{stats.undone}</h2></div>
            <div style={cardStyle("rgba(255,82,82,0.2)")}><p style={{ color: "#dffff0", fontWeight: "700", marginBottom: "8px" }}>Expired</p><h2 style={{ color: "#ff9c9c", margin: 0, fontSize: "40px", fontWeight: "800" }}>{stats.expired}</h2></div>
          </div>
        </div>
      )}
    </div>
  );
};
