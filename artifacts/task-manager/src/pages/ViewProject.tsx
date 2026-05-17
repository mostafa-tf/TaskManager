import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";

export const ViewProject = () => {
  const [project, setProject] = useState<any>({});
  const [tasks, setTasks] = useState<any>({});
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });
  const navigate = useNavigate();
  const { projectid } = useParams();

  const showBox = (type: string, title: string, message: string) => {
    setMessageBox({ show: true, type, title, message });
  };

  useEffect(() => {
    if (!messageBox.show) return;
    const timer = setTimeout(() => setMessageBox({ show: false, type: "", title: "", message: "" }), 3000);
    return () => clearTimeout(timer);
  }, [messageBox.show]);

  const updatetask = async (status: string, taskid: string) => {
    try {
      const res = await fetch(`/api/projects/updatetask/${taskid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      showBox("success", "Task Updated", "Task updated successfully");
      fetchcontributertasks();
    } catch (error: any) {
      showBox("error", "Update Failed", error.message);
    }
  };

  const statusColumns = [
    { key: "todo", title: "Todo" },
    { key: "inprogress", title: "In Progress" },
    { key: "done", title: "Done" },
  ];

  const [taskinfo, setTaskInfo] = useState({
    title: "", description: "", priority: "", dueDate: "",
    assignedto: "", projectid: "", taskType: "project",
  });

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects/assigntask", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(taskinfo),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showBox("success", "Task Assigned", "Task assigned successfully");
      await fetchmembers();
    } catch (error: any) {
      showBox("error", "Assign Failed", error.message);
    }
  };

  const fetchcontributertasks = async () => {
    try {
      const res = await fetch(`/api/projects/contributertasks/${projectid}`, {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTasks(data);
    } catch (error: any) {
      showBox("error", "Fetch Failed", error.message);
    }
  };

  const fetchmembers = async () => {
    try {
      const res = await fetch(`/api/projects/projectinfo/${projectid}`, {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      data.members.shift();
      setProject(data);
      setTaskInfo((prev) => ({ ...prev, projectid: data.projectId }));
    } catch (error: any) {
      showBox("error", "Fetch Failed", error.message);
    }
  };

  useEffect(() => {
    fetchmembers();
    if (localStorage.getItem("role") === "member") {
      fetchcontributertasks();
    }
  }, []);

  const isError = messageBox.type === "error";
  const inputClass = "w-full box-border px-[14px] py-[13px] rounded-xl border border-indigo-500/[0.22] bg-white/[0.07] text-white outline-none text-[15px]";

  return (
    <div className="min-h-screen bg-[#06070f] text-white">
      {messageBox.show && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`w-[min(430px,90%)] p-[22px] rounded-3xl bg-[linear-gradient(135deg,rgba(12,10,30,0.98),rgba(6,7,15,0.98))] flex items-center gap-[15px] text-white shadow-[0_24px_70px_rgba(0,0,0,0.55)] border ${isError ? "border-red-500/[0.40]" : "border-emerald-500/[0.40]"}`}>
            <div className={`min-w-[52px] h-[52px] rounded-[18px] flex items-center justify-center border ${isError ? "bg-red-500/[0.14] border-red-500/[0.25] text-red-400" : "bg-emerald-500/[0.14] border-emerald-500/[0.25] text-emerald-400"}`}>
              {isError ? <MdErrorOutline size={30} /> : <MdCheckCircleOutline size={30} />}
            </div>
            <div>
              <h3 className="m-0 mb-[5px] text-lg font-extrabold">{messageBox.title}</h3>
              <p className="m-0 text-sm text-white/65">{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="h-[90px] relative flex items-center justify-center bg-[rgba(5,5,18,0.95)] border-b border-indigo-500/[0.16] shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-[10px]">
        <button onClick={() => navigate(-1)}
          className="w-[52px] h-[52px] rounded-full absolute left-6 flex items-center justify-center text-indigo-300 border border-indigo-500/[0.22] bg-white/[0.06] cursor-pointer hover:bg-indigo-500/[0.12] transition-all">
          <FaArrowLeft size={19} />
        </button>
        <span className="text-[32px] font-extrabold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">View Project</span>
      </nav>

      <main className="px-6 py-[35px] max-w-[1150px] mx-auto">
        {project.projectName && (
          <section className="rounded-[22px] p-[22px] mb-[26px] border border-indigo-500/[0.16] shadow-[0_18px_45px_rgba(0,0,0,0.35)] bg-white/[0.04]">
            <h2 className="m-0 mb-2 text-[26px] font-extrabold">{project.projectName}</h2>
            <p className="m-0 mb-[14px] text-white/55 text-[15px]">{project.projectDescription}</p>
            <span className="inline-block px-3 py-[6px] rounded-full text-indigo-300 border border-indigo-500/[0.30] bg-indigo-500/[0.10] font-extrabold text-[13px]">
              Members: {project.members?.length ?? 0}
            </span>
          </section>
        )}

        {localStorage.getItem("role") === "owner" && project.members && project.members.length === 0 && (
          <h2 className="text-center text-white/50">No Members Found</h2>
        )}

        {localStorage.getItem("role") === "owner" && project.members && project.members.length !== 0 && (
          <section className="mb-7">
            <h2 className="m-0 mb-[18px] text-[22px] font-extrabold">Project Members</h2>
            <div className="grid gap-[18px]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))" }}>
              {project.members.map((member: any) => (
                <div key={member.userId}
                  className="rounded-[20px] p-[18px] border border-indigo-500/[0.16] shadow-[0_18px_45px_rgba(0,0,0,0.35)] cursor-pointer bg-white/[0.04] transition-all hover:bg-indigo-500/[0.06] hover:-translate-y-0.5"
                  onClick={() => {
                    if (!member.userId) return;
                    localStorage.setItem("projectid", project.projectId);
                    navigate(`/projects/projectmember/${member.userId}`);
                  }}
                >
                  <div className="flex justify-between items-center gap-[10px]">
                    <h3 className="m-0 text-[20px] font-extrabold">{member.username}</h3>
                    <span className={`px-[10px] py-[5px] rounded-full border font-extrabold text-[12px] ${member.isActive ? "text-emerald-300 border-emerald-500/[0.30] bg-emerald-500/[0.10]" : "text-amber-300 border-amber-500/[0.28] bg-amber-500/[0.08]"}`}>
                      {member.isActive ? "Active" : "Offline"}
                    </span>
                  </div>
                  <div className="mt-[14px] text-white/65 leading-[1.7] text-sm">
                    <p className="m-0">Total: {member.totalTasks}</p>
                    <p className="m-0">Todo: {member.todo}</p>
                    <p className="m-0">Progress: {member.inprogress}</p>
                    <p className="m-0">Done: {member.done}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {localStorage.getItem("role") === "owner" && (
          <form onSubmit={handlesubmit} className="mt-[30px] p-6 rounded-[22px] border border-indigo-500/[0.16] shadow-[0_18px_45px_rgba(0,0,0,0.35)] bg-white/[0.04]">
            <h2 className="m-0 mb-[18px] text-[22px] font-extrabold">Assign A Task</h2>

            <label className="block mb-2 mt-[14px] text-indigo-200 font-extrabold">Task Title</label>
            <input className={inputClass} type="text" value={taskinfo.title}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, title: e.target.value }))}
              required minLength={2} maxLength={15} placeholder="Enter task title" />

            <label className="block mb-2 mt-[14px] text-indigo-200 font-extrabold">Task Date</label>
            <input className={inputClass} type="date" value={taskinfo.dueDate}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, dueDate: e.target.value }))} required />

            <label className="block mb-2 mt-[14px] text-indigo-200 font-extrabold">Task Priority</label>
            <select className={`${inputClass} cursor-pointer`} value={taskinfo.priority}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, priority: e.target.value }))} required>
              <option value="">Select Priority</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <label className="block mb-2 mt-[14px] text-indigo-200 font-extrabold">Description</label>
            <textarea className={`${inputClass} min-h-[110px] resize-y`} value={taskinfo.description}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Write task description..." />

            <label className="block mb-2 mt-[14px] text-indigo-200 font-extrabold">Assign To</label>
            <select className={`${inputClass} cursor-pointer`} value={taskinfo.assignedto}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, assignedto: e.target.value }))} required>
              <option value="">Select A Member</option>
              {project.members && project.members.map((member: any) => (
                <option key={member.userId} value={member.userId}>{member.username}</option>
              ))}
            </select>

            <button type="submit"
              className="mt-[22px] w-full py-[14px] rounded-[16px] border-none text-white text-base font-extrabold cursor-pointer bg-gradient-to-r from-indigo-600 to-violet-600 shadow-[0_12px_28px_rgba(99,102,241,0.28)] transition-all hover:-translate-y-0.5">
              Assign Task
            </button>
          </form>
        )}

        {localStorage.getItem("role") === "member" && (
          <div className="grid gap-5 items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {statusColumns.map((col) => {
              const list = tasks[col.key] || [];
              if (list.length === 0) return null;
              return (
                <div key={col.key} className="p-[18px] rounded-[20px] border border-indigo-500/[0.16] shadow-[0_18px_45px_rgba(0,0,0,0.35)] bg-white/[0.04]">
                  <h2 className="m-0 mb-[15px] text-indigo-400 font-extrabold">{col.title}</h2>
                  {list.map((task: any) => (
                    <div key={task._id} className="p-[14px] rounded-[16px] mb-3 border border-indigo-500/[0.12] bg-white/[0.04]">
                      <h3 className="m-0 mb-2 font-extrabold">{task.title}</h3>
                      <p className="m-[5px_0] text-white/55 text-sm">{task.description}</p>
                      <p className="m-[5px_0] text-white/55 text-sm">Priority: {task.priority}</p>
                      <p className="m-[5px_0] text-white/55 text-sm">Due Date: {task.dueDate?.slice(0, 10)}</p>
                      <div className="flex gap-2 flex-wrap mt-3">
                        {["todo", "inprogress", "done"].map((s) => (
                          <button key={s} onClick={() => updatetask(s, task._id)}
                            className="px-[10px] py-2 rounded-[11px] border border-indigo-500/[0.25] bg-indigo-500/[0.08] text-indigo-200 cursor-pointer font-bold text-xs hover:bg-indigo-500/[0.16] transition-all">
                            {s === "inprogress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
