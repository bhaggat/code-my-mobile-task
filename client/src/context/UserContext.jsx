import {
  decodeJWT,
  deleteCookie,
  getCookie,
  setCookie,
} from "@/services/utils";
import { authApi, useInitMutation } from "@/store/authApi";
import { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

export const UserContext = createContext({
  isLoading: true,
});

export default function UserProvider({ children }) {
  const [userData, setUserData] = useState({ token: getCookie("token") });
  const dispatch = useDispatch();
  const [init] = useInitMutation();

  useEffect(() => {
    if (userData?.token && !userData?.id) {
      init()
        .unwrap()
        .then((response) => {
          if (response?.data) {
            setUserData({ token: userData.token, ...response.data });
          } else {
            console.error("Invalid userData data");
          }
        });
    }
  }, [userData?.token]);

  function setUser(user) {
    const { token } = user;

    const decodedToken = decodeJWT(token);
    const expiresIn = decodedToken?.exp
      ? decodedToken.exp - Math.floor(Date.now() / 1000)
      : 0;

    console.log("user", user);
    if (expiresIn > 0) {
      setCookie("token", token, expiresIn);
      setUserData(user);
    } else {
      console.error("Invalid token expiration");
    }
  }

  function removeUser() {
    dispatch(authApi.util.resetApiState());

    deleteCookie("token");
    setUserData(null);
  }

  return (
    <UserContext.Provider
      value={{
        isLoading: false,
        token: userData?.token,
        userData,
        setUser,
        removeUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const user = useContext(UserContext);
  return user;
}
