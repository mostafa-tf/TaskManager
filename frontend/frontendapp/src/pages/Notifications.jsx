import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { FaArrowLeft, FaBell } from "react-icons/fa";

const socket = io.connect("http://localhost:3000");

export const Notifications = () => {
  const navigate = useNavigate();

  const [myid, setMyId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  const sortNotifications = (arr) => {
    return [...arr].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  };

  const getmyid = async () => {
    const res = await fetch("http://localhost:3000/api/users/getmyid", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const errorr = await res.json();
      throw new Error(errorr.message);
    }

    const message = await res.json();
    setMyId(message.myid);
    return message.myid;
  };

  const fetchNotifications = async () => {
    const id = await getmyid();

    const res = await fetch("http://localhost:3000/api/notifications", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const errorr = await res.json();
      throw new Error(errorr.message);
    }

    const data = await res.json();
    setNotifications(sortNotifications(data));

    socket.emit("joinUserRoom", id);
  };

  const checkNewTaskNotifications = async () => {
    const res = await fetch(
      "http://localhost:3000/api/notifications/newtasksnotification",
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!res.ok) {
      const errorr = await res.json();
      throw new Error(errorr.message);
    }

    const newNotifications = await res.json();

    if (newNotifications.length > 0) {
      setNotifications((prev) =>
        sortNotifications([...newNotifications, ...prev]),
      );
    }
  };

  useEffect(() => {
    async function start() {
      try {
        await fetchNotifications();
      } catch (error) {
        alert(error.message);
      }
    }

    start();
  }, []);

  useEffect(() => {
    const addNotification = (notify) => {
      setNotifications((prev) => sortNotifications([notify, ...prev]));
    };

    socket.on("request_accepted", addNotification);
    socket.on("project_invitation", addNotification);
    socket.on("assigned_task", addNotification);

    return () => {
      socket.off("request_accepted", addNotification);
      socket.off("project_invitation", addNotification);
      socket.off("assigned_task", addNotification);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(
      async () => {
        try {
          await checkNewTaskNotifications();
        } catch (error) {
          alert(error.message);
        }
      },
      30 * 60 * 1000,
    );

    return () => clearInterval(timer);
  }, []);

  const filteredNotifications = notifications.filter((notify) => {
    if (filter === "unread") return notify.isRead === false;
    if (filter === "read") return notify.isRead === true;
    return true;
  });

  const markAsRead = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/notifications/markread/${id}`,
        {
          method: "PUT",
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!res.ok) {
        const errorr = await res.json();
        throw new Error(errorr.message);
      }

      const updatedNotification = await res.json();

      setNotifications((prev) =>
        prev.map((notify) =>
          notify._id === id ? updatedNotification : notify,
        ),
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={navbarStyle}>
        <button onClick={() => navigate(-1)} style={backButtonStyle}>
          <FaArrowLeft />
          Back
        </button>

        <div style={navTitleStyle}>
          <FaBell />
          Notifications
        </div>
      </div>

      <div style={containerStyle}>
        <div style={headerRowStyle}>
          <div>
            <h1 style={titleStyle}>Your Notifications</h1>
            <p style={subtitleStyle}>
              Stay updated with projects, tasks, and friend requests.
            </p>
          </div>

          <div style={filterBoxStyle}>
            <button
              onClick={() => setFilter("all")}
              style={filter === "all" ? activeFilterButton : filterButton}
            >
              All
            </button>

            <button
              onClick={() => setFilter("unread")}
              style={filter === "unread" ? activeFilterButton : filterButton}
            >
              Unread
            </button>

            <button
              onClick={() => setFilter("read")}
              style={filter === "read" ? activeFilterButton : filterButton}
            >
              Read
            </button>
          </div>
        </div>

        <div style={listStyle}>
          {filteredNotifications.length === 0 && (
            <div style={emptyStyle}>No notifications found</div>
          )}

          {filteredNotifications.map((notify) => {
            const unread = notify.isRead === false;

            return (
              <div
                key={notify._id}
                onClick={() => markAsRead(notify._id)}
                style={unread ? unreadCardStyle : readCardStyle}
              >
                <div style={iconStyle}>
                  <FaBell />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={cardTopStyle}>
                    <h3 style={cardTitleStyle}>{notify.type}</h3>

                    {unread && <span style={badgeStyle}>Unread</span>}
                  </div>

                  <p style={messageStyle}>{notify.message}</p>

                  <p style={dateStyle}>
                    {notify.createdAt
                      ? new Date(notify.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, #123524 0%, #08110d 45%, #050505 100%)",
  color: "#fff",
};

const navbarStyle = {
  height: "72px",
  padding: "0 28px",
  display: "flex",
  alignItems: "center",
  gap: "20px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(0,0,0,0.28)",
  backdropFilter: "blur(14px)",
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const backButtonStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  padding: "11px 16px",
  borderRadius: "14px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: "800",
};

const navTitleStyle = {
  fontSize: "22px",
  fontWeight: "900",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const containerStyle = {
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "36px 20px",
};

const headerRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  alignItems: "center",
  marginBottom: "28px",
  flexWrap: "wrap",
};

const titleStyle = {
  margin: 0,
  fontSize: "36px",
  fontWeight: "900",
};

const subtitleStyle = {
  marginTop: "8px",
  color: "rgba(255,255,255,0.65)",
};

const filterBoxStyle = {
  display: "flex",
  gap: "8px",
  padding: "7px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const filterButton = {
  border: "none",
  padding: "10px 16px",
  borderRadius: "13px",
  cursor: "pointer",
  background: "transparent",
  color: "rgba(255,255,255,0.68)",
  fontWeight: "800",
};

const activeFilterButton = {
  ...filterButton,
  background: "linear-gradient(135deg, #00c853, #00e676)",
  color: "#07110b",
};

const listStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const unreadCardStyle = {
  display: "flex",
  gap: "16px",
  padding: "20px",
  borderRadius: "22px",
  background: "linear-gradient(135deg, rgba(0,255,140,0.18), rgba(0,0,0,0.35))",
  border: "1px solid rgba(0,255,140,0.35)",
  boxShadow: "0 18px 35px rgba(0,0,0,0.30)",
  cursor: "pointer",
};

const readCardStyle = {
  ...unreadCardStyle,
  background: "rgba(255,255,255,0.055)",
  border: "1px solid rgba(255,255,255,0.08)",
  opacity: 0.78,
};

const iconStyle = {
  minWidth: "48px",
  height: "48px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.10)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#75ffad",
};

const cardTopStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "center",
};

const cardTitleStyle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "900",
};

const messageStyle = {
  margin: "8px 0",
  color: "rgba(255,255,255,0.82)",
  lineHeight: "1.5",
};

const dateStyle = {
  margin: 0,
  color: "rgba(255,255,255,0.45)",
  fontSize: "13px",
};

const badgeStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#00e676",
  color: "#06120a",
  fontSize: "12px",
  fontWeight: "900",
};

const emptyStyle = {
  padding: "50px",
  textAlign: "center",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.05)",
  color: "rgba(255,255,255,0.65)",
  fontSize: "22px",
  fontWeight: "800",
};
