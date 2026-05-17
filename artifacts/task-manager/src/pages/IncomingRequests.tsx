import { useState, useEffect } from "react";
import { FaUserCheck, FaUserTimes, FaUserCircle } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { GiThreeFriends } from "react-icons/gi";

export const IncomingRequests = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });

  const showBox = (type: string, title: string, message: string) => {
    setMessageBox({ show: true, type, title, message });
  };

  useEffect(() => {
    if (!messageBox.show) return;
    const timer = setTimeout(() => setMessageBox({ show: false, type: "", title: "", message: "" }), 3000);
    return () => clearTimeout(timer);
  }, [messageBox.show]);

  const fetchusers = async () => {
    try {
      const res = await fetch("/api/friendship/incomingrequests", {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status !== 200) { const data = await res.json(); throw new Error(data.message); }
      setUsers(await res.json());
    } catch (error: any) {
      showBox("error", "Error", error.message || "Error From Server");
    }
  };

  useEffect(() => { fetchusers(); }, []);

  const acceptuser = async (userid: string) => {
    try {
      const res = await fetch("/api/friendship/acceptuser", {
        method: "PUT",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ userid }),
      });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showBox("success", "Accepted", data.message || "Friend accepted");
      setUsers(users.filter((u) => u._id !== userid));
    } catch (error: any) {
      showBox("error", "Failed", error.message || "Something went wrong");
    }
  };

  const rejectuser = async (userid: string) => {
    try {
      const res = await fetch("/api/friendship/rejectuser", {
        method: "PUT",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ userid }),
      });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showBox("success", "Rejected", data.message || "User rejected");
      setUsers(users.filter((u) => u._id !== userid));
    } catch (error: any) {
      showBox("error", "Failed", error.message || "Something went wrong");
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

      <h2 className="text-center text-white text-[26px] font-extrabold mb-6">Incoming Friend Requests</h2>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        {users.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-5 text-center">
            <div className="w-[72px] h-[72px] rounded-2xl bg-indigo-500/[0.10] border border-indigo-500/[0.22] flex items-center justify-center mb-5">
              <GiThreeFriends size={36} className="text-indigo-400" />
            </div>
            <h2 className="m-0 mb-2 text-[22px] font-extrabold text-white">No incoming requests</h2>
            <p className="m-0 text-white/50 text-[14px] max-w-[280px] leading-[1.7]">When someone sends you a friend request, it will appear here for you to accept or reject.</p>
          </div>
        )}

        {users.map((user) => (
          <div key={user._id} className="py-[22px] px-[18px] rounded-[20px] bg-white/[0.04] border border-indigo-500/[0.14] shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl flex flex-col items-center gap-3.5 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-500/[0.12] border border-indigo-500/[0.22] flex items-center justify-center text-indigo-300">
              <FaUserCircle size={32} />
            </div>
            <div className="text-xl font-extrabold text-white">{user.username}</div>
            <div className="text-white/55 text-sm">Wants to connect with you</div>
            <div className="flex gap-2.5 mt-2">
              <button onClick={() => acceptuser(user._id)} className="px-[14px] py-2 rounded-xl border-none bg-gradient-to-r from-emerald-600 to-emerald-400 text-white font-extrabold cursor-pointer flex items-center gap-1.5 text-sm transition-all hover:-translate-y-0.5">
                <FaUserCheck /> Accept
              </button>
              <button onClick={() => rejectuser(user._id)} className="px-[14px] py-2 rounded-xl border-none bg-gradient-to-r from-red-700 to-red-500 text-white font-extrabold cursor-pointer flex items-center gap-1.5 text-sm transition-all hover:-translate-y-0.5">
                <FaUserTimes /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
