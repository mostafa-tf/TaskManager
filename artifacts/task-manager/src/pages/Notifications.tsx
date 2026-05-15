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
    } catch { /* silent */ }
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

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PUT", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      await fetchNotifications();
    } catch { /* silent */ }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      await fetchNotifications();
    } catch { /* silent */ }
  };

  const cardStyle = (read: boolean): React.CSSProperties => ({
    padding: "16px 20px", borderRadius: "16px", marginBottom: "10px",
    background: read ? "rgba(255,255,255,0.04)" : "rgba(0,255,140,0.07)",
    border: read ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,255,140,0.18)",
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px",
  });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #07110d 0%, #0b1d15 50%, #08110c 100%)", padding: "30px" }}>
      {message && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ padding: "20px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: "1px solid rgba(0,255,140,0.30)", color: "#60ff9c", fontWeight: "700", fontSize: "16px" }}>{message}</div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
        <button onClick={() => navigate("/dashboard")} style={{ width: "46px", height: "46px", borderRadius: "14px", border: "1px solid rgba(0,255,140,0.2)", background: "rgba(0,255,140,0.08)", color: "#dffff0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaArrowLeft size={18} /></button>
        <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(0,255,140,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: "#dffff0" }}><FaBell size={24} /></div>
        <div><h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>Notifications</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>Stay updated with your latest activity.</p></div>
      </div>
      {noNotifications && <h2 style={{ color: "#60ff9c", fontWeight: "800" }}>No Notifications</h2>}
      {notifications.map((n) => (
        <div style={cardStyle(n.read)} key={n._id}>
          <div>
            <p style={{ margin: "0 0 4px", color: "#ffffff", fontWeight: "700", fontSize: "15px" }}>{n.message}</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.50)", fontSize: "12px" }}>{new Date(n.createdAt).toLocaleString()}</p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            {!n.read && <button onClick={() => markRead(n._id)} style={{ height: "34px", padding: "0 12px", borderRadius: "10px", border: "none", background: "rgba(0,255,140,0.15)", color: "#60ff9c", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Mark Read</button>}
            <button onClick={() => deleteNotification(n._id)} style={{ height: "34px", width: "36px", borderRadius: "10px", border: "none", background: "rgba(198,40,40,0.35)", color: "#ff9c9c", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
        </div>
      ))}
    </div>
  );
};
