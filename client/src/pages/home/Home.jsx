import React from "react";
import { useUser } from "../../context/UserContext";

const Home = () => {
  const { removeUser } = useUser();
  const handleLogout = () => {
    removeUser({ token: "test" });
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
