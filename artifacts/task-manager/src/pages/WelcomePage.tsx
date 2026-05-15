import WelcomeNavbar from "../components/WelcomeNavbar";
import tasksimage from "../assets/tasks.png";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <>
      <WelcomeNavbar />
      <main
        className="relative flex justify-center items-center w-full min-h-[calc(100vh-70px)] overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${tasksimage})` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,10,18,0.72),rgba(6,10,18,0.82))]" />
        <div className="relative z-10 w-[min(90%,520px)] px-8 py-12 rounded-[28px] bg-[rgba(255,255,255,0.10)] backdrop-blur-[14px] border border-[rgba(255,255,255,0.18)] shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-col justify-center items-center gap-[18px] text-center">
          <h1 className="m-0 text-4xl sm:text-[42px] font-extrabold text-white leading-[1.2] [text-shadow:0_4px_16px_rgba(0,0,0,0.35)]">
            Welcome to TaskFlow
          </h1>
          <p className="m-0 text-base sm:text-[17px] leading-[1.8] text-white/88 max-w-[420px]">
            Organize your tasks, boost your productivity, and manage your day with a modern smart workflow.
          </p>
          <div className="w-[70px] h-1 rounded-full bg-[linear-gradient(90deg,#00c853,#ffffff)] my-2" />
          <div className="flex flex-col gap-[14px] w-full items-center mt-2">
            <button
              className="w-[220px] h-[52px] rounded-[14px] border-none cursor-pointer text-[17px] font-bold tracking-[0.5px] transition-all duration-300 shadow-[0_8px_22px_rgba(0,0,0,0.25)] bg-[linear-gradient(135deg,#00c853,#00e676)] text-[#0d0d0d] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_14px_28px_rgba(0,200,83,0.35)]"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="w-[220px] h-[52px] rounded-[14px] cursor-pointer text-[17px] font-bold tracking-[0.5px] transition-all duration-300 shadow-[0_8px_22px_rgba(0,0,0,0.25)] bg-transparent text-white border-2 border-white/85 backdrop-blur-[6px] hover:-translate-y-1 hover:scale-[1.02] hover:bg-[rgba(255,255,255,0.12)]"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default WelcomePage;
