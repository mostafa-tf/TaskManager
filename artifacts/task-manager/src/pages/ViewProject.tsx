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
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    assignedto: "",
    projectid: "",
    taskType: "project",
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

  const inputClass = "w-full box-border px-[15px] py-[13px] rounded-[14px] border border-[rgba(0,255,140,0.18)] bg-[rgba(255,255,255,0.06)] text-white outline-none text-[15px]";

  return (
    <div className="min-h-screen text-white" style={{ background: "radial-gradient(circle at top, rgba(0,255,140,0.12), transparent 35%), #050a08" }}>
      {messageBox.show && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`w-[min(430px,90%)] p-[22px] rounded-[24px] flex items-center gap-[15px] text-white shadow-[0_24px_70px_rgba(0,0,0,0.55)] ${isError ? "border border-[rgba(255,77,79,0.45)]" : "border border-[rgba(0,255,140,0.35)]"}`}
            style={{ background: "linear-gradient(135deg, rgba(22,22,22,0.98), rgba(12,12,12,0.98))" }}>
            <div className={`min-w-[52px] h-[52px] rounded-[18px] flex items-center justify-center ${isError ? "bg-[rgba(255,77,79,0.14)] border border-[rgba(255,77,79,0.25)] text-[#ff6b6b]" : "bg-[rgba(0,255,140,0.12)] border border-[rgba(0,255,140,0.22)] text-[#60ff9c]"}`}>
              {isError ? <MdErrorOutline size={30} /> : <MdCheckCircleOutline size={30} />}
            </div>
            <div>
              <h3 className="m-0 mb-[5px] text-lg font-extrabold">{messageBox.title}</h3>
              <p className="m-0 text-sm leading-relaxed text-white/70">{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="h-[95px] relative flex items-center justify-center border-b border-[rgba(0,255,140,0.14)] shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
        style={{ background: "rgba(5,10,8,0.95)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
        <button onClick={() => navigate(-1)}
          className="w-[56px] h-[56px] rounded-full absolute left-6 flex items-center justify-center text-[#dffff0] border border-[rgba(0,255,140,0.18)] bg-[rgba(255,255,255,0.06)] cursor-pointer text-[22px] shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
          <FaArrowLeft />
        </button>
        <span className="text-[34px] font-extrabold tracking-[0.5px]">View Project</span>
      </nav>

      <main className="px-6 py-[35px] max-w-[1150px] mx-auto">
        {project.projectName && (
          <section className="rounded-[22px] p-[22px] mb-[26px] border border-[rgba(0,255,140,0.16)] shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
            style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))" }}>
            <h2 className="m-0 mb-2 text-[28px]">{project.projectName}</h2>
            <p className="m-0 mb-[14px] text-[#b8cfc4]">{project.projectDescription}</p>
            <span className="inline-block px-3 py-[7px] rounded-full text-[#39ff9f] border border-[rgba(57,255,159,0.35)] bg-[rgba(57,255,159,0.08)] font-extrabold text-[13px]">
              Members: {project.members?.length ?? 0}
            </span>
          </section>
        )}

        {localStorage.getItem("role") === "owner" && project.members && project.members.length === 0 && (
          <h2 className="text-center text-[#dffff0]">No Members Found</h2>
        )}

        {localStorage.getItem("role") === "owner" && project.members && project.members.length !== 0 && (
          <section className="mb-7">
            <h2 className="m-0 mb-[18px] text-[24px]">Project Members</h2>
            <div className="grid gap-[18px]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))" }}>
              {project.members.map((member: any) => (
                <div
                  key={member.userId}
                  className="rounded-[20px] p-[18px] border border-[rgba(0,255,140,0.16)] shadow-[0_18px_45px_rgba(0,0,0,0.35)] cursor-pointer"
                  style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))" }}
                  onClick={() => {
                    if (!member.userId) return;
                    localStorage.setItem("projectid", project.projectId);
                    navigate(`/projects/projectmember/${member.userId}`);
                  }}
                >
                  <div className="flex justify-between items-center gap-[10px]">
                    <h3 className="m-0 text-[21px]">{member.username}</h3>
                    <span className={`px-[10px] py-[6px] rounded-full border bg-[rgba(255,255,255,0.06)] font-extrabold text-[12px] ${member.isActive ? "text-[#39ff9f] border-[rgba(57,255,159,0.35)]" : "text-[#ffd36b] border-[rgba(255,211,107,0.35)]"}`}>
                      {member.isActive ? "Active" : "Offline"}
                    </span>
                  </div>
                  <div className="mt-[14px] text-[#dffff0] leading-[1.4]">
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
          <form onSubmit={handlesubmit} className="mt-[30px] p-6 rounded-[22px] border border-[rgba(0,255,140,0.16)] shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
            style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))" }}>
            <h2 className="m-0 mb-[18px] text-[24px]">Assign A Task</h2>

            <label className="block mb-2 mt-[14px] text-[#dffff0] font-extrabold">Task Title</label>
            <input className={inputClass} type="text" value={taskinfo.title}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, title: e.target.value }))}
              required minLength={2} maxLength={15} placeholder="Enter task title" />

            <label className="block mb-2 mt-[14px] text-[#dffff0] font-extrabold">Task Date</label>
            <input className={inputClass} type="date" value={taskinfo.dueDate}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, dueDate: e.target.value }))} required />

            <label className="block mb-2 mt-[14px] text-[#dffff0] font-extrabold">Task Priority</label>
            <select className={inputClass} value={taskinfo.priority}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, priority: e.target.value }))} required>
              <option value="">Select Priority</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <label className="block mb-2 mt-[14px] text-[#dffff0] font-extrabold">Description</label>
            <textarea className={`${inputClass} min-h-[110px] resize-y`} value={taskinfo.description}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Write task description..." />

            <label className="block mb-2 mt-[14px] text-[#dffff0] font-extrabold">Assign To</label>
            <select className={inputClass} value={taskinfo.assignedto}
              onChange={(e) => setTaskInfo((prev) => ({ ...prev, assignedto: e.target.value }))} required>
              <option value="">Select A Member</option>
              {project.members && project.members.map((member: any) => (
                <option key={member.userId} value={member.userId}>{member.username}</option>
              ))}
            </select>

            <button type="submit" className="mt-[22px] w-full py-[14px] rounded-[16px] border border-[rgba(57,255,159,0.35)] text-[#04100b] text-base font-black cursor-pointer"
              style={{ background: "linear-gradient(135deg, #20d982, #0b8f55)" }}>
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
                <div key={col.key} className="p-[18px] rounded-[20px] border border-[rgba(0,255,140,0.16)] shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
                  style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))" }}>
                  <h2 className="m-0 mb-[15px] text-[#39ff9f]">{col.title}</h2>
                  {list.map((task: any) => (
                    <div key={task._id} className="p-[14px] rounded-[16px] mb-3 border border-[rgba(0,255,140,0.12)]" style={{ background: "rgba(5,10,8,0.72)" }}>
                      <h3 className="m-0 mb-2">{task.title}</h3>
                      <p className="m-[6px_0] text-[#b8cfc4]">{task.description}</p>
                      <p className="m-[6px_0] text-[#b8cfc4]">Priority: {task.priority}</p>
                      <p className="m-[6px_0] text-[#b8cfc4]">Due Date: {task.dueDate?.slice(0, 10)}</p>
                      <div className="flex gap-2 flex-wrap mt-3">
                        {["todo", "inprogress", "done"].map((s) => (
                          <button key={s} onClick={() => updatetask(s, task._id)}
                            className="px-[10px] py-2 rounded-[12px] border border-[rgba(57,255,159,0.25)] bg-[rgba(57,255,159,0.08)] text-[#dffff0] cursor-pointer font-bold">
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
