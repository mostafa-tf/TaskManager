import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosPersonAdd } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";

export const FriendsDashboard = () => {
  const navigate = useNavigate();

  const pageStyle = {
    width: "100%",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(0,255,140,0.08), transparent 24%), linear-gradient(135deg, #07110d 0%, #0b1d15 45%, #08110c 100%)",
    color: "#ffffff",
  };

  const topNavStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "95px",
    color: "#ffffff",
    position: "relative",
    fontSize: "32px",
    fontWeight: "800",
    background: "rgba(5,10,8,0.95)",
    borderBottom: "1px solid rgba(0,255,140,0.14)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    letterSpacing: "0.4px",
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
    transition: "all 0.3s ease",
  };

  const tabsWrapper = {
    width: "min(1200px, 92%)",
    margin: "26px auto 0",
    padding: "18px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,255,140,0.12)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    boxSizing: "border-box",
  };

  const tabLinkStyle = ({ isActive }) => ({
    textDecoration: "none",
    minWidth: "220px",
    height: "54px",
    padding: "0 18px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontSize: "16px",
    fontWeight: "800",
    color: isActive ? "#08110c" : "#eafff4",
    background: isActive
      ? "linear-gradient(135deg, #00c853, #00e676)"
      : "rgba(255,255,255,0.06)",
    border: isActive ? "none" : "1px solid rgba(0,255,140,0.15)",
    boxShadow: isActive
      ? "0 14px 30px rgba(0, 200, 83, 0.28)"
      : "0 8px 20px rgba(0,0,0,0.18)",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  });

  const mainStyle = {
    width: "min(1200px, 92%)",
    margin: "26px auto 0",
    padding: "22px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(0,255,140,0.10)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.24)",
    minHeight: "420px",
    boxSizing: "border-box",
  };

  return (
    <div style={pageStyle}>
      <nav style={topNavStyle}>
        <button
          style={buttonstyle}
          onClick={() => navigate(-1)}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 26px rgba(0,0,0,0.32)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
          }}
        >
          <FaArrowLeft />
        </button>
        Friends Dashboard
      </nav>

      <nav style={tabsWrapper}>
        <NavLink to="" end style={tabLinkStyle}>
          <IoIosPersonAdd size={22} />
          Add Friend
        </NavLink>

        <NavLink to="viewfriends" style={tabLinkStyle}>
          <FaUserFriends size={18} />
          View Friends
        </NavLink>

        <NavLink to="incomingrequests" style={tabLinkStyle}>
          <FaUserFriends size={18} />
          Incoming Requests
        </NavLink>
        <NavLink to="outgoingrequests" style={tabLinkStyle}>
          <FaUserFriends size={18} />
          Outgoing Requests
        </NavLink>
        <NavLink to="blockedusers" style={tabLinkStyle}>
          <FaUserFriends size={18} />
          Blocked Users
        </NavLink>
      </nav>

      <main style={mainStyle}>
        <Outlet />
      </main>
    </div>
  );
};
