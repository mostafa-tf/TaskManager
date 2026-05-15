import { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const AddTasks = () => {
  const [data, setData] = useState({ title: "", description: "", priority: "low", dueDate: "", starthour: "", endhour: "" });
  const [calenderdate, setCalenderDate] = useState<Date | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calenderdate) { showMsg("Please select a due date", true); return; }
    const dueDate = calenderdate.toLocaleDateString("en-CA");
    try {
      const res = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ ...data, dueDate }) });
      const resdata = await res.json();
      if (res.status !== 201) throw new Error(resdata.message);
      showMsg("Task added successfully!", false);
      setData({ title: "", description: "", priority: "low", dueDate: "", starthour: "", endhour: "" });
      setCalenderDate(null);
    } catch (error: any) { showMsg(error.message, true); }
  };

  const inputClass = "w-full h-12 rounded-[14px] border border-[rgba(0,255,128,0.20)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] outline-none text-[15px] box-border";

  return (
    <div className="w-full min-h-full box-border">
      {message && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`px-7 py-[22px] rounded-[20px] bg-[rgba(15,15,15,0.98)] border font-bold text-base ${isError ? "border-[rgba(255,77,79,0.45)] text-[#ff9c9c]" : "border-[rgba(0,255,140,0.30)] text-[#60ff9c]"}`}>
            {message}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-7">
        <div className="w-[52px] h-[52px] rounded-2xl bg-[rgba(0,255,140,0.10)] border border-[rgba(0,255,140,0.18)] flex items-center justify-center text-[#dffff0]"><IoIosAddCircle size={28} /></div>
        <div>
          <h2 className="m-0 text-[28px] font-extrabold text-white">Add New Task</h2>
          <p className="m-0 text-white/65 text-sm">Create a task and stay on top of your goals.</p>
        </div>
      </div>

      <div className="max-w-[600px] p-8 rounded-3xl bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.12)] shadow-[0_18px_50px_rgba(0,0,0,0.30)]">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-5">
            <label className="block text-[#caffdf] mb-2 text-sm font-bold">Title</label>
            <input type="text" required minLength={2} maxLength={25} className={inputClass} value={data.title} onChange={(e) => setData(p => ({ ...p, title: e.target.value }))} placeholder="Task title" />
          </div>
          <div className="flex flex-col mb-5">
            <label className="block text-[#caffdf] mb-2 text-sm font-bold">Description</label>
            <textarea required minLength={5} maxLength={200} className="w-full h-20 rounded-[14px] border border-[rgba(0,255,128,0.20)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] py-[10px] outline-none text-[15px] box-border resize-y" value={data.description} onChange={(e) => setData(p => ({ ...p, description: e.target.value }))} placeholder="Task description" />
          </div>
          <div className="flex flex-col mb-5">
            <label className="block text-[#caffdf] mb-2 text-sm font-bold">Priority</label>
            <select className={inputClass} value={data.priority} onChange={(e) => setData(p => ({ ...p, priority: e.target.value }))}>
              <option value="low">Low</option>
              <option value="med">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex flex-col mb-5">
            <label className="block text-[#caffdf] mb-2 text-sm font-bold">Due Date</label>
            <DatePicker placeholderText="Select due date" selected={calenderdate} dateFormat="yyyy-MM-dd" onChange={(d: Date | null) => setCalenderDate(d)} className="custom-dark-datepicker" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col mb-5">
              <label className="block text-[#caffdf] mb-2 text-sm font-bold">Start Hour</label>
              <input type="time" className={inputClass} value={data.starthour} onChange={(e) => setData(p => ({ ...p, starthour: e.target.value }))} required />
            </div>
            <div className="flex flex-col mb-5">
              <label className="block text-[#caffdf] mb-2 text-sm font-bold">End Hour</label>
              <input type="time" className={inputClass} value={data.endhour} onChange={(e) => setData(p => ({ ...p, endhour: e.target.value }))} required />
            </div>
          </div>
          <button type="submit" className="w-full h-[50px] rounded-[14px] border-none bg-[linear-gradient(135deg,#00c853,#00e676)] text-[#08110c] text-base font-extrabold cursor-pointer mt-2.5 flex items-center justify-center gap-2">
            <IoIosAddCircle size={20} />Add Task
          </button>
        </form>
      </div>
    </div>
  );
};
