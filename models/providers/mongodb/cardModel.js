import { Schema } from "mongoose";
import model from "./model.js";
import { email, image, number, phone, string, url } from "./schema.js";

const schema = {
  title: string(true),
  subtitle: string(true),
  description: string(true, 1024),
  phone: phone(),
  email: email(),
  web: url(),
  image: image(),
  address: {
    state: string(),
    country: string(true),
    city: string(true),
    street: string(true),
    houseNumber: number(true),
    zip: number(),
  },
  bizNumber: number(true),
  likes: [Schema.Types.ObjectId],
  createdAt: { type: Date, default: Date.now },
  user_id: { type: Schema.Types.ObjectId, required: true },
};

export const { Model, find, findById, add, edit, remove } = model("card", schema);
