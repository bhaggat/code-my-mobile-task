import * as yup from "yup";

export const validations = {
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
};
