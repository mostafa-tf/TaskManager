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
    if (messageBox.show) {
      const timer = setTimeout(() => setMessageBox({ show: false, type: "", title: "", message: "" }), 3000);
      return () => clearTimeout(timer);
    }
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
    <div className="w-full p-5 box-border">
      {messageBox.show && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`w-[min(430px,90%)] p-[22px] rounded-3xl flex items-center gap-[15px] text-white shadow-[0_24px_70px_rgba(0,0,0,0.55)] ${isError ? "bg-gradient-to-br from-[rgba(22,22,22,0.98)] to-[rgba(12,12,12,0.98)] border border-[rgba(255,77,79,0.45)]" : "bg-gradient-to-br from-[rgba(22,22,22,0.98)] to-[rgba(12,12,12,0.98)] border border-[rgba(0,255,140,0.35)]"}`}>
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

      <div className="w-full mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search for user..."
          value={searchfilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-80 h-12 rounded-[14px] border border-[rgba(0,255,140,0.18)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] outline-none text-[15px]"
        />
      </div>

      {filteredUsers.length === 0 && (
        <h1 className="text-center text-[#ff8f8f] text-[28px] font-extrabold mt-10">No Users Found</h1>
      )}

      {filteredUsers.length > 0 && (
        <div className="grid gap-[18px]" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {filteredUsers.map((user) => (
            <div key={user._id} className="p-5 rounded-[18px] bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.14)] flex flex-col items-center gap-3 shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              <div className="w-[60px] h-[60px] rounded-full bg-[rgba(0,255,140,0.10)] border border-[rgba(0,255,140,0.20)] flex items-center justify-center text-[#dffff0]">
                <IoPersonSharp size={28} />
              </div>
              <div className="text-lg font-bold text-white">{user.username}</div>
              <button
                onClick={() => addfriend(user._id)}
                className="mt-1.5 px-4 py-2.5 rounded-xl border-none bg-gradient-to-br from-[#00c853] to-[#00e676] text-[#08110c] font-bold cursor-pointer flex items-center gap-1.5"
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
