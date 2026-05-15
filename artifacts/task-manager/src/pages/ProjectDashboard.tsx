import { useNavigate } from "react-router-dom";
import { FaProjectDiagram, FaArrowLeft } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { FaEye } from "react-icons/fa6";

export const ProjectDashboard = () => {
  const navigate = useNavigate();

  const cardStyle: React.CSSProperties = { padding: "30px", borderRadius: "22px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.12)", cursor: "pointer", textAlign: "center", transition: "all 0.25s ease", boxShadow: "0 12px 35px rgba(0,0,0,0.22)" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #07110d 0%, #0b1d15 50%, #08110c 100%)", padding: "30px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px" }}>
        <button onClick={() => navigate("/dashboard")} style={{ width: "46px", height: "46px", borderRadius: "14px", border: "1px solid rgba(0,255,140,0.2)", background: "rgba(0,255,140,0.08)", color: "#dffff0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaArrowLeft size={18} /></button>
        <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(0,255,140,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: "#dffff0" }}><FaProjectDiagram size={24} /></div>
        <div><h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>Projects</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>Manage your collaborative projects.</p></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", maxWidth: "600px" }}>
        <div style={cardStyle} onClick={() => navigate("viewprojects")}>
          <FaEye size={36} color="#00e676" />
          <h3 style={{ color: "#ffffff", fontWeight: "800", marginTop: "14px", marginBottom: "6px" }}>View Projects</h3>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", margin: 0 }}>See all your existing projects</p>
        </div>
        <div style={cardStyle} onClick={() => navigate("addproject")}>
          <IoIosAddCircle size={36} color="#00e676" />
          <h3 style={{ color: "#ffffff", fontWeight: "800", marginTop: "14px", marginBottom: "6px" }}>Add Project</h3>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", margin: 0 }}>Create a new project</p>
        </div>
      </div>
    </div>
  );
};
