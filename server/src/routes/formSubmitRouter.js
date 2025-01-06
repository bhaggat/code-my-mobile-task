import { Router } from "express";

import { restrictUpdateFields } from "../middlewares/restrictFieldsMiddleware.js";
import { createFormSubmit } from "../controllers/formSubmitController.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import { createFormSubmitValidation } from "../validations/formSubmitValidation.js";
import { fileUploader } from "../middlewares/fileUploader.js";

const formSubmitRouter = Router();

formSubmitRouter.post("", restrictUpdateFields, fileUploader, createFormSubmit);
export default formSubmitRouter;
