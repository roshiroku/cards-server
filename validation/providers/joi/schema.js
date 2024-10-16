import Joi from "joi";
import { createError } from "../../../utils/errorUtils.js";

export function boolean(required = false) {
  const validator = Joi.boolean();
  return required ? validator.required() : validator.allow("");
}

export function number(required = false) {
  const validator = Joi.number();
  return required ? validator.required() : validator.allow("");
}

export function string(required = false, max = 256) {
  const validator = Joi.string().max(max);
  return required ? validator.min(2).required() : validator.allow("");
}

export function object(schema, required = false) {
  const validator = Joi.object(schema);
  return required ? validator.required() : validator;
}

export function phone(required = false) {
  const validator = Joi.string().ruleset
    .regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
    .rule({ message: "invalid phone number" });
  return required ? validator.required() : validator.allow("");
}

export function url(required = false) {
  const validator = Joi.string().ruleset
    .regex(/^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/)
    .rule({ message: "invalid url" });
  return required ? validator.required() : validator.allow("");
}

export function email(required = false) {
  const validator = Joi.string().ruleset
    .pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
    .rule({ message: "invalid email" });
  return required ? validator.required() : validator.allow("");
}

export function password(required = false) {
  const validator = Joi.string().ruleset
    .regex(/((?=.*\d{1})(?=.*[A-Z]{1})(?=.*[a-z]{1})(?=.*[!@#$%^&*-]{1}).{7,20})/)
    .rule({
      message: "password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number and one of the following characters !@#$%^&*-",
    });
  return required ? validator.required() : validator.allow("");
}

export function image(required = false) {
  return { url: url(required), alt: string(required) };
}

export function handleError(message) {
  throw createError({ message, status: 400, validator: "Joi" });
}
