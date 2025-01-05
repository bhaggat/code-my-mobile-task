import React from "react";
import { useUser } from "../../context/UserContext";

const Signin = () => {
  const { setUser } = useUser();
  const handleLogin = () => {
    setUser({ token: "test" });
  };

  return (
    <div>
      <h1>Signin Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Signin;
