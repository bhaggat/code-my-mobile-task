import { Router } from "express";
import {
  createFormSubmit,
  validateRequest,
} from "../controllers/formSubmitController.js";
import { fileUploader } from "../middlewares/fileUploader.js";

const formSubmitRouter = Router();

formSubmitRouter.post("", fileUploader, validateRequest, createFormSubmit);

export default formSubmitRouter;
