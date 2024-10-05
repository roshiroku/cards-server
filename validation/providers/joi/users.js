import Joi from "joi";
import { email, image, password, phone, number, string, boolean, handleError } from "./schema.js";

export const updateProfileSchema = {
  name: {
    first: string(true),
    middle: string(),
    last: string(true),
  },
  phone: phone(true),
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

export const registerSchema = {
  ...updateProfileSchema,
  email: email(true),
  password: password(true),
  isBusiness: boolean(true),
  isAdmin: boolean(),
};

export const loginSchema = {
  email: email(true),
  password: password(true),
};

export function validateUpdateProfile(input) {
  const { error } = Joi.object(updateProfileSchema).validate(input);
  error && handleError(error.details[0].message);
  return input;
}

export function validateRegister(input) {
  const { error } = Joi.object(registerSchema).validate(input);
  error && handleError(error.details[0].message);
  return input;
}

export function validateLogin(input) {
  const { error } = Joi.object(loginSchema).validate(input);
  error && handleError(error.details[0].message);
  return input;
}
