import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { useState, useEffect } from "react";

export const AddProject = () => {
  const [friends, setFriends] = useState([]);
  const [projectinfo, setProjectinfo] = useState({
    name: "",
    description: "",
    contributers: [],
  });

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
      const res = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(projectinfo),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create project");
      }

      showBox(
        "success",
        "Project Created",
        data.message || "Project created successfully",
      );

      setTimeout(() => {
        navigate(-1);
      }, 1200);
    } catch (error) {
      showBox("error", "Creation Failed", error.message);
    }
  };

  const fetchfriends = async () => {
    try {
      const friendsjson = await fetch(
        "http://localhost:3000/api/friendship/viewfriends",
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await friendsjson.json();

      if (!friendsjson.ok) {
        throw new Error(data.message || "Failed to fetch friends");
      }

      setFriends(data || []);
    } catch (error) {
      showBox("error", "Fetch Failed", error.message);
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
          contributers: prev.contributers.filter((id) => id !== friendid),
        };
      }

      return {
        ...prev,
        contributers: [...prev.contributers, friendid],
      };
    });
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

      <nav style={styles.nav}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1 style={styles.navTitle}>Add Project</h1>
      </nav>

      <main style={styles.main}>
        <form style={styles.formCard} onSubmit={handlesubmit}>
          <label style={styles.label}>Project Name</label>
          <input
            style={styles.input}
            type="text"
            required
            minLength={2}
            maxLength={40}
            placeholder="Enter project name"
            value={projectinfo.name}
            onChange={(e) =>
              setProjectinfo((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />

          <label style={styles.label}>Project Description</label>
          <textarea
            style={styles.textarea}
            maxLength={200}
            placeholder="Enter project description"
            value={projectinfo.description}
            onChange={(e) =>
              setProjectinfo((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />

          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Add Contributors</h2>
            <span style={styles.countBadge}>
              {projectinfo.contributers.length} selected
            </span>
          </div>

          {friends.length === 0 ? (
            <p style={styles.emptyText}>No Friends Found</p>
          ) : (
            <div style={styles.friendsGrid}>
              {friends.map((friend) => {
                const selected = projectinfo.contributers.includes(friend._id);

                return (
                  <label
                    key={friend._id}
                    style={{
                      ...styles.friendCard,
                      borderColor: selected
                        ? "rgba(57,255,159,0.45)"
                        : "rgba(0,255,140,0.14)",
                      background: selected
                        ? "rgba(57,255,159,0.12)"
                        : "rgba(255,255,255,0.04)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => addcontributer(friend._id)}
                    />
                    <span>{friend.username}</span>
                  </label>
                );
              })}
            </div>
          )}

          <button style={styles.submitButton} type="submit">
            Create Project
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
      "radial-gradient(circle at top, rgba(0,255,140,0.12), transparent 35%), #050a08",
    color: "#ffffff",
  },

  nav: {
    height: "95px",
    position: "relative",
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

  main: {
    padding: "45px 24px",
    display: "flex",
    justifyContent: "center",
  },

  formCard: {
    width: "100%",
    maxWidth: "760px",
    padding: "30px",
    borderRadius: "24px",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
    border: "1px solid rgba(0,255,140,0.16)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "18px",
    fontWeight: "800",
    color: "#dffff0",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(0,255,140,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    outline: "none",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(0,255,140,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    outline: "none",
    fontSize: "16px",
    resize: "vertical",
    boxSizing: "border-box",
  },

  sectionHeader: {
    marginTop: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "22px",
  },

  countBadge: {
    padding: "7px 12px",
    borderRadius: "999px",
    color: "#39ff9f",
    border: "1px solid rgba(57,255,159,0.35)",
    background: "rgba(57,255,159,0.08)",
    fontWeight: "800",
    fontSize: "13px",
  },

  friendsGrid: {
    marginTop: "16px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "12px",
  },

  friendCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 14px",
    borderRadius: "16px",
    border: "1px solid",
    cursor: "pointer",
    fontWeight: "700",
  },

  emptyText: {
    color: "#b8cfc4",
  },

  submitButton: {
    marginTop: "28px",
    width: "100%",
    padding: "15px",
    borderRadius: "16px",
    border: "1px solid rgba(57,255,159,0.35)",
    background: "linear-gradient(135deg, #20d982, #0b8f55)",
    color: "#04100b",
    fontSize: "17px",
    fontWeight: "900",
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
    background:
      "linear-gradient(135deg, rgba(22,22,22,0.98), rgba(12,12,12,0.98))",
    boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
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
    lineHeight: "1.5",
    color: "rgba(255,255,255,0.72)",
  },
};
