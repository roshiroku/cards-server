import { errorBoundary, errorUnauthorized } from "../utils/errorUtils.js";
import { auth } from "./authMiddleware.js";

export default function authorizeMiddleware(authorize) {
  return errorBoundary(async (req, res) => {
    if (!await authorize(req, res)) {
      throw errorUnauthorized();
    }
  });
}

export const isAdminMiddleware = authorizeMiddleware(isAdmin);

export const isBusinessMiddleware = authorizeMiddleware(isBusiness);

export async function isAdmin(req, res) {
  const user = await auth(req, res);
  return user?.isAdmin;
}

export async function isBusiness(req, res) {
  const user = await auth(req, res);
  return user?.isBusiness;
}
