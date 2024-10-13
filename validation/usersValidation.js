import { validation } from "../config.js";

const {
  validateUpdateProfile,
  validateRegister,
  validateLogin
} = await import(`./providers/${validation.provider}/users.js`);

export {
  validateUpdateProfile,
  validateRegister,
  validateLogin
};
