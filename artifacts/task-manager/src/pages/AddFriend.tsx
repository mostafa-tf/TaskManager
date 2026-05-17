import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";

export const AddFriend = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchfilter, setSearchFilter] = useState("");
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
      const res = await fetch("/api/friendship/nonfriendsusers", {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status !== 200) { const err = await res.json(); throw new Error(err.message); }
      setUsers(await res.json());
    } catch (error: any) {
      showBox("error", "Error", error.message || "Error From Server");
    }
  };

  useEffect(() => { fetchusers(); }, []);

  const filteredUsers = users.filter((user) => user.username.startsWith(searchfilter));

  const addfriend = async (userid: string) => {
    try {
      const res = await fetch("/api/friendship/addfriend", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ receiver: userid }),
      });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      setUsers(users.filter((user) => user._id !== userid));
      showBox("success", "Friend Request Sent", data.message || "Request sent successfully");
    } catch (error: any) {
      showBox("error", "Request Failed", error.message || "Something went wrong");
    }
  };

  const isError = messageBox.type === "error";

  return (
    <div className="w-full p-1 box-border">
      {messageBox.show && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`w-[min(430px,90%)] p-[22px] rounded-3xl bg-[linear-gradient(135deg,rgba(12,10,30,0.98),rgba(6,7,15,0.98))] flex items-center gap-[15px] text-white shadow-[0_24px_70px_rgba(0,0,0,0.55)] border ${isError ? "border-red-500/[0.40]" : "border-emerald-500/[0.40]"}`}>
            <div className={`min-w-[52px] h-[52px] rounded-[18px] flex items-center justify-center border ${isError ? "bg-red-500/[0.14] border-red-500/[0.25] text-red-400" : "bg-emerald-500/[0.14] border-emerald-500/[0.25] text-emerald-400"}`}>
              {isError ? <MdErrorOutline size={30} /> : <MdCheckCircleOutline size={30} />}
            </div>
            <div>
              <h3 className="m-0 mb-[5px] text-lg font-extrabold">{messageBox.title}</h3>
              <p className="m-0 text-sm leading-relaxed text-white/65">{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search for user..."
          value={searchfilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-80 h-12 rounded-[14px] border border-indigo-500/[0.22] bg-white/[0.07] text-white px-[14px] outline-none text-[15px]"
        />
      </div>

      {filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-5 text-center col-span-full">
          <div className="w-[72px] h-[72px] rounded-2xl bg-indigo-500/[0.10] border border-indigo-500/[0.22] flex items-center justify-center mb-5">
            <IoPersonSharp size={32} className="text-indigo-400" />
          </div>
          <h2 className="m-0 mb-2 text-[22px] font-extrabold text-white">No users found</h2>
          <p className="m-0 text-white/50 text-[14px] max-w-[280px] leading-[1.7]">Try a different search term — there may be users with a slightly different username.</p>
        </div>
      )}

      {filteredUsers.length > 0 && (
        <div className="grid gap-[16px]" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {filteredUsers.map((user) => (
            <div key={user._id} className="p-5 rounded-[18px] bg-white/[0.04] border border-indigo-500/[0.14] flex flex-col items-center gap-3 shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all hover:bg-indigo-500/[0.06] hover:-translate-y-0.5">
              <div className="w-[58px] h-[58px] rounded-full bg-indigo-500/[0.12] border border-indigo-500/[0.22] flex items-center justify-center text-indigo-300">
                <IoPersonSharp size={26} />
              </div>
              <div className="text-base font-bold text-white">{user.username}</div>
              <button
                onClick={() => addfriend(user._id)}
                className="mt-1 px-4 py-2 rounded-xl border-none bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold cursor-pointer flex items-center gap-1.5 text-sm shadow-[0_6px_16px_rgba(99,102,241,0.28)] transition-all hover:-translate-y-0.5"
              >
                <FaUserPlus /> Add Friend
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
