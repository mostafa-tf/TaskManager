import { useState, useEffect } from "react";

export const OutgoingRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [noRequests, setNoRequests] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const fetchRequests = async () => {
    setNoRequests(false); setRequests([]);
    try {
      const res = await fetch("/api/friendship/outgoingrequests", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status === 404) setNoRequests(true);
      else if (res.status === 200) setRequests(data);
      else throw new Error(data.message);
    } catch (error: any) { showMsg(error.message, true); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const cancel = async (requestid: string) => {
    try {
      const res = await fetch(`/api/friendship/cancelrequest/${requestid}`, { method: "DELETE", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("Request cancelled!", false); await fetchRequests();
    } catch (error: any) { showMsg(error.message, true); }
  };

  const cardStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", padding: "16px 20px", borderRadius: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.10)", marginBottom: "10px" };

  return (
    <div>
      {message && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}><div style={{ padding: "22px 28px", borderRadius: "20px", background: "rgba(15,15,15,0.98)", border: isError ? "1px solid rgba(255,77,79,0.45)" : "1px solid rgba(0,255,140,0.30)", color: isError ? "#ff9c9c" : "#60ff9c", fontWeight: "700", fontSize: "16px" }}>{message}</div></div>}
      {noRequests && <h2 style={{ color: "#60ff9c", fontWeight: "800" }}>No Outgoing Requests</h2>}
      {requests.map((r) => (
        <div style={cardStyle} key={r._id}>
          <div>
            <p style={{ margin: 0, color: "#ffffff", fontWeight: "700", fontSize: "16px" }}>{r.receiver?.username || "Unknown"}</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>{r.receiver?.email || ""}</p>
          </div>
          <button onClick={() => cancel(r._id)} style={{ height: "36px", padding: "0 14px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#c62828,#e53935)", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
        </div>
      ))}
    </div>
  );
};
