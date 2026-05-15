import { useState, useEffect } from "react";

export const BlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [noBlocked, setNoBlocked] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const fetchBlocked = async () => {
    setNoBlocked(false); setBlockedUsers([]);
    try {
      const res = await fetch("/api/friendship/blockedusers", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status === 404) setNoBlocked(true);
      else if (res.status === 200) setBlockedUsers(data);
      else throw new Error(data.message);
    } catch (error: any) { showMsg(error.message, true); }
  };

  useEffect(() => { fetchBlocked(); }, []);

  const unblock = async (userid: string) => {
    try {
      const res = await fetch(`/api/friendship/unblock/${userid}`, { method: "PUT", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("User unblocked!", false); await fetchBlocked();
    } catch (error: any) { showMsg(error.message, true); }
  };

  const cardStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", padding: "16px 20px", borderRadius: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,82,82,0.15)", marginBottom: "10px" };

  return (
    <div>
      {message && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}><div style={{ padding: "22px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.30)", color: isError ? "#ff9c9c" : "#60ff9c", fontWeight: "700", fontSize: "16px" }}>{message}</div></div>}
      {noBlocked && <h2 style={{ color: "#60ff9c", fontWeight: "800" }}>No Blocked Users</h2>}
      {blockedUsers.map((u) => (
        <div style={cardStyle} key={u._id}>
          <div>
            <p style={{ margin: 0, color: "#ffffff", fontWeight: "700", fontSize: "16px" }}>{u.username}</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>{u.email}</p>
          </div>
          <button onClick={() => unblock(u._id)} style={{ height: "36px", padding: "0 14px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#1565c0,#1e88e5)", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>Unblock</button>
        </div>
      ))}
    </div>
  );
};
