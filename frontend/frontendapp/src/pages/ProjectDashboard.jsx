import { useNavigate, NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { GrProjects } from "react-icons/gr";
import { IoMdAddCircle } from "react-icons/io";

export const ProjectDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "View Projects",
      icon: <GrProjects />,
      path: "viewprojects",
    },
    {
      title: "Add Project",
      icon: <IoMdAddCircle />,
      path: "addproject",
    },
  ];

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1 style={styles.navTitle}>Project Dashboard</h1>
      </nav>

      <main style={styles.main}>
        <div style={styles.grid}>
          {cards.map((card) => (
            <NavLink key={card.path} to={card.path} style={styles.card}>
              <div style={styles.icon}>{card.icon}</div>
              <h2 style={styles.cardTitle}>{card.title}</h2>
            </NavLink>
          ))}
        </div>
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
    padding: "50px 24px",
    display: "flex",
    justifyContent: "center",
  },

  grid: {
    width: "100%",
    maxWidth: "850px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
  },

  card: {
    minHeight: "190px",
    textDecoration: "none",
    color: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
    border: "1px solid rgba(0,255,140,0.16)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "18px",
    transition: "0.25s ease",
  },

  icon: {
    fontSize: "48px",
    color: "#39ff9f",
  },

  cardTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800",
  },
};
