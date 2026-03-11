import { useState } from "react";
import { FaStar } from "react-icons/fa";

export const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

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

      if (res.status !== 201) {
        const data = await res.json();
        throw new Error(data.message);
      } else {
        alert("Thank You for your feedback");
        setRating(0);
        setMessage("");
      }
    } catch (error) {
      alert(error.message);
    }
  };

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
    letterSpacing: "0.4px",
    lineHeight: "1.2",
  };

  const subtitleStyle = {
    marginTop: "12px",
    marginBottom: "28px",
    color: "rgba(255,255,255,0.75)",
    fontSize: "15px",
    lineHeight: "1.8",
    textAlign: "center",
    maxWidth: "380px",
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
    alignItems: "center",
    gap: "12px",
    marginBottom: "26px",
    flexWrap: "wrap",
  };

  const textareaStyle = {
    width: "100%",
    minHeight: "170px",
    borderRadius: "18px",
    border: "1px solid rgba(0,255,140,0.20)",
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    padding: "16px",
    fontSize: "15px",
    lineHeight: "1.7",
    resize: "none",
    outline: "none",
    boxSizing: "border-box",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)",
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
    fontSize: "16px",
    fontWeight: "800",
    cursor: rating === 0 || message.length < 4 ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    boxShadow:
      rating === 0 || message.length < 4
        ? "none"
        : "0 14px 30px rgba(0, 200, 83, 0.28)",
  };

  const helperTextStyle = {
    width: "100%",
    marginTop: "10px",
    color: "rgba(255,255,255,0.55)",
    fontSize: "13px",
    lineHeight: "1.6",
  };

  return (
    <div style={feedbackdiv}>
      <div style={feedbackform}>
        <h2 style={titleStyle}>Share Your Experience</h2>

        <p style={subtitleStyle}>
          Your feedback helps us improve the platform and create a better
          experience for everyone.
        </p>

        <div
          style={{
            width: "80px",
            height: "4px",
            borderRadius: "999px",
            background: "linear-gradient(90deg, #00c853, #b9ffd3)",
            marginBottom: "18px",
          }}
        />

        <div style={labelStyle}>Rating</div>

        <div style={starsWrapper}>
          <FaStar
            size={32}
            style={{
              color: rating >= 1 ? "#ffd54a" : "rgba(255,255,255,0.22)",
              cursor: "pointer",
              transition: "all 0.25s ease",
              filter:
                rating >= 1
                  ? "drop-shadow(0 0 10px rgba(255,213,74,0.45))"
                  : "none",
            }}
            onClick={() => setRating(1)}
          />
          <FaStar
            size={32}
            style={{
              color: rating >= 2 ? "#ffd54a" : "rgba(255,255,255,0.22)",
              cursor: "pointer",
              transition: "all 0.25s ease",
              filter:
                rating >= 2
                  ? "drop-shadow(0 0 10px rgba(255,213,74,0.45))"
                  : "none",
            }}
            onClick={() => setRating(2)}
          />
          <FaStar
            size={32}
            style={{
              color: rating >= 3 ? "#ffd54a" : "rgba(255,255,255,0.22)",
              cursor: "pointer",
              transition: "all 0.25s ease",
              filter:
                rating >= 3
                  ? "drop-shadow(0 0 10px rgba(255,213,74,0.45))"
                  : "none",
            }}
            onClick={() => setRating(3)}
          />
          <FaStar
            size={32}
            style={{
              color: rating >= 4 ? "#ffd54a" : "rgba(255,255,255,0.22)",
              cursor: "pointer",
              transition: "all 0.25s ease",
              filter:
                rating >= 4
                  ? "drop-shadow(0 0 10px rgba(255,213,74,0.45))"
                  : "none",
            }}
            onClick={() => setRating(4)}
          />
          <FaStar
            size={32}
            style={{
              color: rating >= 5 ? "#ffd54a" : "rgba(255,255,255,0.22)",
              cursor: "pointer",
              transition: "all 0.25s ease",
              filter:
                rating >= 5
                  ? "drop-shadow(0 0 10px rgba(255,213,74,0.45))"
                  : "none",
            }}
            onClick={() => setRating(5)}
          />
        </div>

        <div style={labelStyle}>Message</div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={7}
          cols={29}
          placeholder="Enter your feedback description..."
          style={textareaStyle}
        ></textarea>

        <div style={helperTextStyle}>
          Tell us what you liked, what can be improved, and how your experience
          felt overall.
        </div>

        <button
          disabled={rating === 0 || message.length < 4}
          onClick={submitfeedback}
          style={buttonStyle}
          onMouseOver={(e) => {
            if (!(rating === 0 || message.length < 4)) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 18px 34px rgba(0, 200, 83, 0.35)";
            }
          }}
          onMouseOut={(e) => {
            if (!(rating === 0 || message.length < 4)) {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 14px 30px rgba(0, 200, 83, 0.28)";
            }
          }}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};
