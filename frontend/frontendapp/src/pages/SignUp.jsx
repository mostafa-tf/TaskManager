import WelcomeNavbar from "../components/WelcomeNavbar.jsx";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const repasswordRef = useRef(null);
  const [matching, setMatching] = useState(true);

  const [data, setData] = useState({
    email: "",
    username: "",
    password: "",
    repassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMatching(true);

    if (data.password != data.repassword) {
      setMatching(false);
      passwordRef.current.style.border = "2px solid red";
      repasswordRef.current.style.border = "2px solid red";
      return;
    }

    const { email, username, password } = data;

    try {
      const res = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (res.status != 201) {
        throw new Error(data.message);
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (er) {
      alert("error " + er.message);
    }
  };

  const pageStyle = {
    width: "100%",
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px 20px",
    boxSizing: "border-box",
    background:
      "radial-gradient(circle at top, rgba(0,255,140,0.08), transparent 24%), linear-gradient(135deg, rgb(7,14,10) 0%, rgb(10,24,17) 45%, rgb(6,10,8) 100%)",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "460px",
    padding: "38px 32px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(0,255,128,0.16)",
    boxShadow: "0 22px 60px rgba(0,0,0,0.42)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxSizing: "border-box",
  };

  const titleStyle = {
    margin: 0,
    color: "#ffffff",
    fontSize: "34px",
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: "0.4px",
  };

  const subtitleStyle = {
    marginTop: "10px",
    marginBottom: "28px",
    color: "rgba(255,255,255,0.72)",
    textAlign: "center",
    fontSize: "15px",
    lineHeight: "1.7",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "18px",
  };

  const labelStyle = {
    color: "#dffff0",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.3px",
  };

  const inputStyle = {
    width: "100%",
    height: "48px",
    borderRadius: "14px",
    border: "1px solid rgba(0,255,128,0.20)",
    background: "rgba(255,255,255,0.07)",
    color: "#ffffff",
    padding: "0 14px",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  const footerTextStyle = {
    marginTop: "12px",
    textAlign: "center",
    color: "rgba(255,255,255,0.80)",
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
    marginTop: "10px",
  };

  return (
    <>
      <WelcomeNavbar page="signup" />

      <main style={pageStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Create Account</h2>
          <p style={subtitleStyle}>
            Join the platform and start managing your tasks in a smarter and
            more organized way.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                style={inputStyle}
                required
                minLength={11}
                maxLength={35}
                onChange={(e) =>
                  setData((prev) => {
                    return { ...prev, email: e.target.value };
                  })
                }
                value={data.email}
                placeholder="Enter your email"
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                style={inputStyle}
                required
                minLength={2}
                maxLength={20}
                onChange={(e) =>
                  setData((prev) => {
                    return { ...prev, username: e.target.value };
                  })
                }
                value={data.username}
                placeholder="Enter your username"
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                style={inputStyle}
                required
                minLength={5}
                maxLength={15}
                ref={passwordRef}
                onChange={(e) =>
                  setData((prev) => {
                    return { ...prev, password: e.target.value };
                  })
                }
                value={data.password}
                placeholder="Enter your password"
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                style={inputStyle}
                required
                ref={repasswordRef}
                minLength={5}
                maxLength={15}
                onChange={(e) =>
                  setData((prev) => {
                    return { ...prev, repassword: e.target.value };
                  })
                }
                value={data.repassword}
                placeholder="Re-enter your password"
              />
            </div>

            {!matching && (
              <p
                style={{
                  color: "#ff7b7b",
                  marginTop: "0",
                  marginBottom: "14px",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                Password and Repassword should match
              </p>
            )}

            <button
              type="submit"
              style={buttonStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 16px 34px rgba(0, 200, 83, 0.35)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 12px 28px rgba(0, 200, 83, 0.28)";
              }}
            >
              Sign Up
            </button>

            <div style={footerTextStyle}>
              Already have an account?
              <Link to="/login" style={linkStyle}>
                Login
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default SignUp;
