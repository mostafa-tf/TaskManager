import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineAnalytics } from "react-icons/md";

interface AnalysisStats {
  total: number;
  done: number;
  undone: number;
  expired: number;
}

const statCards = [
  { key: "total" as const, label: "Total Tasks", valueClass: "text-indigo-400", borderClass: "border-indigo-500/[0.20]", iconBg: "bg-indigo-500/[0.10]" },
  { key: "done" as const, label: "Completed", valueClass: "text-emerald-400", borderClass: "border-emerald-500/[0.20]", iconBg: "bg-emerald-500/[0.10]" },
  { key: "undone" as const, label: "Pending", valueClass: "text-amber-300", borderClass: "border-amber-500/[0.20]", iconBg: "bg-amber-500/[0.10]" },
  { key: "expired" as const, label: "Expired", valueClass: "text-red-400", borderClass: "border-red-500/[0.20]", iconBg: "bg-red-500/[0.10]" },
] as const;

export const Analysis = () => {
  const [stats, setStats] = useState<AnalysisStats | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/tasks/analysis", {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.status === 200) setStats(data as AnalysisStats);
      } catch { }
    };
    fetchStats();
  }, []);

  const pct = stats ? Math.round((stats.done / (stats.total || 1)) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#06070f] p-[30px]">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-[46px] h-[46px] rounded-[14px] border border-indigo-500/[0.25] bg-indigo-500/[0.10] text-indigo-300 cursor-pointer flex items-center justify-center transition-all hover:bg-indigo-500/[0.18]"
        >
          <FaArrowLeft size={17} />
        </button>
        <div className="w-[52px] h-[52px] rounded-2xl bg-indigo-500/[0.12] border border-indigo-500/[0.22] flex items-center justify-center text-indigo-300">
          <MdOutlineAnalytics size={26} />
        </div>
        <div>
          <h2 className="m-0 text-[28px] font-extrabold text-white">Task Analysis</h2>
          <p className="m-0 text-white/50 text-sm">Overview of your task completion progress.</p>
        </div>
      </div>

      {!stats ? (
        <p className="text-white/50 text-center mt-16">Loading...</p>
      ) : (
        <div className="max-w-[700px] mx-auto">
          <div className="flex justify-center mb-9">
            <div className="w-[200px] h-[200px]">
              <CircularProgressbar
                value={pct}
                text={`${pct}%`}
                styles={buildStyles({
                  textColor: "#ffffff",
                  pathColor: "#6366f1",
                  trailColor: "rgba(255,255,255,0.07)",
                  textSize: "22px",
                })}
              />
            </div>
          </div>

          <div className="flex gap-5 flex-wrap justify-center">
            {statCards.map(({ key, label, valueClass, borderClass, iconBg }) => (
              <div
                key={key}
                className={`flex-1 min-w-[150px] py-6 px-5 rounded-[22px] bg-white/[0.04] border text-center shadow-[0_12px_35px_rgba(0,0,0,0.25)] ${borderClass}`}
              >
                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mx-auto mb-3`}>
                  <span className={`text-lg font-extrabold ${valueClass}`}>#</span>
                </div>
                <p className="text-white/60 font-bold text-sm mb-2">{label}</p>
                <h2 className={`m-0 text-[40px] font-extrabold ${valueClass}`}>{stats[key]}</h2>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
