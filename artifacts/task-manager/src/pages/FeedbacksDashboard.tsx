import { useNavigate } from "react-router-dom";
import { FaStar, FaArrowLeft } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { useState, useEffect } from "react";

interface FeedbackItem {
  _id: string;
  userId: { username: string; email: string };
  rating: number;
  message: string;
  createdAt: string;
}

export const FeedbacksDashboard = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [searchfilter, setSearchFilter] = useState("");
  const [ratingfilter, setRatingFilter] = useState("");
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });
  const navigate = useNavigate();

  const showBox = (type: string, title: string, message: string) => {
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

  const filteredfeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.userId.username.toLowerCase().startsWith(searchfilter.trim().toLowerCase()) &&
      feedback.rating.toString().startsWith(ratingfilter),
  );

  const fetchfeedbacks = async () => {
    try {
      const res = await fetch("/api/feedbacks", {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.status === 401) throw new Error(data.message || "You must login first");
      if (res.status === 403) throw new Error(data.message || "Admin only access");
      if (res.status === 404) { setFeedbacks([]); return; }
      if (res.status === 500) throw new Error(data.message || "Server error");
      if (res.status !== 200) throw new Error(data.message || "Something went wrong");
      setFeedbacks(data);
    } catch (error: any) {
      showBox("error", "Fetch Failed", error.message);
    }
  };

  useEffect(() => { fetchfeedbacks(); }, []);

  const pageStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    background: "radial-gradient(circle at top, rgba(0,255,140,0.08), transparent 24%), linear-gradient(135deg, #07110d 0%, #0b1d15 45%, #08110c 100%)",
    color: "#ffffff",
  };

  const navStyle: React.CSSProperties = {
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

  const buttonstyle: React.CSSProperties = {
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

  const filterdiv: React.CSSProperties = {
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

  const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "8px" };
  const labelStyle: React.CSSProperties = { color: "#dffff0", fontSize: "14px", fontWeight: "700", letterSpacing: "0.3px" };
  const inputStyle: React.CSSProperties = {
    width: "100%", height: "46px", borderRadius: "14px",
    border: "1px solid rgba(0,255,140,0.16)", background: "rgba(255,255,255,0.07)",
    color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "14px", boxSizing: "border-box",
  };

  const mainStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "calc(100vh - 95px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "28px 20px 40px",
    boxSizing: "border-box",
  };

  const tableWrapper: React.CSSProperties = {
    width: "min(1200px, 100%)",
    overflowX: "auto",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,255,140,0.12)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
    padding: "18px",
    boxSizing: "border-box",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%", minWidth: "900px", borderCollapse: "separate",
    borderSpacing: "0", color: "#ffffff", fontSize: "15px", textAlign: "center",
  };

  const thStyle: React.CSSProperties = {
    padding: "18px 14px", background: "rgba(0,255,140,0.10)", color: "#dffff0",
    fontSize: "14px", fontWeight: "800", borderBottom: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "16px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.88)", whiteSpace: "nowrap", verticalAlign: "middle",
  };

  const descriptionCellStyle: React.CSSProperties = {
    ...tdStyle, maxWidth: "320px", whiteSpace: "normal",
    wordWrap: "break-word", overflowWrap: "break-word", lineHeight: "1.7", textAlign: "left",
  };

  const boxOverlay: React.CSSProperties = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
  };

  const isError = messageBox.type === "error";

  const boxStyle: React.CSSProperties = {
    width: "min(430px, 90%)", padding: "22px", borderRadius: "24px",
    background: "linear-gradient(135deg, rgba(22,22,22,0.98), rgba(12,12,12,0.98))",
    border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.35)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.55)", display: "flex", alignItems: "center", gap: "15px", color: "#fff",
  };

  const boxIcon: React.CSSProperties = {
    minWidth: "52px", height: "52px", borderRadius: "18px",
    background: isError ? "rgba(255,77,79,0.14)" : "rgba(0,255,140,0.12)",
    border: isError ? "1px solid rgba(255,77,79,0.25)" : "1px solid rgba(0,255,140,0.22)",
    display: "flex", alignItems: "center", justifyContent: "center", color: isError ? "#ff6b6b" : "#60ff9c",
  };

  return (
    <div style={pageStyle}>
      {messageBox.show && (
        <div style={boxOverlay}>
          <div style={boxStyle}>
            <div style={boxIcon}>
              {isError ? <MdErrorOutline size={30} /> : <MdCheckCircleOutline size={30} />}
            </div>
            <div>
              <h3 style={{ margin: "0 0 5px", fontSize: "18px", fontWeight: "800" }}>{messageBox.title}</h3>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "rgba(255,255,255,0.72)" }}>{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

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
          <select value={ratingfilter} onChange={(e) => setRatingFilter(e.target.value)} style={inputStyle}>
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
        {filteredfeedbacks.length === 0 ? (
          <h1 style={{ textAlign: "center", color: "#ff8f8f", fontSize: "34px", fontWeight: "800", marginTop: "50px" }}>
            No Feedbacks Found
          </h1>
        ) : (
          <div style={tableWrapper}>
            <table style={tableStyle}>
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
                {filteredfeedbacks.map((feedback) => (
                  <tr key={feedback._id}>
                    <td style={tdStyle}>{feedback.userId.username}</td>
                    <td style={tdStyle}>{feedback.userId.email}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4px" }}>
                        {Array(feedback.rating).fill(null).map((_, index) => (
                          <FaStar key={index} color="#ffd54a" />
                        ))}
                      </div>
                    </td>
                    <td style={descriptionCellStyle}>{feedback.message}</td>
                    <td style={tdStyle}>{feedback.createdAt.replace("T", " | ").slice(0, 21)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
