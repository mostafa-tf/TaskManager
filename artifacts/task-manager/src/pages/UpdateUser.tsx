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

  const inputClass = "w-full h-12 rounded-[14px] border border-[rgba(0,255,128,0.20)] bg-[rgba(255,255,255,0.07)] text-white px-[14px] outline-none text-[15px] box-border";

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
        <h2 className="m-0 text-[28px] font-extrabold text-white">Update User Role</h2>
      </div>

      <div className="max-w-[460px] p-8 rounded-3xl bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.12)]">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-[#caffdf] mb-2 text-sm font-bold">User Email</label>
            <input type="email" required className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter user email" />
          </div>
          <div className="mb-5">
            <label className="block text-[#caffdf] mb-2 text-sm font-bold">New Role</label>
            <select className={inputClass} value={role} onChange={(e) => setRole(e.target.value)} style={{ backgroundColor: "#0b1a12", colorScheme: "dark" }}>
              <option value="user" style={{ backgroundColor: "#0b1a12", color: "#ffffff" }}>User</option>
              <option value="admin" style={{ backgroundColor: "#0b1a12", color: "#ffffff" }}>Admin</option>
            </select>
          </div>
          <button type="submit" className="w-full h-[50px] rounded-[14px] border-none bg-[linear-gradient(135deg,#00c853,#00e676)] text-[#08110c] text-base font-extrabold cursor-pointer">
            Update Role
          </button>
        </form>
      </div>
    </div>
  );
};
