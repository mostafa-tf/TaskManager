import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";

export const AddProject = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const [projectinfo, setProjectinfo] = useState({
    name: "",
    description: "",
    contributers: [] as string[],
  });
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

  const fetchfriends = async () => {
    try {
      const res = await fetch("/api/friendship/viewfriends", {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch friends");
      setFriends(data || []);
    } catch (error: any) {
      showBox("error", "Fetch Failed", error.message);
    }
  };

  useEffect(() => { fetchfriends(); }, []);

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(projectinfo),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create project");
      showBox("success", "Project Created", data.message || "Project created successfully");
      setTimeout(() => navigate(-1), 1200);
    } catch (error: any) {
      showBox("error", "Creation Failed", error.message);
    }
  };

  const addcontributer = (friendid: string) => {
    setProjectinfo((prev) => ({
      ...prev,
      contributers: prev.contributers.includes(friendid)
        ? prev.contributers.filter((id) => id !== friendid)
        : [...prev.contributers, friendid],
    }));
  };

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
        <h1 className="text-[32px] font-extrabold m-0 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Add Project</h1>
      </nav>

      <main className="px-6 py-[45px] flex justify-center">
        <form onSubmit={handlesubmit} className="w-full max-w-[760px] p-[30px] rounded-[24px] border border-indigo-500/[0.16] shadow-[0_18px_45px_rgba(0,0,0,0.35)] bg-white/[0.04]">
          <label className="block mb-2 mt-[18px] font-extrabold text-indigo-200">Project Name</label>
          <input type="text" required minLength={2} maxLength={40} placeholder="Enter project name" value={projectinfo.name}
            onChange={(e) => setProjectinfo((prev) => ({ ...prev, name: e.target.value }))}
            className={inputClass} />

          <label className="block mb-2 mt-[18px] font-extrabold text-indigo-200">Project Description</label>
          <textarea maxLength={200} placeholder="Enter project description" value={projectinfo.description}
            onChange={(e) => setProjectinfo((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full min-h-[120px] box-border px-[14px] py-[13px] rounded-xl border border-indigo-500/[0.22] bg-white/[0.07] text-white outline-none text-[15px] resize-y" />

          <div className="mt-7 flex items-center justify-between gap-3">
            <h2 className="m-0 text-[22px] font-extrabold">Add Contributors</h2>
            <span className="px-3 py-[6px] rounded-full text-indigo-300 border border-indigo-500/[0.30] bg-indigo-500/[0.10] font-extrabold text-[13px]">
              {projectinfo.contributers.length} selected
            </span>
          </div>

          {friends.length === 0 ? (
            <p className="text-white/45 mt-4">No Friends Found</p>
          ) : (
            <div className="mt-4 grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
              {friends.map((friend) => {
                const selected = projectinfo.contributers.includes(friend._id);
                return (
                  <label
                    key={friend._id}
                    className={`flex items-center gap-[10px] px-[14px] py-[13px] rounded-[14px] border cursor-pointer font-bold transition-all duration-150 ${selected ? "border-indigo-500/[0.40] bg-indigo-500/[0.12] text-indigo-200" : "border-white/[0.08] bg-white/[0.04] text-white/65 hover:bg-white/[0.07]"}`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => addcontributer(friend._id)}
                      className="accent-indigo-500 w-4 h-4"
                    />
                    <span>{friend.username}</span>
                  </label>
                );
              })}
            </div>
          )}

          <button type="submit"
            className="mt-7 w-full py-[15px] rounded-[16px] border-none text-white text-[17px] font-extrabold cursor-pointer bg-gradient-to-r from-indigo-600 to-violet-600 shadow-[0_12px_28px_rgba(99,102,241,0.28)] transition-all hover:-translate-y-0.5">
            Create Project
          </button>
        </form>
      </main>
    </div>
  );
};
