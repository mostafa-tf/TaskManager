import { useState, useEffect } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { MdCheckCircleOutline, MdErrorOutline } from "react-icons/md";

export const Profile = () => {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [updated, setUpdated] = useState<{ username: string; email: string }>({ username: "", email: "" });
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });

  const showBox = (type: string, title: string, message: string) => {
    setMessageBox({ show: true, type, title, message });
    setTimeout(() => setMessageBox({ show: false, type: "", title: "", message: "" }), 3000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
        const data = await res.json();
        if (res.status !== 200) throw new Error(data.message);
        const profile = { username: data.username, email: data.email };
        setUser(profile); setUpdated(profile);
      } catch (error: any) { showBox("error", "Error", error.message); }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await fetch("/api/users/profile", { method: "PUT", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ username: updated.username, email: updated.email }) });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      const profile = { username: data.username, email: data.email };
      setUser(profile); setEditing(false); showBox("success", "Profile Updated", "Your profile has been saved successfully.");
    } catch (error: any) { showBox("error", "Update Failed", error.message); }
  };

  const isError = messageBox.type === "error";

  if (!user) return (
    <div className="w-full min-h-full flex items-center justify-center p-10">
      <p className="text-white/50 text-[15px]">Loading profile...</p>
    </div>
  );

  return (
    <div className="w-full min-h-full flex justify-center items-center p-[40px_20px] box-border">
      {messageBox.show && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`w-[min(430px,90%)] p-[22px] rounded-3xl bg-[linear-gradient(135deg,rgba(12,10,30,0.98),rgba(6,7,15,0.98))] shadow-[0_24px_70px_rgba(0,0,0,0.6)] flex items-center gap-[15px] text-white border ${isError ? "border-red-500/[0.40]" : "border-emerald-500/[0.40]"}`}>
            <div className={`min-w-[52px] h-[52px] rounded-[18px] flex items-center justify-center border ${isError ? "bg-red-500/[0.14] border-red-500/[0.25] text-red-400" : "bg-emerald-500/[0.14] border-emerald-500/[0.25] text-emerald-400"}`}>
              {isError ? <MdErrorOutline size={28} /> : <MdCheckCircleOutline size={28} />}
            </div>
            <div>
              <h3 className="m-0 mb-[4px] text-[17px] font-extrabold">{messageBox.title}</h3>
              <p className="m-0 text-[13px] text-white/65">{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[480px] p-[36px_32px] rounded-[28px] bg-white/[0.04] border border-indigo-500/[0.18] shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-[16px] box-border">
        <div className="w-[76px] h-[76px] rounded-full bg-indigo-500/[0.12] border-2 border-indigo-500/[0.28] flex items-center justify-center mx-auto mb-4 text-indigo-300">
          <IoPersonSharp size={34} />
        </div>
        <h2 className="m-0 text-white text-[26px] font-extrabold text-center">{user.username}</h2>
        <p className="mt-2 mb-7 text-white/50 text-[14px] text-center">{user.email}</p>

        <div className="w-[60px] h-[3px] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto mb-7" />

        <div className="flex flex-col gap-2 mb-[18px]">
          <label className="text-indigo-200 text-[13px] font-bold tracking-[0.3px]">Username</label>
          <input
            type="text"
            disabled={!editing}
            value={updated.username}
            onChange={(e) => setUpdated((p) => ({ ...p, username: e.target.value }))}
            className={`w-full h-12 rounded-xl border px-[14px] outline-none text-[15px] box-border transition-all ${editing ? "border-indigo-500/[0.28] bg-white/[0.08] text-white cursor-text" : "border-indigo-500/[0.12] bg-white/[0.04] text-white/50 cursor-not-allowed"}`}
          />
        </div>

        <div className="flex flex-col gap-2 mb-[18px]">
          <label className="text-indigo-200 text-[13px] font-bold tracking-[0.3px]">Email</label>
          <input
            type="email"
            disabled={!editing}
            value={updated.email}
            onChange={(e) => setUpdated((p) => ({ ...p, email: e.target.value }))}
            className={`w-full h-12 rounded-xl border px-[14px] outline-none text-[15px] box-border transition-all ${editing ? "border-indigo-500/[0.28] bg-white/[0.08] text-white cursor-text" : "border-indigo-500/[0.12] bg-white/[0.04] text-white/50 cursor-not-allowed"}`}
          />
        </div>

        <div className="mt-2">
          {!editing
            ? <button className="w-full h-12 rounded-[14px] border-none bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[15px] font-extrabold cursor-pointer shadow-[0_10px_24px_rgba(99,102,241,0.28)] transition-all hover:-translate-y-0.5" onClick={() => setEditing(true)}>Edit Profile</button>
            : <div className="flex gap-3">
              <button className="flex-1 h-12 rounded-[14px] border border-white/[0.12] bg-transparent text-white/65 text-[15px] font-bold cursor-pointer hover:bg-white/[0.06] transition-all" onClick={() => { setEditing(false); setUpdated(user!); }}>Cancel</button>
              <button className="flex-1 h-12 rounded-[14px] border-none bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[15px] font-extrabold cursor-pointer shadow-[0_10px_24px_rgba(99,102,241,0.28)] transition-all hover:-translate-y-0.5" onClick={handleUpdate}>Save Changes</button>
            </div>
          }
        </div>
      </div>
    </div>
  );
};
