import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdFeedback, MdDelete } from "react-icons/md";

export const FeedbacksDashboard = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [noFeedbacks, setNoFeedbacks] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const fetchFeedbacks = async () => {
    setNoFeedbacks(false); setFeedbacks([]);
    try {
      const res = await fetch("/api/feedbacks", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status === 404) setNoFeedbacks(true);
      else if (res.status === 200) setFeedbacks(data);
      else throw new Error(data.message);
    } catch (error: any) { showMsg(error.message, true); }
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const deleteFeedback = async (id: string) => {
    try {
      const res = await fetch(`/api/feedbacks/${id}`, { method: "DELETE", headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("Feedback deleted!", false); await fetchFeedbacks();
    } catch (error: any) { showMsg(error.message, true); }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#07110d_0%,#0b1d15_50%,#08110c_100%)] p-[30px]">
      {message && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`px-7 py-[22px] rounded-[20px] bg-[rgba(15,15,15,0.98)] border font-bold text-base ${isError ? "border-[rgba(255,77,79,0.45)] text-[#ff9c9c]" : "border-[rgba(0,255,140,0.30)] text-[#60ff9c]"}`}>{message}</div>
        </div>
      )}

      <div className="flex items-center gap-[14px] mb-7">
        <button onClick={() => navigate("/admindashboard")} className="w-[46px] h-[46px] rounded-[14px] border border-[rgba(0,255,140,0.2)] bg-[rgba(0,255,140,0.08)] text-[#dffff0] cursor-pointer flex items-center justify-center">
          <FaArrowLeft size={18} />
        </button>
        <div className="w-[52px] h-[52px] rounded-2xl bg-[rgba(0,255,140,0.10)] flex items-center justify-center text-[#dffff0]"><MdFeedback size={26} /></div>
        <div>
          <h2 className="m-0 text-[28px] font-extrabold text-white">User Feedbacks</h2>
          <p className="m-0 text-white/65 text-sm">Review and manage all submitted feedbacks.</p>
        </div>
      </div>

      {noFeedbacks && <h2 className="text-[#60ff9c] text-center font-extrabold">No Feedbacks Found</h2>}

      {feedbacks.map((fb) => (
        <div key={fb._id} className="px-6 py-5 rounded-[18px] bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.10)] mb-3 flex justify-between items-start gap-[14px]">
          <div>
            <h3 className="m-0 mb-1.5 text-white text-lg font-extrabold">{fb.title}</h3>
            <p className="m-0 mb-1.5 text-white/75 text-sm leading-[1.6]">{fb.feedback}</p>
            <p className="m-0 text-white/45 text-xs">By: {fb.user?.username || "Unknown"} ({fb.user?.email || ""})</p>
          </div>
          <button onClick={() => deleteFeedback(fb._id)} className="w-[42px] h-[42px] rounded-[12px] border-none bg-[linear-gradient(135deg,#c62828,#e53935)] text-white cursor-pointer flex items-center justify-center shrink-0">
            <MdDelete size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};
