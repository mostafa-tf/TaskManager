import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBell, FaClock } from "react-icons/fa";
import { FaProjectDiagram } from "react-icons/fa";
import { GiThreeFriends } from "react-icons/gi";
import { RiTaskLine } from "react-icons/ri";
import { useSocket } from "../contexts/SocketContext";

const typeConfig: Record<string, { icon: JSX.Element; label: string; color: string; bg: string; border: string }> = {
  "assigned project": {
    icon: <FaProjectDiagram size={20} />,
    label: "Project",
    color: "#40c4ff",
    bg: "rgba(64,196,255,0.12)",
    border: "rgba(64,196,255,0.28)",
  },
  "assigned task": {
    icon: <RiTaskLine size={22} />,
    label: "Task",
    color: "#00e676",
    bg: "rgba(0,230,118,0.12)",
    border: "rgba(0,230,118,0.28)",
  },
  "friend request accepted": {
    icon: <GiThreeFriends size={22} />,
    label: "Friend",
    color: "#ea80fc",
    bg: "rgba(234,128,252,0.12)",
    border: "rgba(234,128,252,0.28)",
  },
  "task expiration": {
    icon: <FaClock size={18} />,
    label: "Expiring",
    color: "#ff9800",
    bg: "rgba(255,152,0,0.12)",
    border: "rgba(255,152,0,0.28)",
  },
};

const defaultConfig = {
  icon: <FaBell size={18} />,
  label: "Alert",
  color: "#ffffff",
  bg: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.18)",
};

export const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [noNotifications, setNoNotifications] = useState(false);
  const [message, setMessage] = useState("");
  const { socket } = useSocket();
  const navigate = useNavigate();

  const showMsg = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchNotifications = async () => {
    setNoNotifications(false);
    setNotifications([]);
    try {
      const res = await fetch("/api/notifications", {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.status === 404) setNoNotifications(true);
      else if (res.status === 200) setNotifications(data);
    } catch { }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onProjectInvitation = (notification: any) => {
      setNotifications((prev) => [notification, ...prev]);
      setNoNotifications(false);
      showMsg("You've been added to a project!");
    };
    const onAssignedTask = (notification: any) => {
      setNotifications((prev) => [notification, ...prev]);
      setNoNotifications(false);
      showMsg("A new task has been assigned to you!");
    };
    const onRequestAccepted = (notification: any) => {
      setNotifications((prev) => [notification, ...prev]);
      setNoNotifications(false);
      showMsg("A friend request was accepted!");
    };
    const onNotification = (notification: any) => {
      setNotifications((prev) => [notification, ...prev]);
      setNoNotifications(false);
      showMsg("New notification received!");
    };

    socket.on("project_invitation", onProjectInvitation);
    socket.on("assigned_task", onAssignedTask);
    socket.on("request_accepted", onRequestAccepted);
    socket.on("notification", onNotification);

    return () => {
      socket.off("project_invitation", onProjectInvitation);
      socket.off("assigned_task", onAssignedTask);
      socket.off("request_accepted", onRequestAccepted);
      socket.off("notification", onNotification);
    };
  }, [socket]);

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    } catch { }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications((prev) => {
        const updated = prev.filter((n) => n._id !== id);
        if (updated.length === 0) setNoNotifications(true);
        return updated;
      });
    } catch { }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top, rgba(0,255,140,0.08), transparent 24%), linear-gradient(135deg, #07110d 0%, #0b1d15 45%, #08110c 100%)", color: "#fff" }}>
      {message && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ padding: "18px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: "1px solid rgba(0,255,140,0.30)", color: "#60ff9c", fontWeight: "800", fontSize: "15px" }}>{message}</div>
        </div>
      )}

      <nav style={{ height: "95px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", background: "rgba(5,10,8,0.95)", borderBottom: "1px solid rgba(0,255,140,0.14)", boxShadow: "0 10px 30px rgba(0,0,0,0.35)", backdropFilter: "blur(10px)" }}>
        <button onClick={() => navigate("/dashboard")}
          style={{ width: "56px", height: "56px", borderRadius: "50%", position: "absolute", left: "24px", display: "flex", alignItems: "center", justifyContent: "center", color: "#dffff0", border: "1px solid rgba(0,255,140,0.18)", background: "rgba(255,255,255,0.06)", cursor: "pointer", fontSize: "20px" }}>
          <FaArrowLeft />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "rgba(0,255,140,0.10)", border: "1px solid rgba(0,255,140,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#dffff0" }}>
            <FaBell size={20} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "0.4px" }}>Notifications</span>
            {unreadCount > 0 && (
              <span style={{ padding: "3px 10px", borderRadius: "999px", background: "rgba(0,230,118,0.18)", border: "1px solid rgba(0,230,118,0.30)", color: "#00e676", fontSize: "13px", fontWeight: "800" }}>
                {unreadCount} new
              </span>
            )}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: "780px", margin: "0 auto", padding: "28px 20px 50px" }}>
        {noNotifications && notifications.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: "60px" }}>
            <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "rgba(0,255,140,0.08)", border: "1px solid rgba(0,255,140,0.14)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", color: "rgba(255,255,255,0.25)" }}>
              <FaBell size={28} />
            </div>
            <h2 style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontWeight: "700", fontSize: "20px" }}>No notifications yet</h2>
            <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.30)", fontSize: "14px" }}>You're all caught up!</p>
          </div>
        )}

        {notifications.map((n) => {
          const cfg = typeConfig[n.type] || defaultConfig;
          return (
            <div key={n._id} style={{
              display: "flex", alignItems: "center", gap: "14px",
              padding: "16px 18px", borderRadius: "18px", marginBottom: "10px",
              background: n.isRead ? "rgba(255,255,255,0.04)" : "rgba(0,255,140,0.05)",
              border: n.isRead ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,255,140,0.16)",
            }}>
              <div style={{ minWidth: "46px", height: "46px", borderRadius: "14px", background: cfg.bg, border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: cfg.color, flexShrink: 0 }}>
                {cfg.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
                  <span style={{ padding: "2px 9px", borderRadius: "999px", background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: "11px", fontWeight: "800", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                    {cfg.label}
                  </span>
                  {!n.isRead && (
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#00e676", display: "inline-block" }} />
                  )}
                </div>
                <p style={{ margin: 0, color: n.isRead ? "rgba(255,255,255,0.72)" : "#ffffff", fontWeight: n.isRead ? "500" : "700", fontSize: "15px", lineHeight: "1.5" }}>
                  {n.message}
                </p>
                <p style={{ margin: "5px 0 0", color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                {!n.isRead && (
                  <button onClick={() => markRead(n._id)}
                    style={{ height: "34px", padding: "0 12px", borderRadius: "10px", border: "none", background: "rgba(0,255,140,0.12)", color: "#60ff9c", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>
                    Mark Read
                  </button>
                )}
                <button onClick={() => deleteNotification(n._id)}
                  style={{ height: "34px", width: "34px", borderRadius: "10px", border: "none", background: "rgba(198,40,40,0.25)", color: "#ff9c9c", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};
