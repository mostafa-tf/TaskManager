import { useState, useEffect } from "react";
import { FaUserSlash, FaUnlockAlt, FaUserCircle } from "react-icons/fa";

export const BlockedUsers = () => {
  const [blockedusers, setBlockedUsers] = useState([]);

  const removeblock = async (userid) => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/friendship/unblockuser",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ userid: userid }),
        },
      );

      if (res.status != 200) {
        const errorobject = await res.json();
        throw new Error(errorobject.message);
      }

      alert("blocked removed ");

      setBlockedUsers(
        blockedusers.filter((user) => {
          return user._id != userid;
        }),
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchblockedusers = async () => {
    try {
      const blockedusersjson = await fetch(
        `http://localhost:3000/api/friendship/blockedusers`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (blockedusersjson.status == 500) {
        const errorr = await blockedusersjson.json();
        throw new Error(errorr.message);
      }

      const blockedusersarray = await blockedusersjson.json();
      setBlockedUsers(blockedusersarray);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchblockedusers();
  }, []);

  const pageStyle = {
    width: "100%",
  };

  const titleStyle = {
    textAlign: "center",
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "24px",
  };

  const blockedusersdiv = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  };

  const blockeduserdiv = {
    padding: "22px 18px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,255,140,0.14)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
    backdropFilter: "blur(12px)",
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
    background: "rgba(255,0,0,0.10)",
    border: "1px solid rgba(255,0,0,0.20)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffb3b3",
  };

  const usernameStyle = {
    fontSize: "20px",
    fontWeight: "800",
    color: "#ffffff",
  };

  const subtitleStyle = {
    color: "rgba(255,255,255,0.65)",
    fontSize: "14px",
  };

  const unblockButton = {
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

  const emptyState = {
    textAlign: "center",
    color: "#ff8f8f",
    fontSize: "30px",
    fontWeight: "800",
    marginTop: "40px",
  };

  return (
    <div style={pageStyle}>
      <h2 style={titleStyle}>Blocked Users</h2>

      <div style={blockedusersdiv}>
        {blockedusers.length == 0 && (
          <h1 style={emptyState}>No Blocked Users Found</h1>
        )}

        {blockedusers.length != 0 &&
          blockedusers.map((blockeduser) => {
            return (
              <div style={blockeduserdiv} key={blockeduser._id}>
                <div style={avatarStyle}>
                  <FaUserSlash size={30} />
                </div>

                <div style={usernameStyle}>{blockeduser.username}</div>

                <div style={subtitleStyle}>This user is blocked</div>

                <button
                  style={unblockButton}
                  onClick={() => removeblock(blockeduser._id)}
                >
                  <FaUnlockAlt />
                  Unblock
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};
