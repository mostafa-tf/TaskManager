import { FaArrowLeft } from "react-icons/fa";
import "./WelcomeNavbar.css";
import { useNavigate } from "react-router-dom";
const WelcomeNavbar = ({ page = "welcome" }) => {
  const navigate = useNavigate();
  const buttonstyle = {
    width: "60px",
    height: "60px",
    borderRadius: "30px",
    fontSize: "30px",
    position: "absolute",
    left: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "green",
    border: "3px solid green",
    cursor: "pointer",
  };
  return (
    <>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "90px",
          color: "cyan",
          position: "relative",
          fontSize: "30px",
          backgroundColor: "black",
          borderbottom: "1px solid #222",
        }}
      >
        {page != "welcome" && (
          <button style={buttonstyle} onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
        )}
        Task Manager App
      </nav>
    </>
  );
};
export default WelcomeNavbar;
