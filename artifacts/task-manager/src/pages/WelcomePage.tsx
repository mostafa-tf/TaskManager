import WelcomeNavbar from "../components/WelcomeNavbar";
import { useNavigate } from "react-router-dom";
import { RiTaskLine } from "react-icons/ri";
import { GiThreeFriends } from "react-icons/gi";
import { FcStatistics } from "react-icons/fc";
import { FaProjectDiagram, FaBell } from "react-icons/fa";
import { MdDone } from "react-icons/md";

const features = [
  {
    icon: <RiTaskLine size={26} />,
    title: "Personal Tasks",
    desc: "Create, prioritize, and track your daily tasks with due dates, time slots, and completion status.",
    color: "#818cf8",
    bg: "rgba(99,102,241,0.10)",
    border: "rgba(99,102,241,0.22)",
  },
  {
    icon: <FaProjectDiagram size={22} />,
    title: "Project Management",
    desc: "Build projects, invite your friends as contributors, assign tasks, and monitor team progress.",
    color: "#67e8f9",
    bg: "rgba(6,182,212,0.10)",
    border: "rgba(6,182,212,0.22)",
  },
  {
    icon: <GiThreeFriends size={26} />,
    title: "Friends & Teams",
    desc: "Send friend requests, build your network, and collaborate with people you trust.",
    color: "#c084fc",
    bg: "rgba(168,85,247,0.10)",
    border: "rgba(168,85,247,0.22)",
  },
  {
    icon: <FcStatistics size={26} />,
    title: "Analytics Dashboard",
    desc: "Visualize your productivity with progress charts, completion rates, and trend insights.",
    color: "#fbbf24",
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.22)",
  },
  {
    icon: <FaBell size={22} />,
    title: "Real-time Notifications",
    desc: "Get instant alerts when tasks are assigned, friend requests arrive, or projects are updated.",
    color: "#fb923c",
    bg: "rgba(249,115,22,0.10)",
    border: "rgba(249,115,22,0.22)",
  },
  {
    icon: <MdDone size={26} />,
    title: "Done & Pending Views",
    desc: "Quickly switch between completed and pending tasks. Filter by title, date, or priority.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.10)",
    border: "rgba(52,211,153,0.22)",
  },
];

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white bg-[#06070f]">
      <WelcomeNavbar />

      <section className="relative flex flex-col items-center justify-center text-center px-5 pt-[80px] pb-[90px] overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.09), transparent 65%)" }}
        />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/[0.28] bg-indigo-500/[0.08] text-indigo-300 text-sm font-bold mb-7 tracking-wide">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Free to use · No credit card required
        </div>

        <h1 className="m-0 text-[clamp(2.2rem,7vw,4rem)] font-extrabold leading-[1.15] max-w-[720px] tracking-[-0.5px]">
          Manage Tasks.{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Lead Projects.
          </span>{" "}
          Stay Connected.
        </h1>

        <p className="mt-5 mb-9 text-[clamp(1rem,2.5vw,1.15rem)] text-white/60 max-w-[560px] leading-[1.8]">
          TaskFlow brings your tasks, team projects, and friend network into one focused workspace — so you can spend less time organizing and more time doing.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="h-[54px] px-9 rounded-[14px] border-none text-white text-base font-extrabold cursor-pointer tracking-[0.3px] transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-indigo-600 to-violet-600 shadow-[0_12px_28px_rgba(99,102,241,0.30)] hover:shadow-[0_16px_36px_rgba(99,102,241,0.40)]"
          >
            Get Started Free
          </button>
          <button
            onClick={() => navigate("/login")}
            className="h-[54px] px-9 rounded-[14px] text-white text-base font-extrabold cursor-pointer tracking-[0.3px] transition-all duration-300 hover:-translate-y-1 border border-white/[0.18] bg-white/[0.06] hover:bg-white/[0.10]"
          >
            Sign In
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-white/40 text-sm">
          {["No setup needed", "Works on any device", "Real-time updates"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <MdDone size={15} className="text-indigo-400" />
              {t}
            </span>
          ))}
        </div>
      </section>

      <section className="px-5 pb-[90px] max-w-[1100px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="m-0 text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold tracking-[-0.3px]">
            Everything you need in one place
          </h2>
          <p className="mt-3 text-white/45 text-base max-w-[480px] mx-auto leading-[1.7]">
            From personal to-dos to team collaboration — TaskFlow covers the full spectrum of productivity.
          </p>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))" }}>
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-[22px] p-6 border border-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/[0.18]"
              style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))" }}
            >
              <div
                className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center mb-4 border"
                style={{ color: f.color, background: f.bg, borderColor: f.border }}
              >
                {f.icon}
              </div>
              <h3 className="m-0 mb-2 text-lg font-extrabold text-white">{f.title}</h3>
              <p className="m-0 text-white/50 text-[15px] leading-[1.7]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-[100px] max-w-[680px] mx-auto text-center">
        <div
          className="rounded-[28px] p-10 border border-indigo-500/[0.18]"
          style={{ background: "linear-gradient(145deg, rgba(99,102,241,0.07), rgba(99,102,241,0.02))" }}
        >
          <h2 className="m-0 mb-3 text-[clamp(1.5rem,4vw,2.2rem)] font-extrabold">
            Ready to take control of your work?
          </h2>
          <p className="mt-3 mb-8 text-white/55 text-base leading-[1.7]">
            Join thousands of users who organize smarter with TaskFlow. Sign up in seconds — no credit card needed.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="h-[54px] px-10 rounded-[14px] border-none text-white text-base font-extrabold cursor-pointer tracking-[0.3px] transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-indigo-600 to-violet-600 shadow-[0_12px_28px_rgba(99,102,241,0.30)]"
          >
            Create Your Free Account
          </button>
        </div>
      </section>

      <footer className="border-t border-indigo-500/[0.08] py-8 px-5 text-center">
        <p className="m-0 mb-1 text-white/25 text-sm">&copy; {new Date().getFullYear()} TaskFlow · Built for productive teams</p>
        <p className="m-0 text-white/45 text-sm">
          Designed &amp; developed by{" "}
          <span className="font-bold text-indigo-400">Mostafa Tfaily</span>
          {" "}· M1 Software Engineering Student, Lebanese University
        </p>
      </footer>
    </div>
  );
}

export default WelcomePage;
