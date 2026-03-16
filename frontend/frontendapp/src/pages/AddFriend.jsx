import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";

export const AddFriend = () => {
  const [users, setUsers] = useState([]);
  const [searchfilter, setSearchFilter] = useState("");

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
      alert("error " + error.message);
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

      if (res.status != 200) {
        const errorr = await res.json();
        throw new Error(errorr.message);
      }

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

  return (
    <div style={pageStyle}>
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
