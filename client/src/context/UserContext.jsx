import { createContext, useContext, useState } from "react";

export const UserContext = createContext({
  isLoading: true,
});

export function useUser() {
  const user = useContext(UserContext);
  return user;
}

export default function UserProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  function setUser(user) {
    localStorage.setItem("token", user.token);
    setToken(user.token);
  }
  function removeUser() {
    localStorage.removeItem("token");
    setToken();
  }
  return (
    <UserContext.Provider
      value={{ isLoading: false, token, setUser, removeUser }}
    >
      {children}
    </UserContext.Provider>
  );
}
