import Card from "../models/Card.js";
import { errorBoundary, errorNotFound } from "../utils/errorUtils.js";
import { auth } from "./authMiddleware.js";
import authorizeMiddleware, { isAdmin } from "./authorizeMiddleware.js";

export const loadCardMiddleware = errorBoundary(async (req, res) => {
  if (!await getCard(req, res)) {
    throw errorNotFound("Card not found");
  }
});

export const isCardOwnerMiddleware = authorizeMiddleware(isCardOwner);

export const isCardOwnerOrAdminMiddleware = authorizeMiddleware(async (req, res) => await isAdmin(req, res) || await isCardOwner(req, res));

export async function getCard(req, res) {
  if (!res.locals.card && req.params.id) {
    res.locals.card = await Card.findById(req.params.id);
  }

  return res.locals.card;
}

export async function isCardOwner(req, res) {
  const card = await getCard(req, res);
  const user = await auth(req, res);
  
  return card && user && `${card?.user_id}` == `${user?._id}`;
}
