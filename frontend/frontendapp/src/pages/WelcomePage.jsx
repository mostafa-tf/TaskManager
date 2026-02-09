import WelcomeNavbar from "../components/WelcomeNavbar.jsx";
import tasksimage from "../assets/tasks.png";
import { useNavigate } from "react-router-dom";
function WelcomePage() {
  const navigate = useNavigate();

  const buttonstyle = () => {
    return {
      color: "green",
      backgroundColor: "black",
      width: "120px",
      height: "40px",
      display: "block",

      borderRadius: "20px",
      border: "2px solid green",
      cursor: "pointer",
    };
  };
  return (
    <>
      <div>
        <WelcomeNavbar />
      </div>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",

          minHeight: "calc(100vh - 70px)",
          backgroundImage: `url(${tasksimage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <button style={buttonstyle()} onClick={() => navigate("/login")}>
            Login
          </button>
          <button style={buttonstyle()} onClick={() => navigate("/signup")}>
            SignUp
          </button>
        </div>
      </main>
    </>
  );
}
export default WelcomePage;
