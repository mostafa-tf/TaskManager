import { useState, useEffect } from "react";
import { IoPersonSharp } from "react-icons/io5";

export const Profile = () => {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [updated, setUpdated] = useState<{ username: string; email: string }>({ username: "", email: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
        const data = await res.json();
        if (res.status !== 200) throw new Error(data.message);
        const profile = { username: data.username, email: data.email };
        setUser(profile); setUpdated(profile);
      } catch (error: any) { showMsg(error.message, true); }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const payload = { username: updated.username, email: updated.email };
      const res = await fetch("/api/users/profile", { method: "PUT", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      const profile = { username: data.username, email: data.email };
      setUser(profile); setEditing(false); showMsg("Profile updated!", false);
    } catch (error: any) { showMsg(error.message, true); }
  };

  const inputClass = "w-full h-[46px] rounded-[12px] border border-[rgba(0,255,128,0.20)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] outline-none text-[15px] box-border disabled:opacity-60";

  if (!user) return <p className="text-white">Loading profile...</p>;

  return (
    <div className="w-full min-h-full box-border">
      {message && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`px-7 py-[22px] rounded-[20px] bg-[rgba(15,15,15,0.98)] border font-bold text-base ${isError ? "border-[rgba(255,77,79,0.45)] text-[#ff9c9c]" : "border-[rgba(0,255,140,0.30)] text-[#60ff9c]"}`}>{message}</div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-7">
        <div className="w-[52px] h-[52px] rounded-2xl bg-[rgba(0,255,140,0.10)] border border-[rgba(0,255,140,0.18)] flex items-center justify-center text-[#dffff0]"><IoPersonSharp size={26} /></div>
        <div>
          <h2 className="m-0 text-[28px] font-extrabold text-white">Profile</h2>
          <p className="m-0 text-white/65 text-sm">Manage your account information.</p>
        </div>
      </div>

      <div className="max-w-[500px] p-8 rounded-3xl bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.12)]">
        <div className="mb-4">
          <label className="block text-[#caffdf] mb-1.5 text-[13px] font-bold">Username</label>
          <input type="text" className={inputClass} disabled={!editing} value={updated.username} onChange={(e) => setUpdated((p) => ({ ...p, username: e.target.value }))} />
        </div>
        <div className="mb-4">
          <label className="block text-[#caffdf] mb-1.5 text-[13px] font-bold">Email</label>
          <input type="email" className={inputClass} disabled={!editing} value={updated.email} onChange={(e) => setUpdated((p) => ({ ...p, email: e.target.value }))} />
        </div>
        <div className="flex gap-3 mt-2">
          {!editing
            ? <button className="h-[46px] px-6 rounded-[12px] border-none bg-[linear-gradient(135deg,#1565c0,#1e88e5)] text-white text-[15px] font-bold cursor-pointer" onClick={() => setEditing(true)}>Edit Profile</button>
            : <>
              <button className="h-[46px] px-6 rounded-[12px] border-none bg-[linear-gradient(135deg,#00c853,#00e676)] text-white text-[15px] font-bold cursor-pointer" onClick={handleUpdate}>Save Changes</button>
              <button className="h-[46px] px-6 rounded-[12px] border-none bg-[rgba(255,255,255,0.12)] text-white text-[15px] font-bold cursor-pointer" onClick={() => { setEditing(false); setUpdated(user!); }}>Cancel</button>
            </>
          }
        </div>
      </div>
    </div>
  );
};
