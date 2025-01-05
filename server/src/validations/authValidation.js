import Joi from "joi";
import { emailSchema, nameSchema, passwordSchema } from "./commonSchemas.js";

export const signinValidation = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupValidation = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});
