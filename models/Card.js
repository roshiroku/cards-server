import { db } from "../config.js";
import * as mongodb from "./providers/mongodb/cardModel.js";

const providers = { mongodb };
const Card = providers[db.provider];

Card.toggleLike = (card, userId) => {
  const { _id, likes } = card;
  const index = likes.indexOf(userId);

  index == -1 ? likes.push(userId) : likes.splice(index, 1);

  return Card.edit(_id, { likes });
};

export default Card;
