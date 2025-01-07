import jwt from "jsonwebtoken";
import { hashSync, compareSync } from "bcrypt";
import User from "../models/User.js";
import { jwtAlgorithm, jwtExpirationTime } from "../constants/constants.js";

export async function signup(req, res) {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists!" });
    }

    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashSync(req.body.password, 8),
    });
    res
      .status(201)
      .json({ success: true, message: "User registered successfully!" });
  } catch (err) {
    next(err);
  }
}
export async function signin(req, res, next) {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const passwordIsValid = compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      algorithm: jwtAlgorithm,
      allowInsecureKeySizes: true,
      expiresIn: jwtExpirationTime,
    });

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: token,
      },
    });
  } catch (err) {
    console.error("Signin Error:", err);
    next(err);
  }
}
export async function init(req, res, next) {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Init Error:", err);
    next(err);
  }
}
