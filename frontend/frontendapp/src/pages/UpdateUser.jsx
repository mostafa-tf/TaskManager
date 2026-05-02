import { FaArrowLeft } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const UpdateUser = () => {
  const [user, setUser] = useState({});
  const [messageBox, setMessageBox] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  const navigate = useNavigate();

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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      showBox("success", "Updated", "User updated successfully");
      fetchuser();
    } catch (error) {
      showBox("error", "Update Failed", error.message);
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Fetch failed");
      }

      setUser(data);
    } catch (error) {
      showBox("error", "Fetch Failed", error.message);
    }
  };

  useEffect(() => {
    fetchuser();
  }, []);

  const isError = messageBox.type === "error";

  return (
    <div style={styles.page}>
      {/* MESSAGE BOX */}
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
        <h1 style={styles.navTitle}>Update User</h1>
      </nav>

      {/* FORM */}
      <main style={styles.main}>
        <form onSubmit={handlesubmit} style={styles.card}>
          <h2 style={styles.title}>Update User</h2>

          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              value={user.username || ""}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, username: e.target.value }))
              }
              required
              minLength={2}
              maxLength={20}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={user.email || ""}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              minLength={11}
              maxLength={35}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Role</label>
            <select
              style={styles.input}
              value={user.role || "user"}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, role: e.target.value }))
              }
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>
            Update User
          </button>
        </form>
      </main>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(0,255,140,0.08), transparent 24%), linear-gradient(135deg, #07110d 0%, #0b1d15 45%, #08110c 100%)",
    color: "#fff",
  },

  nav: {
    height: "95px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    background: "rgba(5,10,8,0.95)",
    borderBottom: "1px solid rgba(0,255,140,0.14)",
  },

  navTitle: {
    fontSize: "32px",
    fontWeight: "800",
  },

  backButton: {
    position: "absolute",
    left: "20px",
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    border: "1px solid rgba(0,255,140,0.2)",
    background: "rgba(255,255,255,0.06)",
    color: "#dffff0",
    cursor: "pointer",
  },

  main: {
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "30px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(0,255,140,0.16)",
    backdropFilter: "blur(12px)",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  },

  label: {
    marginBottom: "6px",
    color: "#dffff0",
  },

  input: {
    height: "45px",
    borderRadius: "12px",
    border: "1px solid rgba(0,255,140,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    padding: "0 10px",
  },

  button: {
    width: "100%",
    height: "50px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #00c853, #00e676)",
    fontWeight: "800",
    cursor: "pointer",
  },

  boxOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  boxStyle: {
    width: "90%",
    maxWidth: "400px",
    padding: "20px",
    borderRadius: "20px",
    background: "#111",
    display: "flex",
    gap: "10px",
  },

  boxIcon: {
    display: "flex",
    alignItems: "center",
  },

  boxTitle: {
    margin: 0,
  },

  boxMessage: {
    margin: 0,
    fontSize: "14px",
  },
};
