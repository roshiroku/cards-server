import { db } from "../config.js";
import * as mongodb from "./providers/mongodb/cardModel.js";

const providers = { mongodb };
const { find, findById, add, edit, remove } = providers[db.provider];

export default {
  find,
  findById,
  add,
  edit,
  remove,
  toggleLike(card, userId) {
    const { _id, likes } = card;
    const index = likes.indexOf(userId);

    index == -1 ? likes.push(userId) : likes.splice(index, 1);

    return edit(_id, { likes });
  }
};
