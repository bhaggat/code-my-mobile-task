import React from "react";
import { useUser } from "../../context/UserContext";

const PublicForm = () => {
  const { removeUser, setUser, token } = useUser();
  const toggleLogin = () => {
    if (token) {
      removeUser();
    } else {
      setUser({ token: "test" });
    }
  };
  return (
    <div>
      <h1>PublicForm Page</h1>
      <button onClick={toggleLogin}>{token ? "Logout" : "Signin"}</button>
    </div>
  );
};

export default PublicForm;
