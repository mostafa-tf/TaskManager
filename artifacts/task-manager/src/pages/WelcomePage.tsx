import WelcomeNavbar from "../components/WelcomeNavbar";
import { useNavigate } from "react-router-dom";
import { RiTaskLine } from "react-icons/ri";
import { GiThreeFriends } from "react-icons/gi";
import { FcStatistics } from "react-icons/fc";
import { FaProjectDiagram, FaBell } from "react-icons/fa";
import { MdDone, MdOutlineHistory } from "react-icons/md";
import { useTheme } from "../contexts/ThemeContext";

const features = [
  {
    icon: <RiTaskLine size={28} />,
    title: "Personal Tasks",
    desc: "Create, prioritize, and track your daily tasks with due dates, time slots, and completion status.",
    color: "#00e676",
  },
  {
    icon: <FaProjectDiagram size={24} />,
    title: "Project Management",
    desc: "Build projects, invite your friends as contributors, assign tasks, and monitor team progress.",
    color: "#40c4ff",
  },
  {
    icon: <GiThreeFriends size={28} />,
    title: "Friends & Teams",
    desc: "Send friend requests, build your network, and collaborate with people you trust.",
    color: "#ea80fc",
  },
  {
    icon: <FcStatistics size={28} />,
    title: "Analytics Dashboard",
    desc: "Visualize your productivity with progress charts, completion rates, and trend insights.",
    color: "#ffd740",
  },
  {
    icon: <FaBell size={24} />,
    title: "Real-time Notifications",
    desc: "Get instant alerts when tasks are assigned, friend requests arrive, or projects are updated.",
    color: "#ff6d00",
  },
  {
    icon: <MdDone size={28} />,
    title: "Done & Pending Views",
    desc: "Quickly switch between completed and pending tasks. Filter by title, date, or priority.",
    color: "#69f0ae",
  },
  {
    icon: <MdOutlineHistory size={28} />,
    title: "Activity Audit Logs",
    desc: "Every action leaves a trace. Review a full history of task changes, logins, and team activity across your workspace.",
    color: "#b388ff",
  },
];

const LIGHT_BG = "linear-gradient(135deg, #f0faf5 0%, #e6f5ec 50%, #f0faf5 100%)";
const DARK_BG  = "radial-gradient(ellipse at top, rgba(0,255,140,0.10), transparent 55%), #050a08";

function WelcomePage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen text-white" style={{ background: isDark ? DARK_BG : LIGHT_BG }}>
      <WelcomeNavbar />

      <section className="relative flex flex-col items-center justify-center text-center px-5 pt-[80px] pb-[90px] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,255,140,0.07), transparent 65%)" }} />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,255,140,0.25)] bg-[rgba(0,255,140,0.08)] text-[#60ff9c] text-sm font-bold mb-7 tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
          Free to use · No credit card required
        </div>

        <h1 className="m-0 text-[clamp(2.2rem,7vw,4rem)] font-extrabold leading-[1.15] max-w-[720px] tracking-[-0.5px]">
          Manage Tasks.{" "}
          <span style={{ background: "linear-gradient(90deg, #00e676, #69f0ae)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Lead Projects.
          </span>{" "}
          Stay Connected.
        </h1>

        <p className="mt-5 mb-9 text-[clamp(1rem,2.5vw,1.15rem)] text-white/70 max-w-[560px] leading-[1.8]">
          TaskFlow brings your tasks, team projects, and friend network into one focused workspace — so you can spend less time organizing and more time doing.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="h-[54px] px-9 rounded-[14px] border-none text-[#08110c] text-base font-extrabold cursor-pointer tracking-[0.3px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,200,83,0.35)]"
            style={{ background: "linear-gradient(135deg, #00c853, #00e676)" }}
          >
            Get Started Free
          </button>
          <button
            onClick={() => navigate("/login")}
            className="h-[54px] px-9 rounded-[14px] text-white text-base font-extrabold cursor-pointer tracking-[0.3px] transition-all duration-300 hover:-translate-y-1 border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.12)]"
          >
            Sign In
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-white/50 text-sm">
          {["No setup needed", "Works on any device", "Real-time updates"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <MdDone size={16} className="text-[#00e676]" />
              {t}
            </span>
          ))}
        </div>
      </section>

      <section className="px-5 pb-[90px] max-w-[1100px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="m-0 text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold tracking-[-0.3px]">Everything you need in one place</h2>
          <p className="mt-3 text-white/55 text-base max-w-[480px] mx-auto leading-[1.7]">
            From personal to-dos to team collaboration — TaskFlow covers the full spectrum of productivity.
          </p>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))" }}>
          {features.map((f) => (
            <div key={f.title}
              className="rounded-[22px] p-6 border border-[rgba(255,255,255,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(0,255,140,0.18)] group"
              style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))" }}>
              <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center mb-4 border"
                style={{ color: f.color, background: `${f.color}18`, borderColor: `${f.color}30` }}>
                {f.icon}
              </div>
              <h3 className="m-0 mb-2 text-lg font-extrabold text-white">{f.title}</h3>
              <p className="m-0 text-white/55 text-[15px] leading-[1.7]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-[100px] max-w-[680px] mx-auto text-center">
        <div className="rounded-[28px] p-10 border border-[rgba(0,255,140,0.16)]"
          style={{ background: "linear-gradient(145deg, rgba(0,255,140,0.08), rgba(0,255,140,0.02))" }}>
          <h2 className="m-0 mb-3 text-[clamp(1.5rem,4vw,2.2rem)] font-extrabold">Ready to take control of your work?</h2>
          <p className="mt-3 mb-8 text-white/60 text-base leading-[1.7]">
            Join thousands of users who organize smarter with TaskFlow. Sign up in seconds — no credit card needed.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="h-[54px] px-10 rounded-[14px] border-none text-[#08110c] text-base font-extrabold cursor-pointer tracking-[0.3px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,200,83,0.35)]"
            style={{ background: "linear-gradient(135deg, #00c853, #00e676)" }}
          >
            Create Your Free Account
          </button>
        </div>
      </section>

      <footer className="border-t border-[rgba(255,255,255,0.06)] py-8 px-5 text-center">
        <p className="m-0 mb-1 text-white/30 text-sm">© {new Date().getFullYear()} TaskFlow · Built for productive teams</p>
        <p className="m-0 text-white/50 text-sm">
          Designed & developed by{" "}
          <span className="font-bold text-[#60ff9c]">Mostafa Tfaily</span>
          {" "}· M1 Software Engineering Student, Lebanese University
        </p>
      </footer>
    </div>
  );
}

export default WelcomePage;
