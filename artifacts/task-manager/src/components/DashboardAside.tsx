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
    `w-[88%] h-[46px] flex items-center justify-start gap-3 pl-[16px] rounded-[12px] text-sm font-semibold no-underline transition-all duration-200 ${
      isActive
        ? "text-indigo-300 bg-indigo-500/[0.16] border border-indigo-500/[0.28]"
        : "text-white/65 bg-transparent border border-transparent hover:bg-indigo-500/[0.08] hover:text-white/90"
    }`;

  return (
    <aside className="flex flex-col pt-8 gap-2 items-center w-full">
      <NavLink to="" end className={linkClass} onClick={onNavClick}>
        <FaTasks size={17} />
        All Tasks
      </NavLink>
      <NavLink to="donetasks" className={linkClass} onClick={onNavClick}>
        <MdDone size={19} />
        Done Tasks
      </NavLink>
      <NavLink to="undonetasks" className={linkClass} onClick={onNavClick}>
        <MdPending size={19} />
        Pending Tasks
      </NavLink>
      <NavLink to="addtask" className={linkClass} onClick={onNavClick}>
        <IoIosAddCircle size={19} />
        Add Task
      </NavLink>
      <NavLink to="/analysis" className={linkClass} onClick={onNavClick}>
        <FcStatistics size={19} />
        Analysis
      </NavLink>
      <NavLink to="/friendsdashboard" className={linkClass} onClick={onNavClick}>
        <GiThreeFriends size={19} />
        Friends
      </NavLink>
      <NavLink to="/logs" className={linkClass} onClick={onNavClick}>
        <MdOutlineHistory size={19} />
        Activity Logs
      </NavLink>
    </aside>
  );
};

export default DashboardAside;
