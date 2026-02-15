import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";
export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  const tasksofuser = (userid) => {
    allusertasks = tasks.filter((task) => task.userId == userid);
    donetasks = allusertasks.filter((task) => task.isDone == true);
    return [allusertasks, donetasks];
  };
  const buttonstyle = {
    width: "60px",
    height: "60px",
    borderRadius: "30px",
    fontSize: "30px",
    position: "absolute",
    left: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "green",
    border: "3px solid green",
    cursor: "pointer",
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
  const tablestyle = {
    width: "90%",
    maxWidth: "1000px",
    borderCollapse: "collapse",
    backgroundColor: "darkblue",
    color: "white",
    fontSize: "18px",
    textAlign: "center",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0px 0px 20px rgba(0,255,255,0.3)",
  };

  const findlastseen = (datestring) => {
    const now = new Date();
    const lastseen = new Date(datestring);
    const seconds = Math.floor((now - lastseen) / 1000);
    if (seconds < 60) {
      return "JustNow";
    } else if (seconds < 3600) {
      return Math.floor(seconds / 60) + " minute ago";
    } else if (seconds < 86400) {
      return Math.floor(seconds / 3600) + " hours ago";
    } else if (seconds < 604800) {
      return Math.floor(seconds / 86400) + " days ago";
    } else {
      return Math.floor(seconds / 604800) + " months ago ";
    }
  };
  return (
    <>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "90px",
          color: "cyan",
          position: "relative",
          fontSize: "30px",
          backgroundColor: "black",
          borderbottom: "1px solid #222",
        }}
      >
        <button style={buttonstyle} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        Admin Dashboard
      </nav>
      <main
        style={{
          width: "100%",
          minHeight: "calc(100vh - 90px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {users.length == 0 && <h1 style={{ color: "red" }}>No Users Found</h1>}
        {users.length != 0 && (
          <table border={2} style={tablestyle}>
            <thead>
              <th>Username</th>
              <th>Email</th>
              <th>IsActive</th>
              <th>LastSeen</th>
              <th>role</th>
              <th>Date Joined</th>
              <th>Number Of Tasks</th>
              <th>Done Tasks</th>
              <th>% of Done Tasks</th>
              <th>Actions</th>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.isActive ? "Active" : "Offline"}</td>
                    <td>
                      {!user.isActive ? findlastseen(user.lastseen) : "--"}
                    </td>
                    <td>{user.role}</td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td>{user.nballtasks}</td>
                    <td>{user.nbdonetasks}</td>
                    <td>
                      {Math.floor((user.nbdonetasks / user.nballtasks) * 100) ||
                        0}
                      %
                    </td>
                    <td>
                      <button>Delete</button> <button>Update</button>
                      <button>{user.isbanned ? "UnBlock" : "Block"}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
};
