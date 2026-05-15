import { useState, useEffect } from "react";

export const IncomingRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [noRequests, setNoRequests] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const fetchRequests = async () => {
    setNoRequests(false); setRequests([]);
    try {
      const res = await fetch("/api/friendship/incomingrequests", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status === 404) setNoRequests(true);
      else if (res.status === 200) setRequests(data);
      else throw new Error(data.message);
    } catch (error: any) { showMsg(error.message, true); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const respond = async (requestid: string, action: string) => {
    try {
      const res = await fetch(`/api/friendship/respond`, { method: "PUT", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ requestid, action }) });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg(data.message || `Request ${action}!`, false); await fetchRequests();
    } catch (error: any) { showMsg(error.message, true); }
  };

  const cardStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", padding: "16px 20px", borderRadius: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.10)", marginBottom: "10px" };
  const btn = (col: string): React.CSSProperties => ({ height: "36px", padding: "0 14px", borderRadius: "10px", border: "none", background: col, color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer" });

  return (
    <div>
      {message && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}><div style={{ padding: "22px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.30)", color: isError ? "#ff9c9c" : "#60ff9c", fontWeight: "700", fontSize: "16px" }}>{message}</div></div>}
      {noRequests && <h2 style={{ color: "#60ff9c", fontWeight: "800" }}>No Incoming Requests</h2>}
      {requests.map((r) => (
        <div style={cardStyle} key={r._id}>
          <div>
            <p style={{ margin: 0, color: "#ffffff", fontWeight: "700", fontSize: "16px" }}>{r.sender?.username || "Unknown"}</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>{r.sender?.email || ""}</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={btn("linear-gradient(135deg,#00c853,#00e676)")} onClick={() => respond(r._id, "accept")}>Accept</button>
            <button style={btn("linear-gradient(135deg,#c62828,#e53935)")} onClick={() => respond(r._id, "reject")}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};
