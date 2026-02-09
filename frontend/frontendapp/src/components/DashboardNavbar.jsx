import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoPersonSharp } from "react-icons/io5";
import { NavLink } from "react-router-dom";
const DashboardNavbar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");

    navigate("/login");
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
  const personbuttonstyle = {
    width: "100px",
    height: "50px",
    marginBottom: "15px",
    marginLeft: "20px",
    fontSize: "20px",
    color: "#A52A2A",
  };
  return (
    <nav style={dashboardnavbarstyle}>
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
