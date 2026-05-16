import { NavLink } from "react-router-dom";
import { IoIosAddCircle } from "react-icons/io";
import { FcStatistics } from "react-icons/fc";
import { FaTasks } from "react-icons/fa";
import { MdDone, MdPending, MdOutlineHistory } from "react-icons/md";
import { GiThreeFriends } from "react-icons/gi";

interface DashboardAsideProps {
  onNavClick?: () => void;
}

const DashboardAside = ({ onNavClick }: DashboardAsideProps) => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `w-[85%] h-[45px] flex items-center justify-start gap-2.5 pl-[15px] rounded-[10px] text-base font-semibold no-underline transition-all duration-200 ${
      isActive
        ? "text-[#00ff9d] bg-[rgba(0,255,140,0.12)] border border-[rgba(0,255,140,0.2)]"
        : "text-[#eafff4] bg-transparent border border-transparent hover:bg-[rgba(0,255,140,0.06)]"
    }`;

  return (
    <aside className="flex flex-col pt-10 gap-5 items-center w-full">
      <NavLink to="" end className={linkClass} onClick={onNavClick}>
        <FaTasks size={18} />
        All Tasks
      </NavLink>
      <NavLink to="donetasks" className={linkClass} onClick={onNavClick}>
        <MdDone size={20} />
        Done Tasks
      </NavLink>
      <NavLink to="undonetasks" className={linkClass} onClick={onNavClick}>
        <MdPending size={20} />
        Pending Tasks
      </NavLink>
      <NavLink to="addtask" className={linkClass} onClick={onNavClick}>
        <IoIosAddCircle size={20} />
        Add Task
      </NavLink>
      <NavLink to="/analysis" className={linkClass} onClick={onNavClick}>
        <FcStatistics size={20} />
        Analysis
      </NavLink>
      <NavLink to="/friendsdashboard" className={linkClass} onClick={onNavClick}>
        <GiThreeFriends size={20} />
        Friends
      </NavLink>
      <NavLink to="/logs" className={linkClass} onClick={onNavClick}>
        <MdOutlineHistory size={20} />
        Activity Logs
      </NavLink>
    </aside>
  );
};

export default DashboardAside;
