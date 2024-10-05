import { Router } from "express";
import User from "../models/User";
import { errorBoundary, errorUnauthenticated } from "../utils/errorUtils";
import { validateLogin, validateRegister, validateUpdateProfile } from "../validation/usersValidation";
import { omit, pick } from "../utils/objectUtils";
import { isAdminMiddleware as admin } from "../middleware/authorizeMiddleware";
import { loadUserMiddleware as loadUser, isProfileOwnerMiddleware as profileOwner, isProfileOwnerOrAdminMiddleware as profileOwnerOrAdmin } from "../middleware/usersMiddleware";

const usersController = Router();

/** @action Register user */
usersController.post("/", errorBoundary(async (req, res) => {
  const data = validateRegister(req.body);
  const user = await User.register(data);
  res.status(200).send(pick(user, ["name", "email", "_id"]));
}));

/** @action Login */
usersController.post("/login", errorBoundary(async (req, res) => {
  const { email, password } = validateLogin(req.body);
  const token = await User.login(email, password);

  if (!token) {
    throw errorUnauthenticated("Invalid email or password");
  }

  res.status(200).send(token);
}));

/** @action Get all users */
usersController.get("/", admin, errorBoundary(async (_, res) => {
  const users = await User.find();
  res.status(200).send(users.map(user => omit(user, ["password"])));
}));

/** @action Get user */
usersController.get("/:id", [loadUser, profileOwnerOrAdmin], errorBoundary(async (_, res) => {
  const user = res.locals.user;
  res.status(200).send(omit(user, ["password"]));
}));

/** @action Edit user */
usersController.put("/:id", [loadUser, profileOwner], errorBoundary(async (req, res) => {
  const { id } = req.params;
  const data = validateUpdateProfile(req.body);
  const user = await User.edit(id, data);
  res.status(200).send(omit(user, ["password"]));
}));

/** @action Change isBusiness status */
usersController.patch("/:id", [loadUser, profileOwner], errorBoundary(async (_, res) => {
  const { _id, isBusiness } = res.locals.user;
  const user = await User.edit(_id, { isBusiness: !isBusiness });
  res.status(200).send(omit(user, ["password"]));
}));

/** @action Delete user */
usersController.delete("/:id", [loadUser, profileOwnerOrAdmin], errorBoundary(async (req, res) => {
  const { id } = req.params;
  const user = await User.remove(id);
  res.status(200).send(omit(user, ["password"]));
}));

export default usersController;
