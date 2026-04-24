import { IoIosLogOut } from "react-icons/io";
import { useNavigate, NavLink } from "react-router-dom";
import { IoPersonSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa6";
import { FaProjectDiagram } from "react-icons/fa";
const DashboardNavbar = () => {
  const [isadminn, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    await fetch("http://localhost:3000/api/users/logout", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    localStorage.removeItem("token");
    navigate("/login");
  };

  const isadmin = async () => {
    const res = await fetch("http://localhost:3000/api/users/checkrole", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setIsAdmin(data.role == "admin");
  };

  useEffect(() => {
    isadmin();
  }, []);

  const navbarStyle = {
    backgroundColor: "black",
    color: "cyan",
    borderBottom: "3px solid green",
    gridArea: "nav",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  };

  const logoutBtn = {
    position: "absolute",
    right: "20px",
    height: "50px",
    width: "120px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    fontSize: "17px",
    backgroundColor: "brown",
    color: "yellow",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const adminBtn = {
    position: "absolute",
    left: "20px",
    height: "50px",
    width: "140px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
    backgroundColor: "darkblue",
    color: "yellow",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const linkBtn = {
    height: "50px",
    width: "120px",
    marginBottom: "15px",
    marginLeft: "20px",
    fontSize: "18px",
    color: "#A52A2A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    textDecoration: "none",
    backgroundColor: "white",
    borderRadius: "8px",
  };

  return (
    <nav style={navbarStyle}>
      {isadminn && (
        <button style={adminBtn} onClick={() => navigate("/admindashboard")}>
          <FaUsers size={22} />
          Users
        </button>
      )}

      <h2>Dashboard</h2>

      <NavLink to="profile" style={linkBtn}>
        <IoPersonSharp size={20} />
        Profile
      </NavLink>

      <NavLink to="feedback" style={linkBtn}>
        <IoPersonSharp size={20} />
        Feedback
      </NavLink>
      <NavLink to="/projects" style={linkBtn}>
        Projects <FaProjectDiagram />
      </NavLink>
      <button style={logoutBtn} onClick={logout}>
        Logout
        <IoIosLogOut size={25} />
      </button>
    </nav>
  );
};

export default DashboardNavbar;
