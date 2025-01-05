import mongoose from "mongoose";

export const mongooseConnection = mongoose.createConnection(
  process.env.MONGO_DB_CONNECTION
);
