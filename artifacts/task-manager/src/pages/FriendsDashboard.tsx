import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { GiThreeFriends } from "react-icons/gi";

export const FriendsDashboard = () => {
  const navigate = useNavigate();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-[18px] py-[10px] rounded-[12px] no-underline font-bold text-sm transition-all duration-200 ${
      isActive
        ? "text-[#00ff9d] bg-[rgba(0,255,140,0.12)] border border-[rgba(0,255,140,0.22)]"
        : "text-[#dffff0] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.08)]"
    }`;

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#07110d_0%,#0b1d15_50%,#08110c_100%)] p-[30px]">
      <div className="flex items-center gap-[14px] mb-6">
        <button onClick={() => navigate("/dashboard")} className="w-[46px] h-[46px] rounded-[14px] border border-[rgba(0,255,140,0.2)] bg-[rgba(0,255,140,0.08)] text-[#dffff0] cursor-pointer flex items-center justify-center">
          <FaArrowLeft size={18} />
        </button>
        <div className="w-[52px] h-[52px] rounded-2xl bg-[rgba(0,255,140,0.10)] flex items-center justify-center text-[#dffff0]"><GiThreeFriends size={26} /></div>
        <div>
          <h2 className="m-0 text-[28px] font-extrabold text-white">Friends</h2>
          <p className="m-0 text-white/65 text-sm">Manage your friends and requests.</p>
        </div>
      </div>

      <nav className="flex gap-2.5 flex-wrap mb-7 p-4 rounded-[18px] bg-[rgba(255,255,255,0.04)] border border-[rgba(0,255,140,0.08)]">
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
