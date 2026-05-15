import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaProjectDiagram, FaArrowLeft } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export const ViewProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [noProjects, setNoProjects] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const fetchProjects = async () => {
    setNoProjects(false); setProjects([]);
    try {
      const res = await fetch("/api/projects", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status === 404) setNoProjects(true);
      else if (res.status === 200) setProjects(data);
      else throw new Error(data.message);
    } catch (error: any) { showMsg(error.message, true); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const deleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("Project deleted!", false); await fetchProjects();
    } catch (error: any) { showMsg(error.message, true); }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#07110d_0%,#0b1d15_50%,#08110c_100%)] p-[30px]">
      {message && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`px-7 py-[22px] rounded-[20px] bg-[rgba(15,15,15,0.98)] border font-bold text-base ${isError ? "border-[rgba(255,77,79,0.45)] text-[#ff9c9c]" : "border-[rgba(0,255,140,0.30)] text-[#60ff9c]"}`}>{message}</div>
        </div>
      )}

      <div className="flex items-center gap-[14px] mb-7">
        <button onClick={() => navigate("/projects")} className="w-[46px] h-[46px] rounded-[14px] border border-[rgba(0,255,140,0.2)] bg-[rgba(0,255,140,0.08)] text-[#dffff0] cursor-pointer flex items-center justify-center">
          <FaArrowLeft size={18} />
        </button>
        <div className="w-[52px] h-[52px] rounded-2xl bg-[rgba(0,255,140,0.10)] flex items-center justify-center text-[#dffff0]"><FaProjectDiagram size={24} /></div>
        <h2 className="m-0 text-[28px] font-extrabold text-white">My Projects</h2>
      </div>

      {noProjects && <h2 className="text-[#60ff9c] font-extrabold">No Projects Found</h2>}

      {projects.map((p) => (
        <div key={p._id} className="px-6 py-5 rounded-[18px] bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.10)] mb-3 flex justify-between items-center gap-[14px]">
          <div>
            <h3 className="m-0 mb-1 text-white text-lg font-extrabold">{p.title}</h3>
            <p className="m-0 text-white/60 text-[13px]">{p.description}</p>
          </div>
          <div className="flex gap-2">
            <NavLink to={`${p._id}`} className="h-9 px-[14px] rounded-[10px] bg-[linear-gradient(135deg,#1565c0,#1e88e5)] text-white text-[13px] font-bold no-underline flex items-center">View</NavLink>
            <button onClick={() => deleteProject(p._id)} className="h-9 w-10 rounded-[10px] border-none bg-[linear-gradient(135deg,#c62828,#e53935)] text-white cursor-pointer flex items-center justify-center">
              <MdDelete size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
