import User from "../models/User.js";
import { errorBoundary, errorNotFound } from "../utils/errorUtils.js";
import { auth } from "./authMiddleware.js";
import authorizeMiddleware, { isAdmin } from "./authorizeMiddleware.js";

export const loadUserMiddleware = errorBoundary(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw errorNotFound("User not found");
  }

  res.locals.user = user;
});

export const isProfileOwnerMiddleware = authorizeMiddleware(isProfileOwner);

export const isProfileOwnerOrAdminMiddleware = authorizeMiddleware((req, res) => isProfileOwner(req, res) || isAdmin(req, res));

export function isProfileOwner(req, res) {
  const { id } = req.params;
  const user = auth(req, res);
  return id && id == user?._id;
}
