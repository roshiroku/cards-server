import { errorBoundary, errorUnauthorized } from "../utils/errorUtils.js";
import { auth } from "./authMiddleware.js";

export default function authorizeMiddleware(authorize) {
  return errorBoundary(async (req, res, next) => {
    if (!await authorize(req, res)) {
      throw errorUnauthorized();
    }

    next();
  });
}

export const isAdminMiddleware = authorizeMiddleware(isAdmin);

export const isBusinessMiddleware = authorizeMiddleware(isBusiness);

export function isAdmin(req, res) {
  const user = auth(req, res);
  return user?.isAdmin;
}

export function isBusiness(req, res) {
  const user = auth(req, res);
  return user?.isBusiness;
}
