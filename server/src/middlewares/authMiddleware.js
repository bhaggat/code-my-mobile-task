import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers["x-access-token"];
  console.log("token", token);
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "No token provided!",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};
