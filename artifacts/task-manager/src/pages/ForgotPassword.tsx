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
      <div className="w-full min-h-[calc(100vh-70px)] flex items-center justify-center bg-[linear-gradient(135deg,rgb(7,14,10)_0%,rgb(10,24,17)_45%,rgb(6,10,8)_100%)] p-[30px_20px]">
        <div className="w-full max-w-[420px] p-[38px_30px] rounded-[28px] bg-[rgba(255,255,255,0.06)] border border-[rgba(0,255,128,0.18)] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-[14px]">
          <h2 className="text-white text-[30px] font-extrabold text-center mb-2.5">Forgot Password</h2>
          <p className="text-white/70 text-center mb-[26px] text-[15px]">Enter your email and we&apos;ll send you a reset link.</p>
          {message && <p className={`mb-4 font-bold text-center ${isError ? "text-[#ff9c9c]" : "text-[#60ff9c]"}`}>{message}</p>}
          <form onSubmit={handleSubmit}>
            <label className="block text-[#caffdf] mb-2 text-sm font-bold">Email</label>
            <input
              type="email"
              required
              className="w-full h-12 rounded-[14px] border border-[rgba(0,255,128,0.20)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] outline-none text-[15px] box-border mb-5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <button type="submit" className="w-full h-[50px] rounded-[14px] border-none bg-[linear-gradient(135deg,#00c853,#00e676)] text-[#08110c] text-base font-extrabold cursor-pointer">
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
