import WelcomeNavbar from "../components/WelcomeNavbar";
import { useState } from "react";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/forgotpassword", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      setIsError(false); setMessage(data.message || "Reset link sent to your email.");
    } catch (error: any) { setIsError(true); setMessage(error.message); }
  };

  const pageStyle: React.CSSProperties = { width: "100%", minHeight: "calc(100vh - 70px)", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, rgb(7,14,10) 0%, rgb(10,24,17) 45%, rgb(6,10,8) 100%)", padding: "30px 20px" };
  const cardStyle: React.CSSProperties = { width: "100%", maxWidth: "420px", padding: "38px 30px", borderRadius: "28px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(0,255,128,0.18)", boxShadow: "0 20px 60px rgba(0,0,0,0.45)", backdropFilter: "blur(14px)" };
  const inputStyle: React.CSSProperties = { width: "100%", height: "48px", borderRadius: "14px", border: "1px solid rgba(0,255,128,0.20)", background: "rgba(255,255,255,0.07)", color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "15px", boxSizing: "border-box", marginBottom: "20px" };
  const buttonStyle: React.CSSProperties = { width: "100%", height: "50px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #00c853, #00e676)", color: "#08110c", fontSize: "16px", fontWeight: "800", cursor: "pointer" };

  return (
    <>
      <WelcomeNavbar page="forgot" />
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2 style={{ color: "#ffffff", fontSize: "30px", fontWeight: "800", textAlign: "center", marginBottom: "10px" }}>Forgot Password</h2>
          <p style={{ color: "rgba(255,255,255,0.70)", textAlign: "center", marginBottom: "26px", fontSize: "15px" }}>Enter your email and we&apos;ll send you a reset link.</p>
          {message && <p style={{ color: isError ? "#ff9c9c" : "#60ff9c", marginBottom: "16px", fontWeight: "700", textAlign: "center" }}>{message}</p>}
          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", color: "#caffdf", marginBottom: "8px", fontSize: "14px", fontWeight: "700" }}>Email</label>
            <input type="email" required style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
            <button type="submit" style={buttonStyle}>Send Reset Link</button>
          </form>
        </div>
      </div>
    </>
  );
};
