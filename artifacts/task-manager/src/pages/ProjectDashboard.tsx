import { useNavigate } from "react-router-dom";
import { FaProjectDiagram, FaArrowLeft } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { FaEye } from "react-icons/fa6";

export const ProjectDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#06070f] flex flex-col justify-center items-center px-5 py-[50px] relative">
      <button
        className="absolute top-6 left-6 w-[46px] h-[46px] rounded-[14px] border border-indigo-500/[0.25] bg-indigo-500/[0.10] text-indigo-300 cursor-pointer flex items-center justify-center transition-all hover:bg-indigo-500/[0.18]"
        onClick={() => navigate("/dashboard")}
      >
        <FaArrowLeft size={17} />
      </button>

      <div className="w-[70px] h-[70px] rounded-full bg-indigo-500/[0.12] border-2 border-indigo-500/[0.24] flex items-center justify-center text-indigo-300 mb-4">
        <FaProjectDiagram size={30} />
      </div>

      <h2 className="m-0 text-white text-[34px] font-extrabold text-center tracking-[-0.2px]">Projects</h2>
      <p className="mt-[10px] mb-9 text-white/55 text-[15px] text-center leading-[1.7]">
        Manage your collaborative projects.
      </p>
      <div className="w-[60px] h-[3px] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto mb-9" />

      <div className="grid gap-5 w-full max-w-[520px]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div
          className="p-[34px_24px] rounded-[24px] bg-white/[0.04] border border-indigo-500/[0.16] cursor-pointer text-center shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-[12px] transition-all hover:bg-indigo-500/[0.07] hover:-translate-y-1 box-border"
          onClick={() => navigate("viewprojects")}
        >
          <div className="w-[58px] h-[58px] rounded-[18px] bg-indigo-500/[0.12] border border-indigo-500/[0.22] flex items-center justify-center mx-auto mb-4">
            <FaEye size={24} className="text-indigo-400" />
          </div>
          <h3 className="m-0 mb-2 text-white text-[18px] font-extrabold">View Projects</h3>
          <p className="m-0 text-white/50 text-[13px] leading-[1.6]">See all your existing projects and their members</p>
        </div>

        <div
          className="p-[34px_24px] rounded-[24px] bg-white/[0.04] border border-indigo-500/[0.16] cursor-pointer text-center shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-[12px] transition-all hover:bg-indigo-500/[0.07] hover:-translate-y-1 box-border"
          onClick={() => navigate("addproject")}
        >
          <div className="w-[58px] h-[58px] rounded-[18px] bg-violet-500/[0.12] border border-violet-500/[0.22] flex items-center justify-center mx-auto mb-4">
            <IoIosAddCircle size={28} className="text-violet-400" />
          </div>
          <h3 className="m-0 mb-2 text-white text-[18px] font-extrabold">Add Project</h3>
          <p className="m-0 text-white/50 text-[13px] leading-[1.6]">Create a new project and invite your team</p>
        </div>
      </div>
    </div>
  );
};
