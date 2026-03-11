import { FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const Analysis = () => {
  const [alltasks, setAlltasks] = useState([]);
  const [lastmonthtasks, setLastMonthTasks] = useState([]);
  const [lastweektasks, setLastWeekTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredtasks, setFilteredTasks] = useState([]);
  const navigate = useNavigate();

  const fetchalltasks = async () => {
    const res = await fetch("http://localhost:3000/api/tasks", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setAlltasks(data);
    setFilteredTasks(data);

    setLastMonthTasks(
      data.filter((task) => {
        const now = new Date();
        let diff = now - new Date(task.createdAt);
        diff = diff / (1000 * 60 * 60 * 24);
        return diff < 32 && diff >= 0;
      }),
    );

    setLastWeekTasks(
      data.filter((task) => {
        const now = new Date();
        let diff = now - new Date(task.createdAt);
        diff = diff / (1000 * 60 * 60 * 24);
        return diff < 8 && diff >= 0;
      }),
    );
  };

  useEffect(() => {
    fetchalltasks();
  }, []);

  const changetasks = (e) => {
    const val = e.target.value;
    setFilter(val);

    if (val === "") {
      setFilteredTasks(alltasks);
    } else if (val === "month") {
      setFilteredTasks(lastmonthtasks);
    } else if (val === "week") {
      setFilteredTasks(lastweektasks);
    }
  };

  const doneTasks = filteredtasks.filter((task) => task.isDone).length;
  const pendingTasks = filteredtasks.filter((task) => !task.isDone).length;

  const pageStyle = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #1f2937 0%, #0f172a 45%, #020617 100%)",
    color: "white",
    fontFamily: "Arial, sans-serif",
    paddingBottom: "40px",
  };

  const navStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100px",
    position: "relative",
    fontSize: "32px",
    fontWeight: "700",
    letterSpacing: "1px",
    color: "#f8fafc",
    background: "rgba(15, 23, 42, 0.75)",
    backdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
  };

  const buttonStyle = {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    fontSize: "22px",
    position: "absolute",
    left: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#22c55e",
    border: "2px solid rgba(34,197,94,0.6)",
    background: "rgba(255,255,255,0.04)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    cursor: "pointer",
    transition: "0.3s",
  };

  const contentStyle = {
    width: "90%",
    maxWidth: "1200px",
    margin: "40px auto 0",
  };

  const headerRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "32px",
    padding: "24px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  };

  const titleBoxStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const mainTitleStyle = {
    fontSize: "30px",
    fontWeight: "800",
    color: "#ffffff",
    margin: 0,
  };

  const subTitleStyle = {
    fontSize: "15px",
    color: "#94a3b8",
    margin: 0,
  };

  const selectStyle = {
    padding: "14px 20px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(15,23,42,0.9)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    outline: "none",
    minWidth: "180px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
  };

  const cardsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  };

  const cardStyle = {
    background:
      "linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.92))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "28px",
    padding: "26px 22px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.28)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "18px",
    minHeight: "320px",
  };

  const cardTitleStyle = {
    fontSize: "22px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: 0,
  };

  const cardSubtitleStyle = {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
    textAlign: "center",
  };

  const circleWrapperStyle = {
    width: "150px",
    height: "150px",
  };

  const statBadgeStyle = {
    padding: "10px 18px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.06)",
    color: "#cbd5e1",
    fontSize: "14px",
    fontWeight: "600",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <button style={buttonStyle} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        Analysis Dashboard
      </nav>

      <div style={contentStyle}>
        <div style={headerRowStyle}>
          <div style={titleBoxStyle}>
            <h1 style={mainTitleStyle}>Tasks Analytics</h1>
            <p style={subTitleStyle}>
              Track all tasks, completed tasks, and pending tasks in one clean
              dashboard.
            </p>
          </div>

          <select value={filter} onChange={changetasks} style={selectStyle}>
            <option value="">All</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
        </div>

        <div style={cardsGridStyle}>
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>All Tasks</h2>
            <p style={cardSubtitleStyle}>Total tasks in the selected filter</p>

            <div style={circleWrapperStyle}>
              <CircularProgressbar
                value={filteredtasks.length}
                text={`${filteredtasks.length}`}
                styles={buildStyles({
                  textColor: "#f8fafc",
                  pathColor: "#38bdf8",
                  trailColor: "rgba(255,255,255,0.08)",
                  textSize: "18px",
                  strokeLinecap: "round",
                })}
              />
            </div>

            <div style={statBadgeStyle}>{filteredtasks.length} Tasks</div>
          </div>

          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Done Tasks</h2>
            <p style={cardSubtitleStyle}>Tasks marked as completed</p>

            <div style={circleWrapperStyle}>
              <CircularProgressbar
                value={doneTasks}
                text={`${doneTasks}`}
                styles={buildStyles({
                  textColor: "#f8fafc",
                  pathColor: "#22c55e",
                  trailColor: "rgba(255,255,255,0.08)",
                  textSize: "18px",
                  strokeLinecap: "round",
                })}
              />
            </div>

            <div style={statBadgeStyle}>{doneTasks} Completed</div>
          </div>

          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Pending Tasks</h2>
            <p style={cardSubtitleStyle}>Tasks still waiting to be done</p>

            <div style={circleWrapperStyle}>
              <CircularProgressbar
                value={pendingTasks}
                text={`${pendingTasks}`}
                styles={buildStyles({
                  textColor: "#f8fafc",
                  pathColor: "#f59e0b",
                  trailColor: "rgba(255,255,255,0.08)",
                  textSize: "18px",
                  strokeLinecap: "round",
                })}
              />
            </div>

            <div style={statBadgeStyle}>{pendingTasks} Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
};
