import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
export const ResetPassword = () => {
  const navigate = useNavigate("/login");
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();

  const handlesubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/api/users/resetpassword", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `${searchParams.get("token")}`,
      },
      body: JSON.stringify({ password }),
    });
    if (res.status != 200) {
      const data = await res.json();
      alert("failed :" + data.message);
    } else {
      alert("updated succefully ");
      navigate("/login");
    }
  };
  return (
    <>
      <div>
        Enter Your New Password
        <form onSubmit={handlesubmit}>
          <input
            type="password"
            required
            minLength={5}
            maxLength={15}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Reset</button>
        </form>
      </div>
    </>
  );
};
