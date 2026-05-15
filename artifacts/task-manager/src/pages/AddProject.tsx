import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export const AddProject = () => {
  const [data, setData] = useState({ title: "", description: "", memberEmail: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify(data) });
      const resdata = await res.json();
      if (res.status !== 201) throw new Error(resdata.message);
      showMsg("Project created!", false);
      setData({ title: "", description: "", memberEmail: "" });
    } catch (error: any) { showMsg(error.message, true); }
  };

  const inputClass = "w-full h-12 rounded-[14px] border border-[rgba(0,255,128,0.20)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] outline-none text-[15px] box-border";

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
        <h2 className="m-0 text-[28px] font-extrabold text-white">Create Project</h2>
      </div>

      <div className="max-w-[500px] p-8 rounded-3xl bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.12)]">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-[#caffdf] mb-2 text-sm font-bold">Project Title</label>
            <input type="text" required minLength={2} maxLength={50} className={inputClass} value={data.title} onChange={(e) => setData(p => ({ ...p, title: e.target.value }))} placeholder="Project title" />
          </div>
          <div className="mb-5">
            <label className="block text-[#caffdf] mb-2 text-sm font-bold">Description</label>
            <textarea required className="w-full h-20 rounded-[14px] border border-[rgba(0,255,128,0.20)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] py-[10px] outline-none text-[15px] box-border resize-y" value={data.description} onChange={(e) => setData(p => ({ ...p, description: e.target.value }))} placeholder="Describe the project" />
          </div>
          <div className="mb-5">
            <label className="block text-[#caffdf] mb-2 text-sm font-bold">Member Email</label>
            <input type="email" className={inputClass} value={data.memberEmail} onChange={(e) => setData(p => ({ ...p, memberEmail: e.target.value }))} placeholder="Add a member by email (optional)" />
          </div>
          <button type="submit" className="w-full h-[50px] rounded-[14px] border-none bg-[linear-gradient(135deg,#00c853,#00e676)] text-[#08110c] text-base font-extrabold cursor-pointer">
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};
