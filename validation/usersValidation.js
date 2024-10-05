import { validation } from "../config";
import * as joi from "./providers/joi/users";

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
