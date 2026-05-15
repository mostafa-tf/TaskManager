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

  return (
    <div>
      {message && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`px-7 py-[22px] rounded-[20px] bg-[rgba(15,15,15,0.98)] border font-bold text-base ${isError ? "border-[rgba(255,77,79,0.45)] text-[#ff9c9c]" : "border-[rgba(0,255,140,0.30)] text-[#60ff9c]"}`}>{message}</div>
        </div>
      )}
      {noRequests && <h2 className="text-[#60ff9c] font-extrabold">No Incoming Requests</h2>}
      {requests.map((r) => (
        <div key={r._id} className="flex justify-between items-center gap-[14px] px-5 py-4 rounded-[14px] bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.10)] mb-2.5">
          <div>
            <p className="m-0 text-white font-bold text-base">{r.sender?.username || "Unknown"}</p>
            <p className="m-0 text-white/55 text-[13px]">{r.sender?.email || ""}</p>
          </div>
          <div className="flex gap-2">
            <button className="h-9 px-[14px] rounded-[10px] border-none bg-[linear-gradient(135deg,#00c853,#00e676)] text-white text-[13px] font-bold cursor-pointer" onClick={() => respond(r._id, "accept")}>Accept</button>
            <button className="h-9 px-[14px] rounded-[10px] border-none bg-[linear-gradient(135deg,#c62828,#e53935)] text-white text-[13px] font-bold cursor-pointer" onClick={() => respond(r._id, "reject")}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};
