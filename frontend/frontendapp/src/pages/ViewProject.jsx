import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

export const ViewProject = () => {
  const [project, setProject] = useState({});
  const [tasks, setTasks] = useState({});
  const navigate = useNavigate();
  const { projectid } = useParams();

  const statusColumns = [
    { key: "todo", title: "Todo" },
    { key: "inprogress", title: "In Progress" },
    { key: "done", title: "Done" },
  ];

  const [taskinfo, setTaskInfo] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    assignedto: "",
    projectid: "",
    taskType: "project",
  });

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/projects/assigntask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(taskinfo),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Task assigned");
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchcontributertasks = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/projects/contributertasks/${projectid}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setTasks(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchmembers = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/projects/projectinfo/${projectid}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      data.members.shift();
      setProject(data);

      setTaskInfo((prev) => ({
        ...prev,
        projectid: data.projectId,
      }));
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchmembers();

    if (localStorage.getItem("role") === "member") {
      fetchcontributertasks();
    }
  }, []);

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        View Project
      </nav>

      <main style={styles.main}>
        {project.projectName && (
          <section style={styles.projectInfo}>
            <h2 style={styles.projectTitle}>{project.projectName}</h2>
            <p style={styles.projectDesc}>{project.projectDescription}</p>
            <span style={styles.badge}>Members: {project.members.length}</span>
          </section>
        )}

        {localStorage.getItem("role") === "owner" &&
          project.members &&
          project.members.length === 0 && (
            <h2 style={styles.message}>No Members Found</h2>
          )}

        {localStorage.getItem("role") === "owner" &&
          project.members &&
          project.members.length !== 0 && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Project Members</h2>

              <div style={styles.membersGrid}>
                {project.members.map((member) => (
                  <div
                    key={member.userId}
                    style={styles.memberCard}
                    onClick={() => {
                      if (!member.userId) return;
                      localStorage.setItem("projectid", project.projectId);
                      navigate(`/projects/projectmember/${member.userId}`);
                    }}
                  >
                    <div style={styles.memberTop}>
                      <h3 style={styles.memberName}>{member.username}</h3>
                      <span
                        style={{
                          ...styles.statusBadge,
                          color: member.isActive ? "#39ff9f" : "#ffd36b",
                          borderColor: member.isActive
                            ? "rgba(57,255,159,0.35)"
                            : "rgba(255,211,107,0.35)",
                        }}
                      >
                        {member.isActive ? "Active" : "Offline"}
                      </span>
                    </div>

                    <div style={styles.stats}>
                      <p>Total: {member.totalTasks}</p>
                      <p>Todo: {member.todo}</p>
                      <p>Progress: {member.inprogress}</p>
                      <p>Done: {member.done}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        {localStorage.getItem("role") === "owner" && (
          <form style={styles.formCard} onSubmit={handlesubmit}>
            <h2 style={styles.sectionTitle}>Assign A Task</h2>

            <label style={styles.label}>Task Title</label>
            <input
              style={styles.input}
              type="text"
              value={taskinfo.title}
              onChange={(e) =>
                setTaskInfo((prev) => ({ ...prev, title: e.target.value }))
              }
              required
              minLength={2}
              maxLength={15}
              placeholder="Enter task title"
            />

            <label style={styles.label}>Task Date</label>
            <input
              style={styles.input}
              type="date"
              value={taskinfo.dueDate}
              onChange={(e) =>
                setTaskInfo((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              required
            />

            <label style={styles.label}>Task Priority</label>
            <select
              style={styles.input}
              value={taskinfo.priority}
              onChange={(e) =>
                setTaskInfo((prev) => ({ ...prev, priority: e.target.value }))
              }
              required
            >
              <option value="">Select Priority</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <label style={styles.label}>Description</label>
            <textarea
              style={{
                ...styles.input,
                minHeight: "110px",
                resize: "vertical",
              }}
              value={taskinfo.description}
              onChange={(e) =>
                setTaskInfo((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Write task description..."
            />

            <label style={styles.label}>Assign To</label>
            <select
              style={styles.input}
              value={taskinfo.assignedto}
              onChange={(e) =>
                setTaskInfo((prev) => ({ ...prev, assignedto: e.target.value }))
              }
              required
            >
              <option value="">Select A Member</option>
              {project.members &&
                project.members.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.username}
                  </option>
                ))}
            </select>

            <button style={styles.submitButton} type="submit">
              Assign Task
            </button>
          </form>
        )}

        {localStorage.getItem("role") === "member" && (
          <section style={styles.taskColumns}>
            {statusColumns.map((col) => {
              const list = tasks[col.key] || [];
              if (list.length === 0) return null;

              return (
                <div key={col.key} style={styles.taskColumn}>
                  <h2 style={styles.columnTitle}>{col.title}</h2>

                  {list.map((task) => (
                    <div key={task._id} style={styles.taskCard}>
                      <h3 style={styles.taskTitle}>{task.title}</h3>
                      <p style={styles.taskText}>{task.description}</p>
                      <p style={styles.taskText}>Priority: {task.priority}</p>
                      <p style={styles.taskText}>
                        Due Date: {task.dueDate?.slice(0, 10)}
                      </p>

                      <div style={styles.taskActions}>
                        <button style={styles.smallButton}>Todo</button>
                        <button style={styles.smallButton}>In Progress</button>
                        <button style={styles.smallButton}>Done</button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </section>
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

  projectInfo: {
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
    border: "1px solid rgba(0,255,140,0.16)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
    borderRadius: "22px",
    padding: "22px",
    marginBottom: "26px",
  },

  projectTitle: {
    margin: "0 0 8px",
    fontSize: "28px",
  },

  projectDesc: {
    margin: "0 0 14px",
    color: "#b8cfc4",
  },

  badge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    color: "#39ff9f",
    border: "1px solid rgba(57,255,159,0.35)",
    background: "rgba(57,255,159,0.08)",
    fontWeight: "800",
    fontSize: "13px",
  },

  section: {
    marginBottom: "28px",
  },

  sectionTitle: {
    margin: "0 0 18px",
    fontSize: "24px",
  },

  membersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
    gap: "18px",
  },

  memberCard: {
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
    border: "1px solid rgba(0,255,140,0.16)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
    borderRadius: "20px",
    padding: "18px",
    cursor: "pointer",
  },

  memberTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    alignItems: "center",
  },

  memberName: {
    margin: 0,
    fontSize: "21px",
  },

  statusBadge: {
    padding: "6px 10px",
    borderRadius: "999px",
    border: "1px solid",
    background: "rgba(255,255,255,0.06)",
    fontWeight: "800",
    fontSize: "12px",
  },

  stats: {
    marginTop: "14px",
    color: "#dffff0",
    lineHeight: "1.4",
  },

  formCard: {
    marginTop: "30px",
    padding: "24px",
    borderRadius: "22px",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
    border: "1px solid rgba(0,255,140,0.16)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "14px",
    color: "#dffff0",
    fontWeight: "800",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 15px",
    borderRadius: "14px",
    border: "1px solid rgba(0,255,140,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    outline: "none",
    fontSize: "15px",
  },

  submitButton: {
    marginTop: "22px",
    width: "100%",
    padding: "14px",
    borderRadius: "16px",
    border: "1px solid rgba(57,255,159,0.35)",
    background: "linear-gradient(135deg, #20d982, #0b8f55)",
    color: "#04100b",
    fontSize: "16px",
    fontWeight: "900",
    cursor: "pointer",
  },

  taskColumns: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    alignItems: "start",
  },

  taskColumn: {
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

  taskText: {
    margin: "6px 0",
    color: "#b8cfc4",
  },

  taskActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "12px",
  },

  smallButton: {
    padding: "8px 10px",
    borderRadius: "12px",
    border: "1px solid rgba(57,255,159,0.25)",
    background: "rgba(57,255,159,0.08)",
    color: "#dffff0",
    cursor: "pointer",
    fontWeight: "700",
  },

  message: {
    textAlign: "center",
    color: "#dffff0",
  },
};
