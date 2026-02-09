import { IoPersonSharp } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
export const Profile = () => {
  const [disabled, setDisabled] = useState(true);
  const [counter, setCounter] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [buttontext, setButtonText] = useState("update profile");
  const usernameinput = useRef(null);
  const emailinput = useRef(null);

  const fetchprofile = async () => {
    const result = await fetch("http://localhost:3000/api/users/profile", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (result.status != 200) {
      alert("error in data fetching ");
    } else {
      const userobject = await result.json();
      setUsername(userobject.username);
      setEmail(userobject.email);
    }
  };
  useEffect(() => {
    fetchprofile();
  }, []);
  const handleupdate = async () => {
    if (counter % 2 == 0) {
      setDisabled(false);
      setCounter(counter + 1);
      setButtonText("confirm Update");
    } else {
      setDisabled(true);
      setCounter(counter + 1);
      try {
        const res = await fetch("http://localhost:3000/api/users/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ username, email }),
        });
        if (res.status != 200) {
          const errormessage = await res.json();
          throw new Error(errormessage);
        }
        alert("update sucesfully");
      } catch (error) {
        alert(error.message);
      }
      setButtonText("update profile");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <div>
        <h2>Profile</h2>
        Email{" "}
        <input
          type="email"
          ref={emailinput}
          value={email}
          disabled={disabled}
          onChange={(e) => setEmail(e.target.value)}
          minLength={11}
          maxLength={35}
        />
        <br />
        Username{" "}
        <input
          type="text"
          ref={usernameinput}
          value={username}
          disabled={disabled}
          onChange={(e) => setUsername(e.target.value)}
          minLength={2}
          maxLength={20}
        />
        <button onClick={handleupdate}>{buttontext}</button>
        <br />
      </div>
    </div>
  );
};
