import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { GiThreeFriends } from "react-icons/gi";

export const FriendsDashboard = () => {
  const navigate = useNavigate();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-[16px] py-[9px] rounded-[12px] no-underline font-bold text-sm transition-all duration-200 ${
      isActive
        ? "text-indigo-300 bg-indigo-500/[0.16] border border-indigo-500/[0.30]"
        : "text-white/65 bg-white/[0.05] border border-white/[0.06] hover:bg-white/[0.09] hover:text-white/90"
    }`;

  return (
    <div className="min-h-screen bg-[#06070f] p-[30px]">
      <div className="flex items-center gap-[14px] mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-[46px] h-[46px] rounded-[14px] border border-indigo-500/[0.25] bg-indigo-500/[0.10] text-indigo-300 cursor-pointer flex items-center justify-center transition-all hover:bg-indigo-500/[0.18]"
        >
          <FaArrowLeft size={17} />
        </button>
        <div className="w-[52px] h-[52px] rounded-2xl bg-indigo-500/[0.12] border border-indigo-500/[0.22] flex items-center justify-center text-indigo-300">
          <GiThreeFriends size={26} />
        </div>
        <div>
          <h2 className="m-0 text-[28px] font-extrabold text-white">Friends</h2>
          <p className="m-0 text-white/50 text-sm">Manage your friends and requests.</p>
        </div>
      </div>

      <nav className="flex gap-2.5 flex-wrap mb-7 p-4 rounded-[18px] bg-white/[0.04] border border-indigo-500/[0.10]">
        <NavLink to="" end className={navClass}>Add Friend</NavLink>
        <NavLink to="viewfriends" className={navClass}>View Friends</NavLink>
        <NavLink to="incomingrequests" className={navClass}>Incoming Requests</NavLink>
        <NavLink to="outgoingrequests" className={navClass}>Outgoing Requests</NavLink>
        <NavLink to="blockedusers" className={navClass}>Blocked Users</NavLink>
      </nav>

      <Outlet />
    </div>
  );
};
