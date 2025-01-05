import { Router } from "express";
import {
  createForm,
  deleteForm,
  getForm,
  getForms,
  updateForm,
} from "../controllers/formController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { restrictUpdateFields } from "../middlewares/restrictFieldsMiddleware.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import {
  createFormValidation,
  updateFormValidation,
} from "../validations/formValidation.js";

const formRouter = Router();

formRouter.use(authMiddleware);

formRouter.get("/forms", getForms);
formRouter.get("/forms/:id", getForm);
formRouter.post(
  "/forms",
  restrictUpdateFields,
  validatorMiddleware(createFormValidation),
  createForm
);
formRouter.patch(
  "/forms/:id",
  restrictUpdateFields,
  validatorMiddleware(updateFormValidation),
  updateForm
);
formRouter.delete("/forms", deleteForm);

export default formRouter;
