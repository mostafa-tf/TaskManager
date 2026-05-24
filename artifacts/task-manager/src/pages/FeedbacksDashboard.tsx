import { useNavigate } from "react-router-dom";
import { FaStar, FaArrowLeft, FaBrain } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { useState, useEffect } from "react";

interface FeedbackItem {
  _id: string;
  userId: { username: string; email: string };
  rating: number;
  message: string;
  createdAt: string;
}

// ─── VADER-inspired weighted lexicon ────────────────────────────────────────
const LEXICON: Record<string, number> = {
  good: 2, great: 3, excellent: 3, amazing: 3, awesome: 3, love: 3,
  perfect: 3, fantastic: 3, wonderful: 3, best: 3, helpful: 2, easy: 2,
  fast: 2, smooth: 2, nice: 2, happy: 2, satisfied: 2, enjoy: 2,
  recommend: 2, superb: 3, outstanding: 3, brilliant: 3, pleasant: 2,
  useful: 2, reliable: 2, impressive: 2, intuitive: 2, clean: 1,
  simple: 1, efficient: 2, effective: 2, like: 1, works: 1, working: 1,
  beautiful: 2, clear: 1, powerful: 2, responsive: 2,
  bad: -2, terrible: -3, awful: -3, horrible: -3, worst: -3, poor: -2,
  slow: -2, broken: -3, useless: -3, buggy: -2, crash: -3,
  confusing: -2, difficult: -2, complicated: -2, hate: -3,
  disappointed: -2, disappointing: -3, frustrating: -3, frustrate: -2,
  annoying: -2, annoyed: -2, problem: -2, issue: -1, error: -2,
  fail: -2, failed: -2, missing: -1, hard: -1, ugly: -2, boring: -2,
  waste: -2, dislike: -2, lacking: -2, laggy: -2, unstable: -2,
  unreliable: -3, unusable: -3, glitchy: -2,
};

const NEGATIONS = new Set(["not", "never", "no", "neither", "nor", "barely", "hardly", "scarcely", "without"]);

function analyzeSentiment(text: string): { score: number; label: "Positive" | "Neutral" | "Negative" } {
  const tokens = text.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter(Boolean);
  let total = 0;
  let count = 0;
  let negateCount = 0;

  for (const token of tokens) {
    if (NEGATIONS.has(token)) { negateCount = 3; continue; }
    const weight = LEXICON[token];
    if (weight !== undefined) {
      total += negateCount > 0 ? -weight : weight;
      count++;
    }
    if (negateCount > 0) negateCount--;
  }

  const score = count > 0 ? total / count : 0;
  const label = score > 0.3 ? "Positive" : score < -0.3 ? "Negative" : "Neutral";
  return { score: Math.round(score * 100) / 100, label };
}
// ────────────────────────────────────────────────────────────────────────────

const SENTIMENT_COLORS = {
  Positive: { bg: "rgba(0,200,83,0.13)", border: "rgba(0,200,83,0.30)", text: "#39ff9f", dot: "#00c853" },
  Neutral:  { bg: "rgba(255,193,7,0.11)", border: "rgba(255,193,7,0.28)", text: "#ffd54a", dot: "#ffca28" },
  Negative: { bg: "rgba(255,77,79,0.12)", border: "rgba(255,77,79,0.28)", text: "#ff6b6b", dot: "#f44336" },
};

