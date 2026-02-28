import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

export const Feedback = () => {
  const feedbackdiv = {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const feedbackform = {
    width: "300px",
    height: "400px",
    border: "2px solid green",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  };

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
      if (res.status != 201) {
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
  return (
    <div style={feedbackdiv}>
      <div style={feedbackform}>
        <h2 style={{ position: "absolute", top: "10px" }}>
          How was your experience
        </h2>
        Rating
        <div>
          <FaStar
            size={24}
            style={{ color: rating >= 1 ? "blue" : "black" }}
            onClick={() => setRating(1)}
          />
          <FaStar
            size={24}
            style={{ color: rating >= 2 ? "blue" : "black" }}
            onClick={() => setRating(2)}
          />
          <FaStar
            size={24}
            style={{ color: rating >= 3 ? "blue" : "black" }}
            onClick={() => setRating(3)}
          />
          <FaStar
            size={24}
            style={{ color: rating >= 4 ? "blue" : "black" }}
            onClick={() => setRating(4)}
          />
          <FaStar
            size={24}
            style={{ color: rating >= 5 ? "blue" : "black" }}
            onClick={() => setRating(5)}
          />
        </div>
        Message{" "}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={7}
          cols={29}
          placeholder={"enter your feedback description"}
        ></textarea>
        <button
          disabled={rating === 0 || message.length < 4}
          onClick={submitfeedback}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};
