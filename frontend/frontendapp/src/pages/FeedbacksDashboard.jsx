import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";

export const FeedbacksDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchfilter, setSearchFilter] = useState("");
  const [ratingfilter, setRatingFilter] = useState("");

  const filteredfeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.userId.username.startsWith(searchfilter.trim().toLowerCase()) &&
      feedback.rating.toString().startsWith(ratingfilter),
  );

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

  useEffect(() => {
    fetchfeedbacks();
  }, []);

  const pageStyle = {
    width: "100%",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(0,255,140,0.08), transparent 24%), linear-gradient(135deg, #07110d 0%, #0b1d15 45%, #08110c 100%)",
    color: "#ffffff",
  };

  const navStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "95px",
    color: "#ffffff",
    position: "relative",
    fontSize: "32px",
    fontWeight: "800",
    background: "rgba(5,10,8,0.95)",
    borderBottom: "1px solid rgba(0,255,140,0.14)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    letterSpacing: "0.4px",
  };

  const buttonstyle = {
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
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
  };

  const filterdiv = {
    width: "min(1200px, 92%)",
    margin: "28px auto 0",
    padding: "22px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,255,140,0.12)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    boxSizing: "border-box",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const labelStyle = {
    color: "#dffff0",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.3px",
  };

  const inputStyle = {
    width: "100%",
    height: "46px",
    borderRadius: "14px",
    border: "1px solid rgba(0,255,140,0.16)",
    background: "rgba(255,255,255,0.07)",
    color: "#ffffff",
    padding: "0 14px",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const mainStyle = {
    width: "100%",
    minHeight: "calc(100vh - 95px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "28px 20px 40px",
    boxSizing: "border-box",
  };

  const tableWrapper = {
    width: "min(1200px, 100%)",
    overflowX: "auto",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,255,140,0.12)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
    padding: "18px",
    boxSizing: "border-box",
  };

  const tableStyle = {
    width: "100%",
    minWidth: "900px",
    borderCollapse: "separate",
    borderSpacing: "0",
    color: "#ffffff",
    fontSize: "15px",
    textAlign: "center",
  };

  const thStyle = {
    padding: "18px 14px",
    background: "rgba(0,255,140,0.10)",
    color: "#dffff0",
    fontSize: "14px",
    fontWeight: "800",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "16px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.88)",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  };

  const descriptionCellStyle = {
    ...tdStyle,
    maxWidth: "320px",
    whiteSpace: "normal",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    lineHeight: "1.7",
    textAlign: "left",
  };

  const emptyStateStyle = {
    textAlign: "center",
    color: "#ff8f8f",
    fontSize: "34px",
    fontWeight: "800",
    marginTop: "50px",
  };

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <button style={buttonstyle} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        Feedbacks Dashboard
      </nav>

      <div style={filterdiv}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Enter Username</label>
          <input
            type="text"
            value={searchfilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={inputStyle}
            placeholder="Search by username"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Search By Rating</label>
          <select
            value={ratingfilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="">Filter By Rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
      </div>

      <main style={mainStyle}>
        {filteredfeedbacks.length == 0 ? (
          <h1 style={emptyStateStyle}>No Feedbacks Found</h1>
        ) : (
          <div style={tableWrapper}>
            <table border={0} style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Username</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Rating</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Feedback Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredfeedbacks.map((feedback) => {
                  return (
                    <tr key={feedback._id}>
                      <td style={tdStyle}>{feedback.userId.username}</td>
                      <td style={tdStyle}>{feedback.userId.email}</td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {Array(feedback.rating)
                            .fill()
                            .map((_, index) => (
                              <FaStar key={index} color="#ffd54a" />
                            ))}
                        </div>
                      </td>
                      <td style={descriptionCellStyle}>{feedback.message}</td>
                      <td style={tdStyle}>
                        {feedback.createdAt.replace("T", " | ").slice(0, 21)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
