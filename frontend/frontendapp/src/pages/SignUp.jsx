import WelcomeNavbar from "../components/WelcomeNavbar.jsx";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
const SignUp = () => {
  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const repasswordRef = useRef(null);
  const [matching, setMatching] = useState(true);
  const [data, setData] = useState({
    email: "",
    username: "",
    password: "",
    repassword: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMatching(true);
    if (data.password != data.repassword) {
      setMatching(false);
      passwordRef.current.style.border = "2px solid red";
      repasswordRef.current.style.border = "2px solid red";
      return;
    }

    const { email, username, password } = data;
    try {
      const res = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await res.json();
      if (res.status != 201) {
        throw new Error(data.message);
      }
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (er) {
      alert("error " + er.message);
    }
  };

  return (
    <>
      <WelcomeNavbar page="signup" />
      <main
        style={{
          width: "100%",
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "20",
            border: "2px solid green",
            width: "400px",
            height: "350px",
          }}
        >
          <h2
            style={{
              color: "green",
              width: "400px",
              border: "1.5px solid green",
              height: "60px",
            }}
          >
            SignUp
          </h2>
          <div
            style={{
              marginTop: "20px",
              fontSize: "17px",
              color: "green",
            }}
          >
            <form onSubmit={handleSubmit}>
              Enter your Email{" "}
              <input
                type="email"
                style={{ borderRadius: "20px", height: "25px" }}
                required
                minLength={11}
                maxLength={35}
                onChange={(e) =>
                  setData((prev) => {
                    return { ...prev, email: e.target.value };
                  })
                }
                value={data.email}
              />
              <br /> Enter your Username{" "}
              <input
                type="text"
                style={{ borderRadius: "20px", height: "25px" }}
                required
                minLength={2}
                maxLength={20}
                onChange={(e) =>
                  setData((prev) => {
                    return { ...prev, username: e.target.value };
                  })
                }
                value={data.username}
              />
              <br />
              Enter your Password{" "}
              <input
                type="password"
                style={{ borderRadius: "20px", height: "25px" }}
                required
                minLength={5}
                maxLength={15}
                ref={passwordRef}
                onChange={(e) =>
                  setData((prev) => {
                    return { ...prev, password: e.target.value };
                  })
                }
                value={data.password}
              />
              <br /> ReEnter your Password{" "}
              <input
                type="password"
                style={{ borderRadius: "20px", height: "25px" }}
                required
                ref={repasswordRef}
                minLength={5}
                maxLength={15}
                onChange={(e) =>
                  setData((prev) => {
                    return { ...prev, repassword: e.target.value };
                  })
                }
                value={data.repassword}
              />
              {!matching && (
                <p style={{ color: "red" }}>
                  Password and Repassword should be match
                </p>
              )}
              <br />
              Already Have An Account ? <Link to="/login">Login</Link>
              <br />
              <button type="submit">SignUp</button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};
export default SignUp;
