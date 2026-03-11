import { FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FeedbacksDashboard } from "./FeedbacksDashboard";

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [usernamefilter, setUsernamefilter] = useState("");
  const [rolefilter, setRolefilter] = useState("");
  const [statusfilter, setStatusFilter] = useState("");

  const usersfilter = users.filter((user) => {
    return (
      user.username.startsWith(usernamefilter.trim().toLowerCase()) &&
      user.role.startsWith(rolefilter.trim().toLowerCase()) &&
      user.isActive.toString().startsWith(statusfilter)
    );
  });

  const navigate = useNavigate();

  const tasksofuser = (userid) => {
    allusertasks = tasks.filter((task) => task.userId == userid);
    donetasks = allusertasks.filter((task) => task.isDone == true);
    return [allusertasks, donetasks];
  };

  const deleteuser = async (email) => {
    setUsers(
      users.filter((user) => {
        return user.email != email;
      }),
    );

    fetch(`http://localhost:3000/api/users/${email}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  };

  const toggleblock = async (email) => {
    setUsers(
      users.map((user) => {
        if (user.email == email) {
          user.isbanned = !user.isbanned;
        }
        return user;
      }),
    );

    await fetch(`http://localhost:3000/api/users/toggleblock/${email}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  };

  const fetchallusersandtasks = async () => {
    try {
      const userandtasksjson = await fetch("http://localhost:3000/api/users", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const tasksandusersarray = await userandtasksjson.json();
      setUsers(tasksandusersarray);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchallusersandtasks();
  }, []);

  const findlastseen = (datestring) => {
    const now = new Date();
    const lastseen = new Date(datestring);
    const seconds = Math.floor((now - lastseen) / 1000);

    if (seconds < 60) {
      return "Just now";
    } else if (seconds < 3600) {
      return Math.floor(seconds / 60) + " minutes ago";
    } else if (seconds < 86400) {
      return Math.floor(seconds / 3600) + " hours ago";
    } else if (seconds < 2629746) {
      return Math.floor(seconds / 86400) + " days ago";
    } else {
      return Math.floor(seconds / 2629746) + " months ago";
    }
  };

  const pageStyle = {
    width: "100%",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(0,255,140,0.08), transparent 26%), linear-gradient(135deg, #07110d 0%, #0b1d15 45%, #08110c 100%)",
    color: "#ffffff",
  };

  const navStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "95px",
    position: "relative",
    fontSize: "34px",
    fontWeight: "800",
    color: "#ffffff",
    background: "rgba(5,10,8,0.95)",
    borderBottom: "1px solid rgba(0,255,140,0.14)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    letterSpacing: "0.5px",
  };

  const buttonstyle = {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    fontSize: "22px",
    position: "absolute",
    left: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#dffff0",
    border: "1px solid rgba(0,255,140,0.18)",
    background: "rgba(255,255,255,0.06)",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
  };

  const filtersWrapper = {
    width: "min(1200px, 92%)",
    margin: "28px auto 0",
    padding: "22px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,255,140,0.12)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    boxSizing: "border-box",
  };

  const filterField = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const labelStyle = {
    color: "#dffff0",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.3px",
  };

  const inputStyle = {
    width: "100%",
    height: "46px",
    borderRadius: "14px",
    border: "1px solid rgba(0,255,140,0.16)",
    background: "rgba(255,255,255,0.07)",
    color: "#ffffff",
    padding: "0 14px",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const mainStyle = {
    width: "100%",
    minHeight: "calc(100vh - 95px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "28px 20px 10px",
    boxSizing: "border-box",
  };

  const tableWrapper = {
    width: "min(1250px, 100%)",
    overflowX: "auto",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,255,140,0.12)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
    padding: "18px",
    boxSizing: "border-box",
  };

  const tablestyle = {
    width: "100%",
    minWidth: "1100px",
    borderCollapse: "separate",
    borderSpacing: "0",
    color: "#ffffff",
    fontSize: "15px",
    textAlign: "center",
    overflow: "hidden",
  };

  const thStyle = {
    padding: "18px 14px",
    background: "rgba(0,255,140,0.10)",
    color: "#dffff0",
    fontSize: "14px",
    fontWeight: "800",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "16px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.88)",
    whiteSpace: "nowrap",
  };

  const actionButtonBase = {
    height: "38px",
    padding: "0 12px",
    borderRadius: "10px",
    border: "none",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
    margin: "4px",
    fontSize: "13px",
  };

  const emptyStateStyle = {
    textAlign: "center",
    color: "#ff8f8f",
    fontSize: "34px",
    fontWeight: "800",
    marginTop: "50px",
  };

  const feedbackLinkWrapper = {
    textAlign: "center",
    padding: "10px 0 36px",
  };

  const feedbackLinkStyle = {
    display: "inline-block",
    padding: "14px 24px",
    borderRadius: "14px",
    textDecoration: "none",
    color: "#08110c",
    background: "linear-gradient(135deg, #00c853, #00e676)",
    fontWeight: "800",
    fontSize: "16px",
    boxShadow: "0 14px 30px rgba(0, 200, 83, 0.25)",
  };

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <button style={buttonstyle} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        Admin Dashboard
      </nav>

      <div style={filtersWrapper}>
        <div style={filterField}>
          <label style={labelStyle}>Enter Username</label>
          <input
            type="text"
            value={usernamefilter}
            onChange={(e) => setUsernamefilter(e.target.value)}
            style={inputStyle}
            placeholder="Search by username"
          />
        </div>

        <div style={filterField}>
          <label style={labelStyle}>Search By Role</label>
          <select
            value={rolefilter}
            onChange={(e) => setRolefilter(e.target.value)}
            style={inputStyle}
          >
            <option value="">Filter By Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div style={filterField}>
          <label style={labelStyle}>Search By Status</label>
          <select
            value={statusfilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="">Filter By Status</option>
            <option value="true">Active</option>
            <option value="false">InActive</option>
          </select>
        </div>
      </div>

      <main style={mainStyle}>
        {usersfilter.length == 0 && (
          <h1 style={emptyStateStyle}>No Users Found</h1>
        )}

        {usersfilter.length != 0 && (
          <div style={tableWrapper}>
            <table border={0} style={tablestyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Username</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Last Seen</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Date Joined</th>
                  <th style={thStyle}>Number Of Tasks</th>
                  <th style={thStyle}>Done Tasks</th>
                  <th style={thStyle}>% of Done Tasks</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {usersfilter.map((user) => {
                  return (
                    <tr key={user._id}>
                      <td style={tdStyle}>{user.username}</td>
                      <td style={tdStyle}>{user.email}</td>
                      <td style={tdStyle}>
                        {user.isActive ? "Online 🟢" : "Inactive ⚫"}
                      </td>
                      <td style={tdStyle}>
                        {!user.isActive ? findlastseen(user.lastseen) : "--"}
                      </td>
                      <td style={tdStyle}>{user.role}</td>
                      <td style={tdStyle}>
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td style={tdStyle}>{user.nballtasks}</td>
                      <td style={tdStyle}>{user.nbdonetasks}</td>
                      <td style={tdStyle}>
                        {Math.floor(
                          (user.nbdonetasks / user.nballtasks) * 100,
                        ) || 0}
                        %
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => deleteuser(user.email)}
                          style={{
                            ...actionButtonBase,
                            background:
                              "linear-gradient(135deg, #c62828, #e53935)",
                          }}
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => {
                            localStorage.setItem("userid", user._id);
                            navigate("updateuser");
                          }}
                          style={{
                            ...actionButtonBase,
                            background:
                              "linear-gradient(135deg, #1565c0, #1976d2)",
                          }}
                        >
                          Update
                        </button>

                        <button
                          onClick={() => toggleblock(user.email)}
                          style={{
                            ...actionButtonBase,
                            background: user.isbanned
                              ? "linear-gradient(135deg, #2e7d32, #43a047)"
                              : "linear-gradient(135deg, #ef6c00, #fb8c00)",
                          }}
                        >
                          {user.isbanned ? "UnBlock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <div style={feedbackLinkWrapper}>
        <NavLink to="feedbacks" style={feedbackLinkStyle}>
          View Feedbacks
        </NavLink>
      </div>
    </div>
  );
};
