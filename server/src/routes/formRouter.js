import { Router } from "express";
import {
  createForm,
  deleteForm,
  getForm,
  getFormByPublicId,
  getForms,
  updateForm,
} from "../controllers/formController.js";
import { restrictUpdateFields } from "../middlewares/restrictFieldsMiddleware.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import {
  createFormValidation,
  updateFormValidation,
} from "../validations/formValidation.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const formRouter = Router();

formRouter.get("/public/:publicId", getFormByPublicId);
formRouter.use(authMiddleware);

formRouter.get("", getForms);
formRouter.get("/:id", getForm);
formRouter.post(
  "",
  restrictUpdateFields,
  validatorMiddleware(createFormValidation),
  createForm
);
formRouter.patch(
  "/:id",
  restrictUpdateFields,
  validatorMiddleware(updateFormValidation),
  updateForm
);
formRouter.delete("", deleteForm);

export default formRouter;
