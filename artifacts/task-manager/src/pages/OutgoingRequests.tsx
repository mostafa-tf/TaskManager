import { useState, useEffect } from "react";
import { FaUserCircle, FaUndo } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";

export const OutgoingRequests = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });

  const showBox = (type: string, title: string, message: string) => {
    setMessageBox({ show: true, type, title, message });
  };

  useEffect(() => {
    if (messageBox.show) {
      const timer = setTimeout(() => setMessageBox({ show: false, type: "", title: "", message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [messageBox.show]);

  const fetchusers = async () => {
    try {
      const res = await fetch("/api/friendship/outgoingrequests", {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status !== 200) { const data = await res.json(); throw new Error(data.message); }
      setUsers(await res.json());
    } catch (error: any) {
      showBox("error", "Error", error.message || "Error From Server");
    }
  };

  useEffect(() => { fetchusers(); }, []);

  const undorequest = async (userid: string) => {
    try {
      const res = await fetch("/api/friendship/undorequest", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ userid }),
      });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showBox("success", "Request Canceled", data.message || "Undo request");
      setUsers(users.filter((u) => u._id !== userid));
    } catch (error: any) {
      showBox("error", "Undo Failed", error.message || "Something went wrong");
    }
  };

  const isError = messageBox.type === "error";

  return (
    <div className="w-full box-border">
      {messageBox.show && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`w-[min(430px,90%)] p-[22px] rounded-3xl flex items-center gap-[15px] text-white shadow-[0_24px_70px_rgba(0,0,0,0.55)] bg-gradient-to-br from-[rgba(22,22,22,0.98)] to-[rgba(12,12,12,0.98)] ${isError ? "border border-[rgba(255,77,79,0.45)]" : "border border-[rgba(0,255,140,0.35)]"}`}>
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

      <h2 className="text-center text-white text-[28px] font-extrabold mb-6">Outgoing Friend Requests</h2>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {users.length === 0 && (
          <h1 className="text-center text-[#ff8f8f] text-[30px] font-extrabold mt-10">No Users Found</h1>
        )}

        {users.map((user) => (
          <div key={user._id} className="py-[22px] px-[18px] rounded-[20px] bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.14)] shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl flex flex-col items-center gap-3.5 text-center">
            <div className="w-16 h-16 rounded-full bg-[rgba(0,255,140,0.10)] border border-[rgba(0,255,140,0.20)] flex items-center justify-center text-[#dffff0]">
              <FaUserCircle size={34} />
            </div>
            <div className="text-xl font-extrabold text-white">{user.username}</div>
            <div className="text-white/70 text-sm">Friend request sent</div>
            <button
              onClick={() => undorequest(user._id)}
              className="px-[14px] py-2.5 rounded-xl border-none bg-gradient-to-br from-[#ef6c00] to-[#fb8c00] text-white font-extrabold cursor-pointer flex items-center gap-1.5"
            >
              <FaUndo /> Undo Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
