import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoPersonSharp } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa6";
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
  let dashboardnavbarstyle = {
    backgroundColor: "black",
    color: "cyan",
    borderBottom: "3px solid green",
    gridArea: "nav",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  };
  let buttonstyle = {
    color: "yellow",
    backgroundColor: "brown",
    position: "absolute",
    right: "20px",
    height: "50px",
    width: "100px",
    padding: "10px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "17px",
  };
  let viewusersbutton = {
    color: "yellow",
    backgroundColor: "darkblue",
    position: "absolute",
    left: "20px",
    height: "50px",
    width: "100px",
    padding: "10px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "17px",
  };
  const personbuttonstyle = {
    width: "100px",
    height: "50px",
    marginBottom: "15px",
    marginLeft: "20px",
    fontSize: "20px",
    color: "#A52A2A",
  };
  useEffect(() => {
    isadmin();
  }, []);
  return (
    <nav style={dashboardnavbarstyle}>
      {isadminn && (
        <button
          style={viewusersbutton}
          onClick={() => navigate("/admindashboard")}
        >
          View Users <FaUsers size={30} />
        </button>
      )}
      <h2>Dashboard</h2>{" "}
      <button style={personbuttonstyle}>
        <NavLink to="profile">
          <IoPersonSharp />
          Profile
        </NavLink>
      </button>
      <button style={buttonstyle} onClick={logout}>
        Logout <IoIosLogOut size={40} />{" "}
      </button>
    </nav>
  );
};
export default DashboardNavbar;
