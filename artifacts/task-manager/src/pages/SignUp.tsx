import WelcomeNavbar from "../components/WelcomeNavbar";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";

const SignUp = () => {
  const navigate = useNavigate();
  const passwordRef = useRef<HTMLInputElement>(null);
  const repasswordRef = useRef<HTMLInputElement>(null);
  const [matching, setMatching] = useState(true);
  const [data, setData] = useState({ email: "", username: "", password: "", repassword: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMatching(true);
    if (data.password !== data.repassword) {
      setMatching(false);
      if (passwordRef.current) passwordRef.current.style.border = "2px solid rgba(255,77,79,0.7)";
      if (repasswordRef.current) repasswordRef.current.style.border = "2px solid rgba(255,77,79,0.7)";
      return;
    }
    if (passwordRef.current) passwordRef.current.style.border = "";
    if (repasswordRef.current) repasswordRef.current.style.border = "";
    const { email, username, password } = data;
    try {
      const res = await fetch("/api/users/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, username, password }) });
      const resdata = await res.json();
      if (res.status !== 201) throw new Error(resdata.message);
      localStorage.setItem("token", resdata.token);
      navigate("/dashboard");
    } catch (er: any) { setError(er.message); }
  };

  const inputClass = "w-full h-12 rounded-[14px] border border-[rgba(0,255,128,0.20)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] outline-none text-[15px] box-border";

  return (
    <>
      <WelcomeNavbar page="signup" />
      <main className="w-full min-h-[calc(100vh-70px)] flex justify-center items-center px-5 py-[30px] box-border bg-[radial-gradient(circle_at_top,rgba(0,255,140,0.08),transparent_24%),linear-gradient(135deg,rgb(7,14,10)_0%,rgb(10,24,17)_45%,rgb(6,10,8)_100%)]">
        <div className="w-full max-w-[460px] p-[38px_32px] rounded-[28px] bg-[rgba(255,255,255,0.06)] border border-[rgba(0,255,128,0.16)] shadow-[0_22px_60px_rgba(0,0,0,0.42)] backdrop-blur-[14px] box-border">
          <h2 className="m-0 text-white text-[34px] font-extrabold text-center tracking-[0.4px]">Create Account</h2>
          <p className="mt-2.5 mb-7 text-white/72 text-center text-[15px] leading-[1.7]">
            Join the platform and start managing your tasks in a smarter and more organized way.
          </p>

          {error && (
            <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-[14px] border border-[rgba(255,77,79,0.40)] bg-[rgba(255,77,79,0.10)]">
              <MdErrorOutline size={20} className="text-[#ff6b6b] shrink-0" />
              <p className="m-0 text-[#ff9c9c] text-sm font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 mb-[18px]">
              <label className="text-[#dffff0] text-sm font-bold tracking-[0.3px]">Email</label>
              <input type="email" className={inputClass} required minLength={11} maxLength={50} onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))} value={data.email} placeholder="Enter your email" />
            </div>
            <div className="flex flex-col gap-2 mb-[18px]">
              <label className="text-[#dffff0] text-sm font-bold tracking-[0.3px]">Username</label>
              <input type="text" className={inputClass} required minLength={2} maxLength={20} onChange={(e) => setData(prev => ({ ...prev, username: e.target.value }))} value={data.username} placeholder="Enter your username" />
            </div>
            <div className="flex flex-col gap-2 mb-[18px]">
              <label className="text-[#dffff0] text-sm font-bold tracking-[0.3px]">Password</label>
              <input type="password" className={inputClass} required minLength={5} maxLength={15} ref={passwordRef} onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))} value={data.password} placeholder="Enter your password" />
            </div>
            <div className="flex flex-col gap-2 mb-[18px]">
              <label className="text-[#dffff0] text-sm font-bold tracking-[0.3px]">Confirm Password</label>
              <input type="password" className={inputClass} required ref={repasswordRef} minLength={5} maxLength={15} onChange={(e) => setData(prev => ({ ...prev, repassword: e.target.value }))} value={data.repassword} placeholder="Re-enter your password" />
            </div>
            {!matching && (
              <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-[14px] border border-[rgba(255,77,79,0.40)] bg-[rgba(255,77,79,0.10)]">
                <MdErrorOutline size={20} className="text-[#ff6b6b] shrink-0" />
                <p className="m-0 text-[#ff9c9c] text-sm font-semibold">Password and Confirm Password must match</p>
              </div>
            )}
            <button type="submit" className="w-full h-[50px] rounded-[14px] border-none bg-[linear-gradient(135deg,#00c853,#00e676)] text-[#08110c] text-base font-extrabold cursor-pointer shadow-[0_12px_28px_rgba(0,200,83,0.28)] transition-all duration-300 mt-2.5">
              Sign Up
            </button>
            <div className="mt-3 text-center text-white/80 text-sm">
              Already have an account?<Link to="/login" className="text-[#39ff9c] no-underline font-bold ml-1.5">Login</Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default SignUp;
