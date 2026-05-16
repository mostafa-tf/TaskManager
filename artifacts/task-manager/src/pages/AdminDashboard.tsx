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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "44px",
    borderRadius: "12px",
    border: "1px solid rgba(0,255,140,0.20)",
    background: "rgba(255,255,255,0.07)",
    color: "#ffffff",
    padding: "0 14px",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  const readonlyStyle: React.CSSProperties = {
    ...inputStyle,
    color: "rgba(255,255,255,0.55)",
    cursor: "not-allowed",
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#07110d_0%,#0b1d15_50%,#08110c_100%)] p-[30px]">
      {message && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`px-7 py-[22px] rounded-[20px] bg-[rgba(15,15,15,0.98)] border font-bold text-base ${isError ? "border-[rgba(255,77,79,0.45)] text-[#ff9c9c]" : "border-[rgba(0,255,140,0.30)] text-[#60ff9c]"}`}>
            {message}
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9998]" onClick={closeEdit}>
          <div
            className="w-[min(460px,92%)] rounded-[24px] bg-[rgba(10,20,15,0.98)] border border-[rgba(0,255,140,0.18)] p-7 shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="m-0 mb-5 text-white text-[20px] font-extrabold">Update User</h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-[#caffdf] mb-1.5 text-sm font-bold">Username</label>
                <input type="text" value={editingUser.username} readOnly style={readonlyStyle} />
              </div>
              <div className="mb-4">
                <label className="block text-[#caffdf] mb-1.5 text-sm font-bold">Email</label>
                <input type="email" value={editingUser.email} readOnly style={readonlyStyle} />
              </div>
              <div className="mb-6">
                <label className="block text-[#caffdf] mb-1.5 text-sm font-bold">Role</label>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="flex-1 h-[46px] rounded-[12px] border border-[rgba(255,255,255,0.12)] bg-transparent text-white/70 text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-[46px] rounded-[12px] border-none bg-[linear-gradient(135deg,#00c853,#00e676)] text-[#08110c] text-sm font-extrabold cursor-pointer"
                >
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
          className="w-[46px] h-[46px] rounded-[14px] border border-[rgba(0,255,140,0.2)] bg-[rgba(0,255,140,0.08)] text-[#dffff0] cursor-pointer flex items-center justify-center"
        >
          <FaArrowLeft size={18} />
        </button>
        <div className="w-[52px] h-[52px] rounded-2xl bg-[rgba(0,255,140,0.10)] flex items-center justify-center text-[#dffff0]">
          <FaUsers size={26} />
        </div>
        <div>
          <h2 className="m-0 text-[28px] font-extrabold text-white">Admin Dashboard</h2>
          <p className="m-0 text-white/65 text-sm">Manage all users and their accounts.</p>
        </div>
        <div className="ml-auto">
          <button
            className="h-9 px-3 rounded-[10px] border-none bg-[linear-gradient(135deg,#1565c0,#1e88e5)] text-white text-sm font-bold cursor-pointer flex items-center gap-1.5"
            onClick={() => navigate("feedbacks")}
          >
            View Feedbacks
          </button>
        </div>
      </div>

      {noUsers && <h1 className="text-[#60ff9c] text-center text-[30px] font-extrabold">No Users Found</h1>}

      {users.length > 0 && (
        <div className="rounded-[20px] bg-[rgba(255,255,255,0.04)] border border-[rgba(0,255,140,0.10)] p-4 overflow-x-auto">
          <div className="grid grid-cols-[1fr_1fr_1fr_120px] gap-3 px-5 py-2.5 mb-2">
            {["Username", "Email", "Role", "Actions"].map((h) => (
              <span key={h} className="text-white/50 text-xs font-extrabold uppercase tracking-[0.8px]">{h}</span>
            ))}
          </div>
          {users.map((user) => (
            <div key={user._id} className="grid grid-cols-[1fr_1fr_1fr_120px] gap-3 items-center px-5 py-4 rounded-[14px] bg-[rgba(255,255,255,0.04)] border border-[rgba(0,255,140,0.08)] mb-2.5">
              <span className="text-white/90 text-sm font-semibold break-all">{user.username}</span>
              <span className="text-white/90 text-sm font-semibold break-all">{user.email}</span>
              <span className={`text-sm font-semibold ${user.role === "admin" ? "text-[#ffe082]" : "text-[#dffff0]"}`}>{user.role}</span>
              <div className="flex gap-2">
                <button
                  className="h-9 px-3 rounded-[10px] border-none bg-[linear-gradient(135deg,#c62828,#e53935)] text-white text-sm font-bold cursor-pointer flex items-center gap-1.5"
                  onClick={() => deleteUser(user._id)}
                >
                  <MdDelete size={16} />
                </button>
                <button
                  className="h-9 px-3 rounded-[10px] border-none bg-[linear-gradient(135deg,#00796b,#00bfa5)] text-white text-sm font-bold cursor-pointer flex items-center gap-1.5"
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
