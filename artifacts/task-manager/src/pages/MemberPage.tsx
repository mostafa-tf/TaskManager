import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";

export const MemberPage = () => {
  const navigate = useNavigate();
  const { memberid } = useParams();
  const [tasks, setTasks] = useState<{ todo: any[]; inprogress: any[]; done: any[] }>({ todo: [], inprogress: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });

  const showBox = (type: string, title: string, message: string) => {
    setMessageBox({ show: true, type, title, message });
  };

  useEffect(() => {
    if (!messageBox.show) return;
    const timer = setTimeout(() => setMessageBox({ show: false, type: "", title: "", message: "" }), 3000);
    return () => clearTimeout(timer);
  }, [messageBox.show]);

  useEffect(() => {
    const projectid = localStorage.getItem("projectid");
    const token = localStorage.getItem("token");

    if (!memberid || memberid === "undefined" || !projectid || !token) {
      navigate("/login");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/projects/membertasks/${projectid}/${memberid}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch tasks");
        setTasks({ todo: data.todo || [], inprogress: data.inprogress || [], done: data.done || [] });
      } catch (err: any) {
        showBox("error", "Fetch Failed", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [memberid, navigate]);

  const columns = [
    { title: "Todo", data: tasks.todo },
    { title: "In Progress", data: tasks.inprogress },
    { title: "Done", data: tasks.done },
  ].filter((col) => col.data.length > 0);

  const isError = messageBox.type === "error";

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

      <nav className="h-[90px] relative flex items-center justify-center bg-[rgba(5,5,18,0.95)] border-b border-indigo-500/[0.16] shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-[10px] text-[32px] font-extrabold">
        <button onClick={() => navigate(-1)}
          className="w-[52px] h-[52px] rounded-full absolute left-6 flex items-center justify-center text-indigo-300 border border-indigo-500/[0.22] bg-white/[0.06] cursor-pointer hover:bg-indigo-500/[0.12] transition-all">
          <FaArrowLeft size={19} />
        </button>
        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Member Tasks</span>
      </nav>

      <main className="px-6 py-[35px] max-w-[1150px] mx-auto">
        {loading && <h2 className="text-center text-white/50 mt-[60px]">Loading...</h2>}

        {!loading && columns.length === 0 && (
          <h2 className="text-center text-white/50 mt-[60px]">No tasks found</h2>
        )}

        {!loading && columns.length > 0 && (
          <div className="grid gap-5 items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {columns.map((col) => (
              <div key={col.title} className="p-[18px] rounded-[20px] border border-indigo-500/[0.16] shadow-[0_18px_45px_rgba(0,0,0,0.35)] bg-white/[0.04]">
                <h2 className="m-0 mb-[15px] text-indigo-400 font-extrabold">{col.title}</h2>
                {col.data.map((task: any) => (
                  <div key={task._id} className="p-[14px] rounded-[16px] mb-3 border border-indigo-500/[0.12] bg-white/[0.04]">
                    <h3 className="m-0 mb-2 font-extrabold">{task.title}</h3>
                    <p className="m-[5px_0] text-white/55 text-sm">{task.description}</p>
                    <p className="m-[5px_0] text-white/55 text-sm">Status: {task.status}</p>
                    <p className="m-[5px_0] text-white/55 text-sm">Priority: {task.priority}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
