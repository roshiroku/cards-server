import mongoose from "mongoose";
import * as log from "../../logging/loggingProvider.js";

const { DB_CONNECTION_STRING } = process.env;

export async function connect() {
  try {
    await mongoose.connect(DB_CONNECTION_STRING);
    log.success("Connected to MongoDB");
  } catch (e) {
    log.error(`Could not connect to MongoDB:\n${e.message}`);
  }
}
