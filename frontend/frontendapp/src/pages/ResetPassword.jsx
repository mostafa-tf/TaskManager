import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();

  const [messageBox, setMessageBox] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  const showBox = (type, title, message) => {
    setMessageBox({ show: true, type, title, message });
  };

  useEffect(() => {
    if (messageBox.show) {
      const timer = setTimeout(() => {
        setMessageBox({ show: false, type: "", title: "", message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messageBox.show]);

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/users/resetpassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `${searchParams.get("token")}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Reset failed");
      }

      showBox("success", "Password Updated", "Password reset successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      showBox("error", "Reset Failed", error.message);
    }
  };

  const isError = messageBox.type === "error";

  return (
    <div style={styles.page}>
      {messageBox.show && (
        <div style={styles.boxOverlay}>
          <div
            style={{
              ...styles.boxStyle,
              border: isError
                ? "1px solid rgba(255,77,79,0.45)"
                : "1px solid rgba(0,255,140,0.35)",
            }}
          >
            <div
              style={{
                ...styles.boxIcon,
                background: isError
                  ? "rgba(255,77,79,0.14)"
                  : "rgba(0,255,140,0.12)",
                border: isError
                  ? "1px solid rgba(255,77,79,0.25)"
                  : "1px solid rgba(0,255,140,0.22)",
                color: isError ? "#ff6b6b" : "#60ff9c",
              }}
            >
              {isError ? (
                <MdErrorOutline size={30} />
              ) : (
                <MdCheckCircleOutline size={30} />
              )}
            </div>

            <div>
              <h3 style={styles.boxTitle}>{messageBox.title}</h3>
              <p style={styles.boxMessage}>{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav style={styles.nav}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1 style={styles.navTitle}>Reset Password</h1>
      </nav>

      {/* FORM */}
      <form onSubmit={handlesubmit} style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>

        <p style={styles.subtitle}>Enter your new password below.</p>

        <div style={styles.line}></div>

        <div style={styles.field}>
          <label style={styles.label}>New Password</label>
          <input
            style={styles.input}
            type="password"
            required
            minLength={5}
            maxLength={15}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <button type="submit" style={styles.button}>
          Reset Password
        </button>
      </form>
    </div>
  );
};

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "130px 20px 40px",
    boxSizing: "border-box",
    background:
      "radial-gradient(circle at top, rgba(0,255,140,0.08), transparent 24%), linear-gradient(135deg, #07110d 0%, #0b1d15 45%, #08110c 100%)",
  },

  nav: {
    height: "95px",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(5,10,8,0.95)",
    borderBottom: "1px solid rgba(0,255,140,0.14)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  },

  navTitle: {
    fontSize: "34px",
    fontWeight: "800",
    margin: 0,
    color: "#ffffff",
  },

  backButton: {
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
  },

  card: {
    width: "100%",
    maxWidth: "500px",
    borderRadius: "30px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(0,255,140,0.16)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.42)",
    backdropFilter: "blur(16px)",
    padding: "36px 32px",
  },

  title: {
    margin: 0,
    color: "#ffffff",
    fontSize: "34px",
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    marginTop: "10px",
    marginBottom: "28px",
    color: "rgba(255,255,255,0.72)",
    textAlign: "center",
  },

  line: {
    width: "80px",
    height: "4px",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #00c853, #b7ffd5)",
    margin: "0 auto 26px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "18px",
  },

  label: {
    color: "#dffff0",
    fontWeight: "700",
  },

  input: {
    height: "50px",
    borderRadius: "14px",
    border: "1px solid rgba(0,255,140,0.22)",
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    padding: "0 14px",
  },

  button: {
    width: "100%",
    height: "52px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #00c853, #00e676)",
    color: "#08110c",
    fontWeight: "800",
    cursor: "pointer",
  },

  boxOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  boxStyle: {
    width: "min(430px, 90%)",
    padding: "22px",
    borderRadius: "24px",
    background: "rgba(20,20,20,0.95)",
    display: "flex",
    gap: "15px",
    color: "#fff",
  },

  boxIcon: {
    minWidth: "52px",
    height: "52px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  boxTitle: {
    margin: "0 0 5px",
    fontSize: "18px",
    fontWeight: "800",
  },

  boxMessage: {
    margin: 0,
    fontSize: "14px",
    color: "rgba(255,255,255,0.72)",
  },
};
