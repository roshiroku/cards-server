import { Router } from "express";
import { errorBoundary } from "../utils/errorUtils.js";
import Card from "../models/Card.js";
import { validateBizNumber, validateCard } from "../validation/cardsValidation.js";
import auth from "../middleware/authMiddleware.js";
import { isCardOwnerMiddleware as cardOwner, isCardOwnerOrAdminMiddleware as cardOwnerOrAdmin, loadCardMiddleware as loadCard } from "../middleware/cardsMiddleware.js";
import { isBusinessMiddleware as business, isAdminMiddleware as admin } from "../middleware/authorizeMiddleware.js";

const cardsController = Router();

/** @action Get all cards */
cardsController.get("/", errorBoundary(async (_, res) => {
  const cards = await Card.find();
  res.status(200).send(cards);
}));

/** @action Get user cards */
cardsController.get("/my-cards", auth, errorBoundary(async (_, res) => {
  const { _id: user_id } = res.locals.auth;
  const cards = await Card.find({ user_id });
  res.status(200).send(cards);
}));

/** @action Get card */
cardsController.get("/:id", loadCard, errorBoundary(async (_, res) => {
  const card = res.locals.card;
  res.status(200).send(card);
}));

/** @action Create new card */
cardsController.post("/", [auth, business], errorBoundary(async (req, res) => {
  const { _id: user_id } = res.locals.auth;
  const data = validateCard(req.body);
  const card = await Card.create({ ...data, user_id });
  res.status(200).send(card);
}));

/** @action Edit card */
cardsController.put("/:id", [auth, loadCard, cardOwner], errorBoundary(async (req, res) => {
  const { id } = req.params;
  const data = validateCard(req.body);
  const card = await Card.edit(id, data);
  res.status(200).send(card);
}));

/** @action Like card */
cardsController.patch("/:id", [auth, loadCard], errorBoundary(async (_, res) => {
  const { _id } = res.locals.auth;
  const card = await Card.toggleLike(res.locals.card, _id);
  res.status(200).send(card);
}));

/** @action Edit card bizNumber */
cardsController.patch("/:id/biz-number", [auth, admin, loadCard], errorBoundary(async (req, res) => {
  const { id } = req.params;
  const bizNumber = await validateBizNumber(req.body.bizNumber);
  const card = await Card.edit(id, { bizNumber });
  res.status(200).send(card);
}));

/** @action Delete card */
cardsController.delete("/:id", [auth, loadCard, cardOwnerOrAdmin], errorBoundary(async (req, res) => {
  const { id } = req.params;
  const card = await Card.remove(id);
  res.status(200).send(card);
}));

export default cardsController;
