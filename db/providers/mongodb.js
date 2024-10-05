import mongoose from "mongoose";
import { error, success } from "../../logging/loggingProvider.js";

const { DB_CONNECTION_STRING } = process.env;

export async function connect() {
  try {
    await mongoose.connect(DB_CONNECTION_STRING);
    success("Connected to MongoDB");
  } catch (e) {
    error(`Could not connect to MongoDB:\n${e.message}`);
  }
}
