import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const WelcomeNavbar = ({ page = "welcome" }: { page?: string }) => {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center justify-center w-full h-[70px] relative bg-[#080b1a] border-b border-indigo-500/[0.18] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {page !== "welcome" && (
        <button
          className="w-[46px] h-[46px] rounded-[14px] absolute left-4 flex items-center justify-center text-indigo-300 border border-indigo-500/[0.30] bg-indigo-500/[0.10] cursor-pointer transition-all hover:bg-indigo-500/[0.18]"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft size={17} />
        </button>
      )}
      <span className="font-extrabold text-2xl sm:text-3xl tracking-wide bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
        TaskFlow
      </span>
    </nav>
  );
};

export default WelcomeNavbar;
