import { cards as cardsConfig, db } from "../config.js";
import { randomInt } from "../utils/randomUtils.js";
import * as mongodb from "./providers/mongodb/cardModel.js";

const providers = { mongodb };
const { count, find, findOne, findById, add, edit, remove } = providers[db.provider];
const { minBizNumber, maxBizNumber, defaultImage } = cardsConfig;

export default {
  count,
  find,
  findOne,
  findById,
  add,
  edit,
  remove,
  async create(data) {
    const card = await add({
      ...data,
      image: {
        url: data.image?.url || defaultImage,
        alt: data.image?.alt || data.title,
      },
      bizNumber: await generateBizNumber(),
    });

    return card;
  },
  toggleLike(card, userId) {
    const { _id, likes } = card;
    const index = likes.indexOf(userId);

    index == -1 ? likes.push(userId) : likes.splice(index, 1);

    return edit(_id, { likes });
  }
};

async function generateBizNumber() {
  let bizNumber;
  let card;

  do {
    bizNumber = randomInt(minBizNumber, maxBizNumber + 1);
    card = await findOne({ bizNumber });
  } while (card);

  return bizNumber;
}
