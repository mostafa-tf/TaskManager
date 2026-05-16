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
        style={{ background: "rgba(5,10,8,0.95)", backdropFilter: "blur(10px)" }}>
        <button onClick={() => navigate(-1)}
          className="w-[56px] h-[56px] rounded-full absolute left-6 flex items-center justify-center text-[#dffff0] border border-[rgba(0,255,140,0.18)] bg-[rgba(255,255,255,0.06)] cursor-pointer text-[22px]">
          <FaArrowLeft />
        </button>
        <h1 className="text-[34px] font-extrabold m-0 tracking-[0.5px]">View Projects</h1>
      </nav>

      <main className="px-6 py-[45px]">
        {loading && <h2 className="text-center text-[#dffff0] mt-[60px]">Loading projects...</h2>}

        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
            <div className="w-[72px] h-[72px] rounded-2xl bg-[rgba(64,196,255,0.08)] border border-[rgba(64,196,255,0.18)] flex items-center justify-center mb-5">
              <FaProjectDiagram size={30} className="text-[#40c4ff]" />
            </div>
            <h2 className="m-0 mb-2 text-[24px] font-extrabold text-white">No projects yet</h2>
            <p className="m-0 mb-6 text-white/55 text-[15px] max-w-[320px] leading-[1.7]">Create your first project, invite friends as contributors, and start assigning tasks together.</p>
            <a href="/projects/addproject" className="h-11 px-6 rounded-[12px] no-underline text-[#08110c] font-extrabold text-sm flex items-center" style={{ background: "linear-gradient(135deg, #00c853, #00e676)" }}>+ Create a project</a>
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
                  className="min-h-[170px] no-underline text-white rounded-[22px] p-6 flex flex-col justify-between border border-[rgba(0,255,140,0.16)] shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition-all duration-200"
                  style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))" }}
                  onClick={() => {
                    localStorage.setItem("projectid", project._id);
                    localStorage.setItem("role", isOwner ? "owner" : "member");
                  }}
                >
                  <div className="flex justify-between items-start gap-[14px]">
                    <h2 className="m-0 text-[24px] font-extrabold">{project.name}</h2>
                    <span className={`px-3 py-[7px] rounded-full border bg-[rgba(255,255,255,0.06)] text-[13px] font-extrabold ${isOwner ? "text-[#39ff9f] border-[rgba(57,255,159,0.35)]" : "text-[#ffd36b] border-[rgba(255,211,107,0.35)]"}`}>
                      {isOwner ? "Owner" : "Member"}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-[#b8cfc4] text-[15px] leading-relaxed">{project.description}</p>
                  )}
                  <p className="m-0 text-[#39ff9f] font-extrabold">Open project →</p>
                </NavLink>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
