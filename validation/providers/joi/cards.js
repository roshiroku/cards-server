import Joi from "joi";
import { email, handleError, image, number, phone, string, url } from "./schema.js";

export const cardSchema = {
  title: string(true),
  subtitle: string(true),
  description: string(true, 1024),
  phone: phone(true),
  email: email(true),
  web: url(),
  image: Joi.object(image()).required(),
  address: Joi.object({
    state: string(),
    country: string(true),
    city: string(true),
    street: string(true),
    houseNumber: number(true),
    zip: number(),
  }).required(),
};

export function validateCard(input) {
  const { error } = Joi.object(cardSchema).validate(input);
  error && handleError(error.details[0].message);
  return input;
}
