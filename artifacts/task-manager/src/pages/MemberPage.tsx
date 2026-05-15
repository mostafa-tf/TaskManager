import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { TaskStructure } from "../components/TaskStructure";

export const MemberPage = () => {
  const { memberid } = useParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [noTasks, setNoTasks] = useState(false);
  const [memberName, setMemberName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemberTasks = async () => {
      try {
        const res = await fetch(`/api/tasks/membertasks/${memberid}`, { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
        const data = await res.json();
        if (res.status === 404) setNoTasks(true);
        else if (res.status === 200) { setTasks(data.tasks || data); setMemberName(data.username || ""); }
      } catch { }
    };
    fetchMemberTasks();
  }, [memberid]);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#07110d_0%,#0b1d15_50%,#08110c_100%)] p-[30px]">
      <div className="flex items-center gap-[14px] mb-7">
        <button onClick={() => navigate(-1)} className="w-[46px] h-[46px] rounded-[14px] border border-[rgba(0,255,140,0.2)] bg-[rgba(0,255,140,0.08)] text-[#dffff0] cursor-pointer flex items-center justify-center">
          <FaArrowLeft size={18} />
        </button>
        <h2 className="m-0 text-[28px] font-extrabold text-white">{memberName ? `${memberName}'s Tasks` : "Member Tasks"}</h2>
      </div>
      {noTasks && <h2 className="text-[#60ff9c] font-extrabold">No Tasks Found</h2>}
      <div className="grid gap-[18px]">
        {tasks.map((task) => (
          <TaskStructure key={task._id} title={task.title} description={task.description} priority={task.priority} completed={task.isDone} isexpired={task.dueDate} completedat={task.completedAt} deletefun={() => {}} onChange={() => {}} taskid={task._id} starthour={task.starthour} endhour={task.endhour} />
        ))}
      </div>
    </div>
  );
};
