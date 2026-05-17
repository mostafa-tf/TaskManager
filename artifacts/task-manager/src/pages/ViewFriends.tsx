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
          className="w-80 h-12 rounded-[14px] border border-[rgba(0,255,140,0.18)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] outline-none text-[15px]"
        />
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {filteredFriends.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-5 text-center">
            <div className="w-[72px] h-[72px] rounded-2xl bg-[rgba(234,128,252,0.08)] border border-[rgba(234,128,252,0.18)] flex items-center justify-center mb-5">
              <GiThreeFriends size={36} className="text-[#ea80fc]" />
            </div>
            <h2 className="m-0 mb-2 text-[22px] font-extrabold text-white">No friends yet</h2>
            <p className="m-0 text-white/55 text-[14px] max-w-[280px] leading-[1.7]">Head over to Add Friend to find and connect with people you know.</p>
          </div>
        )}

        {filteredFriends.map((friend) => (
          <div key={friend._id} className="py-[22px] px-[18px] rounded-[20px] bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.14)] shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-[rgba(0,255,140,0.10)] border border-[rgba(0,255,140,0.20)] flex items-center justify-center text-[#dffff0] shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
              <FaUserCircle size={34} />
            </div>

            <div className="text-xl font-extrabold text-white mt-0.5">{friend.username}</div>

            <div className={`px-3 py-1.5 rounded-full text-[13px] font-bold ${friend.isActive ? "text-[#08110c] bg-gradient-to-br from-[#00c853] to-[#00e676]" : "text-white bg-[rgba(255,255,255,0.10)]"}`}>
              {friend.isActive ? "Online 🟢" : "Inactive ⚫"}
            </div>

            <div className="text-white/70 text-sm leading-relaxed">{friend.friendshipdate}</div>

            <div className="flex gap-2.5 mt-2 flex-wrap justify-center">
              <button
                onClick={() => removefriend(friend._id)}
                className="px-[14px] py-2.5 rounded-xl border-none bg-gradient-to-br from-[#c62828] to-[#e53935] text-white font-bold cursor-pointer flex items-center gap-1.5"
              >
                Remove <IoPersonRemove />
              </button>
              <button
                onClick={() => blockfriend(friend._id)}
                className="px-[14px] py-2.5 rounded-xl border-none bg-gradient-to-br from-[#ef6c00] to-[#fb8c00] text-white font-bold cursor-pointer flex items-center gap-1.5"
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
