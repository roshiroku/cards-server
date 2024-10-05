import { errorBoundary, errorUnauthorized } from "../utils/errorUtils";
import { auth } from "./authMiddleware";

export default function authorizeMiddleware(authorize) {
  return errorBoundary(async (req, res) => {
    if (!await authorize(req, res)) {
      throw errorUnauthorized();
    }
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
