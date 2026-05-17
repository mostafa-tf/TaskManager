import { useNavigate, NavLink } from "react-router-dom";
import { FaArrowLeft, FaProjectDiagram } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { useEffect, useState } from "react";

export const ViewProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [userid, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });
  const navigate = useNavigate();

  const showBox = (type: string, title: string, message: string) => {
    setMessageBox({ show: true, type, title, message });
  };

  useEffect(() => {
    if (!messageBox.show) return;
    const timer = setTimeout(() => setMessageBox({ show: false, type: "", title: "", message: "" }), 3000);
    return () => clearTimeout(timer);
  }, [messageBox.show]);

  const fetchallprojects = async () => {
    try {
      const res = await fetch("/api/projects", {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch projects");
      setProjects(data.projects || []);
      setUserId(data.userid || "");
    } catch (error: any) {
      showBox("error", "Fetch Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchallprojects(); }, []);

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

      <nav className="h-[90px] relative flex items-center justify-center bg-[rgba(5,5,18,0.95)] border-b border-indigo-500/[0.16] shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-[10px]">
        <button onClick={() => navigate(-1)}
          className="w-[52px] h-[52px] rounded-full absolute left-6 flex items-center justify-center text-indigo-300 border border-indigo-500/[0.22] bg-white/[0.06] cursor-pointer hover:bg-indigo-500/[0.12] transition-all">
          <FaArrowLeft size={19} />
        </button>
        <h1 className="text-[32px] font-extrabold m-0 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">View Projects</h1>
      </nav>

      <main className="px-6 py-[45px]">
        {loading && <h2 className="text-center text-white/50 mt-[60px]">Loading projects...</h2>}

        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
            <div className="w-[72px] h-[72px] rounded-2xl bg-indigo-500/[0.10] border border-indigo-500/[0.22] flex items-center justify-center mb-5">
              <FaProjectDiagram size={28} className="text-indigo-400" />
            </div>
            <h2 className="m-0 mb-2 text-[24px] font-extrabold text-white">No projects yet</h2>
            <p className="m-0 mb-6 text-white/50 text-[15px] max-w-[320px] leading-[1.7]">Create your first project, invite friends as contributors, and start assigning tasks together.</p>
            <a href="/projects/addproject" className="h-11 px-6 rounded-[12px] no-underline text-white font-extrabold text-sm flex items-center bg-gradient-to-r from-indigo-600 to-violet-600 shadow-[0_8px_20px_rgba(99,102,241,0.28)]">+ Create a project</a>
          </div>
        )}

        {!loading && projects.length !== 0 && (
          <div className="max-w-[1100px] mx-auto grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))" }}>
            {projects.map((project) => {
              const isOwner = project.owner?.toString() === userid;
              return (
                <NavLink
                  key={project._id}
                  to={`${project._id}`}
                  className="min-h-[160px] no-underline text-white rounded-[22px] p-6 flex flex-col justify-between border border-indigo-500/[0.16] shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition-all duration-200 hover:border-indigo-500/[0.28] hover:-translate-y-1 bg-white/[0.04]"
                  onClick={() => {
                    localStorage.setItem("projectid", project._id);
                    localStorage.setItem("role", isOwner ? "owner" : "member");
                  }}
                >
                  <div className="flex justify-between items-start gap-[14px]">
                    <h2 className="m-0 text-[22px] font-extrabold">{project.name}</h2>
                    <span className={`px-3 py-[6px] rounded-full border text-[12px] font-extrabold ${isOwner ? "text-indigo-300 border-indigo-500/[0.35] bg-indigo-500/[0.10]" : "text-amber-300 border-amber-500/[0.35] bg-amber-500/[0.08]"}`}>
                      {isOwner ? "Owner" : "Member"}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-white/55 text-[14px] leading-relaxed">{project.description}</p>
                  )}
                  <p className="m-0 text-indigo-400 font-extrabold text-sm">Open project →</p>
                </NavLink>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
