import { useState } from "react";
import { MdFeedback } from "react-icons/md";

export const Feedback = () => {
  const [data, setData] = useState({ title: "", feedback: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/feedbacks", { method: "POST", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify(data) });
      const resdata = await res.json();
      if (res.status !== 201) throw new Error(resdata.message);
      showMsg("Feedback submitted!", false);
      setData({ title: "", feedback: "" });
    } catch (error: any) { showMsg(error.message, true); }
  };

  const inputClass = "w-full h-12 rounded-[14px] border border-[rgba(0,255,128,0.20)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] outline-none text-[15px] box-border";

  return (
    <div className="w-full min-h-full box-border">
      {message && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`px-7 py-[22px] rounded-[20px] bg-[rgba(15,15,15,0.98)] border font-bold text-base ${isError ? "border-[rgba(255,77,79,0.45)] text-[#ff9c9c]" : "border-[rgba(0,255,140,0.30)] text-[#60ff9c]"}`}>{message}</div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-7">
        <div className="w-[52px] h-[52px] rounded-2xl bg-[rgba(0,255,140,0.10)] border border-[rgba(0,255,140,0.18)] flex items-center justify-center text-[#dffff0]"><MdFeedback size={26} /></div>
        <div>
          <h2 className="m-0 text-[28px] font-extrabold text-white">Send Feedback</h2>
          <p className="m-0 text-white/65 text-sm">We value your feedback and suggestions.</p>
        </div>
      </div>

      <div className="max-w-[500px] p-8 rounded-3xl bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.12)]">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-5">
            <label className="block text-[#caffdf] mb-2 text-sm font-bold">Title</label>
            <input type="text" required minLength={2} maxLength={50} className={inputClass} value={data.title} onChange={(e) => setData(p => ({ ...p, title: e.target.value }))} placeholder="Feedback title" />
          </div>
          <div className="flex flex-col mb-5">
            <label className="block text-[#caffdf] mb-2 text-sm font-bold">Feedback</label>
            <textarea required minLength={5} maxLength={500} className="w-full h-[120px] rounded-[14px] border border-[rgba(0,255,128,0.20)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] py-3 outline-none text-[15px] box-border resize-y" value={data.feedback} onChange={(e) => setData(p => ({ ...p, feedback: e.target.value }))} placeholder="Write your feedback..." />
          </div>
          <button type="submit" className="w-full h-[50px] rounded-[14px] border-none bg-[linear-gradient(135deg,#00c853,#00e676)] text-[#08110c] text-base font-extrabold cursor-pointer">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};
