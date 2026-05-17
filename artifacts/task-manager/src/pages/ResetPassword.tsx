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

  const inputClass = "w-full h-12 rounded-xl border border-indigo-500/[0.22] bg-white/[0.07] text-white px-[14px] outline-none text-[15px] box-border mb-[18px] transition-all focus:border-indigo-400/[0.50]";

  return (
    <>
      <WelcomeNavbar page="reset" />
      <div className="w-full min-h-[calc(100vh-70px)] flex items-center justify-center bg-[#06070f] p-[30px_20px]">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06), transparent 60%)" }}
        />
        <div className="w-full max-w-[420px] p-[38px_30px] rounded-[28px] bg-white/[0.05] border border-indigo-500/[0.18] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-[14px] relative z-10">
          <h2 className="text-white text-[30px] font-extrabold text-center mb-2.5 tracking-[0.4px]">Reset Password</h2>
          <p className="text-white/55 text-center mb-[26px] text-[15px] leading-[1.7]">Enter your new password below.</p>
          {message && (
            <p className={`mb-4 font-bold text-center text-sm rounded-xl px-4 py-3 ${isError ? "text-red-300 bg-red-500/[0.09] border border-red-500/[0.30]" : "text-emerald-300 bg-emerald-500/[0.09] border border-emerald-500/[0.28]"}`}>
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <label className="block text-indigo-200 mb-2 text-sm font-bold">New Password</label>
            <input type="password" required minLength={5} maxLength={15} className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" />
            <label className="block text-indigo-200 mb-2 text-sm font-bold">Confirm Password</label>
            <input type="password" required minLength={5} maxLength={15} className={inputClass} value={repassword} onChange={(e) => setRepassword(e.target.value)} placeholder="Confirm new password" />
            <button
              type="submit"
              className="w-full h-[50px] rounded-[14px] border-none bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-base font-extrabold cursor-pointer shadow-[0_12px_28px_rgba(99,102,241,0.28)] transition-all hover:-translate-y-0.5 mt-2"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
