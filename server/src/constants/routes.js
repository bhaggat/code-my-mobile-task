import Fields from "../../../client/src/pages/fields/Fields";
import Forms from "../../../client/src/pages/forms/Forms";
import Home from "../../../client/src/pages/home/Home";
import PublicForm from "../../../client/src/pages/public-form/PublicForm";
import Signin from "../../../client/src/pages/sign-in/Signin";
import Signup from "../../../client/src/pages/sign-up/Signup";

export const nonAuthRoutes = [
  { path: "/signin", Component: Signin },
  { path: "/signup", Component: Signup },
];

export const authRoutes = [
  { path: "/", Component: Home },
  { path: "/home", Component: Home },
  { path: "/forms", Component: Forms },
  { path: "/fields", Component: Fields },
];

export const publicRoutes = [{ path: "/public/forms", Component: PublicForm }];
