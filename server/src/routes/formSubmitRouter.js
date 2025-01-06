import { Router } from "express";

import { restrictUpdateFields } from "../middlewares/restrictFieldsMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createFormSubmit,
  getFormSubmit,
  getFormSubmits,
} from "../controllers/formSubmitController.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import { createFormSubmitValidation } from "../validations/formSubmitValidation.js";

const formSubmitRouter = Router();

formSubmitRouter.use(authMiddleware);

formSubmitRouter.post(
  "",
  restrictUpdateFields,
  validatorMiddleware(createFormSubmitValidation),
  createFormSubmit
);

export default formSubmitRouter;
