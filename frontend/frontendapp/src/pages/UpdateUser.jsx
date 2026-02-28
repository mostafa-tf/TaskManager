import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const UpdateUser = () => {
  const [user, setUser] = useState({});

  const navigate = useNavigate();
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
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const { username, email, role } = user;
      const res = await fetch(
        `http://localhost:3000/api/users/updateuser/${localStorage.getItem("userid")}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ username, email, role }),
        },
      );
      if (res.status != 200) {
        const data = await res.json();
        throw new Error(data.message);
      }
      fetchuser();
    } catch (error) {
      alert(error.message);
    }
  };
  const fetchuser = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/userinfo/${localStorage.getItem("userid")}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.status != 200) {
        const data = await res.json();
        throw new Error(data.message);
      }
      const data = await res.json();
      setUser(data);
    } catch (error) {
      alert(error.message);
    }
  };
  useEffect(() => {
    fetchuser();
  }, []);
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
        Update User
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
        <form onSubmit={handlesubmit}>
          <div
            style={{
              width: "390px",
              height: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#e0ffff",
              position: "relative",
            }}
          >
            <h2 style={{ position: "absolute", top: "0px", color: "red" }}>
              Update User
            </h2>
            username{" "}
            <input
              type="text"
              onChange={(e) =>
                setUser((prev) => {
                  return { ...prev, username: e.target.value };
                })
              }
              value={user.username}
              required
              minLength={2}
              maxLength={20}
            />
            email{" "}
            <input
              type="email"
              onChange={(e) =>
                setUser((prev) => {
                  return { ...prev, email: e.target.value };
                })
              }
              value={user.email}
              required
              minLength={11}
              maxLength={35}
            />
            <br />
            <select
              value={user.role}
              onChange={(e) =>
                setUser((prev) => {
                  return { ...prev, role: e.target.value };
                })
              }
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
            <button>Update User</button>
          </div>
        </form>
      </main>
    </>
  );
};
