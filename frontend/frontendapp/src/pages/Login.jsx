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

      if (res.status !== 200) {
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

  const pageStyle = {
    width: "100%",
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, rgb(7, 14, 10) 0%, rgb(10, 24, 17) 45%, rgb(6, 10, 8) 100%)",
    padding: "30px 20px",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "430px",
    padding: "40px 32px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(0,255,128,0.18)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  };

  const titleStyle = {
    color: "#ffffff",
    fontSize: "34px",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: "8px",
    letterSpacing: "0.5px",
  };

  const subtitleStyle = {
    color: "rgba(255,255,255,0.72)",
    textAlign: "center",
    fontSize: "15px",
    marginBottom: "30px",
    lineHeight: "1.7",
  };

  const labelStyle = {
    display: "block",
    color: "#caffdf",
    marginBottom: "8px",
    fontSize: "15px",
    fontWeight: "600",
  };

  const inputStyle = {
    width: "100%",
    height: "48px",
    borderRadius: "14px",
    border: "1px solid rgba(0,255,128,0.25)",
    background: "rgba(255,255,255,0.07)",
    color: "#ffffff",
    padding: "0 16px",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  const fieldWrapper = {
    marginBottom: "20px",
  };

  const linksWrapper = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "8px",
    marginBottom: "26px",
    color: "rgba(255,255,255,0.8)",
    fontSize: "14px",
  };

  const linkStyle = {
    color: "#39ff9c",
    textDecoration: "none",
    fontWeight: "700",
    marginLeft: "6px",
  };

  const buttonStyle = {
    width: "100%",
    height: "50px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #00c853, #00e676)",
    color: "#08110c",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 12px 28px rgba(0, 200, 83, 0.28)",
    transition: "all 0.3s ease",
  };

  return (
    <>
      <WelcomeNavbar page="login" />

      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Welcome Back</h2>
          <p style={subtitleStyle}>
            Login to your account and continue managing your tasks efficiently.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={fieldWrapper}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                required
                minLength={11}
                maxLength={50}
                style={inputStyle}
                placeholder="Enter your email"
                value={data.email}
                onChange={(e) =>
                  setData((prev) => {
                    return { ...prev, email: e.target.value };
                  })
                }
              />
            </div>

            <div style={fieldWrapper}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                style={inputStyle}
                value={data.password}
                minLength={5}
                maxLength={15}
                placeholder="Enter your password"
                onChange={(e) =>
                  setData((prev) => {
                    return { ...prev, password: e.target.value };
                  })
                }
                required
              />
            </div>

            <div style={linksWrapper}>
              <div>
                Don&apos;t have an account?
                <Link to="/signup" style={linkStyle}>
                  Register
                </Link>
              </div>

              <div>
                Forgot your password?
                <Link to="/forgotpassword" style={linkStyle}>
                  Reset it here
                </Link>
              </div>
            </div>

            <button
              type="submit"
              style={buttonStyle}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 16px 34px rgba(0, 200, 83, 0.38)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 12px 28px rgba(0, 200, 83, 0.28)";
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
