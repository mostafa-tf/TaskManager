import WelcomeNavbar from "../components/WelcomeNavbar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/users/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.status !== 200) { const msg = await res.json(); throw new Error(msg.message); }
      const msg = await res.json();
      localStorage.setItem("token", msg.token);
      navigate("/dashboard");
    } catch (error: any) { setError(error.message); }
  };

  const inputClass = "w-full h-12 rounded-xl border border-indigo-500/[0.22] bg-white/[0.07] text-white px-4 outline-none text-[15px] box-border transition-all focus:border-indigo-400/[0.50]";

  return (
    <>
      <WelcomeNavbar page="login" />
      <div className="w-full min-h-[calc(100vh-70px)] flex items-center justify-center bg-[#06070f] p-[30px_20px]">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07), transparent 60%)" }}
        />
        <div className="w-full max-w-[430px] p-[40px_32px] rounded-[28px] bg-white/[0.05] border border-indigo-500/[0.18] shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-[14px] relative z-10">
          <h2 className="text-white text-[32px] font-extrabold text-center mb-2 tracking-[0.4px]">Welcome Back</h2>
          <p className="text-white/55 text-center text-[15px] mb-[28px] leading-[1.7]">
            Login to your account and continue managing your tasks efficiently.
          </p>

          {error && (
            <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-[12px] border border-red-500/[0.35] bg-red-500/[0.09]">
              <MdErrorOutline size={20} className="text-red-400 shrink-0" />
              <p className="m-0 text-red-300 text-sm font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-indigo-200 mb-2 text-sm font-bold">Email</label>
              <input
                type="email"
                required
                minLength={11}
                maxLength={50}
                className={inputClass}
                placeholder="Enter your email"
                value={data.email}
                onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="mb-5">
              <label className="block text-indigo-200 mb-2 text-sm font-bold">Password</label>
              <input
                type="password"
                required
                minLength={5}
                maxLength={15}
                className={inputClass}
                placeholder="Enter your password"
                value={data.password}
                onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2 mt-2 mb-[24px] text-white/65 text-sm">
              <div>Don&apos;t have an account?<Link to="/signup" className="text-indigo-400 no-underline font-bold ml-1.5 hover:text-indigo-300 transition-colors">Register</Link></div>
              <div>Forgot your password?<Link to="/forgotpassword" className="text-indigo-400 no-underline font-bold ml-1.5 hover:text-indigo-300 transition-colors">Reset it here</Link></div>
            </div>
            <button
              type="submit"
              className="w-full h-[50px] rounded-[14px] border-none bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-base font-extrabold cursor-pointer shadow-[0_12px_28px_rgba(99,102,241,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(99,102,241,0.38)]"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
