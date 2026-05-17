import { IoIosLogOut } from "react-icons/io";
import { useNavigate, NavLink } from "react-router-dom";
import { IoPersonSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { FaUsers, FaBars } from "react-icons/fa";
import { FaProjectDiagram } from "react-icons/fa";
import { MdFeedback, MdNotifications } from "react-icons/md";

interface DashboardNavbarProps {
  onMenuClick?: () => void;
}

interface Notification {
  _id: string;
  read: boolean;
  message: string;
  createdAt: string;
}

const DashboardNavbar = ({ onMenuClick }: DashboardNavbarProps) => {
  const [isadminn, setIsAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const logout = async () => {
    await fetch("/api/users/logout", {
      method: "PUT",
      headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isadmin = async () => {
    const res = await fetch("/api/users/checkrole", {
      headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setIsAdmin(data.role === "admin");
  };

  const fetchUnread = async () => {
    try {
      const res = await fetch("/api/notifications", {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const data: Notification[] = await res.json();
        if (Array.isArray(data)) {
          setUnreadCount(data.filter((n) => !n.read).length);
        }
      }
    } catch { }
  };

  useEffect(() => {
    isadmin();
    fetchUnread();
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-[10px] text-sm font-bold no-underline transition-all ${
      isActive
        ? "bg-indigo-500/[0.18] text-indigo-300 border border-indigo-500/[0.30]"
        : "text-white/70 hover:bg-white/[0.07] border border-transparent hover:text-white"
    }`;

  return (
    <nav className="[grid-area:nav] bg-[#080b1a] border-b border-indigo-500/[0.15] h-full flex items-center px-4 relative shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
      <button
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-[10px] border border-indigo-500/[0.25] bg-indigo-500/[0.10] text-indigo-300 cursor-pointer mr-3 transition-all hover:bg-indigo-500/[0.18]"
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <FaBars size={16} />
      </button>

      {isadminn && (
        <button
          className="flex items-center gap-2 h-9 px-3 rounded-[10px] bg-indigo-600/[0.75] text-white text-sm font-bold cursor-pointer border-none mr-3 transition-all hover:bg-indigo-600/[0.90]"
          onClick={() => navigate("/admindashboard")}
        >
          <FaUsers size={16} />
          <span>Users</span>
        </button>
      )}

      <span className="font-extrabold text-lg sm:text-xl tracking-wide mx-auto bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
        Dashboard
      </span>

      <div className="flex items-center gap-1 sm:gap-2">
        <NavLink to="profile" className={navLinkClass}>
          <IoPersonSharp size={15} />
          <span className="hidden md:inline">Profile</span>
        </NavLink>

        <NavLink to="feedback" className={navLinkClass}>
          <MdFeedback size={15} />
          <span className="hidden md:inline">Feedback</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={navLinkClass}
        >
          <FaProjectDiagram size={14} />
          <span className="hidden md:inline">Projects</span>
        </NavLink>

        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-[10px] border border-indigo-500/[0.22] bg-indigo-500/[0.08] text-indigo-300 cursor-pointer transition-all hover:bg-indigo-500/[0.16]"
          onClick={() => navigate("/notifications")}
          aria-label="Notifications"
        >
          <MdNotifications size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        <button
          className="flex items-center gap-1.5 h-9 px-3 rounded-[10px] bg-red-700/[0.70] hover:bg-red-600/[0.80] text-white text-sm font-bold cursor-pointer border-none transition-all"
          onClick={logout}
        >
          <IoIosLogOut size={17} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
