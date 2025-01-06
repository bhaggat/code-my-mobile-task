import { Router } from "express";

import { restrictUpdateFields } from "../middlewares/restrictFieldsMiddleware.js";
import { createFormSubmit } from "../controllers/formSubmitController.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import { createFormSubmitValidation } from "../validations/formSubmitValidation.js";

const formSubmitRouter = Router();

formSubmitRouter.post(
  "",
  restrictUpdateFields,
  validatorMiddleware(createFormSubmitValidation),
  createFormSubmit
);

export default formSubmitRouter;
