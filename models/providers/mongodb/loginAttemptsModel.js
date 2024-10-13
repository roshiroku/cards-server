import model from "./model.js";
import { email, number } from "./schema.js";

const schema = {
  email: email(true),
  count: number(true),
  attemptTime: { type: Date, default: Date.now }
};

export const { Model, count, find, findOne, findById, add, edit, remove } = model("login_attempts", schema);
