import { useNavigate, NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from "react";

export const ViewProjects = () => {
  const [projects, setProjects] = useState([]);
  const [userid, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function fetchhallprojects() {
    try {
      const res = await fetch("http://localhost:3000/api/projects", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch projects");
      }

      setProjects(data.projects || []);
      setUserId(data.userid || "");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchhallprojects();
  }, []);

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1 style={styles.navTitle}>View Projects</h1>
      </nav>

      <main style={styles.main}>
        {loading && <h2 style={styles.message}>Loading projects...</h2>}

        {!loading && projects.length === 0 && (
          <h2 style={styles.message}>No Projects Found</h2>
        )}

        {!loading && projects.length !== 0 && (
          <div style={styles.grid}>
            {projects.map((project) => {
              const isOwner = project.owner === userid;

              return (
                <NavLink
                  key={project._id}
                  to={`${project._id}`}
                  style={styles.card}
                  onClick={() => {
                    localStorage.setItem("projectid", project._id);
                    localStorage.setItem("role", isOwner ? "owner" : "member");
                  }}
                >
                  <div style={styles.topRow}>
                    <h2 style={styles.projectName}>{project.name}</h2>

                    <span
                      style={{
                        ...styles.badge,
                        color: isOwner ? "#39ff9f" : "#ffd36b",
                        borderColor: isOwner
                          ? "rgba(57,255,159,0.35)"
                          : "rgba(255,211,107,0.35)",
                      }}
                    >
                      {isOwner ? "Owner" : "Member"}
                    </span>
                  </div>

                  {project.description && (
                    <p style={styles.description}>{project.description}</p>
                  )}

                  <p style={styles.openText}>Open project →</p>
                </NavLink>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(0,255,140,0.12), transparent 35%), #050a08",
    color: "#ffffff",
  },

  nav: {
    height: "95px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(5,10,8,0.95)",
    borderBottom: "1px solid rgba(0,255,140,0.14)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },

  navTitle: {
    fontSize: "34px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    margin: 0,
  },

  backButton: {
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
  },

  main: {
    padding: "45px 24px",
  },

  grid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
    gap: "24px",
  },

  card: {
    minHeight: "170px",
    textDecoration: "none",
    color: "#ffffff",
    borderRadius: "22px",
    padding: "24px",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
    border: "1px solid rgba(0,255,140,0.16)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "14px",
  },

  projectName: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800",
  },

  badge: {
    padding: "7px 12px",
    borderRadius: "999px",
    border: "1px solid",
    background: "rgba(255,255,255,0.06)",
    fontSize: "13px",
    fontWeight: "800",
  },

  description: {
    color: "#b8cfc4",
    fontSize: "15px",
    lineHeight: "1.5",
  },

  openText: {
    margin: 0,
    color: "#39ff9f",
    fontWeight: "800",
  },

  message: {
    textAlign: "center",
    color: "#dffff0",
    marginTop: "60px",
  },
};
