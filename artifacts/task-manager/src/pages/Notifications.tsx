import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBell } from "react-icons/fa";
import { io, Socket } from "socket.io-client";

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
    <div className="min-h-screen bg-[linear-gradient(135deg,#07110d_0%,#0b1d15_50%,#08110c_100%)] p-[30px]">
      {message && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="px-7 py-5 rounded-[20px] bg-[rgba(15,15,15,0.98)] border border-[rgba(0,255,140,0.30)] text-[#60ff9c] font-bold text-base">{message}</div>
        </div>
      )}

      <div className="flex items-center gap-[14px] mb-7">
        <button onClick={() => navigate("/dashboard")} className="w-[46px] h-[46px] rounded-[14px] border border-[rgba(0,255,140,0.2)] bg-[rgba(0,255,140,0.08)] text-[#dffff0] cursor-pointer flex items-center justify-center">
          <FaArrowLeft size={18} />
        </button>
        <div className="w-[52px] h-[52px] rounded-2xl bg-[rgba(0,255,140,0.10)] flex items-center justify-center text-[#dffff0]"><FaBell size={24} /></div>
        <div>
          <h2 className="m-0 text-[28px] font-extrabold text-white">Notifications</h2>
          <p className="m-0 text-white/65 text-sm">Stay updated with your latest activity.</p>
        </div>
      </div>

      {noNotifications && <h2 className="text-[#60ff9c] font-extrabold">No Notifications</h2>}

      {notifications.map((n) => (
        <div
          key={n._id}
          className={`px-5 py-4 rounded-2xl mb-2.5 flex justify-between items-center gap-[14px] ${n.read ? "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)]" : "bg-[rgba(0,255,140,0.07)] border border-[rgba(0,255,140,0.18)]"}`}
        >
          <div>
            <p className="m-0 mb-1 text-white font-bold text-[15px]">{n.message}</p>
            <p className="m-0 text-white/50 text-xs">{new Date(n.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            {!n.read && (
              <button onClick={() => markRead(n._id)} className="h-[34px] px-3 rounded-[10px] border-none bg-[rgba(0,255,140,0.15)] text-[#60ff9c] text-xs font-bold cursor-pointer">
                Mark Read
              </button>
            )}
            <button onClick={() => deleteNotification(n._id)} className="h-[34px] w-9 rounded-[10px] border-none bg-[rgba(198,40,40,0.35)] text-[#ff9c9c] cursor-pointer flex items-center justify-center">
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
