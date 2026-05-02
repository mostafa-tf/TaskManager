import { IoPersonSharp } from "react-icons/io5";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { useState, useEffect, useRef } from "react";

export const Profile = () => {
  const [disabled, setDisabled] = useState(true);
  const [counter, setCounter] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [buttontext, setButtonText] = useState("update profile");
  const [messageBox, setMessageBox] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  const usernameinput = useRef(null);
  const emailinput = useRef(null);

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

  const fetchprofile = async () => {
    try {
      const result = await fetch("http://localhost:3000/api/users/profile", {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await result.json();

      if (result.status != 200) {
        throw new Error(data.message || "error in data fetching");
      }

      setUsername(data.username);
      setEmail(data.email);
    } catch (error) {
      showBox("error", "Fetch Failed", error.message);
    }
  };

  useEffect(() => {
    fetchprofile();
  }, []);

  const handleupdate = async () => {
    if (counter % 2 == 0) {
      setDisabled(false);
      setCounter(counter + 1);
      setButtonText("confirm Update");
    } else {
      setDisabled(true);
      setCounter(counter + 1);

      try {
        const res = await fetch("http://localhost:3000/api/users/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ username, email }),
        });

        const data = await res.json();

        if (res.status != 200) {
          throw new Error(data.message || "Update failed");
        }

        showBox("success", "Updated", "Profile updated successfully");
      } catch (error) {
        showBox("error", "Update Failed", error.message);
      }

      setButtonText("update profile");
    }
  };

  const pageStyle = {
    width: "100%",
    minHeight: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    boxSizing: "border-box",
    background:
      "radial-gradient(circle at top, rgba(0,255,140,0.08), transparent 24%), linear-gradient(135deg, #07110d 0%, #0b1d15 45%, #08110c 100%)",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "500px",
    borderRadius: "30px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(0,255,140,0.16)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.42)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    padding: "36px 32px",
    boxSizing: "border-box",
  };

  const iconWrapper = {
    width: "74px",
    height: "74px",
    borderRadius: "50%",
    margin: "0 auto 16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0,255,140,0.10)",
    border: "1px solid rgba(0,255,140,0.18)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
    color: "#dffff0",
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
    height: "50px",
    borderRadius: "14px",
    border: disabled
      ? "1px solid rgba(255,255,255,0.10)"
      : "1px solid rgba(0,255,140,0.22)",
    background: disabled ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)",
    color: "#ffffff",
    padding: "0 14px",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
    transition: "all 0.25s ease",
  };

  const buttonStyle = {
    width: "100%",
    height: "52px",
    borderRadius: "16px",
    border: "none",
    background:
      buttontext === "confirm Update"
        ? "linear-gradient(135deg, #1565c0, #1e88e5)"
        : "linear-gradient(135deg, #00c853, #00e676)",
    color: "#08110c",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow:
      buttontext === "confirm Update"
        ? "0 14px 30px rgba(30, 136, 229, 0.28)"
        : "0 14px 30px rgba(0, 200, 83, 0.28)",
    transition: "all 0.3s ease",
    marginTop: "8px",
  };

  const noteStyle = {
    marginTop: "14px",
    textAlign: "center",
    color: "rgba(255,255,255,0.58)",
    fontSize: "13px",
    lineHeight: "1.6",
  };

  const boxOverlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };

  const isError = messageBox.type === "error";

  const boxStyle = {
    width: "min(430px, 90%)",
    padding: "22px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, rgba(22,22,22,0.98), rgba(12,12,12,0.98))",
    border: isError
      ? "1px solid rgba(255,77,79,0.45)"
      : "1px solid rgba(0,255,140,0.35)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    color: "#fff",
  };

  const boxIcon = {
    minWidth: "52px",
    height: "52px",
    borderRadius: "18px",
    background: isError ? "rgba(255,77,79,0.14)" : "rgba(0,255,140,0.12)",
    border: isError
      ? "1px solid rgba(255,77,79,0.25)"
      : "1px solid rgba(0,255,140,0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: isError ? "#ff6b6b" : "#60ff9c",
  };

  const boxTitle = {
    margin: "0 0 5px",
    fontSize: "18px",
    fontWeight: "800",
  };

  const boxMessage = {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.5",
    color: "rgba(255,255,255,0.72)",
  };

  return (
    <div style={pageStyle}>
      {messageBox.show && (
        <div style={boxOverlay}>
          <div style={boxStyle}>
            <div style={boxIcon}>
              {isError ? (
                <MdErrorOutline size={30} />
              ) : (
                <MdCheckCircleOutline size={30} />
              )}
            </div>

            <div>
              <h3 style={boxTitle}>{messageBox.title}</h3>
              <p style={boxMessage}>{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <div style={iconWrapper}>
          <IoPersonSharp size={34} />
        </div>

        <h2 style={titleStyle}>Profile</h2>
        <p style={subtitleStyle}>
          View and update your personal account information in a clean and
          secure workspace.
        </p>

        <div
          style={{
            width: "80px",
            height: "4px",
            borderRadius: "999px",
            background: "linear-gradient(90deg, #00c853, #b7ffd5)",
            margin: "0 auto 26px",
          }}
        />

        <div style={fieldStyle}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            ref={emailinput}
            value={email}
            disabled={disabled}
            onChange={(e) => setEmail(e.target.value)}
            minLength={11}
            maxLength={35}
            style={inputStyle}
            placeholder="Enter your email"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Username</label>
          <input
            type="text"
            ref={usernameinput}
            value={username}
            disabled={disabled}
            onChange={(e) => setUsername(e.target.value)}
            minLength={2}
            maxLength={20}
            style={inputStyle}
            placeholder="Enter your username"
          />
        </div>

        <button
          onClick={handleupdate}
          style={buttonStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              buttontext === "confirm Update"
                ? "0 18px 34px rgba(30, 136, 229, 0.35)"
                : "0 18px 34px rgba(0, 200, 83, 0.35)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              buttontext === "confirm Update"
                ? "0 14px 30px rgba(30, 136, 229, 0.28)"
                : "0 14px 30px rgba(0, 200, 83, 0.28)";
          }}
        >
          {buttontext}
        </button>

        <p style={noteStyle}>
          Click once to enable editing, then click again to confirm your profile
          update.
        </p>
      </div>
    </div>
  );
};
