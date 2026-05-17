import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export const UpdateUser = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const showMsg = (msg: string, err: boolean) => { setMessage(msg); setIsError(err); setTimeout(() => setMessage(""), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/updaterole", { method: "PUT", headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ email, role }) });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("User role updated successfully!", false);
    } catch (error: any) { showMsg(error.message, true); }
  };

  const inputClass = "w-full h-12 rounded-xl border border-indigo-500/[0.22] bg-white/[0.07] text-white px-[14px] outline-none text-[15px] box-border";

  return (
    <div className="min-h-screen bg-[#06070f] p-[30px]">
      {message && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`px-7 py-[22px] rounded-[20px] bg-[rgba(10,10,25,0.98)] border font-bold text-base shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${isError ? "border-red-500/[0.40] text-red-300" : "border-emerald-500/[0.35] text-emerald-300"}`}>{message}</div>
        </div>
      )}

      <div className="flex items-center gap-[14px] mb-7">
        <button
          onClick={() => navigate("/admindashboard")}
          className="w-[46px] h-[46px] rounded-[14px] border border-indigo-500/[0.25] bg-indigo-500/[0.10] text-indigo-300 cursor-pointer flex items-center justify-center transition-all hover:bg-indigo-500/[0.18]"
        >
          <FaArrowLeft size={17} />
        </button>
        <h2 className="m-0 text-[28px] font-extrabold text-white">Update User Role</h2>
      </div>

      <div className="max-w-[460px] p-8 rounded-3xl bg-white/[0.04] border border-indigo-500/[0.14]">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-indigo-200 mb-2 text-sm font-bold">User Email</label>
            <input type="email" required className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter user email" />
          </div>
          <div className="mb-5">
            <label className="block text-indigo-200 mb-2 text-sm font-bold">New Role</label>
            <select className={`${inputClass} cursor-pointer`} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full h-[50px] rounded-[14px] border-none bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-base font-extrabold cursor-pointer shadow-[0_12px_28px_rgba(99,102,241,0.28)] transition-all hover:-translate-y-0.5"
          >
            Update Role
          </button>
        </form>
      </div>
    </div>
  );
};
