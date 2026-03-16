import { useState, useEffect } from "react";
import { FaUserCheck, FaUserTimes, FaUserCircle } from "react-icons/fa";

export const IncomingRequests = () => {
  const [users, setUsers] = useState([]);

  const fetchusers = async () => {
    try {
      const usersjson = await fetch(
        "http://localhost:3000/api/friendship/incomingrequests",
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (usersjson.status != 200) {
        const message = await usersjson.json();
        throw new Error(message.message);
      }

      const usersarray = await usersjson.json();
      setUsers(usersarray);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchusers();
  }, []);

  const acceptuser = async (userid) => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/friendship/acceptuser",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ userid: userid }),
        },
      );

      if (res.status != 200) {
        const errorr = await res.json();
        throw new Error(errorr.message);
      }

      alert("friend accepted ");
      setUsers(
        users.filter((user) => {
          return user._id != userid;
        }),
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const rejectuser = async (userid) => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/friendship/rejectuser",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ userid: userid }),
        },
      );

      if (res.status != 200) {
        const errorr = await res.json();
        throw new Error(errorr.message);
      }

      alert("user rejected ");
      setUsers(
        users.filter((user) => {
          return user._id != userid;
        }),
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const pageStyle = {
    width: "100%",
    boxSizing: "border-box",
  };

  const titleStyle = {
    textAlign: "center",
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "24px",
  };

  const usersdiv = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  };

  const usercard = {
    padding: "22px 18px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,255,140,0.14)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
    textAlign: "center",
  };

  const avatarStyle = {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "rgba(0,255,140,0.10)",
    border: "1px solid rgba(0,255,140,0.20)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#dffff0",
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
  };

  const usernameStyle = {
    fontSize: "20px",
    fontWeight: "800",
    color: "#ffffff",
  };

  const subtitleStyle = {
    color: "rgba(255,255,255,0.70)",
    fontSize: "14px",
  };

  const actionsRow = {
    display: "flex",
    gap: "10px",
    marginTop: "8px",
    flexWrap: "wrap",
    justifyContent: "center",
  };

  const acceptButton = {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #00c853, #00e676)",
    color: "#08110c",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 10px 24px rgba(0, 200, 83, 0.25)",
  };

  const rejectButton = {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #c62828, #e53935)",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 10px 24px rgba(229, 57, 53, 0.25)",
  };

  const emptyState = {
    textAlign: "center",
    color: "#ff8f8f",
    fontSize: "30px",
    fontWeight: "800",
    marginTop: "40px",
  };

  return (
    <div style={pageStyle}>
      <h2 style={titleStyle}>Incoming Friend Requests</h2>

      <div style={usersdiv}>
        {users.length == 0 && <h1 style={emptyState}>No Users Found</h1>}

        {users.length > 0 &&
          users.map((user) => {
            return (
              <div style={usercard} key={user._id}>
                <div style={avatarStyle}>
                  <FaUserCircle size={34} />
                </div>

                <div style={usernameStyle}>{user.username}</div>
                <div style={subtitleStyle}>Wants to connect with you</div>

                <div style={actionsRow}>
                  <button
                    onClick={() => acceptuser(user._id)}
                    style={acceptButton}
                  >
                    <FaUserCheck />
                    Accept
                  </button>

                  <button
                    onClick={() => rejectuser(user._id)}
                    style={rejectButton}
                  >
                    <FaUserTimes />
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
