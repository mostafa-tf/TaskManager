import { useState } from "react";

export const AddFriend = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/friendship/request", { method: "POST", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (res.status !== 200 && res.status !== 201) throw new Error(data.message);
      showMsg(data.message || "Friend request sent!", false); setEmail("");
    } catch (error: any) { showMsg(error.message, true); }
  };

  return (
    <div>
      {message && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ padding: "22px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.30)", color: isError ? "#ff9c9c" : "#60ff9c", fontWeight: "700", fontSize: "16px" }}>{message}</div>
        </div>
      )}
      <div style={{ maxWidth: "460px", padding: "28px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.10)" }}>
        <h3 style={{ color: "#ffffff", fontWeight: "800", marginTop: 0, marginBottom: "20px" }}>Send Friend Request</h3>
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", color: "#caffdf", marginBottom: "8px", fontSize: "14px", fontWeight: "700" }}>Friend&apos;s Email</label>
          <input type="email" required style={{ width: "100%", height: "46px", borderRadius: "12px", border: "1px solid rgba(0,255,128,0.20)", background: "rgba(255,255,255,0.07)", color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "15px", boxSizing: "border-box", marginBottom: "16px" }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" />
          <button type="submit" style={{ width: "100%", height: "46px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #00c853, #00e676)", color: "#08110c", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>Send Request</button>
        </form>
      </div>
    </div>
  );
};
