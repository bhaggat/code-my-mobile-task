import { Router } from "express";
import {
  createField,
  deleteField,
  getField,
  getFields,
  updateField,
} from "../controllers/fieldController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictUpdateFields } from "../middlewares/restrictFieldsMiddleware.js";
import { fileUploader } from "../middlewares/fileUploader.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import {
  createFieldValidation,
  updateFieldValidation,
} from "../validations/fieldValidation.js";

const fieldRouter = Router();

fieldRouter.use(authMiddleware);

fieldRouter.get("", getFields);
fieldRouter.get("/:id", getField);
fieldRouter.post(
  "",
  restrictUpdateFields,
  validatorMiddleware(createFieldValidation),
  fileUploader,
  createField
);
fieldRouter.patch(
  "/:id",
  restrictUpdateFields,
  validatorMiddleware(updateFieldValidation),
  fileUploader,
  updateField
);
fieldRouter.delete("", deleteField);

export default fieldRouter;
