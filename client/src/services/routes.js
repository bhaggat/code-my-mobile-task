import FormSubmissions from "@/pages/forms/FormSubmissions";
import Fields from "../pages/fields/Fields";
import Forms from "../pages/forms/Forms";
import PublicForm from "../pages/public-form/PublicForm";
import Signin from "../pages/sign-in/Signin";
import Signup from "../pages/sign-up/Signup";

export const nonAuthRoutes = [
  { path: "/signin", Component: Signin },
  { path: "/signup", Component: Signup },
];

export const authRoutes = [
  { path: "/", Component: Fields },
  { path: "/forms", Component: Forms },
  { path: "/forms/:id", Component: FormSubmissions },
  { path: "/fields", Component: Fields },
];

export const publicRoutes = [
  { path: "/public/forms/:id", Component: PublicForm },
];
