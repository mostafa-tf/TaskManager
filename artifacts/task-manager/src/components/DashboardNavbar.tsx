import { IoIosLogOut } from "react-icons/io";
import { useNavigate, NavLink } from "react-router-dom";
import { IoPersonSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { FaUsers, FaBars } from "react-icons/fa";
import { FaProjectDiagram } from "react-icons/fa";
import { MdFeedback, MdNotifications } from "react-icons/md";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useTheme } from "../contexts/ThemeContext";

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
  const { isDark, toggleTheme } = useTheme();

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

  return (
    <nav className="[grid-area:nav] bg-[#07110d] border-b border-[#1f3d2e] h-full flex items-center px-4 relative">
      <button
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-[10px] border border-[rgba(0,255,140,0.2)] bg-[rgba(0,255,140,0.08)] text-[#dffff0] cursor-pointer mr-3"
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <FaBars size={16} />
      </button>

      {isadminn && (
        <button
          className="flex items-center gap-2 h-10 px-4 rounded-[10px] bg-[rgba(21,101,192,0.85)] text-[#dffff0] text-sm font-bold cursor-pointer border-none mr-3"
          onClick={() => navigate("/admindashboard")}
        >
          <FaUsers size={18} />
          <span>Users</span>
        </button>
      )}

      <span className="text-[#00e676] font-extrabold text-lg sm:text-xl tracking-wide mx-auto">
        Dashboard
      </span>

      <div className="flex items-center gap-1 sm:gap-2">
        <NavLink
          to="profile"
          className={({ isActive }) =>
            `hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-[10px] text-sm font-bold no-underline transition-all ${isActive ? "bg-[rgba(0,255,140,0.14)] text-[#00ff9d] border border-[rgba(0,255,140,0.22)]" : "text-[#dffff0] hover:bg-[rgba(255,255,255,0.07)] border border-transparent"}`
          }
        >
          <IoPersonSharp size={16} />
          <span className="hidden md:inline">Profile</span>
        </NavLink>

        <NavLink
          to="feedback"
          className={({ isActive }) =>
            `hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-[10px] text-sm font-bold no-underline transition-all ${isActive ? "bg-[rgba(0,255,140,0.14)] text-[#00ff9d] border border-[rgba(0,255,140,0.22)]" : "text-[#dffff0] hover:bg-[rgba(255,255,255,0.07)] border border-transparent"}`
          }
        >
          <MdFeedback size={16} />
          <span className="hidden md:inline">Feedback</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-[10px] text-sm font-bold no-underline transition-all ${isActive ? "bg-[rgba(0,255,140,0.14)] text-[#00ff9d] border border-[rgba(0,255,140,0.22)]" : "text-[#dffff0] hover:bg-[rgba(255,255,255,0.07)] border border-transparent"}`
          }
        >
          <FaProjectDiagram size={15} />
          <span className="hidden md:inline">Projects</span>
        </NavLink>

        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-[10px] border border-[rgba(0,255,140,0.18)] bg-[rgba(0,255,140,0.06)] text-[#dffff0] cursor-pointer"
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
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="w-9 h-9 flex items-center justify-center rounded-[10px] border border-[rgba(0,255,140,0.18)] bg-[rgba(0,255,140,0.06)] text-[#dffff0] cursor-pointer"
        >
          {isDark ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
        </button>

        <button
          className="flex items-center gap-1.5 h-9 px-3 rounded-[10px] bg-[rgba(198,40,40,0.75)] text-white text-sm font-bold cursor-pointer border-none"
          onClick={logout}
        >
          <IoIosLogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
