import { useState } from "react";
import { MdFeedback } from "react-icons/md";

export const Feedback = () => {
  const [data, setData] = useState({ title: "", feedback: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/feedbacks", { method: "POST", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify(data) });
      const resdata = await res.json();
      if (res.status !== 201) throw new Error(resdata.message);
      showMsg("Feedback submitted!", false);
      setData({ title: "", feedback: "" });
    } catch (error: any) { showMsg(error.message, true); }
  };

  const inputStyle: React.CSSProperties = { width: "100%", height: "48px", borderRadius: "14px", border: "1px solid rgba(0,255,128,0.20)", background: "rgba(255,255,255,0.07)", color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "15px", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", color: "#caffdf", marginBottom: "8px", fontSize: "14px", fontWeight: "700" };
  const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", marginBottom: "20px" };

  return (
    <div style={{ width: "100%", minHeight: "100%", boxSizing: "border-box" }}>
      {message && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ padding: "22px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.30)", color: isError ? "#ff9c9c" : "#60ff9c", fontWeight: "700", fontSize: "16px" }}>{message}</div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(0,255,140,0.10)", border: "1px solid rgba(0,255,140,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#dffff0" }}><MdFeedback size={26} /></div>
        <div><h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>Send Feedback</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>We value your feedback and suggestions.</p></div>
      </div>
      <div style={{ maxWidth: "500px", padding: "32px", borderRadius: "24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.12)" }}>
        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}><label style={labelStyle}>Title</label><input type="text" required minLength={2} maxLength={50} style={inputStyle} value={data.title} onChange={(e) => setData(p => ({ ...p, title: e.target.value }))} placeholder="Feedback title" /></div>
          <div style={fieldStyle}><label style={labelStyle}>Feedback</label><textarea required minLength={5} maxLength={500} style={{ ...inputStyle, height: "120px", padding: "12px 14px", resize: "vertical" }} value={data.feedback} onChange={(e) => setData(p => ({ ...p, feedback: e.target.value }))} placeholder="Write your feedback..." /></div>
          <button type="submit" style={{ width: "100%", height: "50px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #00c853, #00e676)", color: "#08110c", fontSize: "16px", fontWeight: "800", cursor: "pointer" }}>Submit Feedback</button>
        </form>
      </div>
    </div>
  );
};
