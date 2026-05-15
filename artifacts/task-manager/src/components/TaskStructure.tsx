import { MdDelete } from "react-icons/md";
import { TiPencil } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { IoAlarm } from "react-icons/io5";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

interface TaskStructureProps {
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  isexpired: string;
  completedat: string | null;
  deletefun: () => void;
  onChange: () => void;
  taskid: string;
  starthour: string;
  endhour: string;
}

export const TaskStructure = ({
  title, description, priority, completed, isexpired, completedat,
  deletefun, onChange, taskid, starthour, endhour,
}: TaskStructureProps) => {
  const curtime = new Date();
  let taskdate = new Date(isexpired);
  taskdate.setDate(taskdate.getDate() + 1);

  const expirestime = (curdate: Date, taskdate: Date) => {
    const diff = Math.floor((taskdate.getTime() - curdate.getTime()) / 1000);
    if (diff < 0) return "Expired";
    if (diff < 60) return `${diff} seconds`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days`;
    if (diff < 2419200) return `${Math.floor(diff / 604800)} weeks`;
    return `${Math.floor(diff / 2419200)} months`;
  };

  const navigate = useNavigate();

  const getStatusConfig = () => {
    if (completed) return { label: "Completed", bg: "rgba(0, 200, 83, 0.16)", border: "1px solid rgba(0, 230, 118, 0.25)", color: "#7dffb2" };
    if (curtime > taskdate) return { label: "Expired", bg: "rgba(229, 57, 53, 0.16)", border: "1px solid rgba(255, 82, 82, 0.25)", color: "#ff9c9c" };
    return { label: "Pending", bg: "rgba(255, 193, 7, 0.14)", border: "1px solid rgba(255, 213, 79, 0.24)", color: "#ffe082" };
  };

  const getPriorityConfig = () => {
    if (priority === "high") return { bg: "rgba(229, 57, 53, 0.16)", border: "1px solid rgba(255, 82, 82, 0.25)", color: "#ff9c9c" };
    if (priority === "medium" || priority === "med") return { bg: "rgba(255, 193, 7, 0.14)", border: "1px solid rgba(255, 213, 79, 0.24)", color: "#ffe082" };
    return { bg: "rgba(0, 200, 83, 0.16)", border: "1px solid rgba(0, 230, 118, 0.25)", color: "#7dffb2" };
  };

  const statusConfig = getStatusConfig();
  const priorityConfig = getPriorityConfig();

  const cardStyle: React.CSSProperties = {
    width: "100%", borderRadius: "24px",
    background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
    border: "1px solid rgba(0,255,140,0.12)", boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
    backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    padding: "22px", boxSizing: "border-box", position: "relative", overflow: "hidden",
  };

  const topAccent: React.CSSProperties = {
    position: "absolute", top: 0, left: 0, right: 0, height: "4px",
    background: completed
      ? "linear-gradient(90deg, #00c853, #00e676)"
      : curtime > taskdate
        ? "linear-gradient(90deg, #c62828, #e53935)"
        : "linear-gradient(90deg, #ef6c00, #ffd54f)",
  };

  const topRow: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", marginBottom: "18px" };
  const titleSection: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "10px", flex: 1, minWidth: 0 };
  const titleStyle: React.CSSProperties = { margin: 0, fontSize: "24px", fontWeight: "800", color: "#ffffff", lineHeight: "1.3", wordBreak: "break-word" };
  const badgesRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" };
  const badgeBase: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: "800", letterSpacing: "0.2px" };
  const actionsRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: "10px" };
  const iconButton: React.CSSProperties = { width: "42px", height: "42px", borderRadius: "12px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 8px 20px rgba(0,0,0,0.18)" };
  const contentGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "18px" };
  const sectionCard: React.CSSProperties = { borderRadius: "18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", padding: "16px", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { margin: 0, marginBottom: "8px", color: "rgba(255,255,255,0.62)", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px" };
  const valueStyle: React.CSSProperties = { margin: 0, color: "#ffffff", fontSize: "16px", lineHeight: "1.8", wordBreak: "break-word" };
  const bottomRow: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", marginTop: "18px" };
  const timeBlock: React.CSSProperties = { display: "flex", alignItems: "center", gap: "10px", color: "#dffff0", fontWeight: "700", fontSize: "15px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.10)", padding: "10px 14px", borderRadius: "14px" };
  const statusText: React.CSSProperties = { margin: 0, fontSize: "14px", fontWeight: "700", lineHeight: "1.7" };
  const checkboxWrap: React.CSSProperties = { display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,140,0.10)", padding: "10px 14px", borderRadius: "14px" };
  const checkboxstyle: React.CSSProperties = { width: "20px", height: "20px", accentColor: "#00e676", cursor: "pointer" };

  return (
    <div style={cardStyle}>
      <div style={topAccent} />
      <div style={topRow}>
        <div style={titleSection}>
          <h3 style={titleStyle}>{title}</h3>
          <div style={badgesRow}>
            <span style={{ ...badgeBase, background: statusConfig.bg, border: statusConfig.border, color: statusConfig.color }}>{statusConfig.label}</span>
            <span style={{ ...badgeBase, background: priorityConfig.bg, border: priorityConfig.border, color: priorityConfig.color }}>{priority}</span>
          </div>
        </div>
        <div style={actionsRow}>
          <button style={{ ...iconButton, background: "linear-gradient(135deg, #1565c0, #1e88e5)", color: "#ffffff" }}
            onClick={() => { localStorage.setItem("taskid", taskid); navigate("/dashboard/edittask"); }}>
            <TiPencil />
          </button>
          <button style={{ ...iconButton, background: "linear-gradient(135deg, #c62828, #e53935)", color: "#ffffff" }} onClick={deletefun}>
            <MdDelete />
          </button>
        </div>
      </div>
      <div style={contentGrid}>
        <div style={sectionCard}>
          <p style={labelStyle}>Description</p>
          <p style={valueStyle}>{description || "No description provided"}</p>
        </div>
        <div style={sectionCard}>
          <p style={labelStyle}>Due Date</p>
          <p style={valueStyle}>{isexpired?.slice(0, 10)}</p>
        </div>
      </div>
      <div style={bottomRow}>
        <div style={timeBlock}>
          <IoAlarm size={18} />
          <span>{starthour} - {endhour}</span>
        </div>
        <div style={{ flex: 1, minWidth: "220px" }}>
          {completed && completedat && (
            <p style={{ ...statusText, color: "#7dffb2" }}>Completed At: {completedat.slice(0, 19).replace("T", " ")}</p>
          )}
          {taskdate < curtime && !completed ? <p style={{ ...statusText, color: "#ff9c9c" }}>Expired</p> : ""}
          {taskdate > curtime && !completed ? (
            <p style={{ ...statusText, color: "#ffe082" }}>Expires In {expirestime(curtime, taskdate)} ({isexpired.slice(0, 10)})</p>
          ) : ""}
        </div>
        <div style={checkboxWrap}>
          {completed ? <FaCheckCircle color="#00e676" size={18} /> : <FaRegCircle color="#dffff0" size={18} />}
          <input type="checkbox" onChange={onChange} style={checkboxstyle} checked={completed} />
        </div>
      </div>
    </div>
  );
};
