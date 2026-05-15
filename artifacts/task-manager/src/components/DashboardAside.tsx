import { NavLink } from "react-router-dom";
import { IoIosAddCircle } from "react-icons/io";
import { FcStatistics } from "react-icons/fc";
import { FaTasks } from "react-icons/fa";
import { MdDone, MdPending } from "react-icons/md";
import { GiThreeFriends } from "react-icons/gi";

const DashboardAside = () => {
  const asidestyle: React.CSSProperties = {
    gridArea: "aside",
    background: "#0b1210",
    borderRight: "1px solid #1f3d2e",
    display: "flex",
    flexDirection: "column",
    paddingTop: "40px",
    gap: "20px",
    alignItems: "center",
  };

  const navItem: React.CSSProperties = {
    width: "85%",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "10px",
    paddingLeft: "15px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
  };

  const stylenavlink = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    ...navItem,
    textDecoration: "none",
    color: isActive ? "#00ff9d" : "#eafff4",
    background: isActive ? "rgba(0,255,140,0.12)" : "transparent",
    border: isActive ? "1px solid rgba(0,255,140,0.2)" : "1px solid transparent",
    transition: "all 0.25s ease",
  });

  return (
    <aside style={asidestyle}>
      <NavLink to="" end style={stylenavlink}>
        <FaTasks size={18} />
        All Tasks
      </NavLink>
      <NavLink to="donetasks" style={stylenavlink}>
        <MdDone size={20} />
        Done Tasks
      </NavLink>
      <NavLink to="undonetasks" style={stylenavlink}>
        <MdPending size={20} />
        Pending Tasks
      </NavLink>
      <NavLink to="addtask" style={stylenavlink}>
        <IoIosAddCircle size={20} />
        Add Task
      </NavLink>
      <NavLink to="/analysis" style={stylenavlink}>
        <FcStatistics size={20} />
        Analysis
      </NavLink>
      <NavLink to="/friendsdashboard" style={stylenavlink}>
        <GiThreeFriends size={20} />
        Friends
      </NavLink>
      <NavLink to="/notifications" style={stylenavlink}>
        <GiThreeFriends size={20} />
        Notifications
      </NavLink>
    </aside>
  );
};

export default DashboardAside;
