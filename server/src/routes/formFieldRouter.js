import { Router } from "express";
import { updateForm } from "../controllers/formFieldController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictUpdateFields } from "../middlewares/restrictFieldsMiddleware.js";

const formFieldRouter = Router();

formFieldRouter.use(authMiddleware);

formFieldRouter.patch("/:id", restrictUpdateFields, updateForm);

export default formFieldRouter;
