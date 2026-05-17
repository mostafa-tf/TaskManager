import { MdDelete } from "react-icons/md";
import { TiPencil } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { IoAlarm } from "react-icons/io5";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

interface TaskStructureProps {
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  isexpired: string;
  completedat: string | null;
  deletefun: () => void;
  onChange: () => void;
  taskid: string;
  starthour: string;
  endhour: string;
}

export const TaskStructure = ({
  title, description, priority, completed, isexpired, completedat,
  deletefun, onChange, taskid, starthour, endhour,
}: TaskStructureProps) => {
  const curtime = new Date();
  let taskdate = new Date(isexpired);
  taskdate.setDate(taskdate.getDate() + 1);

  const expirestime = (curdate: Date, tdate: Date) => {
    const diff = Math.floor((tdate.getTime() - curdate.getTime()) / 1000);
    if (diff < 0) return "Expired";
    if (diff < 60) return `${diff} seconds`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days`;
    if (diff < 2419200) return `${Math.floor(diff / 604800)} weeks`;
    return `${Math.floor(diff / 2419200)} months`;
  };

  const navigate = useNavigate();

  const getStatusConfig = () => {
    if (completed) return { label: "Completed", cls: "bg-emerald-500/[0.14] border-emerald-500/[0.28] text-emerald-300" };
    if (curtime > taskdate) return { label: "Expired", cls: "bg-red-500/[0.14] border-red-500/[0.28] text-red-300" };
    return { label: "Pending", cls: "bg-amber-500/[0.14] border-amber-500/[0.28] text-amber-300" };
  };

  const getPriorityConfig = () => {
    if (priority === "high") return "bg-red-500/[0.14] border-red-500/[0.28] text-red-300";
    if (priority === "medium" || priority === "med") return "bg-amber-500/[0.14] border-amber-500/[0.28] text-amber-300";
    return "bg-emerald-500/[0.14] border-emerald-500/[0.28] text-emerald-300";
  };

  const statusConfig = getStatusConfig();
  const priorityClass = getPriorityConfig();

  const topAccentBg = completed
    ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
    : curtime > taskdate
      ? "linear-gradient(90deg, #ef4444, #dc2626)"
      : "linear-gradient(90deg, #f59e0b, #fbbf24)";

  return (
    <div className="w-full rounded-2xl bg-white/[0.04] border border-indigo-500/[0.14] shadow-[0_12px_35px_rgba(0,0,0,0.28)] backdrop-blur-[12px] p-4 sm:p-[22px] box-border relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: topAccentBg }} />

      <div className="flex justify-between items-start gap-3 flex-wrap mb-4">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <h3 className="m-0 text-xl sm:text-2xl font-extrabold text-white leading-[1.3] break-words">{title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[12px] sm:text-[13px] font-extrabold tracking-[0.2px] border ${statusConfig.cls}`}>
              {statusConfig.label}
            </span>
            <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[12px] sm:text-[13px] font-extrabold tracking-[0.2px] border ${priorityClass}`}>
              {priority}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-[46px] h-[46px] rounded-[13px] border-none cursor-pointer flex items-center justify-center text-xl shadow-[0_6px_16px_rgba(0,0,0,0.22)] bg-gradient-to-r from-indigo-600 to-indigo-500 text-white active:scale-95 transition-transform"
            onClick={() => { localStorage.setItem("taskid", taskid); navigate("/dashboard/edittask"); }}
          >
            <TiPencil />
          </button>
          <button
            className="w-[46px] h-[46px] rounded-[13px] border-none cursor-pointer flex items-center justify-center text-xl shadow-[0_6px_16px_rgba(0,0,0,0.22)] bg-gradient-to-r from-red-700 to-red-500 text-white active:scale-95 transition-transform"
            onClick={deletefun}
          >
            <MdDelete />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-3 sm:gap-[16px]">
        <div className="rounded-[14px] bg-white/[0.04] border border-white/[0.06] p-3 sm:p-4 box-border">
          <p className="m-0 mb-1.5 text-white/50 text-[11px] font-bold uppercase tracking-[0.8px]">Description</p>
          <p className="m-0 text-white text-sm sm:text-base leading-[1.8] break-words">{description || "No description provided"}</p>
        </div>
        <div className="rounded-[14px] bg-white/[0.04] border border-white/[0.06] p-3 sm:p-4 box-border">
          <p className="m-0 mb-1.5 text-white/50 text-[11px] font-bold uppercase tracking-[0.8px]">Due Date</p>
          <p className="m-0 text-white text-sm sm:text-base leading-[1.8]">{isexpired?.slice(0, 10)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center gap-3 flex-wrap mt-4">
        <div className="flex items-center gap-2 text-indigo-200 font-bold text-sm bg-indigo-500/[0.08] border border-indigo-500/[0.15] px-3 py-[9px] rounded-[11px]">
          <IoAlarm size={15} />
          <span>{starthour} - {endhour}</span>
        </div>

        <div className="flex-1 min-w-[160px]">
          {completed && completedat && (
            <p className="m-0 text-sm font-bold leading-[1.7] text-emerald-400">
              Completed At: {completedat.slice(0, 19).replace("T", " ")}
            </p>
          )}
          {taskdate < curtime && !completed && (
            <p className="m-0 text-sm font-bold leading-[1.7] text-red-400">Expired</p>
          )}
          {taskdate > curtime && !completed && (
            <p className="m-0 text-sm font-bold leading-[1.7] text-amber-300">
              Expires in {expirestime(curtime, taskdate)} ({isexpired.slice(0, 10)})
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 bg-indigo-500/[0.08] border border-indigo-500/[0.15] px-3 py-[9px] rounded-[11px]">
          {completed ? <FaCheckCircle className="text-indigo-400" size={17} /> : <FaRegCircle className="text-white/50" size={17} />}
          <input
            type="checkbox"
            onChange={onChange}
            className="w-5 h-5 accent-indigo-500 cursor-pointer"
            checked={completed}
          />
        </div>
      </div>
    </div>
  );
};
