import { NavLink } from "react-router-dom";
import { IoIosAddCircle } from "react-icons/io";
const DashboardAside = () => {
  const asidestyle = {
    borderRight: "3px solid green",
    backgroundColor: "black",
    gridArea: "aside",
    display: "flex",
    fontSize: "25px",
    gap: "70px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };
  const stylenavlink = ({ isActive }) => {
    return isActive
      ? {
          color: "red",
          textDecoration: "none",
          fontWeight: "bold",
          fontFamily: "Georgia",
        }
      : { color: "blue", textDecoration: "underline", fontWeight: "normal" };
  };

  return (
    <aside style={asidestyle}>
      <NavLink to="" end style={stylenavlink}>
        All Tasks
      </NavLink>
      <NavLink style={stylenavlink} to="donetasks">
        Done Tasks
      </NavLink>
      <NavLink style={stylenavlink} to="undonetasks">
        Pending Tasks
      </NavLink>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {" "}
        <NavLink style={stylenavlink} to="addtask">
          Add task <IoIosAddCircle size={18} style={{ marginBottom: 0 }} />
        </NavLink>{" "}
      </div>
    </aside>
  );
};
export default DashboardAside;
