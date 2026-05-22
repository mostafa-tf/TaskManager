import { useState, useEffect } from "react";
import { TaskStructure } from "../components/TaskStructure";
import { RiTaskLine } from "react-icons/ri";
import { FaFilter } from "react-icons/fa";
import { MdDateRange, MdLowPriority, MdErrorOutline } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const AllTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [notasks, setNoTasks] = useState(false);
  const [titlefilter, setTitleFilter] = useState("");
  const [calenderdate, setCalenderDate] = useState<Date | null>(null);
  const [priorityfilter, setPriorityFilter] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const showError = (message: string) => setErrorMsg(message || "Error From Server");

  useEffect(() => {
    if (!errorMsg) return;
    const timer = setTimeout(() => setErrorMsg(""), 3000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  const filteredtasks = tasks.filter((task) => {
    const date = calenderdate ? calenderdate.toLocaleDateString("en-CA") : "";
    return task.title.startsWith(titlefilter) && task.dueDate.startsWith(date) && task.priority.startsWith(priorityfilter);
  });

  async function fetchalltasks() {
    setNoTasks(false); setTasks([]);
    try {
      const res = await fetch("/api/tasks", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      if (res.status === 404) { setNoTasks(true); }
      else if (res.status === 500) { throw new Error("Error From Server"); }
      else if (res.status === 200) { const tasksobj = await res.json(); setTasks(tasksobj); }
    } catch (error: any) { showError(error.message); }
  }

  useEffect(() => { fetchalltasks(); }, []);

  const switchcheckbox = async (taskid: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskid}`, { method: "PUT", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` } });
      const msg = await res.json();
      if (res.status !== 200) throw new Error(msg.message || "Error From Server");
      await fetchalltasks();
    } catch (error: any) { showError(error.message); }
  };

  const deletetask = async (taskid: string) => {
    try {
      const result = await fetch(`/api/tasks/${taskid}`, { method: "DELETE", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      if (result.status !== 200) { const data = await result.json(); throw new Error(data.message); }
      await fetchalltasks();
    } catch (error: any) { showError("Failed " + error.message); }
  };

  const inputClass = "w-full h-[46px] rounded-[14px] border border-[rgba(0,255,140,0.16)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] outline-none text-sm box-border";

  return (
    <div className="w-full min-h-full box-border">
      {errorMsg && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="w-[min(420px,90%)] p-[22px_24px] rounded-[22px] bg-[linear-gradient(135deg,rgba(40,20,20,0.98),rgba(20,20,20,0.98))] border border-[rgba(255,77,79,0.45)] shadow-[0_24px_60px_rgba(0,0,0,0.55)] text-white flex items-center gap-[14px]">
            <div className="min-w-[48px] h-[48px] rounded-2xl bg-[rgba(255,77,79,0.14)] border border-[rgba(255,77,79,0.25)] flex items-center justify-center text-[#ff6b6b]">
              <MdErrorOutline size={28} />
            </div>
            <div>
              <h3 className="m-0 mb-1 text-[17px] font-extrabold">Something went wrong</h3>
              <p className="m-0 text-sm text-white/75 leading-[1.5]">{errorMsg}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-[14px] flex-wrap mb-6">
        <div className="flex items-center gap-3">
          <div className="w-[52px] h-[52px] rounded-2xl bg-[rgba(0,255,140,0.10)] border border-[rgba(0,255,140,0.18)] flex items-center justify-center text-[#dffff0]">
            <RiTaskLine size={26} />
          </div>
          <div>
            <h2 className="m-0 text-[28px] font-extrabold text-white">All Tasks</h2>
            <p className="m-0 text-white/65 text-sm">View, filter, complete, and manage all your tasks in one place.</p>
          </div>
        </div>
      </div>

      {notasks && (
        <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
          <div className="w-[72px] h-[72px] rounded-2xl bg-[rgba(0,255,140,0.08)] border border-[rgba(0,255,140,0.16)] flex items-center justify-center mb-5">
            <RiTaskLine size={34} className="text-[#60ff9c]" />
          </div>
          <h2 className="m-0 mb-2 text-[24px] font-extrabold text-white">No tasks yet</h2>
          <p className="m-0 mb-6 text-white/55 text-[15px] max-w-[320px] leading-[1.7]">You haven't added any tasks. Create your first task and start tracking your work.</p>
          <a href="/dashboard/addtask" className="h-11 px-6 rounded-[12px] no-underline text-[#08110c] font-extrabold text-sm flex items-center" style={{ background: "linear-gradient(135deg, #00c853, #00e676)" }}>+ Add your first task</a>
        </div>
      )}

      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-5 rounded-[20px] bg-[rgba(255,255,255,0.04)] border border-[rgba(0,255,140,0.10)]">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-[#dffff0] text-sm font-bold"><FaFilter />Search By Title</label>
          <input type="text" value={titlefilter} onChange={(e) => setTitleFilter(e.target.value)} className={inputClass} placeholder="Enter task title" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-[#dffff0] text-sm font-bold"><MdDateRange />Filter By Date</label>
          <DatePicker placeholderText="Select date" selected={calenderdate} dateFormat="yyyy-MM-dd" onChange={(d: Date | null) => setCalenderDate(d)} className="custom-dark-datepicker" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-[#dffff0] text-sm font-bold"><MdLowPriority />Filter By Priority</label>
          <select value={priorityfilter} onChange={(e) => setPriorityFilter(e.target.value)} className={inputClass} style={{ backgroundColor: "#0b1a12", colorScheme: "dark" }}>
            <option value="" style={{ backgroundColor: "#0b1a12", color: "#ffffff" }}>Filter By Priority</option>
            <option value="low" style={{ backgroundColor: "#0b1a12", color: "#ffffff" }}>low</option>
            <option value="med" style={{ backgroundColor: "#0b1a12", color: "#ffffff" }}>medium</option>
            <option value="high" style={{ backgroundColor: "#0b1a12", color: "#ffffff" }}>high</option>
          </select>
        </div>
      </div>

      <div className="grid gap-[18px]">
        {filteredtasks.map((task) => (
          <TaskStructure key={task._id} title={task.title} description={task.description} priority={task.priority} completed={task.isDone} isexpired={task.dueDate} completedat={task.completedAt} deletefun={() => deletetask(task._id)} onChange={() => switchcheckbox(task._id)} taskid={task._id} starthour={task.starthour} endhour={task.endhour} />
        ))}
      </div>
    </div>
  );
};
