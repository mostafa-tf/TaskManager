import { useNavigate } from "react-router-dom";
import { FaProjectDiagram, FaArrowLeft } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { FaEye } from "react-icons/fa6";

export const ProjectDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#07110d_0%,#0b1d15_50%,#08110c_100%)] p-[30px]">
      <div className="flex items-center gap-[14px] mb-8">
        <button onClick={() => navigate("/dashboard")} className="w-[46px] h-[46px] rounded-[14px] border border-[rgba(0,255,140,0.2)] bg-[rgba(0,255,140,0.08)] text-[#dffff0] cursor-pointer flex items-center justify-center">
          <FaArrowLeft size={18} />
        </button>
        <div className="w-[52px] h-[52px] rounded-2xl bg-[rgba(0,255,140,0.10)] flex items-center justify-center text-[#dffff0]"><FaProjectDiagram size={24} /></div>
        <div>
          <h2 className="m-0 text-[28px] font-extrabold text-white">Projects</h2>
          <p className="m-0 text-white/65 text-sm">Manage your collaborative projects.</p>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 max-w-[600px]">
        <div
          className="p-[30px] rounded-[22px] bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.12)] cursor-pointer text-center transition-all duration-200 shadow-[0_12px_35px_rgba(0,0,0,0.22)] hover:bg-[rgba(0,255,140,0.06)] hover:-translate-y-1"
          onClick={() => navigate("viewprojects")}
        >
          <FaEye size={36} color="#00e676" />
          <h3 className="text-white font-extrabold mt-[14px] mb-1.5">View Projects</h3>
          <p className="text-white/60 text-sm m-0">See all your existing projects</p>
        </div>
        <div
          className="p-[30px] rounded-[22px] bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,140,0.12)] cursor-pointer text-center transition-all duration-200 shadow-[0_12px_35px_rgba(0,0,0,0.22)] hover:bg-[rgba(0,255,140,0.06)] hover:-translate-y-1"
          onClick={() => navigate("addproject")}
        >
          <IoIosAddCircle size={36} color="#00e676" />
          <h3 className="text-white font-extrabold mt-[14px] mb-1.5">Add Project</h3>
          <p className="text-white/60 text-sm m-0">Create a new project</p>
        </div>
      </div>
    </div>
  );
};
