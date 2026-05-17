import { useNavigate } from "react-router-dom";
import { FaStar, FaArrowLeft } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { useState, useEffect } from "react";

interface FeedbackItem {
  _id: string;
  userId: { username: string; email: string };
  rating: number;
  message: string;
  createdAt: string;
}

export const FeedbacksDashboard = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [searchfilter, setSearchFilter] = useState("");
  const [ratingfilter, setRatingFilter] = useState("");
  const [messageBox, setMessageBox] = useState({ show: false, type: "", title: "", message: "" });
  const navigate = useNavigate();

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

  const filteredfeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.userId.username.toLowerCase().startsWith(searchfilter.trim().toLowerCase()) &&
      feedback.rating.toString().startsWith(ratingfilter),
  );

  const fetchfeedbacks = async () => {
    try {
      const res = await fetch("/api/feedbacks", {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.status === 401) throw new Error(data.message || "You must login first");
      if (res.status === 403) throw new Error(data.message || "Admin only access");
      if (res.status === 404) { setFeedbacks([]); return; }
      if (res.status === 500) throw new Error(data.message || "Server error");
      if (res.status !== 200) throw new Error(data.message || "Something went wrong");
      setFeedbacks(data);
    } catch (error: any) {
      showBox("error", "Fetch Failed", error.message);
    }
  };

  useEffect(() => { fetchfeedbacks(); }, []);

  const isError = messageBox.type === "error";
  const inputClass = "w-full h-[46px] rounded-xl border border-indigo-500/[0.20] bg-white/[0.07] text-white px-[14px] outline-none text-sm box-border";

  return (
    <div className="min-h-screen bg-[#06070f] text-white">
      {messageBox.show && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`w-[min(430px,90%)] p-[22px] rounded-3xl bg-[linear-gradient(135deg,rgba(12,10,30,0.98),rgba(6,7,15,0.98))] shadow-[0_24px_70px_rgba(0,0,0,0.55)] flex items-center gap-[15px] text-white border ${isError ? "border-red-500/[0.40]" : "border-emerald-500/[0.40]"}`}>
            <div className={`min-w-[52px] h-[52px] rounded-[18px] flex items-center justify-center border ${isError ? "bg-red-500/[0.14] border-red-500/[0.25] text-red-400" : "bg-emerald-500/[0.14] border-emerald-500/[0.25] text-emerald-400"}`}>
              {isError ? <MdErrorOutline size={30} /> : <MdCheckCircleOutline size={30} />}
            </div>
            <div>
              <h3 className="m-0 mb-[5px] text-lg font-extrabold">{messageBox.title}</h3>
              <p className="m-0 text-sm leading-[1.5] text-white/65">{messageBox.message}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex items-center justify-center w-full h-[90px] bg-[rgba(5,5,18,0.95)] border-b border-indigo-500/[0.16] relative text-[30px] font-extrabold tracking-[0.4px] shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-[10px]">
        <button
          className="absolute left-6 w-[52px] h-[52px] rounded-full border border-indigo-500/[0.22] bg-white/[0.06] text-indigo-300 cursor-pointer flex items-center justify-center text-[20px] hover:bg-indigo-500/[0.12] transition-all"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft size={20} />
        </button>
        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Feedbacks Dashboard</span>
      </nav>

      <div className="w-[min(1200px,92%)] mx-auto mt-7 p-[22px] rounded-[22px] bg-white/[0.04] border border-indigo-500/[0.12] shadow-[0_18px_40px_rgba(0,0,0,0.22)] grid gap-[18px]"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))" }}
      >
        <div className="flex flex-col gap-2">
          <label className="text-indigo-200 text-[14px] font-bold">Enter Username</label>
          <input type="text" value={searchfilter} onChange={(e) => setSearchFilter(e.target.value)} className={inputClass} placeholder="Search by username" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-indigo-200 text-[14px] font-bold">Search By Rating</label>
          <select value={ratingfilter} onChange={(e) => setRatingFilter(e.target.value)} className={inputClass}>
            <option value="">Filter By Rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
      </div>

      <main className="w-full min-h-[calc(100vh-90px)] flex justify-center items-start px-5 pb-10 pt-7 box-border">
        {filteredfeedbacks.length === 0 ? (
          <h1 className="text-center text-red-400 text-[32px] font-extrabold mt-12">No Feedbacks Found</h1>
        ) : (
          <div className="w-[min(1200px,100%)] overflow-x-auto rounded-[22px] bg-white/[0.04] border border-indigo-500/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.28)] p-[18px] box-border">
            <table className="w-full min-w-[900px] text-center text-[15px] text-white" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr>
                  {["Username","Email","Rating","Description","Feedback Date"].map((h) => (
                    <th key={h} className="px-[14px] py-[18px] bg-indigo-500/[0.10] text-indigo-200 text-[13px] font-extrabold border-b border-white/[0.08] whitespace-nowrap first:rounded-tl-xl last:rounded-tr-xl">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredfeedbacks.map((feedback) => (
                  <tr key={feedback._id} className="hover:bg-indigo-500/[0.04] transition-colors">
                    <td className="px-3 py-4 border-b border-white/[0.06] text-white/85 whitespace-nowrap">{feedback.userId.username}</td>
                    <td className="px-3 py-4 border-b border-white/[0.06] text-white/85 whitespace-nowrap">{feedback.userId.email}</td>
                    <td className="px-3 py-4 border-b border-white/[0.06]">
                      <div className="flex justify-center items-center gap-1">
                        {Array(feedback.rating).fill(null).map((_, index) => (
                          <FaStar key={index} color="#fbbf24" size={14} />
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-4 border-b border-white/[0.06] text-white/85 max-w-[320px] whitespace-normal break-words text-left leading-[1.7]">{feedback.message}</td>
                    <td className="px-3 py-4 border-b border-white/[0.06] text-white/85 whitespace-nowrap">{feedback.createdAt.replace("T"," | ").slice(0,21)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
