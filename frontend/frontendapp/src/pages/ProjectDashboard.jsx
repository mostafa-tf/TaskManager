import { useNavigate, NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { GrProjects } from "react-icons/gr";
import { IoMdAddCircle } from "react-icons/io";
export const ProjectDashboard = () => {
  const navigate = useNavigate();

  const navStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "95px",
    position: "relative",
    fontSize: "34px",
    fontWeight: "800",
    color: "#ffffff",
    background: "rgba(5,10,8,0.95)",
    borderBottom: "1px solid rgba(0,255,140,0.14)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    letterSpacing: "0.5px",
  };

  const buttonstyle = {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    fontSize: "22px",
    position: "absolute",
    left: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#dffff0",
    border: "1px solid rgba(0,255,140,0.18)",
    background: "rgba(255,255,255,0.06)",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
  };
  return (
    <>
      <div>
        <nav style={navStyle}>
          <button style={buttonstyle} onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          Project Dashboard
        </nav>

        <div>
          <NavLink to="viewprojects">
            View Projects <GrProjects />
          </NavLink>
        </div>
        <div>
          <NavLink to="addproject">
            Add Projects <IoMdAddCircle />
          </NavLink>
        </div>
      </div>
    </>
  );
};
