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
          <div className={`w-[min(430px,90%)] p-[22px] rounded-3xl flex items-center gap-[15px] text-white bg-[rgba(20,20,20,0.95)] ${isError ? "border border-[rgba(255,77,79,0.45)]" : "border border-[rgba(0,255,140,0.35)]"}`}>
            <div className={`min-w-[52px] h-[52px] rounded-[18px] flex items-center justify-center ${isError ? "text-[#ff6b6b]" : "text-[#60ff9c]"}`}>
              {isError ? <MdErrorOutline size={30} /> : <MdCheckCircleOutline size={30} />}
            </div>
            <div>
              <h3 className="m-0">{messageBox.title}</h3>
              <p className="m-0">{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-center text-white text-[28px] font-extrabold mb-6">Incoming Friend Requests</h2>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {users.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-5 text-center">
            <div className="w-[72px] h-[72px] rounded-2xl bg-[rgba(0,255,140,0.08)] border border-[rgba(0,255,140,0.16)] flex items-center justify-center mb-5">
              <GiThreeFriends size={36} className="text-[#60ff9c]" />
            </div>
            <h2 className="m-0 mb-2 text-[22px] font-extrabold text-white">No incoming requests</h2>
            <p className="m-0 text-white/55 text-[14px] max-w-[280px] leading-[1.7]">When someone sends you a friend request, it will appear here for you to accept or reject.</p>
          </div>
        )}

        {users.map((user) => (
          <div key={user._id} className="py-[22px] px-[18px] rounded-[20px] bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.14)] shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl flex flex-col items-center gap-3.5 text-center">
            <div className="w-16 h-16 rounded-full bg-[rgba(0,255,140,0.10)] border border-[rgba(0,255,140,0.20)] flex items-center justify-center text-[#dffff0]">
              <FaUserCircle size={34} />
            </div>
            <div className="text-xl font-extrabold text-white">{user.username}</div>
            <div className="text-white/70 text-sm">Wants to connect with you</div>
            <div className="flex gap-2.5 mt-2">
              <button onClick={() => acceptuser(user._id)} className="px-[14px] py-2.5 rounded-xl border-none bg-gradient-to-br from-[#00c853] to-[#00e676] text-[#08110c] font-extrabold cursor-pointer flex items-center gap-1.5">
                <FaUserCheck /> Accept
              </button>
              <button onClick={() => rejectuser(user._id)} className="px-[14px] py-2.5 rounded-xl border-none bg-gradient-to-br from-[#c62828] to-[#e53935] text-white font-extrabold cursor-pointer flex items-center gap-1.5">
                <FaUserTimes /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
