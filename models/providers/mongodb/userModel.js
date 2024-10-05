import { Schema } from "mongoose";
import model from "./model.js";
import { email, image, number, phone, string } from "./schema.js";

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
};

export const { Model, find, findById, add, edit, remove } = model("user", schema);
