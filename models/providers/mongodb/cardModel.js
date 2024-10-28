import { Schema } from "mongoose";
import model from "./model.js";
import { email, number, phone, string, url } from "./schema.js";
import { cards } from "../../../config.js";

const schema = {
  title: string(true),
  subtitle: string(true),
  description: string(true, 1024),
  phone: phone(),
  email: email(),
  web: url(),
  image: {
    url: {
      ...url(),
      get: v => v || cards.defaultImage
    },
    alt: {
      ...string(),
      get(v) { return v || this.title; }
    }
  },
  address: {
    state: string(),
    country: string(true),
    city: string(true),
    street: string(true),
    houseNumber: number(true),
    zip: number(),
  },
  bizNumber: { ...number(true, cards.maxBizNumber, cards.minBizNumber), unique: true },
  likes: [Schema.Types.ObjectId],
  createdAt: { type: Date, default: Date.now },
  user_id: { type: Schema.Types.ObjectId, required: true },
};

export const { Model, count, find, findOne, findById, add, edit, remove } = model("card", schema);
