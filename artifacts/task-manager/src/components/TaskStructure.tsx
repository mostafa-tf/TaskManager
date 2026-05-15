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
    if (completed) return { label: "Completed", bgClass: "bg-[rgba(0,200,83,0.16)] border-[rgba(0,230,118,0.25)] text-[#7dffb2]" };
    if (curtime > taskdate) return { label: "Expired", bgClass: "bg-[rgba(229,57,53,0.16)] border-[rgba(255,82,82,0.25)] text-[#ff9c9c]" };
    return { label: "Pending", bgClass: "bg-[rgba(255,193,7,0.14)] border-[rgba(255,213,79,0.24)] text-[#ffe082]" };
  };

  const getPriorityConfig = () => {
    if (priority === "high") return "bg-[rgba(229,57,53,0.16)] border-[rgba(255,82,82,0.25)] text-[#ff9c9c]";
    if (priority === "medium" || priority === "med") return "bg-[rgba(255,193,7,0.14)] border-[rgba(255,213,79,0.24)] text-[#ffe082]";
    return "bg-[rgba(0,200,83,0.16)] border-[rgba(0,230,118,0.25)] text-[#7dffb2]";
  };

  const statusConfig = getStatusConfig();
  const priorityClass = getPriorityConfig();

  const topAccentBg = completed
    ? "linear-gradient(90deg, #00c853, #00e676)"
    : curtime > taskdate
      ? "linear-gradient(90deg, #c62828, #e53935)"
      : "linear-gradient(90deg, #ef6c00, #ffd54f)";

  return (
    <div className="w-full rounded-3xl bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] border border-[rgba(0,255,140,0.12)] shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-[12px] p-[22px] box-border relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: topAccentBg }} />

      <div className="flex justify-between items-start gap-4 flex-wrap mb-[18px]">
        <div className="flex flex-col gap-2.5 flex-1 min-w-0">
          <h3 className="m-0 text-2xl font-extrabold text-white leading-[1.3] break-words">{title}</h3>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`inline-flex items-center justify-center px-3 py-2 rounded-full text-[13px] font-extrabold tracking-[0.2px] border ${statusConfig.bgClass}`}>
              {statusConfig.label}
            </span>
            <span className={`inline-flex items-center justify-center px-3 py-2 rounded-full text-[13px] font-extrabold tracking-[0.2px] border ${priorityClass}`}>
              {priority}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            className="w-[42px] h-[42px] rounded-[12px] border-none cursor-pointer flex items-center justify-center text-xl shadow-[0_8px_20px_rgba(0,0,0,0.18)] bg-[linear-gradient(135deg,#1565c0,#1e88e5)] text-white"
            onClick={() => { localStorage.setItem("taskid", taskid); navigate("/dashboard/edittask"); }}
          >
            <TiPencil />
          </button>
          <button
            className="w-[42px] h-[42px] rounded-[12px] border-none cursor-pointer flex items-center justify-center text-xl shadow-[0_8px_20px_rgba(0,0,0,0.18)] bg-[linear-gradient(135deg,#c62828,#e53935)] text-white"
            onClick={deletefun}
          >
            <MdDelete />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-[18px]">
        <div className="rounded-[18px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] p-4 box-border">
          <p className="m-0 mb-2 text-white/62 text-[13px] font-bold uppercase tracking-[0.8px]">Description</p>
          <p className="m-0 text-white text-base leading-[1.8] break-words">{description || "No description provided"}</p>
        </div>
        <div className="rounded-[18px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] p-4 box-border">
          <p className="m-0 mb-2 text-white/62 text-[13px] font-bold uppercase tracking-[0.8px]">Due Date</p>
          <p className="m-0 text-white text-base leading-[1.8]">{isexpired?.slice(0, 10)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 flex-wrap mt-[18px]">
        <div className="flex items-center gap-2.5 text-[#dffff0] font-bold text-[15px] bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.10)] px-[14px] py-[10px] rounded-[14px]">
          <IoAlarm size={18} />
          <span>{starthour} - {endhour}</span>
        </div>

        <div className="flex-1 min-w-[180px]">
          {completed && completedat && (
            <p className="m-0 text-sm font-bold leading-[1.7] text-[#7dffb2]">
              Completed At: {completedat.slice(0, 19).replace("T", " ")}
            </p>
          )}
          {taskdate < curtime && !completed && (
            <p className="m-0 text-sm font-bold leading-[1.7] text-[#ff9c9c]">Expired</p>
          )}
          {taskdate > curtime && !completed && (
            <p className="m-0 text-sm font-bold leading-[1.7] text-[#ffe082]">
              Expires In {expirestime(curtime, taskdate)} ({isexpired.slice(0, 10)})
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5 bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.10)] px-[14px] py-[10px] rounded-[14px]">
          {completed ? <FaCheckCircle color="#00e676" size={18} /> : <FaRegCircle color="#dffff0" size={18} />}
          <input
            type="checkbox"
            onChange={onChange}
            className="w-5 h-5 accent-[#00e676] cursor-pointer"
            checked={completed}
          />
        </div>
      </div>
    </div>
  );
};
