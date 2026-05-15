import { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export const ViewProject = () => {
  const { projectid } = useParams();
  const [project, setProject] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const navigate = useNavigate();

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectid}`, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      setProject(data);
    } catch (error: any) { showMsg(error.message, true); }
  };

  useEffect(() => { fetchProject(); }, [projectid]);

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/projects/${projectid}/members`, { method: "POST", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ email: addEmail }) });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("Member added!", false); setAddEmail(""); await fetchProject();
    } catch (error: any) { showMsg(error.message, true); }
  };

  const removeMember = async (memberid: string) => {
    try {
      const res = await fetch(`/api/projects/${projectid}/members/${memberid}`, { method: "DELETE", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("Member removed!", false); await fetchProject();
    } catch (error: any) { showMsg(error.message, true); }
  };

  if (!project) return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#07110d_0%,#0b1d15_50%,#08110c_100%)] p-[30px] text-white">Loading...</div>
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#07110d_0%,#0b1d15_50%,#08110c_100%)] p-[30px]">
      {message && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`px-7 py-[22px] rounded-[20px] bg-[rgba(15,15,15,0.98)] border font-bold text-base ${isError ? "border-[rgba(255,77,79,0.45)] text-[#ff9c9c]" : "border-[rgba(0,255,140,0.30)] text-[#60ff9c]"}`}>{message}</div>
        </div>
      )}

      <div className="flex items-center gap-[14px] mb-6">
        <button onClick={() => navigate("/projects/viewprojects")} className="w-[46px] h-[46px] rounded-[14px] border border-[rgba(0,255,140,0.2)] bg-[rgba(0,255,140,0.08)] text-[#dffff0] cursor-pointer flex items-center justify-center">
          <FaArrowLeft size={18} />
        </button>
        <div>
          <h2 className="m-0 text-[28px] font-extrabold text-white">{project.title}</h2>
          <p className="m-0 text-white/65 text-sm">{project.description}</p>
        </div>
      </div>

      <div className="max-w-[600px]">
        <h3 className="text-[#dffff0] font-extrabold mb-4">Members</h3>
        <form onSubmit={addMember} className="flex gap-2.5 mb-[18px]">
          <input
            type="email"
            value={addEmail}
            onChange={(e) => setAddEmail(e.target.value)}
            className="h-11 rounded-[12px] border border-[rgba(0,255,128,0.20)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] outline-none text-[15px] flex-1"
            placeholder="Add member by email"
          />
          <button type="submit" className="h-11 px-[18px] rounded-[12px] border-none bg-[linear-gradient(135deg,#00c853,#00e676)] text-[#08110c] font-extrabold cursor-pointer">Add</button>
        </form>
        {(project.members || []).map((m: any) => (
          <div key={m._id} className="flex justify-between items-center gap-[14px] px-[18px] py-[14px] rounded-[14px] bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.08)] mb-2.5">
            <div>
              <p className="m-0 text-white font-bold">{m.username}</p>
              <p className="m-0 text-white/55 text-[13px]">{m.email}</p>
            </div>
            <div className="flex gap-2">
              <NavLink to={`/projects/projectmember/${m._id}`} className="h-9 px-3 rounded-[10px] bg-[linear-gradient(135deg,#1565c0,#1e88e5)] text-white text-[13px] font-bold no-underline flex items-center">View Tasks</NavLink>
              <button onClick={() => removeMember(m._id)} className="w-9 h-9 rounded-[10px] border-none bg-[linear-gradient(135deg,#c62828,#e53935)] text-white cursor-pointer flex items-center justify-center">
                <MdDelete size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
