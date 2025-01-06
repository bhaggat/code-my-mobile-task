import Joi from "joi";
import { booleanSchema, metaSchema } from "./commonSchemas.js";

const buttonSchema = Joi.object();
const titleSchema = Joi.string().min(3).max(100);
const descriptionSchema = Joi.string().optional();

export const createFormValidation = Joi.object({
  title: titleSchema.required(),
  description: descriptionSchema,
  isEnabled: booleanSchema.optional(),
  buttons: buttonSchema.required(),
  meta: metaSchema,
});

export const updateFormValidation = Joi.object({
  title: titleSchema.optional(),
  description: descriptionSchema,
  isEnabled: booleanSchema.optional(),
  buttons: buttonSchema.optional(),
  meta: metaSchema,
}).min(1);
