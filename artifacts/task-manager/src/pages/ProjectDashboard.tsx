import { useNavigate } from "react-router-dom";
import { FaProjectDiagram, FaArrowLeft } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { FaEye } from "react-icons/fa6";

export const ProjectDashboard = () => {
  const navigate = useNavigate();

  const pageStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    boxSizing: "border-box",
    background: "radial-gradient(circle at top, rgba(0,255,140,0.10), transparent 28%), linear-gradient(135deg, #07110d 0%, #0b1d15 45%, #08110c 100%)",
    position: "relative",
  };

  const backBtn: React.CSSProperties = {
    position: "absolute",
    top: "24px",
    left: "24px",
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    border: "1px solid rgba(0,255,140,0.2)",
    background: "rgba(0,255,140,0.08)",
    color: "#dffff0",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const iconWrap: React.CSSProperties = {
    width: "70px", height: "70px", borderRadius: "50%",
    background: "rgba(0,255,140,0.10)", border: "2px solid rgba(0,255,140,0.20)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#dffff0", marginBottom: "16px",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0, color: "#ffffff", fontSize: "34px", fontWeight: "800", textAlign: "center",
  };

  const subtitleStyle: React.CSSProperties = {
    marginTop: "10px", marginBottom: "36px",
    color: "rgba(255,255,255,0.65)", fontSize: "15px", textAlign: "center",
  };

  const dividerStyle: React.CSSProperties = {
    width: "60px", height: "3px", borderRadius: "999px",
    background: "linear-gradient(90deg, #00c853, #b7ffd5)", margin: "0 auto 36px",
  };

  const cardsWrapper: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    width: "100%",
    maxWidth: "520px",
  };

  const cardBase: React.CSSProperties = {
    padding: "34px 24px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(0,255,140,0.14)",
    cursor: "pointer",
    textAlign: "center",
    boxShadow: "0 18px 50px rgba(0,0,0,0.30)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  };

  const cardIconWrap: React.CSSProperties = {
    width: "58px", height: "58px", borderRadius: "18px",
    background: "rgba(0,255,140,0.10)", border: "1px solid rgba(0,255,140,0.18)",
    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
  };

  const cardTitle: React.CSSProperties = {
    margin: "0 0 8px", color: "#ffffff", fontSize: "18px", fontWeight: "800",
  };

  const cardDesc: React.CSSProperties = {
    margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "13px", lineHeight: "1.6",
  };

  return (
    <div style={pageStyle}>
      <button style={backBtn} onClick={() => navigate("/dashboard")}>
        <FaArrowLeft size={18} />
      </button>

      <div style={iconWrap}>
        <FaProjectDiagram size={30} />
      </div>

      <h2 style={titleStyle}>Projects</h2>
      <p style={subtitleStyle}>Manage your collaborative projects.</p>
      <div style={dividerStyle} />

      <div style={cardsWrapper}>
        <div
          style={cardBase}
          onClick={() => navigate("viewprojects")}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = "rgba(0,255,140,0.08)";
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)";
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          }}
        >
          <div style={cardIconWrap}><FaEye size={26} color="#00e676" /></div>
          <h3 style={cardTitle}>View Projects</h3>
          <p style={cardDesc}>See all your existing projects and their members</p>
        </div>

        <div
          style={cardBase}
          onClick={() => navigate("addproject")}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = "rgba(0,255,140,0.08)";
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)";
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          }}
        >
          <div style={cardIconWrap}><IoIosAddCircle size={28} color="#00e676" /></div>
          <h3 style={cardTitle}>Add Project</h3>
          <p style={cardDesc}>Create a new project and invite your team</p>
        </div>
      </div>
    </div>
  );
};
