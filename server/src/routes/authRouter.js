import { Router } from "express";
import { signin, signup } from "../controllers/authController.js";
import {
  signinValidation,
  signupValidation,
} from "../validations/authValidation.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";

const authRouter = Router();

authRouter.post("/signin", validatorMiddleware(signinValidation), signin);
authRouter.post("/signup", validatorMiddleware(signupValidation), signup);

export default authRouter;