export const FeedbacksDashboard = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [searchfilter, setSearchFilter] = useState("");
  const [ratingfilter, setRatingFilter] = useState("");
  const [showSentiment, setShowSentiment] = useState(false);
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });
  const navigate = useNavigate();

  const showBox = (type: string, title: string, message: string) => {
    setMessageBox({ show: true, type, title, message });
  };

  useEffect(() => {
    if (messageBox.show) {
      const timer = setTimeout(() => setMessageBox({ show: false, type: "", title: "", message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [messageBox.show]);

  const filteredfeedbacks = feedbacks.filter(
    (f) =>
      f.userId.username.toLowerCase().startsWith(searchfilter.trim().toLowerCase()) &&
      f.rating.toString().startsWith(ratingfilter),
  );

  const analyzedFeedbacks = filteredfeedbacks.map((f) => ({
    ...f,
    sentiment: analyzeSentiment(f.message),
  }));

  const sentimentCounts = analyzedFeedbacks.reduce(
    (acc, f) => { acc[f.sentiment.label]++; return acc; },
    { Positive: 0, Neutral: 0, Negative: 0 } as Record<string, number>,
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
      if (res.status !== 200) throw new Error(data.message || "Something went wrong");
      setFeedbacks(data);
    } catch (error: any) {
      showBox("error", "Fetch Failed", error.message);
    }
  };

  useEffect(() => { fetchfeedbacks(); }, []);

  const pageStyle: React.CSSProperties = {
    width: "100%", minHeight: "100vh",
    background: "radial-gradient(circle at top, rgba(0,255,140,0.08), transparent 24%), linear-gradient(135deg, #07110d 0%, #0b1d15 45%, #08110c 100%)",
    color: "#ffffff",
  };
  const navStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "100%", height: "95px", color: "#ffffff", position: "relative",
    fontSize: "32px", fontWeight: "800",
    background: "rgba(5,10,8,0.95)", borderBottom: "1px solid rgba(0,255,140,0.14)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)", backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)", letterSpacing: "0.4px",
  };
  const buttonstyle: React.CSSProperties = {
    width: "56px", height: "56px", borderRadius: "50%", fontSize: "22px",
    position: "absolute", left: "24px", display: "flex", alignItems: "center",
    justifyContent: "center", color: "#dffff0", border: "1px solid rgba(0,255,140,0.18)",
    background: "rgba(255,255,255,0.06)", cursor: "pointer", boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
  };
  const filterdiv: React.CSSProperties = {
    width: "min(1200px, 92%)", margin: "28px auto 0", padding: "22px", borderRadius: "24px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.12)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px", boxSizing: "border-box",
  };
  const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "8px" };
  const labelStyle: React.CSSProperties = { color: "#dffff0", fontSize: "14px", fontWeight: "700", letterSpacing: "0.3px" };
  const inputStyle: React.CSSProperties = {
    width: "100%", height: "46px", borderRadius: "14px",
    border: "1px solid rgba(0,255,140,0.16)", background: "rgba(255,255,255,0.07)",
    color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "14px", boxSizing: "border-box",
  };
  const mainStyle: React.CSSProperties = {
    width: "100%", minHeight: "calc(100vh - 95px)", display: "flex",
    justifyContent: "center", alignItems: "flex-start",
    padding: "28px 20px 40px", boxSizing: "border-box",
  };
  const tableWrapper: React.CSSProperties = {
    width: "min(1200px, 100%)", overflowX: "auto", borderRadius: "24px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.12)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.28)", padding: "18px", boxSizing: "border-box",
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
  const isError = messageBox.type === "error";
  const boxStyle: React.CSSProperties = {
    width: "min(430px, 90%)", padding: "22px", borderRadius: "24px",
    background: "linear-gradient(135deg, rgba(22,22,22,0.98), rgba(12,12,12,0.98))",
    border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.35)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.55)", display: "flex", alignItems: "center", gap: "15px", color: "#fff",
  };

  return (
    <div style={pageStyle}>
      {messageBox.show && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={boxStyle}>
            <div style={{ minWidth: "52px", height: "52px", borderRadius: "18px", background: isError ? "rgba(255,77,79,0.14)" : "rgba(0,255,140,0.12)", border: isError ? "1px solid rgba(255,77,79,0.25)" : "1px solid rgba(0,255,140,0.22)", display: "flex", alignItems: "center", justifyContent: "center", color: isError ? "#ff6b6b" : "#60ff9c" }}>
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
        <button style={buttonstyle} onClick={() => navigate(-1)}><FaArrowLeft /></button>
        Feedbacks Dashboard
      </nav>

      <div style={filterdiv}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Enter Username</label>
          <input type="text" value={searchfilter} onChange={(e) => setSearchFilter(e.target.value)} style={inputStyle} placeholder="Search by username" />
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

      {/* Sentiment Analysis Toggle Button */}
      <div style={{ width: "min(1200px, 92%)", margin: "20px auto 0", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => setShowSentiment((v) => !v)}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "12px 24px", borderRadius: "14px", border: "none", cursor: "pointer",
            fontSize: "15px", fontWeight: "800",
            background: showSentiment
              ? "linear-gradient(135deg, #00c853, #00e676)"
              : "linear-gradient(135deg, #6a1b9a, #ab47bc)",
            color: showSentiment ? "#08110c" : "#ffffff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.30)",
            transition: "all 0.2s ease",
          }}
        >
          <FaBrain size={16} />
          {showSentiment ? "Back to Table" : "Sentiment Analysis"}
        </button>
      </div>

      <main style={mainStyle}>
        {filteredfeedbacks.length === 0 ? (
          <h1 style={{ textAlign: "center", color: "#ff8f8f", fontSize: "34px", fontWeight: "800", marginTop: "50px" }}>
            No Feedbacks Found
          </h1>
        ) : !showSentiment ? (
          /* ── Normal table view ── */
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
                        {Array(feedback.rating).fill(null).map((_, i) => <FaStar key={i} color="#ffd54a" />)}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, maxWidth: "320px", whiteSpace: "normal", wordWrap: "break-word", overflowWrap: "break-word", lineHeight: "1.7", textAlign: "left" }}>{feedback.message}</td>
                    <td style={tdStyle}>{feedback.createdAt.replace("T", " | ").slice(0, 21)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* ── Sentiment Analysis view ── */
          <div style={{ width: "min(1200px, 100%)" }}>

            {/* Summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              {(["Positive", "Neutral", "Negative"] as const).map((label) => {
                const c = SENTIMENT_COLORS[label];
                const pct = analyzedFeedbacks.length > 0 ? Math.round((sentimentCounts[label] / analyzedFeedbacks.length) * 100) : 0;
                return (
                  <div key={label} style={{ padding: "22px", borderRadius: "20px", background: c.bg, border: `1px solid ${c.border}`, textAlign: "center", boxShadow: "0 12px 30px rgba(0,0,0,0.22)" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: c.dot, margin: "0 auto 10px" }} />
                    <div style={{ fontSize: "32px", fontWeight: "900", color: c.text }}>{sentimentCounts[label]}</div>
                    <div style={{ fontSize: "15px", fontWeight: "700", color: "#ffffff", marginTop: "4px" }}>{label}</div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{pct}% of feedbacks</div>
                  </div>
                );
              })}
              <div style={{ padding: "22px", borderRadius: "20px", background: "rgba(100,160,255,0.10)", border: "1px solid rgba(100,160,255,0.25)", textAlign: "center", boxShadow: "0 12px 30px rgba(0,0,0,0.22)" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#90caf9", margin: "0 auto 10px" }} />
                <div style={{ fontSize: "32px", fontWeight: "900", color: "#90caf9" }}>{analyzedFeedbacks.length}</div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#ffffff", marginTop: "4px" }}>Total</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>feedbacks analyzed</div>
              </div>
            </div>

            {/* Algorithm note */}
            <div style={{ padding: "14px 20px", borderRadius: "14px", background: "rgba(171,71,188,0.10)", border: "1px solid rgba(171,71,188,0.22)", marginBottom: "22px", fontSize: "13px", color: "rgba(255,255,255,0.60)", lineHeight: "1.6" }}>
              <strong style={{ color: "#ce93d8" }}>Algorithm:</strong> VADER-inspired weighted lexicon — each word is scored from a 60-word dictionary. Negation words (<em>not, never, no...</em>) flip the sign of the following word. Final score &gt; 0.3 → Positive · &lt; −0.3 → Negative · otherwise → Neutral.
            </div>

            {/* Per-feedback rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {analyzedFeedbacks.map((f) => {
                const c = SENTIMENT_COLORS[f.sentiment.label];
                return (
                  <div key={f._id} style={{ padding: "18px 22px", borderRadius: "18px", background: "rgba(255,255,255,0.04)", border: `1px solid ${c.border}`, display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <span style={{ fontWeight: "800", fontSize: "15px", color: "#dffff0" }}>{f.userId.username}</span>
                        <span style={{ color: "rgba(255,255,255,0.40)", fontSize: "13px" }}>{f.userId.email}</span>
                        <div style={{ display: "flex", gap: "3px" }}>
                          {Array(f.rating).fill(null).map((_, i) => <FaStar key={i} color="#ffd54a" size={12} />)}
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.78)", lineHeight: "1.65" }}>{f.message}</p>
                    </div>
                    <div style={{ textAlign: "center", minWidth: "110px" }}>
                      <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "14px", background: c.bg, border: `1px solid ${c.border}` }}>
                        <span style={{ fontSize: "13px", fontWeight: "900", color: c.text, letterSpacing: "0.5px" }}>{f.sentiment.label.toUpperCase()}</span>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: "600" }}>score: {f.sentiment.score}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
