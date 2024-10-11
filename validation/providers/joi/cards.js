import Joi from "joi";
import { email, handleError, image, number, phone, string, url } from "./schema.js";

export const cardSchema = {
  title: string(true),
  subtitle: string(true),
  description: string(true, 1024),
  phone: phone(true),
  email: email(true),
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
};

export const bizNumberSchema = {
  bizNumber: number(true)
};

export function validateCard(input) {
  const { error } = Joi.object(cardSchema).validate(input);
  error && handleError(error.details[0].message);
  return input;
}

export function validateBizNumber(bizNumber) {
  const { error } = Joi.object(bizNumberSchema).validate({ bizNumber });
  error && handleError(error.details[0].message);
  return bizNumber;
}
