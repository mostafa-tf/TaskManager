import { useNavigate } from "react-router-dom";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";
export const FeedbacksDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchfilter, setSearchFilter] = useState("");
  const filteredfeedbacks = feedbacks.filter((feedback) =>
    feedback.userId.username.startsWith(searchfilter.trim().toLowerCase()),
  );
  const filterdiv = {
    display: "block",
  };

  const fetchfeedbacks = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/feedbacks", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status == 404) {
        setFeedbacks([]);
      }

      if (res.status == 200) {
        const feedbacks = await res.json();
        setFeedbacks(feedbacks);
      } else {
        const data = await res.json();
        throw new Error(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const navigate = useNavigate();
  const buttonstyle = {
    width: "60px",
    height: "60px",
    borderRadius: "30px",
    fontSize: "30px",
    position: "absolute",
    left: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "green",
    border: "3px solid green",
    cursor: "pointer",
  };
  useEffect(() => {
    fetchfeedbacks();
  }, []);
  return (
    <>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "90px",
          color: "cyan",
          position: "relative",
          fontSize: "30px",
          backgroundColor: "black",
          borderbottom: "1px solid #222",
        }}
      >
        <button style={buttonstyle} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        Feedbacks Dashboard
      </nav>
      <main
        style={{
          width: "100%",
          minHeight: "calc(100vh - 90px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={filterdiv}>
          Enter Username{" "}
          <input
            type="text"
            value={searchfilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
        <br />
        {filteredfeedbacks.length == 0 ? (
          <h1 style={{ color: "red" }}>No Feedbacks Found</h1>
        ) : (
          <table border={2}>
            <thead>
              <th>Username</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Description</th>
              <th>Feedback Date</th>
            </thead>
            <tbody>
              {filteredfeedbacks.map((feedback) => {
                return (
                  <tr>
                    <td>{feedback.userId.username}</td>
                    <td>{feedback.userId.email}</td>
                    <td style={{ textAlign: "center" }}>
                      {Array(feedback.rating)
                        .fill()
                        .map((_, index) => (
                          <FaStar key={index} color={"green"} />
                        ))}
                    </td>
                    <td
                      style={{
                        maxWidth: "300px",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {feedback.message}
                    </td>
                    <td>
                      {feedback.createdAt.replace("T", " | ").slice(0, 21)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
};
