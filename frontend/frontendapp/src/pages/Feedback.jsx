import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";

export const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
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

  const submitfeedback = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ rating, message }),
      });

      const data = await res.json();

      if (res.status === 401) {
        throw new Error(data.message || "You must login first");
      }

      if (res.status === 400) {
        throw new Error(data.message || "Invalid data");
      }

      if (res.status === 500) {
        throw new Error(data.message || "Server error");
      }

      if (res.status !== 201) {
        throw new Error(data.message || "Something went wrong");
      }

      showBox("success", "Thank You ❤️", "Feedback submitted successfully");

      setRating(0);
      setMessage("");
    } catch (error) {
      showBox("error", "Submission Failed", error.message);
    }
  };

  // 🔽 نفس الستايل تبعك بدون أي تعديل
  const feedbackdiv = {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "radial-gradient(circle at top, rgba(0,255,140,0.10), transparent 30%), linear-gradient(135deg, #07110d 0%, #0b1d15 45%, #08110c 100%)",
    padding: "30px 20px",
    boxSizing: "border-box",
  };

  const feedbackform = {
    width: "100%",
    maxWidth: "520px",
    minHeight: "620px",
    borderRadius: "30px",
    border: "1px solid rgba(0,255,140,0.18)",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: "45px 32px 35px",
    boxSizing: "border-box",
    boxShadow: "0 25px 70px rgba(0,0,0,0.45)",
  };

  const titleStyle = {
    margin: 0,
    fontSize: "34px",
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
  };

  const subtitleStyle = {
    marginTop: "12px",
    marginBottom: "28px",
    color: "rgba(255,255,255,0.75)",
    fontSize: "15px",
    textAlign: "center",
  };

  const labelStyle = {
    width: "100%",
    color: "#d9ffe9",
    fontSize: "15px",
    fontWeight: "700",
    marginBottom: "12px",
    marginTop: "10px",
  };

  const starsWrapper = {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "26px",
  };

  const textareaStyle = {
    width: "100%",
    minHeight: "170px",
    borderRadius: "18px",
    border: "1px solid rgba(0,255,140,0.20)",
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    padding: "16px",
  };

  const buttonStyle = {
    width: "100%",
    height: "54px",
    marginTop: "26px",
    borderRadius: "16px",
    border: "none",
    background:
      rating === 0 || message.length < 4
        ? "rgba(255,255,255,0.12)"
        : "linear-gradient(135deg, #00c853, #00e676)",
    color:
      rating === 0 || message.length < 4 ? "rgba(255,255,255,0.45)" : "#08110c",
    cursor: rating === 0 || message.length < 4 ? "not-allowed" : "pointer",
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
    background: "rgba(20,20,20,0.95)",
    border: isError
      ? "1px solid rgba(255,77,79,0.45)"
      : "1px solid rgba(0,255,140,0.35)",
    display: "flex",
    gap: "15px",
    color: "#fff",
  };

  return (
    <div style={feedbackdiv}>
      {messageBox.show && (
        <div style={boxOverlay}>
          <div style={boxStyle}>
            {isError ? (
              <MdErrorOutline size={30} color="#ff6b6b" />
            ) : (
              <MdCheckCircleOutline size={30} color="#60ff9c" />
            )}
            <div>
              <h3>{messageBox.title}</h3>
              <p>{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

      <div style={feedbackform}>
        <h2 style={titleStyle}>Share Your Experience</h2>
        <p style={subtitleStyle}>
          Your feedback helps us improve the platform.
        </p>

        <div style={labelStyle}>Rating</div>

        <div style={starsWrapper}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={32}
              style={{
                color: rating >= star ? "#ffd54a" : "rgba(255,255,255,0.22)",
                cursor: "pointer",
              }}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <div style={labelStyle}>Message</div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={textareaStyle}
        />

        <button
          disabled={rating === 0 || message.length < 4}
          onClick={submitfeedback}
          style={buttonStyle}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};
