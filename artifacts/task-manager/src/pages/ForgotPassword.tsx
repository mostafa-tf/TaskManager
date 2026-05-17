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

  return (
    <>
      <WelcomeNavbar page="forgot" />
      <div className="w-full min-h-[calc(100vh-70px)] flex items-center justify-center bg-[#06070f] p-[30px_20px]">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06), transparent 60%)" }}
        />
        <div className="w-full max-w-[420px] p-[38px_30px] rounded-[28px] bg-white/[0.05] border border-indigo-500/[0.18] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-[14px] relative z-10">
          <h2 className="text-white text-[30px] font-extrabold text-center mb-2.5 tracking-[0.4px]">Forgot Password</h2>
          <p className="text-white/55 text-center mb-[26px] text-[15px] leading-[1.7]">Enter your email and we&apos;ll send you a reset link.</p>
          {message && (
            <p className={`mb-4 font-bold text-center text-sm rounded-xl px-4 py-3 ${isError ? "text-red-300 bg-red-500/[0.09] border border-red-500/[0.30]" : "text-emerald-300 bg-emerald-500/[0.09] border border-emerald-500/[0.28]"}`}>
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <label className="block text-indigo-200 mb-2 text-sm font-bold">Email</label>
            <input
              type="email"
              required
              className="w-full h-12 rounded-xl border border-indigo-500/[0.22] bg-white/[0.07] text-white px-[14px] outline-none text-[15px] box-border mb-5 transition-all focus:border-indigo-400/[0.50]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <button
              type="submit"
              className="w-full h-[50px] rounded-[14px] border-none bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-base font-extrabold cursor-pointer shadow-[0_12px_28px_rgba(99,102,241,0.28)] transition-all hover:-translate-y-0.5"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
