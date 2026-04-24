import { useNavigate, NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { GrProjects } from "react-icons/gr";
import { IoMdAddCircle } from "react-icons/io";
import { useState, useEffect } from "react";
export const AddProject = () => {
  const [friends, setFriends] = useState([]);
  const [projectinfo, setProjectinfo] = useState({
    name: "",
    description: "",
    contributers: [],
  });
  const navigate = useNavigate();
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(projectinfo),
      });

      if (res.status != 201) {
        const data = await res.json();
        throw new Error(data.message);
      }
      alert("project inserted");
    } catch (error) {
      alert(error.message);
    }
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

  const addcontributer = (friendid) => {
    setProjectinfo((prev) => {
      if (prev.contributers.includes(friendid)) {
        return {
          ...prev,
          contributers: prev.contributers.filter(
            (contributer) => contributer != friendid,
          ),
        };
      } else {
        return { ...prev, contributers: [...prev.contributers, friendid] };
      }
    });
  };
  const friendsdiv = {};
  const frienddiv = {};
  return (
    <>
      {" "}
      <nav style={navStyle}>
        <button style={buttonstyle} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        Add Project
      </nav>
      <div>
        <form onSubmit={handlesubmit}>
          Project Name{" "}
          <input
            type="text"
            required
            onChange={(e) =>
              setProjectinfo((prev) => {
                return { ...prev, name: e.target.value };
              })
            }
            minLength={2}
            maxLength={40}
          />
          <br />
          Project Description{" "}
          <textarea
            onChange={(e) =>
              setProjectinfo((prev) => {
                return { ...prev, description: e.target.value };
              })
            }
            maxLength={200}
          ></textarea>
          <br />
          {friends.length == 0 && <p>No Friends Found</p>}
          {friends.length != 0 && (
            <>
              {" "}
              Add Contributers
              <div style={friendsdiv}>
                {friends.map((friend, index) => {
                  return (
                    <div key={index} style={frienddiv}>
                      <input
                        type="checkbox"
                        onChange={() => {
                          addcontributer(friend._id);
                        }}
                      />
                      {friend.username}
                    </div>
                  );
                })}
              </div>
              <button type="submit">Submit</button>
            </>
          )}
        </form>
      </div>
    </>
  );
};
