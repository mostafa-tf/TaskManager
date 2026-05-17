import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBell } from "react-icons/fa";
import { io, Socket } from "socket.io-client";
import { MdDeleteOutline } from "react-icons/md";

export const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [noNotifications, setNoNotifications] = useState(false);
  const [message, setMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();

  const showMsg = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(""), 3000); };

  const fetchNotifications = async () => {
    setNoNotifications(false); setNotifications([]);
    try {
      const res = await fetch("/api/notifications", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status === 404) setNoNotifications(true);
      else if (res.status === 200) setNotifications(data);
    } catch { }
  };

  useEffect(() => {
    fetchNotifications();
    socketRef.current = io("/", {
      path: "/api/socket.io",
      auth: { token: localStorage.getItem("token") },
    });
    socketRef.current.on("notification", (notification: any) => {
      setNotifications((prev) => [notification, ...prev]);
      setNoNotifications(false);
      showMsg("New notification received!");
    });
    return () => { socketRef.current?.disconnect(); };
  }, []);

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PUT", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      await fetchNotifications();
    } catch { }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      await fetchNotifications();
    } catch { }
  };

  return (
    <div className="min-h-screen bg-[#06070f] p-[30px]">
      {message && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="px-7 py-5 rounded-[20px] bg-[rgba(12,10,30,0.98)] border border-indigo-500/[0.35] text-indigo-300 font-bold text-base shadow-[0_20px_50px_rgba(0,0,0,0.5)]">{message}</div>
        </div>
      )}

      <div className="flex items-center gap-[14px] mb-7">
        <button onClick={() => navigate("/dashboard")} className="w-[46px] h-[46px] rounded-[14px] border border-indigo-500/[0.25] bg-indigo-500/[0.10] text-indigo-300 cursor-pointer flex items-center justify-center transition-all hover:bg-indigo-500/[0.18]">
          <FaArrowLeft size={17} />
        </button>
        <div className="w-[52px] h-[52px] rounded-2xl bg-indigo-500/[0.12] border border-indigo-500/[0.22] flex items-center justify-center text-indigo-300">
          <FaBell size={22} />
        </div>
        <div>
          <h2 className="m-0 text-[28px] font-extrabold text-white">Notifications</h2>
          <p className="m-0 text-white/50 text-sm">Stay updated with your latest activity.</p>
        </div>
      </div>

      {noNotifications && (
        <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
          <div className="w-[72px] h-[72px] rounded-2xl bg-indigo-500/[0.10] border border-indigo-500/[0.20] flex items-center justify-center mb-5">
            <FaBell size={30} className="text-indigo-400" />
          </div>
          <h2 className="m-0 mb-2 text-[22px] font-extrabold text-white">No notifications</h2>
          <p className="m-0 text-white/45 text-[14px] max-w-[280px] leading-[1.7]">You're all caught up! New notifications will appear here.</p>
        </div>
      )}

      <div className="max-w-[800px] flex flex-col gap-2.5">
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`px-5 py-4 rounded-2xl flex justify-between items-center gap-[14px] transition-all ${n.read ? "bg-white/[0.03] border border-white/[0.06]" : "bg-indigo-500/[0.07] border border-indigo-500/[0.20]"}`}
          >
            <div className="flex-1 min-w-0">
              {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-400 mb-1.5" />}
              <p className="m-0 mb-1 text-white font-bold text-[15px]">{n.message}</p>
              <p className="m-0 text-white/40 text-xs">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              {!n.read && (
                <button onClick={() => markRead(n._id)} className="h-[34px] px-3 rounded-[10px] border border-indigo-500/[0.28] bg-indigo-500/[0.12] text-indigo-300 text-xs font-bold cursor-pointer transition-all hover:bg-indigo-500/[0.20]">
                  Mark Read
                </button>
              )}
              <button onClick={() => deleteNotification(n._id)} className="h-[34px] w-9 rounded-[10px] border border-red-500/[0.20] bg-red-500/[0.10] text-red-400 cursor-pointer flex items-center justify-center transition-all hover:bg-red-500/[0.18]">
                <MdDeleteOutline size={17} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
