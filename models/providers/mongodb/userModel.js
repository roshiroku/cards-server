import { auth } from "../../../config.js";
import model from "./model.js";
import { boolean, email, image, number, phone, string } from "./schema.js";

function required() {
  for (const provider of auth.providers || []) {
    if (this[`${provider}Id`]) {
      return false;
    }
  }

  return true;
}

const schema = {
  name: {
    first: string(true),
    middle: string(),
    last: string(true),
  },
  phone: phone(required),
  email: email(true),
  password: string(required),
  image: image(),
  googleId: { ...string(), unique: true, sparse: true },
  address: {
    state: string(),
    country: string(required),
    city: string(required),
    street: string(required),
    houseNumber: number(required),
    zip: number(),
  },
  isAdmin: boolean(),
  isBusiness: boolean(),
  createdAt: { type: Date, default: Date.now },
};

export const { Model, count, find, findOne, findById, add, edit, remove } = model("user", schema);
