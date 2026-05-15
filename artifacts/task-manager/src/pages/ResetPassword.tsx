import WelcomeNavbar from "../components/WelcomeNavbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ResetPassword = () => {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repassword) { setIsError(true); setMessage("Passwords do not match"); return; }
    try {
      const res = await fetch("/api/users/resetpassword", { method: "PUT", headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      setIsError(false); setMessage("Password reset successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) { setIsError(true); setMessage(error.message); }
  };

  const pageStyle: React.CSSProperties = { width: "100%", minHeight: "calc(100vh - 70px)", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, rgb(7,14,10) 0%, rgb(10,24,17) 45%, rgb(6,10,8) 100%)", padding: "30px 20px" };
  const cardStyle: React.CSSProperties = { width: "100%", maxWidth: "420px", padding: "38px 30px", borderRadius: "28px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(0,255,128,0.18)", boxShadow: "0 20px 60px rgba(0,0,0,0.45)", backdropFilter: "blur(14px)" };
  const inputStyle: React.CSSProperties = { width: "100%", height: "48px", borderRadius: "14px", border: "1px solid rgba(0,255,128,0.20)", background: "rgba(255,255,255,0.07)", color: "#ffffff", padding: "0 14px", outline: "none", fontSize: "15px", boxSizing: "border-box", marginBottom: "18px" };
  const buttonStyle: React.CSSProperties = { width: "100%", height: "50px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #00c853, #00e676)", color: "#08110c", fontSize: "16px", fontWeight: "800", cursor: "pointer", marginTop: "8px" };
  const labelStyle: React.CSSProperties = { display: "block", color: "#caffdf", marginBottom: "8px", fontSize: "14px", fontWeight: "700" };

  return (
    <>
      <WelcomeNavbar page="reset" />
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2 style={{ color: "#ffffff", fontSize: "30px", fontWeight: "800", textAlign: "center", marginBottom: "10px" }}>Reset Password</h2>
          <p style={{ color: "rgba(255,255,255,0.70)", textAlign: "center", marginBottom: "26px", fontSize: "15px" }}>Enter your new password below.</p>
          {message && <p style={{ color: isError ? "#ff9c9c" : "#60ff9c", marginBottom: "16px", fontWeight: "700", textAlign: "center" }}>{message}</p>}
          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>New Password</label>
            <input type="password" required minLength={5} maxLength={15} style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" />
            <label style={labelStyle}>Confirm Password</label>
            <input type="password" required minLength={5} maxLength={15} style={inputStyle} value={repassword} onChange={(e) => setRepassword(e.target.value)} placeholder="Confirm new password" />
            <button type="submit" style={buttonStyle}>Reset Password</button>
          </form>
        </div>
      </div>
    </>
  );
};
