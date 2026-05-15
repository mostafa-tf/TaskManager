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

  const cardStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", padding: "16px 20px", borderRadius: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.10)", marginBottom: "10px" };
  const btn = (col: string): React.CSSProperties => ({ height: "36px", padding: "0 14px", borderRadius: "10px", border: "none", background: col, color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer" });

  return (
    <div>
      {message && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}><div style={{ padding: "22px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.30)", color: isError ? "#ff9c9c" : "#60ff9c", fontWeight: "700", fontSize: "16px" }}>{message}</div></div>}
      {noFriends && <h2 style={{ color: "#60ff9c", fontWeight: "800" }}>No Friends Yet</h2>}
      {friends.map((f) => (
        <div style={cardStyle} key={f._id}>
          <div>
            <p style={{ margin: 0, color: "#ffffff", fontWeight: "700", fontSize: "16px" }}>{f.username}</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>{f.email}</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={btn("linear-gradient(135deg,#1565c0,#1e88e5)")} onClick={() => navigate(`/projects/projectmember/${f._id}`)}>View Tasks</button>
            <button style={btn("rgba(255,193,7,0.25)")} onClick={() => blockfriend(f._id)}>Block</button>
            <button style={{ ...btn("linear-gradient(135deg,#c62828,#e53935)"), display: "flex", alignItems: "center", gap: "4px" }} onClick={() => unfriend(f._id)}><MdDelete size={16} />Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
};
