import express, { json, urlencoded } from "express";
import helmet from "helmet";
import cors from "cors";
import { sequelize } from "./src/dbs/postgresDb.js";
import { version } from "./src/constants/constants.js";
import rateLimit from "express-rate-limit";
import authRouter from "./src/routes/authRouter.js";
import fieldRouter from "./src/routes/fieldRouter.js";
import { mongooseConnection } from "./src/dbs/mongoDb.js";
import formSubmitRouter from "./src/routes/formSubmitRouter.js";
import fileRouter from "./src/routes/fileRouter.js";
import formRouter from "./src/routes/formRouter.js";

const app = express();
const PORT = process.env.PORT || 8080;
const forceSync = false;

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
  })
);
app.use(cors({ origin: "*" }));
app.use(json());
app.use(urlencoded({ extended: true }));

sequelize.sync({ force: forceSync }).then(() => {
  console.info(`Database sync complete with force: ${forceSync}`);
});

mongooseConnection.once("open", () => {
  console.info("MongoDB connection established successfully");
});

app.get("/version", (req, res) => res.json({ message: version }));

app.use("/auth", authRouter);
app.use("/fields", fieldRouter);
app.use("/form-submits", formSubmitRouter);
app.use("/files", fileRouter);
app.use("/forms", formRouter);

app.listen(PORT, () => {
  console.info(`Server running at http://localhost:${PORT}`, { version });
});
