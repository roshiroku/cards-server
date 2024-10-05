import model from "./model.js";
import { boolean, email, image, number, phone, string } from "./schema.js";

const schema = {
  name: {
    first: string(true),
    middle: string(),
    last: string(true),
  },
  phone: phone(true),
  email: email(true),
  password: string(true),
  image: image(),
  address: {
    state: string(),
    country: string(true),
    city: string(true),
    street: string(true),
    houseNumber: number(true),
    zip: number(),
  },
  isAdmin: boolean(),
  isBusiness: boolean(),
  createdAt: { type: Date, default: Date.now },
};

export const { Model, count, find, findOne, findById, add, edit, remove } = model("user", schema);
