import FormSubmissions from "@/pages/forms/FormSubmissions";
import Fields from "../../../client/src/pages/fields/Fields";
import Forms from "../../../client/src/pages/forms/Forms";
import PublicForm from "../../../client/src/pages/public-form/PublicForm";
import Signin from "../../../client/src/pages/sign-in/Signin";
import Signup from "../../../client/src/pages/sign-up/Signup";

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
