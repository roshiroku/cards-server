import { cards as cardsConfig, db } from "../config.js";
import { randomInt } from "../utils/randomUtils.js";

const { count, find, findOne, findById, add, edit, remove } = await import(`./providers/${db.provider}/cardModel.js`);
const { minBizNumber, maxBizNumber } = cardsConfig;

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
      bizNumber: await generateBizNumber(),
    });

    return card;
  },
  toggleLike(card, userId) {
    const { _id, likes } = card;
    const index = likes.findIndex(id => `${id}` == `${userId}`);

    index == -1 ? likes.push(userId) : likes.splice(index, 1);

    return edit(_id, { likes });
  }
};

export async function generateBizNumber() {
  let bizNumber;
  let card;

  do {
    bizNumber = randomInt(minBizNumber, maxBizNumber + 1);
    card = await findOne({ bizNumber });
  } while (card);

  return bizNumber;
}
