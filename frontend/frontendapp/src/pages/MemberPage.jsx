import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export const MemberPage = () => {
  const navigate = useNavigate();
  const { memberid } = useParams();

  const [tasks, setTasks] = useState({ todo: [], inprogress: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const projectid = localStorage.getItem("projectid");
    const token = localStorage.getItem("token");

    if (!memberid || memberid === "undefined" || !projectid || !token) {
      navigate("/login");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/projects/membertasks/${projectid}/${memberid}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch tasks");
        }

        setTasks({
          todo: data.todo || [],
          inprogress: data.inprogress || [],
          done: data.done || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [memberid, navigate]);

  const columns = [
    { title: "Todo", data: tasks.todo },
    { title: "In Progress", data: tasks.inprogress },
    { title: "Done", data: tasks.done },
  ].filter((col) => col.data.length > 0);

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        Member Tasks
      </nav>

      <main style={styles.main}>
        {loading && <h2 style={styles.message}>Loading...</h2>}
        {error && <h2 style={styles.message}>{error}</h2>}

        {!loading && !error && columns.length === 0 && (
          <h2 style={styles.message}>No tasks found</h2>
        )}

        {!loading && !error && columns.length > 0 && (
          <div style={styles.columns}>
            {columns.map((col) => (
              <div key={col.title} style={styles.column}>
                <h2 style={styles.columnTitle}>{col.title}</h2>

                {col.data.map((task) => (
                  <div key={task._id} style={styles.taskCard}>
                    <h3 style={styles.taskTitle}>{task.title}</h3>
                    <p style={styles.text}>{task.description}</p>
                    <p style={styles.text}>Status: {task.status}</p>
                    <p style={styles.text}>Priority: {task.priority}</p>
                  </div>
                ))}
              </div>
            ))}
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
    padding: "35px 24px",
    maxWidth: "1150px",
    margin: "0 auto",
  },

  columns: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    alignItems: "start",
  },

  column: {
    padding: "18px",
    borderRadius: "20px",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
    border: "1px solid rgba(0,255,140,0.16)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
  },

  columnTitle: {
    margin: "0 0 15px",
    color: "#39ff9f",
  },

  taskCard: {
    padding: "14px",
    borderRadius: "16px",
    marginBottom: "12px",
    background: "rgba(5,10,8,0.72)",
    border: "1px solid rgba(0,255,140,0.12)",
  },

  taskTitle: {
    margin: "0 0 8px",
  },

  text: {
    margin: "6px 0",
    color: "#b8cfc4",
  },

  message: {
    textAlign: "center",
    color: "#dffff0",
    marginTop: "60px",
  },
};
