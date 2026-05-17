import { useState, useEffect } from "react";
import { IoPersonRemove } from "react-icons/io5";
import { FaUserSlash, FaUserCircle } from "react-icons/fa";
import { GiThreeFriends } from "react-icons/gi";

export const ViewFriends = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const [searchfilter, setSearchFilter] = useState("");

  const fetchfriends = async () => {
    try {
      const res = await fetch("/api/friendship/viewfriends", {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status === 500) { const err = await res.json(); throw new Error(err.message); }
      setFriends(await res.json());
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => { fetchfriends(); }, []);

  const removefriend = async (friendid: string) => {
    try {
      const res = await fetch("/api/friendship/removefriend", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ friendid }),
      });
      if (res.status !== 200) { const err = await res.json(); throw new Error(err.message); }
      alert("friend deleted");
      setFriends(friends.filter((f) => f._id !== friendid));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const blockfriend = async (friendid: string) => {
    try {
      const res = await fetch("/api/friendship/blockuser", {
        method: "PUT",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ userid: friendid }),
      });
      if (res.status !== 200) { const err = await res.json(); throw new Error(err.message); }
      alert("friend blocked");
      setFriends(friends.filter((f) => f._id !== friendid));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const filteredFriends = friends.filter((f) =>
    f.username.toLowerCase().startsWith(searchfilter.toLowerCase())
  );

  return (
    <div className="w-full box-border">
      <div className="w-full flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search friends..."
          value={searchfilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-80 h-12 rounded-[14px] border border-indigo-500/[0.22] bg-white/[0.07] text-white px-[14px] outline-none text-[15px]"
        />
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        {filteredFriends.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-5 text-center">
            <div className="w-[72px] h-[72px] rounded-2xl bg-indigo-500/[0.10] border border-indigo-500/[0.22] flex items-center justify-center mb-5">
              <GiThreeFriends size={36} className="text-indigo-400" />
            </div>
            <h2 className="m-0 mb-2 text-[22px] font-extrabold text-white">No friends yet</h2>
            <p className="m-0 text-white/50 text-[14px] max-w-[280px] leading-[1.7]">Head over to Add Friend to find and connect with people you know.</p>
          </div>
        )}

        {filteredFriends.map((friend) => (
          <div key={friend._id} className="py-[22px] px-[18px] rounded-[20px] bg-white/[0.04] border border-indigo-500/[0.14] shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl flex flex-col items-center gap-3 text-center transition-all hover:bg-indigo-500/[0.06]">
            <div className="w-16 h-16 rounded-full bg-indigo-500/[0.12] border border-indigo-500/[0.22] flex items-center justify-center text-indigo-300">
              <FaUserCircle size={32} />
            </div>

            <div className="text-xl font-extrabold text-white mt-0.5">{friend.username}</div>

            <div className={`px-3 py-1.5 rounded-full text-[12px] font-bold ${friend.isActive ? "text-emerald-300 bg-emerald-500/[0.12] border border-emerald-500/[0.25]" : "text-white/50 bg-white/[0.07] border border-white/[0.08]"}`}>
              {friend.isActive ? "Online 🟢" : "Inactive ⚫"}
            </div>

            <div className="text-white/55 text-sm leading-relaxed">{friend.friendshipdate}</div>

            <div className="flex gap-2.5 mt-2 flex-wrap justify-center">
              <button
                onClick={() => removefriend(friend._id)}
                className="px-[14px] py-2 rounded-xl border-none bg-gradient-to-r from-red-700 to-red-500 text-white font-bold cursor-pointer flex items-center gap-1.5 text-sm transition-all hover:-translate-y-0.5"
              >
                Remove <IoPersonRemove />
              </button>
              <button
                onClick={() => blockfriend(friend._id)}
                className="px-[14px] py-2 rounded-xl border-none bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold cursor-pointer flex items-center gap-1.5 text-sm transition-all hover:-translate-y-0.5"
              >
                Block <FaUserSlash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
