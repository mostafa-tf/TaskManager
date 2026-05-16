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
        <h1 className="text-[34px] font-extrabold m-0">Add Project</h1>
      </nav>

      <main className="px-6 py-[45px] flex justify-center">
        <form onSubmit={handlesubmit}
          className="w-full max-w-[760px] p-[30px] rounded-[24px] border border-[rgba(0,255,140,0.16)] shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
          style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))" }}>

          <label className="block mb-2 mt-[18px] font-extrabold text-[#dffff0]">Project Name</label>
          <input
            type="text"
            required
            minLength={2}
            maxLength={40}
            placeholder="Enter project name"
            value={projectinfo.name}
            onChange={(e) => setProjectinfo((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-[14px] rounded-[14px] border border-[rgba(0,255,140,0.18)] bg-[rgba(255,255,255,0.06)] text-white outline-none text-base box-border"
          />

          <label className="block mb-2 mt-[18px] font-extrabold text-[#dffff0]">Project Description</label>
          <textarea
            maxLength={200}
            placeholder="Enter project description"
            value={projectinfo.description}
            onChange={(e) => setProjectinfo((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full min-h-[120px] px-4 py-[14px] rounded-[14px] border border-[rgba(0,255,140,0.18)] bg-[rgba(255,255,255,0.06)] text-white outline-none text-base resize-y box-border"
          />

          <div className="mt-7 flex items-center justify-between gap-3">
            <h2 className="m-0 text-[22px]">Add Contributors</h2>
            <span className="px-3 py-[7px] rounded-full text-[#39ff9f] border border-[rgba(57,255,159,0.35)] bg-[rgba(57,255,159,0.08)] font-extrabold text-[13px]">
              {projectinfo.contributers.length} selected
            </span>
          </div>

          {friends.length === 0 ? (
            <p className="text-[#b8cfc4] mt-4">No Friends Found</p>
          ) : (
            <div className="mt-4 grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
              {friends.map((friend) => {
                const selected = projectinfo.contributers.includes(friend._id);
                return (
                  <label
                    key={friend._id}
                    className="flex items-center gap-[10px] px-[14px] py-[13px] rounded-[16px] border cursor-pointer font-bold transition-all duration-150"
                    style={{
                      borderColor: selected ? "rgba(57,255,159,0.45)" : "rgba(0,255,140,0.14)",
                      background: selected ? "rgba(57,255,159,0.12)" : "rgba(255,255,255,0.04)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => addcontributer(friend._id)}
                      className="accent-[#39ff9f] w-4 h-4"
                    />
                    <span>{friend.username}</span>
                  </label>
                );
              })}
            </div>
          )}

          <button
            type="submit"
            className="mt-7 w-full py-[15px] rounded-[16px] border border-[rgba(57,255,159,0.35)] text-[#04100b] text-[17px] font-black cursor-pointer"
            style={{ background: "linear-gradient(135deg, #20d982, #0b8f55)" }}
          >
            Create Project
          </button>
        </form>
      </main>
    </div>
  );
};
