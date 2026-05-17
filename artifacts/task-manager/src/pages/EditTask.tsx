import { useState, useEffect } from "react";
import { TiPencil } from "react-icons/ti";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const EditTask = () => {
  const [task, setTask] = useState<any>(null);
  const [calenderdate, setCalenderDate] = useState<Date | null>(null);
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });

  const showBox = (type: string, title: string, message: string) => {
    setMessageBox({ show: true, type, title, message });
    setTimeout(() => setMessageBox({ show: false, type: "", title: "", message: "" }), 3000);
  };

  useEffect(() => {
    const fetchTask = async () => {
      const taskid = localStorage.getItem("taskid");
      if (!taskid) return;
      try {
        const res = await fetch(`/api/tasks/singletask/${taskid}`, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
        const data = await res.json();
        if (res.status !== 200) throw new Error(data.message);
        setTask(data);
        if (data.dueDate) setCalenderDate(new Date(data.dueDate));
      } catch (error: any) { showBox("error", "Load Failed", error.message); }
    };
    fetchTask();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const taskid = localStorage.getItem("taskid");
    if (!calenderdate || !taskid) return;
    const dueDate = calenderdate.toLocaleDateString("en-CA");
    try {
      const res = await fetch(`/api/tasks/edittask/${taskid}`, { method: "PUT", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ ...task, dueDate }) });
      const resdata = await res.json();
      if (res.status !== 200) throw new Error(resdata.message);
      showBox("success", "Task Updated", "Task details saved successfully.");
    } catch (error: any) { showBox("error", "Update Failed", error.message); }
  };

  const isError = messageBox.type === "error";
  const inputClass = "w-full h-12 rounded-xl border border-indigo-500/[0.22] bg-white/[0.07] text-white px-[14px] outline-none text-[15px] box-border transition-all focus:border-indigo-400/[0.50]";

  if (!task) return (
    <div className="w-full min-h-full flex items-center justify-center p-10">
      <p className="text-white/50 text-[15px]">Loading task...</p>
    </div>
  );

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
            <TiPencil size={30} />
          </div>
        </div>
        <h2 className="m-0 text-white text-[32px] font-extrabold text-center tracking-[0.4px]">Edit Task</h2>
        <p className="mt-[10px] mb-7 text-white/55 text-center text-[15px] leading-[1.7]">Update your task details below.</p>
        <div className="w-[80px] h-[4px] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto mb-7" />

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
          <div className="flex flex-col gap-2">
            <label className="text-indigo-200 text-sm font-bold">Task Title</label>
            <input type="text" required minLength={2} maxLength={25} className={inputClass}
              value={task.title || ""}
              onChange={(e) => setTask((p: any) => ({ ...p, title: e.target.value }))} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-indigo-200 text-sm font-bold">Priority</label>
            <select className={`${inputClass} cursor-pointer`} value={task.priority || "low"}
              onChange={(e) => setTask((p: any) => ({ ...p, priority: e.target.value }))}>
              <option value="low">Low Priority</option>
              <option value="med">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-indigo-200 text-sm font-bold">Due Date</label>
            <DatePicker
              placeholderText="Select due date"
              selected={calenderdate}
              dateFormat="yyyy-MM-dd"
              onChange={(d: Date | null) => setCalenderDate(d)}
              className="custom-dark-datepicker"
            />
          </div>

          <div className="grid grid-cols-2 gap-[14px]">
            <div className="flex flex-col gap-2">
              <label className="text-indigo-200 text-sm font-bold">Start Hour</label>
              <input type="time" className={inputClass}
                value={task.starthour || ""}
                onChange={(e) => setTask((p: any) => ({ ...p, starthour: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-indigo-200 text-sm font-bold">End Hour</label>
              <input type="time" className={inputClass}
                value={task.endhour || ""}
                onChange={(e) => setTask((p: any) => ({ ...p, endhour: e.target.value }))} />
            </div>
          </div>

          <div className="flex flex-col gap-2 col-span-1 sm:col-span-2">
            <label className="text-indigo-200 text-sm font-bold">Description</label>
            <textarea required minLength={5} maxLength={200}
              className="w-full min-h-[120px] rounded-[16px] border border-indigo-500/[0.22] bg-white/[0.07] text-white p-[14px] outline-none text-[15px] resize-none box-border leading-[1.7] focus:border-indigo-400/[0.50] transition-all"
              value={task.description || ""}
              onChange={(e) => setTask((p: any) => ({ ...p, description: e.target.value }))} />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <button
              type="submit"
              className="w-full h-[54px] rounded-[16px] border-none bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[16px] font-extrabold cursor-pointer shadow-[0_14px_30px_rgba(99,102,241,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(99,102,241,0.38)]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
