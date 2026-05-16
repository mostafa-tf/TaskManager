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

      <nav className="h-[95px] relative flex items-center justify-center border-b border-[rgba(0,255,140,0.14)] shadow-[0_10px_30px_rgba(0,0,0,0.35)] text-[34px] font-extrabold tracking-[0.5px]"
        style={{ background: "rgba(5,10,8,0.95)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
        <button onClick={() => navigate(-1)}
          className="w-[56px] h-[56px] rounded-full absolute left-6 flex items-center justify-center text-[#dffff0] border border-[rgba(0,255,140,0.18)] bg-[rgba(255,255,255,0.06)] cursor-pointer text-[22px] shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
          <FaArrowLeft />
        </button>
        Member Tasks
      </nav>

      <main className="px-6 py-[35px] max-w-[1150px] mx-auto">
        {loading && <h2 className="text-center text-[#dffff0] mt-[60px]">Loading...</h2>}

        {!loading && columns.length === 0 && (
          <h2 className="text-center text-[#dffff0] mt-[60px]">No tasks found</h2>
        )}

        {!loading && columns.length > 0 && (
          <div className="grid gap-5 items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {columns.map((col) => (
              <div key={col.title} className="p-[18px] rounded-[20px] border border-[rgba(0,255,140,0.16)] shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
                style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))" }}>
                <h2 className="m-0 mb-[15px] text-[#39ff9f]">{col.title}</h2>
                {col.data.map((task: any) => (
                  <div key={task._id} className="p-[14px] rounded-[16px] mb-3 border border-[rgba(0,255,140,0.12)]"
                    style={{ background: "rgba(5,10,8,0.72)" }}>
                    <h3 className="m-0 mb-2">{task.title}</h3>
                    <p className="m-[6px_0] text-[#b8cfc4]">{task.description}</p>
                    <p className="m-[6px_0] text-[#b8cfc4]">Status: {task.status}</p>
                    <p className="m-[6px_0] text-[#b8cfc4]">Priority: {task.priority}</p>
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
