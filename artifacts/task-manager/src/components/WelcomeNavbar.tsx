import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const WelcomeNavbar = ({ page = "welcome" }: { page?: string }) => {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center justify-center w-full h-[70px] text-[#00e676] relative text-2xl sm:text-3xl bg-[#07110d] border-b border-[#1a2e22]">
      {page !== "welcome" && (
        <button
          className="w-[50px] h-[50px] rounded-full text-2xl absolute left-4 flex items-center justify-center text-[#00e676] border-2 border-[#00e676] cursor-pointer bg-transparent"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
        </button>
      )}
      <span className="font-extrabold tracking-wide">TaskFlow</span>
    </nav>
  );
};

export default WelcomeNavbar;
