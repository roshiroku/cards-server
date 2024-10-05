import mongoose from "mongoose";

const { DB_CONNECTION_STRING } = process.env;

export async function connect() {
  try {
    await mongoose.connect(DB_CONNECTION_STRING);
    /** @todo log success */
  } catch (e) {
    /** @todo log failure */
  }
}
