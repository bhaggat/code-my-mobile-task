import Joi from "joi";

export const emailSchema = Joi.string().email().lowercase().required();
export const passwordSchema = Joi.string().min(5).required();
export const nameSchema = Joi.string().min(2).max(50).required();
export const metaSchema = Joi.object().optional();
export const booleanSchema = Joi.boolean();
