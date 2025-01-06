import Joi from "joi";
import { emailSchema } from "./commonSchemas.js";

const submittedDataSchema = Joi.object();

export const createFormSubmitValidation = Joi.object({
  email: emailSchema,
  submittedData: submittedDataSchema.required(),
  formId: Joi.number().required(),
}).unknown();
