import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineHistory } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";

interface LogEntry {
  _id: string;
  message: string;
  usertype: "admin" | "user";
  createdAt: string;
  sender?: { username: string };
  receiver?: { username: string };
}

export const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const checkRole = async () => {
    const res = await fetch("/api/users/checkrole", {
      headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setIsAdmin(data.role === "admin");
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/logs", {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status === 404) { setLogs([]); return; }
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (_) {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    checkRole();
    fetchLogs();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
      " · " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  const typeColor = (type: string) =>
    type === "admin"
      ? "text-amber-300 border-amber-500/[0.25] bg-amber-500/[0.08]"
      : "text-indigo-300 border-indigo-500/[0.20] bg-indigo-500/[0.08]";

  return (
    <div className="min-h-screen bg-[#06070f] p-[30px]">
      <div className="flex flex-wrap items-center gap-[14px] mb-7">
        <button
          onClick={() => navigate(-1)}
          className="w-[46px] h-[46px] rounded-[14px] border border-indigo-500/[0.25] bg-indigo-500/[0.10] text-indigo-300 cursor-pointer flex items-center justify-center transition-all hover:bg-indigo-500/[0.18]"
        >
          <FaArrowLeft size={17} />
        </button>
        <div className="w-[52px] h-[52px] rounded-2xl bg-indigo-500/[0.12] border border-indigo-500/[0.22] flex items-center justify-center text-indigo-300">
          <MdOutlineHistory size={26} />
        </div>
        <div>
          <h2 className="m-0 text-[28px] font-extrabold text-white">Activity Logs</h2>
          <p className="m-0 text-white/50 text-sm">
            {isAdmin ? "All system activity across all users." : "Your recent activity on the platform."}
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-center text-white/50 mt-16">Loading logs...</p>
      )}

      {!loading && logs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
          <div className="w-[72px] h-[72px] rounded-2xl bg-indigo-500/[0.10] border border-indigo-500/[0.20] flex items-center justify-center mb-5">
            <BsClockHistory size={32} className="text-indigo-400" />
          </div>
          <h2 className="m-0 mb-2 text-[22px] font-extrabold text-white">No activity yet</h2>
          <p className="m-0 text-white/50 text-[14px] max-w-[300px] leading-[1.7]">
            Once you start adding tasks, making friends, or joining projects — it'll show up here.
          </p>
        </div>
      )}

      {!loading && logs.length > 0 && (
        <div className="flex flex-col gap-3 max-w-[800px]">
          {logs.map((log) => (
            <div
              key={log._id}
              className="flex items-start gap-4 px-5 py-4 rounded-[16px] bg-white/[0.04] border border-indigo-500/[0.10] shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all hover:bg-indigo-500/[0.05]"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-500/[0.12] border border-indigo-500/[0.20] flex items-center justify-center flex-shrink-0 mt-0.5">
                <MdOutlineHistory size={17} className="text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {isAdmin && log.receiver && (
                    <span className="text-xs font-bold text-cyan-400">@{(log.receiver as any).username}</span>
                  )}
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${typeColor(log.usertype)}`}>
                    {log.usertype}
                  </span>
                </div>
                <p className="m-0 text-white/85 text-sm leading-[1.6]">{log.message}</p>
                <p className="m-0 mt-1 text-white/30 text-[12px]">{formatDate(log.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
