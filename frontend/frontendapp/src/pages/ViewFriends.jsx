import { useState, useEffect } from "react";
import { IoPersonRemove } from "react-icons/io5";
import { FaUserSlash, FaUserCircle } from "react-icons/fa";

export const ViewFriends = () => {
  const [friends, setFriends] = useState([]);
  const [searchfilter, setSearchFilter] = useState("");

  const fetchfriends = async () => {
    try {
      const friendsjson = await fetch(
        `http://localhost:3000/api/friendship/viewfriends`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (friendsjson.status == 500) {
        const errorr = await friendsjson.json();
        throw new Error(errorr.message);
      }

      const friendsarray = await friendsjson.json();
      setFriends(friendsarray);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchfriends();
  }, []);

  const removefriend = async (friendid) => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/friendship/removefriend",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ friendid: friendid }),
        },
      );

      if (res.status != 200) {
        const errorr = await res.json();
        throw new Error(errorr.message);
      }

      alert("friend deleted ");
      setFriends(
        friends.filter((friend) => {
          return friend._id != friendid;
        }),
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const blockfriend = async (friendid) => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/friendship/blockuser",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ userid: friendid }),
        },
      );

      if (res.status != 200) {
        const errorr = await res.json();
        throw new Error(errorr.message);
      }

      alert("friend blocked ");
      setFriends(
        friends.filter((friend) => {
          return friend._id != friendid;
        }),
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().startsWith(searchfilter.toLowerCase()),
  );

  const pageStyle = {
    width: "100%",
    boxSizing: "border-box",
  };

  const topBar = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
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

  const friendsdiv = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  };

  const frienddiv = {
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
    gap: "12px",
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
    marginTop: "2px",
  };

  const metaStyle = {
    color: "rgba(255,255,255,0.72)",
    fontSize: "14px",
    lineHeight: "1.6",
  };

  const statusStyle = (isActive) => ({
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
    color: isActive ? "#08110c" : "#ffffff",
    background: isActive
      ? "linear-gradient(135deg, #00c853, #00e676)"
      : "rgba(255,255,255,0.10)",
  });

  const actionsRow = {
    display: "flex",
    gap: "10px",
    marginTop: "8px",
    flexWrap: "wrap",
    justifyContent: "center",
  };

  const removeButton = {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #c62828, #e53935)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const blockButton = {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #ef6c00, #fb8c00)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
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
      <div style={topBar}>
        <input
          type="text"
          placeholder="Search friends..."
          value={searchfilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          style={searchInput}
        />
      </div>

      <div style={friendsdiv}>
        {filteredFriends.length == 0 && (
          <h1 style={emptyState}>No Friends Found</h1>
        )}

        {filteredFriends.length != 0 &&
          filteredFriends.map((friend) => {
            return (
              <div style={frienddiv} key={friend._id}>
                <div style={avatarStyle}>
                  <FaUserCircle size={34} />
                </div>

                <div style={usernameStyle}>{friend.username}</div>

                <div style={statusStyle(friend.isActive)}>
                  {friend.isActive ? "Online 🟢" : "Inactive ⚫"}
                </div>

                <div style={metaStyle}>{friend.friendshipdate}</div>

                <div style={actionsRow}>
                  <button
                    style={removeButton}
                    onClick={() => removefriend(friend._id)}
                  >
                    Remove <IoPersonRemove />
                  </button>

                  <button
                    style={blockButton}
                    onClick={() => blockfriend(friend._id)}
                  >
                    Block <FaUserSlash />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
