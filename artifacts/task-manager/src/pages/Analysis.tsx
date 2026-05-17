import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FcStatistics } from "react-icons/fc";
import { FaArrowLeft } from "react-icons/fa";

interface AnalysisStats {
  total: number;
  done: number;
  undone: number;
  expired: number;
}

const statCards = [
  {
    key: "total" as const,
    label: "Total Tasks",
    valueClass: "text-[#00e676]",
    borderClass: "border-[rgba(0,255,140,0.2)]",
  },
  {
    key: "done" as const,
    label: "Completed",
    valueClass: "text-[#00e676]",
    borderClass: "border-[rgba(0,230,118,0.2)]",
  },
  {
    key: "undone" as const,
    label: "Pending",
    valueClass: "text-[#ffe082]",
    borderClass: "border-[rgba(255,193,7,0.2)]",
  },
  {
    key: "expired" as const,
    label: "Expired",
    valueClass: "text-[#ff9c9c]",
    borderClass: "border-[rgba(255,82,82,0.2)]",
  },
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
    <div className="min-h-screen bg-[linear-gradient(135deg,#07110d_0%,#0b1d15_50%,#08110c_100%)] p-[30px]">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-[46px] h-[46px] rounded-[14px] border border-[rgba(0,255,140,0.2)] bg-[rgba(0,255,140,0.08)] text-[#dffff0] cursor-pointer flex items-center justify-center"
        >
          <FaArrowLeft size={18} />
        </button>
        <div className="w-[52px] h-[52px] rounded-2xl bg-[rgba(0,255,140,0.10)] flex items-center justify-center">
          <FcStatistics size={28} />
        </div>
        <div>
          <h2 className="m-0 text-[28px] font-extrabold text-white">Task Analysis</h2>
          <p className="m-0 text-white/65 text-sm">Overview of your task completion progress.</p>
        </div>
      </div>

      {!stats ? (
        <p className="text-white">Loading...</p>
      ) : (
        <div>
          <div className="flex justify-center mb-9">
            <div className="w-[200px] h-[200px]">
              <CircularProgressbar
                value={pct}
                text={`${pct}%`}
                styles={buildStyles({
                  textColor: "#ffffff",
                  pathColor: "#00e676",
                  trailColor: "rgba(255,255,255,0.1)",
                  textSize: "22px",
                })}
              />
            </div>
          </div>

          <div className="flex gap-5 flex-wrap justify-center">
            {statCards.map(({ key, label, valueClass, borderClass }) => (
              <div
                key={key}
                className={`flex-1 min-w-[160px] py-6 px-5 rounded-[22px] bg-[rgba(255,255,255,0.05)] border text-center shadow-[0_12px_35px_rgba(0,0,0,0.25)] ${borderClass}`}
              >
                <p className="text-[#dffff0] font-bold mb-2">{label}</p>
                <h2 className={`m-0 text-[40px] font-extrabold ${valueClass}`}>{stats[key]}</h2>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
