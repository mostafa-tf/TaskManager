import { useState } from "react";

export const AddFriend = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/friendship/request", { method: "POST", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (res.status !== 200 && res.status !== 201) throw new Error(data.message);
      showMsg(data.message || "Friend request sent!", false); setEmail("");
    } catch (error: any) { showMsg(error.message, true); }
  };

  return (
    <div>
      {message && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`px-7 py-[22px] rounded-[20px] bg-[rgba(15,15,15,0.98)] border font-bold text-base ${isError ? "border-[rgba(255,77,79,0.45)] text-[#ff9c9c]" : "border-[rgba(0,255,140,0.30)] text-[#60ff9c]"}`}>{message}</div>
        </div>
      )}
      <div className="max-w-[460px] p-7 rounded-[20px] bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.10)]">
        <h3 className="text-white font-extrabold mt-0 mb-5">Send Friend Request</h3>
        <form onSubmit={handleSubmit}>
          <label className="block text-[#caffdf] mb-2 text-sm font-bold">Friend&apos;s Email</label>
          <input
            type="email"
            required
            className="w-full h-[46px] rounded-[12px] border border-[rgba(0,255,128,0.20)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] outline-none text-[15px] box-border mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
          />
          <button type="submit" className="w-full h-[46px] rounded-[12px] border-none bg-[linear-gradient(135deg,#00c853,#00e676)] text-[#08110c] text-[15px] font-extrabold cursor-pointer">
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
};
