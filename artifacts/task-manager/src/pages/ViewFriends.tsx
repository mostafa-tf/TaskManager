import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

export const ViewFriends = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const [noFriends, setNoFriends] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const fetchFriends = async () => {
    setNoFriends(false); setFriends([]);
    try {
      const res = await fetch("/api/friendship/friends", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status === 404) setNoFriends(true);
      else if (res.status === 200) setFriends(data);
      else throw new Error(data.message);
    } catch (error: any) { showMsg(error.message, true); }
  };

  useEffect(() => { fetchFriends(); }, []);

  const unfriend = async (friendid: string) => {
    try {
      const res = await fetch(`/api/friendship/unfriend/${friendid}`, { method: "DELETE", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("Unfriended successfully!", false); await fetchFriends();
    } catch (error: any) { showMsg(error.message, true); }
  };

  const blockfriend = async (friendid: string) => {
    try {
      const res = await fetch(`/api/friendship/block/${friendid}`, { method: "PUT", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("User blocked!", false); await fetchFriends();
    } catch (error: any) { showMsg(error.message, true); }
  };

  return (
    <div>
      {message && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`px-7 py-[22px] rounded-[20px] bg-[rgba(15,15,15,0.98)] border font-bold text-base ${isError ? "border-[rgba(255,77,79,0.45)] text-[#ff9c9c]" : "border-[rgba(0,255,140,0.30)] text-[#60ff9c]"}`}>{message}</div>
        </div>
      )}
      {noFriends && <h2 className="text-[#60ff9c] font-extrabold">No Friends Yet</h2>}
      {friends.map((f) => (
        <div key={f._id} className="flex justify-between items-center gap-[14px] px-5 py-4 rounded-[14px] bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.10)] mb-2.5">
          <div>
            <p className="m-0 text-white font-bold text-base">{f.username}</p>
            <p className="m-0 text-white/55 text-[13px]">{f.email}</p>
          </div>
          <div className="flex gap-2">
            <button className="h-9 px-[14px] rounded-[10px] border-none bg-[linear-gradient(135deg,#1565c0,#1e88e5)] text-white text-[13px] font-bold cursor-pointer" onClick={() => navigate(`/projects/projectmember/${f._id}`)}>View Tasks</button>
            <button className="h-9 px-[14px] rounded-[10px] border-none bg-[rgba(255,193,7,0.25)] text-white text-[13px] font-bold cursor-pointer" onClick={() => blockfriend(f._id)}>Block</button>
            <button className="h-9 px-[14px] rounded-[10px] border-none bg-[linear-gradient(135deg,#c62828,#e53935)] text-white text-[13px] font-bold cursor-pointer flex items-center gap-1" onClick={() => unfriend(f._id)}>
              <MdDelete size={16} />Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
