import { useState, useEffect } from "react";
import { FaUserSlash, FaUnlockAlt } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";

export const BlockedUsers = () => {
  const [blockedusers, setBlockedUsers] = useState([]);
  const [messageBox, setMessageBox] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  const showBox = (type, title, message) => {
    setMessageBox({ show: true, type, title, message });
  };

  useEffect(() => {
    if (messageBox.show) {
      const timer = setTimeout(() => {
        setMessageBox({ show: false, type: "", title: "", message: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [messageBox.show]);

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

      const data = await res.json();

      if (res.status != 200) {
        throw new Error(data.message);
      }

      showBox("success", "User Unblocked", data.message || "Blocked removed");

      setBlockedUsers(
        blockedusers.filter((user) => {
          return user._id != userid;
        }),
      );
    } catch (error) {
      showBox(
        "error",
        "Unblock Failed",
        error.message || "Something went wrong",
      );
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
      showBox("error", "Error", error.message || "Error From Server");
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

  const boxOverlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };

  const isError = messageBox.type === "error";

  const boxStyle = {
    width: "min(430px, 90%)",
    padding: "22px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, rgba(22,22,22,0.98), rgba(12,12,12,0.98))",
    border: isError
      ? "1px solid rgba(255,77,79,0.45)"
      : "1px solid rgba(0,255,140,0.35)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    color: "#fff",
  };

  const boxIcon = {
    minWidth: "52px",
    height: "52px",
    borderRadius: "18px",
    background: isError ? "rgba(255,77,79,0.14)" : "rgba(0,255,140,0.12)",
    border: isError
      ? "1px solid rgba(255,77,79,0.25)"
      : "1px solid rgba(0,255,140,0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: isError ? "#ff6b6b" : "#60ff9c",
  };

  const boxTitle = {
    margin: "0 0 5px",
    fontSize: "18px",
    fontWeight: "800",
  };

  const boxMessage = {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.5",
    color: "rgba(255,255,255,0.72)",
  };

  return (
    <div style={pageStyle}>
      {messageBox.show && (
        <div style={boxOverlay}>
          <div style={boxStyle}>
            <div style={boxIcon}>
              {isError ? (
                <MdErrorOutline size={30} />
              ) : (
                <MdCheckCircleOutline size={30} />
              )}
            </div>

            <div>
              <h3 style={boxTitle}>{messageBox.title}</h3>
              <p style={boxMessage}>{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

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
