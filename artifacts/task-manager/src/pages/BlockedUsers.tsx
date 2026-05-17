import { useState, useEffect } from "react";
import { FaUserSlash, FaUnlockAlt } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { GiThreeFriends } from "react-icons/gi";

export const BlockedUsers = () => {
  const [blockedusers, setBlockedUsers] = useState<any[]>([]);
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });

  const showBox = (type: string, title: string, message: string) => {
    setMessageBox({ show: true, type, title, message });
  };

  useEffect(() => {
    if (!messageBox.show) return;
    const timer = setTimeout(() => setMessageBox({ show: false, type: "", title: "", message: "" }), 3000);
    return () => clearTimeout(timer);
  }, [messageBox.show]);

  const fetchblockedusers = async () => {
    try {
      const res = await fetch("/api/friendship/blockedusers", {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status === 500) { const err = await res.json(); throw new Error(err.message); }
      setBlockedUsers(await res.json());
    } catch (error: any) {
      showBox("error", "Error", error.message || "Error From Server");
    }
  };

  useEffect(() => { fetchblockedusers(); }, []);

  const removeblock = async (userid: string) => {
    try {
      const res = await fetch("/api/friendship/unblockuser", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ userid }),
      });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showBox("success", "User Unblocked", data.message || "Block removed");
      setBlockedUsers(blockedusers.filter((u) => u._id !== userid));
    } catch (error: any) {
      showBox("error", "Unblock Failed", error.message || "Something went wrong");
    }
  };

  const isError = messageBox.type === "error";

  return (
    <div className="w-full box-border">
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

      <h2 className="text-center text-white text-[26px] font-extrabold mb-6">Blocked Users</h2>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        {blockedusers.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-5 text-center">
            <div className="w-[72px] h-[72px] rounded-2xl bg-amber-500/[0.10] border border-amber-500/[0.22] flex items-center justify-center mb-5">
              <GiThreeFriends size={36} className="text-amber-300" />
            </div>
            <h2 className="m-0 mb-2 text-[22px] font-extrabold text-white">No blocked users</h2>
            <p className="m-0 text-white/50 text-[14px] max-w-[280px] leading-[1.7]">You haven't blocked anyone. Blocked users won't be able to send you friend requests.</p>
          </div>
        )}

        {blockedusers.map((blockeduser) => (
          <div key={blockeduser._id} className="py-[22px] px-[18px] rounded-[20px] bg-white/[0.04] border border-red-500/[0.14] shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl flex flex-col items-center gap-3.5 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/[0.10] border border-red-500/[0.20] flex items-center justify-center text-red-400">
              <FaUserSlash size={28} />
            </div>
            <div className="text-xl font-extrabold text-white">{blockeduser.username}</div>
            <div className="text-white/50 text-sm">This user is blocked</div>
            <button
              onClick={() => removeblock(blockeduser._id)}
              className="px-[14px] py-2 rounded-xl border-none bg-gradient-to-r from-emerald-600 to-emerald-400 text-white font-extrabold cursor-pointer flex items-center gap-1.5 text-sm shadow-[0_8px_20px_rgba(52,211,153,0.22)] transition-all hover:-translate-y-0.5"
            >
              <FaUnlockAlt /> Unblock
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
