import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaArrowLeft, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  isbanned: boolean;
  createdAt: string;
}

export const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [noUsers, setNoUsers] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState("user");
  const navigate = useNavigate();

  const showMsg = (msg: string, err: boolean) => {
    setMessage(msg);
    setIsError(err);
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchUsers = async () => {
    setNoUsers(false);
    setUsers([]);
    try {
      const res = await fetch("/api/users/allusers", {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.status === 404) setNoUsers(true);
      else if (res.status === 200) setUsers(data);
      else throw new Error(data.message);
    } catch (error: any) {
      showMsg(error.message, true);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async (userid: string) => {
    try {
      const res = await fetch(`/api/users/${userid}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("User deleted successfully!", false);
      await fetchUsers();
    } catch (error: any) {
      showMsg(error.message, true);
    }
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setEditRole(user.role);
  };

  const closeEdit = () => {
    setEditingUser(null);
    setEditRole("user");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const res = await fetch("/api/users/updaterole", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email: editingUser.email, role: editRole }),
      });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.message);
      showMsg("User role updated successfully!", false);
      closeEdit();
      await fetchUsers();
    } catch (error: any) {
      showMsg(error.message, true);
    }
  };

  const inputClass = "w-full h-11 rounded-xl border border-indigo-500/[0.22] bg-white/[0.07] text-white px-[14px] outline-none text-[15px] box-border";
  const readonlyClass = `${inputClass} text-white/45 cursor-not-allowed border-white/[0.08] bg-white/[0.03]`;

  return (
    <div className="min-h-screen bg-[#06070f] p-[30px]">
      {message && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`px-7 py-[22px] rounded-[20px] bg-[rgba(10,10,25,0.98)] border font-bold text-base shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${isError ? "border-red-500/[0.40] text-red-300" : "border-emerald-500/[0.35] text-emerald-300"}`}>
            {message}
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-[9998]" onClick={closeEdit}>
          <div
            className="w-[min(460px,92%)] rounded-[24px] bg-[#0a0b1e] border border-indigo-500/[0.22] p-7 shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="m-0 mb-5 text-white text-[20px] font-extrabold">Update User</h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-indigo-200 mb-1.5 text-sm font-bold">Username</label>
                <input type="text" value={editingUser.username} readOnly className={readonlyClass} />
              </div>
              <div className="mb-4">
                <label className="block text-indigo-200 mb-1.5 text-sm font-bold">Email</label>
                <input type="email" value={editingUser.email} readOnly className={readonlyClass} />
              </div>
              <div className="mb-6">
                <label className="block text-indigo-200 mb-1.5 text-sm font-bold">Role</label>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className={`${inputClass} cursor-pointer`}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={closeEdit} className="flex-1 h-11 rounded-[12px] border border-white/[0.12] bg-transparent text-white/65 text-sm font-bold cursor-pointer hover:bg-white/[0.06] transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 h-11 rounded-[12px] border-none bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-extrabold cursor-pointer shadow-[0_8px_20px_rgba(99,102,241,0.28)] transition-all hover:-translate-y-0.5">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-[14px] mb-7">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-[46px] h-[46px] rounded-[14px] border border-indigo-500/[0.25] bg-indigo-500/[0.10] text-indigo-300 cursor-pointer flex items-center justify-center transition-all hover:bg-indigo-500/[0.18]"
        >
          <FaArrowLeft size={17} />
        </button>
        <div className="w-[52px] h-[52px] rounded-2xl bg-indigo-500/[0.12] border border-indigo-500/[0.22] flex items-center justify-center text-indigo-300">
          <FaUsers size={22} />
        </div>
        <div>
          <h2 className="m-0 text-[28px] font-extrabold text-white">Admin Dashboard</h2>
          <p className="m-0 text-white/50 text-sm">Manage all users and their accounts.</p>
        </div>
        <div className="ml-auto">
          <button
            className="h-9 px-4 rounded-[10px] border-none bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold cursor-pointer flex items-center gap-1.5 shadow-[0_6px_16px_rgba(99,102,241,0.28)] transition-all hover:-translate-y-0.5"
            onClick={() => navigate("feedbacks")}
          >
            View Feedbacks
          </button>
        </div>
      </div>

      {noUsers && <h1 className="text-indigo-400 text-center text-[28px] font-extrabold">No Users Found</h1>}

      {users.length > 0 && (
        <div className="rounded-[20px] bg-white/[0.04] border border-indigo-500/[0.12] p-4 overflow-x-auto">
          <div className="grid grid-cols-[1fr_1fr_1fr_120px] gap-3 px-5 py-2.5 mb-2 min-w-[500px]">
            {["Username", "Email", "Role", "Actions"].map((h) => (
              <span key={h} className="text-white/40 text-xs font-extrabold uppercase tracking-[0.8px]">{h}</span>
            ))}
          </div>
          {users.map((user) => (
            <div key={user._id} className="grid grid-cols-[1fr_1fr_1fr_120px] gap-3 items-center px-5 py-4 rounded-[14px] bg-white/[0.04] border border-indigo-500/[0.08] mb-2.5 min-w-[500px] transition-all hover:bg-indigo-500/[0.05]">
              <span className="text-white/85 text-sm font-semibold break-all">{user.username}</span>
              <span className="text-white/85 text-sm font-semibold break-all">{user.email}</span>
              <span className={`text-sm font-semibold ${user.role === "admin" ? "text-amber-300" : "text-indigo-300"}`}>{user.role}</span>
              <div className="flex gap-2">
                <button
                  className="h-9 px-3 rounded-[10px] border-none bg-gradient-to-r from-red-700 to-red-500 text-white text-sm font-bold cursor-pointer flex items-center gap-1.5 transition-all hover:-translate-y-0.5"
                  onClick={() => deleteUser(user._id)}
                >
                  <MdDelete size={16} />
                </button>
                <button
                  className="h-9 px-3 rounded-[10px] border-none bg-gradient-to-r from-teal-700 to-teal-500 text-white text-sm font-bold cursor-pointer flex items-center gap-1.5 transition-all hover:-translate-y-0.5"
                  onClick={() => openEdit(user)}
                >
                  <FaEdit size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
