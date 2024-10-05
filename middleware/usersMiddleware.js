import User from "../models/User";
import { errorBoundary, errorNotFound } from "../utils/errorUtils";
import { auth } from "./authMiddleware";
import authorizeMiddleware, { isAdmin } from "./authorizeMiddleware";

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
