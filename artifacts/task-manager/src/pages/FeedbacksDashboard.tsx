import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdFeedback, MdDelete } from "react-icons/md";

export const FeedbacksDashboard = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [noFeedbacks, setNoFeedbacks] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const fetchFeedbacks = async () => {
    setNoFeedbacks(false); setFeedbacks([]);
    try {
      const res = await fetch("/api/feedbacks", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status === 404) setNoFeedbacks(true);
      else if (res.status === 200) setFeedbacks(data);
      else throw new Error(data.message);
    } catch (error: any) { showMsg(error.message, true); }
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const deleteFeedback = async (id: string) => {
    try {
      const res = await fetch(`/api/feedbacks/${id}`, { method: "DELETE", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("Feedback deleted!", false); await fetchFeedbacks();
    } catch (error: any) { showMsg(error.message, true); }
  };

  const cardStyle: React.CSSProperties = { padding: "20px 24px", borderRadius: "18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.10)", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #07110d 0%, #0b1d15 50%, #08110c 100%)", padding: "30px" }}>
      {message && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ padding: "22px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.30)", color: isError ? "#ff9c9c" : "#60ff9c", fontWeight: "700", fontSize: "16px" }}>{message}</div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
        <button onClick={() => navigate("/admindashboard")} style={{ width: "46px", height: "46px", borderRadius: "14px", border: "1px solid rgba(0,255,140,0.2)", background: "rgba(0,255,140,0.08)", color: "#dffff0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaArrowLeft size={18} /></button>
        <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(0,255,140,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: "#dffff0" }}><MdFeedback size={26} /></div>
        <div><h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>User Feedbacks</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>Review and manage all submitted feedbacks.</p></div>
      </div>
      {noFeedbacks && <h2 style={{ color: "#60ff9c", textAlign: "center", fontWeight: "800" }}>No Feedbacks Found</h2>}
      {feedbacks.map((fb) => (
        <div style={cardStyle} key={fb._id}>
          <div>
            <h3 style={{ margin: "0 0 6px", color: "#ffffff", fontSize: "18px", fontWeight: "800" }}>{fb.title}</h3>
            <p style={{ margin: "0 0 6px", color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: "1.6" }}>{fb.feedback}</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>By: {fb.user?.username || "Unknown"} ({fb.user?.email || ""})</p>
          </div>
          <button onClick={() => deleteFeedback(fb._id)} style={{ width: "42px", height: "42px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#c62828,#e53935)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><MdDelete size={20} /></button>
        </div>
      ))}
    </div>
  );
};
