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

  const inputClass = "w-full h-12 rounded-[14px] border border-[rgba(0,255,128,0.20)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] outline-none text-[15px] box-border mb-[18px]";

  return (
    <>
      <WelcomeNavbar page="reset" />
      <div className="w-full min-h-[calc(100vh-70px)] flex items-center justify-center bg-[linear-gradient(135deg,rgb(7,14,10)_0%,rgb(10,24,17)_45%,rgb(6,10,8)_100%)] p-[30px_20px]">
        <div className="w-full max-w-[420px] p-[38px_30px] rounded-[28px] bg-[rgba(255,255,255,0.06)] border border-[rgba(0,255,128,0.18)] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-[14px]">
          <h2 className="text-white text-[30px] font-extrabold text-center mb-2.5">Reset Password</h2>
          <p className="text-white/70 text-center mb-[26px] text-[15px]">Enter your new password below.</p>
          {message && <p className={`mb-4 font-bold text-center ${isError ? "text-[#ff9c9c]" : "text-[#60ff9c]"}`}>{message}</p>}
          <form onSubmit={handleSubmit}>
            <label className="block text-[#caffdf] mb-2 text-sm font-bold">New Password</label>
            <input type="password" required minLength={5} maxLength={15} className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" />
            <label className="block text-[#caffdf] mb-2 text-sm font-bold">Confirm Password</label>
            <input type="password" required minLength={5} maxLength={15} className={inputClass} value={repassword} onChange={(e) => setRepassword(e.target.value)} placeholder="Confirm new password" />
            <button type="submit" className="w-full h-[50px] rounded-[14px] border-none bg-[linear-gradient(135deg,#00c853,#00e676)] text-[#08110c] text-base font-extrabold cursor-pointer mt-2">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
