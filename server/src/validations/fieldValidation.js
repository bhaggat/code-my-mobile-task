import Joi from "joi";
import { booleanSchema, metaSchema, nameSchema } from "./commonSchemas.js";

const fieldTypeSchema = Joi.string().valid("text", "number", "boolean");

export const createFieldValidation = Joi.object({
  name: nameSchema,
  fieldType: fieldTypeSchema.required(),
  isEnabled: booleanSchema.optional(),
  meta: metaSchema,
});

export const updateFieldValidation = Joi.object({
  name: nameSchema.optional(),
  fieldType: fieldTypeSchema.optional(),
  isEnabled: booleanSchema.optional(),
  meta: metaSchema.optional(),
}).min(1);
