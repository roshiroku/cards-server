import { Router } from "express";
import { errorBoundary } from "../utils/errorUtils.js";
import Card from "../models/Card.js";
import { validateCard } from "../validation/cardsValidation.js";
import auth from "../middleware/authMiddleware.js";
import { isCardOwnerMiddleware as cardOwner, isCardOwnerOrAdminMiddleware as cardOwnerOrAdmin, loadCardMiddleware as loadCard } from "../middleware/cardsMiddleware.js";
import { isBusinessMiddleware as business } from "../middleware/authorizeMiddleware.js";

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
cardsController.post("/", business, errorBoundary(async (req, res) => {
  const data = validateCard(req.body);
  const card = await Card.add(data);
  res.status(200).send(card);
}));

/** @action Edit card */
cardsController.put("/:id", [loadCard, cardOwner], errorBoundary(async (req, res) => {
  const { id } = req.params;
  const data = validateCard(req.body);
  const card = await Card.edit(id, data);
  res.status(200).send(card);
}));

/** @action Like card */
cardsController.patch("/:id", [loadCard, auth], errorBoundary(async (_, res) => {
  const { _id } = res.locals.auth;
  const card = await Card.toggleLike(res.locals.card, _id);
  res.status(200).send(card);
}));

/** @action Delete card */
cardsController.delete("/:id", [loadCard, cardOwnerOrAdmin], errorBoundary(async (req, res) => {
  const { id } = req.params;
  const card = await Card.remove(id);
  res.status(200).send(card);
}));

export default cardsController;
