import WelcomeNavbar from "../components/WelcomeNavbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.status != 200) {
        const msg = await res.json();
        throw new Error(msg.message);
      }
      const msg = await res.json();
      localStorage.setItem("token", msg.token);
      navigate("/dashboard");
    } catch (error) {
      alert("error " + error.message);
    }
  };

  const logindiv = {
    width: "100%",
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const inputstyle = {
    width: "190px",
    border: "2px solid green",
    height: "25px",
    borderRadius: "15px",
    color: "green",
  };
  const loginform = {
    border: "2px solid green",
    width: "300px",
    height: "340px",
    position: "relative",
    textAlign: "center",
  };
  return (
    <>
      <WelcomeNavbar page="login" />
      <div style={logindiv}>
        <div style={loginform}>
          <h2 style={{ color: "green" }}>Login</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginTop: "60px", fontSize: "20px" }}>
              Email
              <input
                type="email"
                required
                minLength={11}
                maxLength={35}
                style={{
                  width: "190px",
                  border: "2px solid green",
                  height: "25px",
                  borderRadius: "15px",
                  marginLeft: "25px",
                  color: "green",
                }}
                value={data.email}
                onChange={(e) =>
                  setData((prev) => {
                    return { ...prev, email: e.target.value };
                  })
                }
              />
            </div>
            <div style={{ marginTop: "20px", fontSize: "20px" }}>
              Password{" "}
              <input
                type="password"
                style={inputstyle}
                value={data.password}
                minLength={5}
                maxLength={15}
                onChange={(e) =>
                  setData((prev) => {
                    return { ...prev, password: e.target.value };
                  })
                }
                required
              />
            </div>
            You Dont Have An Account <Link to="/signup">Register</Link>
            <button
              type="submit"
              style={{
                width: "80px",
                borderRadius: "20px",
                height: "30px",
                marginTop: "40px",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
export default Login;
