import { Router } from "express";
import { signin, init, signup } from "../controllers/authController.js";
import {
  signinValidation,
  signupValidation,
} from "../validations/authValidation.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post("/init", authMiddleware, init);
authRouter.post("/signin", validatorMiddleware(signinValidation), signin);
authRouter.post("/signup", validatorMiddleware(signupValidation), signup);

export default authRouter;
