import Card from "../models/Card.js";
import { errorBoundary, errorNotFound } from "../utils/errorUtils.js";
import { auth } from "./authMiddleware.js";
import authorizeMiddleware, { isAdmin } from "./authorizeMiddleware.js";

export const loadCardMiddleware = errorBoundary(async (req, res, next) => {
  const card = await Card.findById(req.params.id);

  if (!card) {
    throw errorNotFound("Card not found");
  }

  res.locals.card = card;

  next();
});

export const isCardOwnerMiddleware = authorizeMiddleware(isCardOwner);

export const isCardOwnerOrAdminMiddleware = authorizeMiddleware(async (req, res) => isAdmin(req, res) || await isCardOwner(req, res));

export async function isCardOwner(req, res) {
  if (!res.locals.card && req.params.id) {
    res.locals.card = await Card.findById(req.params.id);
  }

  const card = res.locals.card;
  const user = auth(req, res);

  return card && user && card?.user_id == user?._id;
}
