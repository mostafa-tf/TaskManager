import { useNavigate, NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from "react";

export const ViewProjects = () => {
  const [projects, setProjects] = useState([]);
  const [userid, setUserId] = useState("");
  const navigate = useNavigate();
  async function fetchhallprojects() {
    try {
      const res = await fetch("http://localhost:3000/api/projects", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status == 500) {
        const data = await res.json();
        throw new Error(data.message);
      } else if (res.status == 200) {
        const object = await res.json();
        setProjects(object.projects);
        setUserId(object.userid);
      }
    } catch (error) {
      alert(error.message);
    }
  }

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
  useEffect(() => {
    fetchhallprojects();
  }, []);
  const projectsdiv = {};
  const projectdiv = {};
  return (
    <>
      <nav style={navStyle}>
        <button style={buttonstyle} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        View Projects
      </nav>
      {projects.length == 0 && <h1>No Projects Found</h1>}
      {projects.length != 0 && (
        <div style={projectsdiv}>
          {projects.map((project) => {
            return (
              <NavLink
                to={`${project._id}`}
                onClick={() =>
                  localStorage.setItem(
                    "role",
                    project.owner == userid ? "owner" : "member",
                  )
                }
              >
                <div
                  style={{
                    backgroundColor: project.owner == userid ? "red" : "brown",
                  }}
                >
                  {project.name}
                  {project.owner == userid ? (
                    <h1>Role:owner</h1>
                  ) : (
                    <h1>Role:member</h1>
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>
      )}
    </>
  );
};
