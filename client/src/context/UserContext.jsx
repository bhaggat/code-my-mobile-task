import {
  decodeJWT,
  deleteCookie,
  getCookie,
  setCookie,
} from "@/services/utils";
import { authApi } from "@/store/authApi";
import { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

export const UserContext = createContext({
  isLoading: true,
});

export default function UserProvider({ children }) {
  const [token, setToken] = useState(getCookie("token"));
  const dispatch = useDispatch();

  function setUser(user) {
    const { token } = user;

    const decodedToken = decodeJWT(token);
    const expiresIn = decodedToken?.exp
      ? decodedToken.exp - Math.floor(Date.now() / 1000)
      : 0;

    if (expiresIn > 0) {
      setCookie("token", token, expiresIn);
      setToken(token);
    } else {
      console.error("Invalid token expiration");
    }
  }

  function removeUser() {
    dispatch(authApi.util.resetApiState());

    deleteCookie("token");
    setToken(null);
  }

  useEffect(() => {
    setToken(getCookie("token"));
  }, []);

  return (
    <UserContext.Provider
      value={{ isLoading: false, token, setUser, removeUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const user = useContext(UserContext);
  return user;
}
