import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import "react-datepicker/dist/react-datepicker.css";

export const AddTasks = () => {
  const [taskinfo, setTaskInfo] = useState({
    title: "",
    priority: "",
    dueDate: "",
    description: "",
    starthour: "00:00",
    endhour: "23:59",
  });

  const [tasktime, setTaskTime] = useState("allday");
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });

  const showBox = (type: string, title: string, message: string) => {
    setMessageBox({ show: true, type, title, message });
  };

  useEffect(() => {
    if (messageBox.show) {
      const timer = setTimeout(() => {
        setMessageBox({ show: false, type: "", title: "", message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messageBox.show]);

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(taskinfo),
      });
      const data = await res.json();
      if (res.status !== 201) throw new Error(data.message);
      showBox("success", "Task Added", "Task inserted to the database successfully");
    } catch (error: any) {
      showBox("error", "Insert Failed", error.message || "Error From Server");
    }
  };

  const refreshhour = () => {
    setTaskInfo((prev) => ({ ...prev, starthour: "00:00", endhour: "23:59" }));
  };

  const isError = messageBox.type === "error";
  const inputClass = "w-full h-12 rounded-xl border border-indigo-500/[0.22] bg-white/[0.07] text-white px-[14px] outline-none text-[15px] box-border transition-all focus:border-indigo-400/[0.50]";
  const selectClass = `${inputClass} cursor-pointer`;

  return (
    <div className="w-full min-h-full flex justify-center items-center p-[40px_20px] box-border">
      {messageBox.show && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`w-[min(430px,90%)] p-[22px] rounded-3xl bg-[linear-gradient(135deg,rgba(12,10,30,0.98),rgba(6,7,15,0.98))] shadow-[0_24px_70px_rgba(0,0,0,0.55)] flex items-center gap-[15px] text-white border ${isError ? "border-red-500/[0.40]" : "border-emerald-500/[0.40]"}`}>
            <div className={`min-w-[52px] h-[52px] rounded-[18px] flex items-center justify-center border ${isError ? "bg-red-500/[0.14] border-red-500/[0.25] text-red-400" : "bg-emerald-500/[0.14] border-emerald-500/[0.25] text-emerald-400"}`}>
              {isError ? <MdErrorOutline size={30} /> : <MdCheckCircleOutline size={30} />}
            </div>
            <div>
              <h3 className="m-0 mb-[5px] text-lg font-extrabold">{messageBox.title}</h3>
              <p className="m-0 text-sm leading-[1.5] text-white/65">{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[720px] rounded-[28px] bg-white/[0.04] border border-indigo-500/[0.18] shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-[16px] p-[34px_32px] box-border">
        <div className="flex justify-center mb-4">
          <div className="w-[58px] h-[58px] rounded-[18px] bg-indigo-500/[0.12] border border-indigo-500/[0.22] flex items-center justify-center text-indigo-300">
            <IoIosAddCircle size={30} />
          </div>
        </div>
        <h2 className="m-0 text-white text-[32px] font-extrabold text-center tracking-[0.4px]">Add Your Task</h2>
        <p className="mt-[10px] mb-7 text-white/55 text-center text-[15px] leading-[1.7]">
          Create a new task, set its priority, due date, and manage the time in a clean and organized way.
        </p>
        <div className="w-[80px] h-[4px] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto mb-7" />

        <form onSubmit={handlesubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
          <div className="flex flex-col gap-2">
            <label className="text-indigo-200 text-sm font-bold tracking-[0.3px]">Task Title</label>
            <input
              type="text"
              value={taskinfo.title}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, title: e.target.value }))}
              required minLength={2} maxLength={15}
              className={inputClass}
              placeholder="Enter task title"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-indigo-200 text-sm font-bold tracking-[0.3px]">Task Priority</label>
            <select value={taskinfo.priority} onChange={(e) => setTaskInfo((prev) => ({ ...prev, priority: e.target.value }))} className={selectClass}>
              <option value="">Select Priority</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-indigo-200 text-sm font-bold tracking-[0.3px]">Due Date</label>
            <input
              type="date"
              value={taskinfo.dueDate}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, dueDate: e.target.value }))}
              required
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-indigo-200 text-sm font-bold tracking-[0.3px]">Task Type</label>
            <div className="flex items-center gap-4 flex-wrap h-12 px-[14px] rounded-xl bg-white/[0.05] border border-indigo-500/[0.14] text-white/80">
              <span className="font-bold text-sm">Time</span>
              <input type="radio" value="time" checked={tasktime === "time"} onChange={(e) => setTaskTime(e.target.value)} className="accent-indigo-500 w-4 h-4" />
              <span className="font-bold text-sm">All Day</span>
              <input type="radio" checked={tasktime === "allday"} value="allday" onChange={(e) => { setTaskTime(e.target.value); refreshhour(); }} className="accent-indigo-500 w-4 h-4" />
            </div>
          </div>

          {tasktime === "time" && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-indigo-200 text-sm font-bold tracking-[0.3px]">Start Hour</label>
                <input
                  type="text" placeholder="HH:MM"
                  pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                  required value={taskinfo.starthour}
                  onChange={(e) => setTaskInfo((prev) => ({ ...prev, starthour: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-indigo-200 text-sm font-bold tracking-[0.3px]">End Hour</label>
                <input
                  type="text" placeholder="HH:MM"
                  pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                  required value={taskinfo.endhour}
                  onChange={(e) => setTaskInfo((prev) => ({ ...prev, endhour: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-2 col-span-1 sm:col-span-2">
            <label className="text-indigo-200 text-sm font-bold tracking-[0.3px]">Description</label>
            <textarea
              value={taskinfo.description} rows={5}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full min-h-[140px] rounded-[16px] border border-indigo-500/[0.22] bg-white/[0.07] text-white p-[14px] outline-none text-[15px] resize-none box-border leading-[1.7] focus:border-indigo-400/[0.50] transition-all"
              placeholder="Write task description..."
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <button
              type="submit"
              className="w-full h-[54px] rounded-[16px] border-none bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[16px] font-extrabold cursor-pointer shadow-[0_14px_30px_rgba(99,102,241,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(99,102,241,0.38)]"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
