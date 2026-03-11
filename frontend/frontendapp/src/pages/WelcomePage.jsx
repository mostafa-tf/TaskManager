import WelcomeNavbar from "../components/WelcomeNavbar.jsx";
import tasksimage from "../assets/tasks.png";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const navigate = useNavigate();

  const buttonStyle = (type) => {
    const baseStyle = {
      width: "220px",
      height: "52px",
      borderRadius: "14px",
      border: "none",
      cursor: "pointer",
      fontSize: "17px",
      fontWeight: "700",
      letterSpacing: "0.5px",
      transition: "all 0.3s ease",
      boxShadow: "0 8px 22px rgba(0,0,0,0.25)",
    };

    if (type === "login") {
      return {
        ...baseStyle,
        background: "linear-gradient(135deg, #00c853, #00e676)",
        color: "#0d0d0d",
      };
    }

    return {
      ...baseStyle,
      background: "transparent",
      color: "#ffffff",
      border: "2px solid rgba(255,255,255,0.85)",
      backdropFilter: "blur(6px)",
    };
  };

  return (
    <>
      <div>
        <WelcomeNavbar />
      </div>

      <main
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "calc(100vh - 70px)",
          backgroundImage: `url(${tasksimage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(rgba(6, 10, 18, 0.72), rgba(6, 10, 18, 0.82))",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "min(90%, 520px)",
            padding: "50px 35px",
            borderRadius: "28px",
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "18px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              fontWeight: "800",
              color: "#ffffff",
              lineHeight: "1.2",
              textShadow: "0 4px 16px rgba(0,0,0,0.35)",
            }}
          >
            Welcome to TaskFlow
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "17px",
              lineHeight: "1.8",
              color: "rgba(255,255,255,0.88)",
              maxWidth: "420px",
            }}
          >
            Organize your tasks, boost your productivity, and manage your day
            with a modern smart workflow.
          </p>

          <div
            style={{
              width: "70px",
              height: "4px",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #00c853, #ffffff)",
              margin: "10px 0 6px",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              width: "100%",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <button
              style={buttonStyle("login")}
              onClick={() => navigate("/login")}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-3px) scale(1.02)";
                e.target.style.boxShadow = "0 14px 28px rgba(0, 200, 83, 0.35)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 8px 22px rgba(0,0,0,0.25)";
              }}
            >
              Login
            </button>

            <button
              style={buttonStyle("signup")}
              onClick={() => navigate("/signup")}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-3px) scale(1.02)";
                e.target.style.background = "rgba(255,255,255,0.12)";
                e.target.style.boxShadow = "0 14px 28px rgba(255,255,255,0.12)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.background = "transparent";
                e.target.style.boxShadow = "0 8px 22px rgba(0,0,0,0.25)";
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default WelcomePage;
