import { validation } from "../config.js";
import * as joi from "./providers/joi/users.js";

const providers = { joi };
const {
  validateUpdateProfile,
  validateRegister,
  validateLogin,
} = providers[validation.provider];

export {
  validateUpdateProfile,
  validateRegister,
  validateLogin,
};
