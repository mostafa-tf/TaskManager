import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";

export const AddFriend = () => {
  const [users, setUsers] = useState([]);
  const [searchfilter, setSearchFilter] = useState("");
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

  const fetchusers = async () => {
    try {
      const usersjson = await fetch(
        `http://localhost:3000/api/friendship/nonfriendsusers`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (usersjson.status != 200) {
        const errorr = await usersjson.json();
        throw new Error(errorr.message);
      }

      const usersarray = await usersjson.json();
      setUsers(usersarray);
    } catch (error) {
      showBox("error", "Error", error.message || "Error From Server");
    }
  };

  let filteredUsers = users.filter((user) => {
    return user.username.startsWith(searchfilter);
  });

  useEffect(() => {
    fetchusers();
  }, []);

  const addfriend = async (userid) => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/friendship/addfriend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ receiver: userid }),
        },
      );

      const data = await res.json();

      if (res.status != 200) {
        throw new Error(data.message);
      }

      setUsers(
        users.filter((user) => {
          return user._id != userid;
        }),
      );

      showBox(
        "success",
        "Friend Request Sent",
        data.message || "Request sent successfully",
      );
    } catch (error) {
      showBox(
        "error",
        "Request Failed",
        error.message || "Something went wrong",
      );
    }
  };

  const pageStyle = {
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
  };

  const searchWrapper = {
    width: "100%",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "center",
  };

  const searchInput = {
    width: "320px",
    height: "48px",
    borderRadius: "14px",
    border: "1px solid rgba(0,255,140,0.18)",
    background: "rgba(255,255,255,0.07)",
    color: "#ffffff",
    padding: "0 14px",
    outline: "none",
    fontSize: "15px",
  };

  const usersdiv = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "18px",
  };

  const usercard = {
    padding: "20px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,255,140,0.14)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
    backdropFilter: "blur(12px)",
  };

  const avatarStyle = {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "rgba(0,255,140,0.10)",
    border: "1px solid rgba(0,255,140,0.20)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#dffff0",
  };

  const usernameStyle = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#ffffff",
  };

  const addButton = {
    marginTop: "6px",
    padding: "10px 16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #00c853, #00e676)",
    color: "#08110c",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const emptyState = {
    textAlign: "center",
    color: "#ff8f8f",
    fontSize: "28px",
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

      <div style={searchWrapper}>
        <input
          type="text"
          placeholder="Search for user..."
          value={searchfilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          style={searchInput}
        />
      </div>

      {filteredUsers.length == 0 && <h1 style={emptyState}>No Users Found</h1>}

      {filteredUsers.length != 0 && (
        <div style={usersdiv}>
          {filteredUsers.map((user) => {
            return (
              <div style={usercard} key={user._id}>
                <div style={avatarStyle}>
                  <IoPersonSharp size={28} />
                </div>

                <div style={usernameStyle}>{user.username}</div>

                <button style={addButton} onClick={() => addfriend(user._id)}>
                  <FaUserPlus />
                  Add Friend
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
