import { useState, useEffect } from "react";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost:3000/api/users/forgotpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <>
      <div>
        <form onSubmit={handlesubmit}>
          Forgot Your Password{" "}
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            minLength={11}
            maxLength={35}
          />
          <button type="submit">Reset Your Pass</button>
        </form>
      </div>
    </>
  );
};
