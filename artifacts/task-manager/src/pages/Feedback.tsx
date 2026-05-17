import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";

export const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });

  const showBox = (type: string, title: string, message: string) => {
    setMessageBox({ show: true, type, title, message });
  };

  useEffect(() => {
    if (messageBox.show) {
      const timer = setTimeout(() => {
        setMessageBox({ show: false, type: "", title: "", message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messageBox.show]);

  const submitfeedback = async () => {
    try {
      const res = await fetch("/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ rating, message }),
      });
      const data = await res.json();
      if (res.status === 401) throw new Error(data.message || "You must login first");
      if (res.status === 400) throw new Error(data.message || "Invalid data");
      if (res.status === 500) throw new Error(data.message || "Server error");
      if (res.status !== 201) throw new Error(data.message || "Something went wrong");
      showBox("success", "Thank You ❤️", "Feedback submitted successfully");
      setRating(0);
      setMessage("");
    } catch (error: any) {
      showBox("error", "Submission Failed", error.message);
    }
  };

  const disabled = rating === 0 || message.length < 4;
  const isError = messageBox.type === "error";

  return (
    <div className="w-full min-h-full flex justify-center items-center p-[30px_20px] box-border">
      {messageBox.show && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`w-[min(430px,90%)] p-[22px] rounded-3xl bg-[linear-gradient(135deg,rgba(12,10,30,0.98),rgba(6,7,15,0.98))] shadow-[0_24px_70px_rgba(0,0,0,0.55)] flex items-center gap-[15px] text-white border ${isError ? "border-red-500/[0.40]" : "border-emerald-500/[0.40]"}`}>
            <div className={`min-w-[52px] h-[52px] rounded-[18px] flex items-center justify-center border ${isError ? "bg-red-500/[0.14] border-red-500/[0.25] text-red-400" : "bg-emerald-500/[0.14] border-emerald-500/[0.25] text-emerald-400"}`}>
              {isError ? <MdErrorOutline size={30} /> : <MdCheckCircleOutline size={30} />}
            </div>
            <div>
              <h3 className="m-0 mb-[5px] text-lg font-extrabold">{messageBox.title}</h3>
              <p className="m-0 text-sm text-white/65">{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[520px] min-h-[600px] rounded-[28px] border border-indigo-500/[0.18] bg-white/[0.04] backdrop-blur-[16px] flex flex-col justify-center items-center p-[45px_32px_35px] box-border shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
        <h2 className="m-0 text-white text-[32px] font-extrabold text-center tracking-[0.2px]">Share Your Experience</h2>
        <p className="mt-3 mb-7 text-white/60 text-[15px] text-center leading-[1.7]">
          Your feedback helps us improve the platform.
        </p>

        <div className="w-[60px] h-[3px] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto mb-7" />

        <p className="w-full text-indigo-200 text-[15px] font-bold mb-3 mt-2">Rating</p>

        <div className="flex justify-center gap-3 mb-7">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={34}
              style={{ color: rating >= star ? "#fbbf24" : "rgba(255,255,255,0.18)", cursor: "pointer", transition: "color 0.15s ease" }}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <p className="w-full text-indigo-200 text-[15px] font-bold mb-3">Message</p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full min-h-[160px] rounded-[16px] border border-indigo-500/[0.22] bg-white/[0.07] text-white p-4 outline-none text-[15px] box-border resize-none leading-[1.7] focus:border-indigo-400/[0.45] transition-all"
          placeholder="Write your feedback..."
        />

        <button
          disabled={disabled}
          onClick={submitfeedback}
          className={`w-full h-[54px] mt-6 rounded-[16px] border-none text-[16px] font-extrabold transition-all ${
            disabled
              ? "bg-white/[0.08] text-white/35 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white cursor-pointer shadow-[0_12px_28px_rgba(99,102,241,0.28)] hover:-translate-y-0.5"
          }`}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};
