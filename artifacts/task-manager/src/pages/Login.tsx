import WelcomeNavbar from "../components/WelcomeNavbar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.status !== 200) { const msg = await res.json(); throw new Error(msg.message); }
      const msg = await res.json();
      localStorage.setItem("token", msg.token);
      navigate("/dashboard");
    } catch (error: any) { alert("error " + error.message); }
  };

  return (
    <>
      <WelcomeNavbar page="login" />
      <div className="w-full min-h-[calc(100vh-70px)] flex items-center justify-center bg-[linear-gradient(135deg,rgb(7,14,10)_0%,rgb(10,24,17)_45%,rgb(6,10,8)_100%)] p-[30px_20px]">
        <div className="w-full max-w-[430px] p-[40px_32px] rounded-[28px] bg-[rgba(255,255,255,0.06)] border border-[rgba(0,255,128,0.18)] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-[14px]">
          <h2 className="text-white text-[34px] font-extrabold text-center mb-2 tracking-[0.5px]">Welcome Back</h2>
          <p className="text-white/72 text-center text-[15px] mb-[30px] leading-[1.7]">
            Login to your account and continue managing your tasks efficiently.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-[#caffdf] mb-2 text-[15px] font-semibold">Email</label>
              <input
                type="email"
                required
                minLength={11}
                maxLength={50}
                className="w-full h-12 rounded-[14px] border border-[rgba(0,255,128,0.25)] bg-[rgba(255,255,255,0.07)] text-white px-4 outline-none text-[15px] box-border"
                placeholder="Enter your email"
                value={data.email}
                onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="mb-5">
              <label className="block text-[#caffdf] mb-2 text-[15px] font-semibold">Password</label>
              <input
                type="password"
                required
                minLength={5}
                maxLength={15}
                className="w-full h-12 rounded-[14px] border border-[rgba(0,255,128,0.25)] bg-[rgba(255,255,255,0.07)] text-white px-4 outline-none text-[15px] box-border"
                placeholder="Enter your password"
                value={data.password}
                onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2.5 mt-2 mb-[26px] text-white/80 text-sm">
              <div>Don&apos;t have an account?<Link to="/signup" className="text-[#39ff9c] no-underline font-bold ml-1.5">Register</Link></div>
              <div>Forgot your password?<Link to="/forgotpassword" className="text-[#39ff9c] no-underline font-bold ml-1.5">Reset it here</Link></div>
            </div>
            <button
              type="submit"
              className="w-full h-[50px] rounded-[14px] border-none bg-[linear-gradient(135deg,#00c853,#00e676)] text-[#08110c] text-base font-extrabold cursor-pointer shadow-[0_12px_28px_rgba(0,200,83,0.28)] transition-all duration-300"
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
