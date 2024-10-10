import { generateToken } from "../auth/authProvider.js";
import { db } from "../config.js";
import { pick } from "../utils/objectUtils.js";
import Card from "./Card.js";
import * as mongodb from "./providers/mongodb/userModel.js";
import bcryptjs from "bcryptjs";

const providers = { mongodb };
const { count, find, findOne, findById, add, edit, remove } = providers[db.provider];

export default {
  count,
  find,
  findOne,
  findById,
  add,
  edit,
  async remove(id) {
    const user = await remove(id);
    const likedCards = await Card.find({ likes: id });
    const cards = await Card.find({ user_id: id });

    await Promise.all(likedCards.map(card => {
      card.likes = card.likes.filter(userId => userId != id);
      return Card.edit(card._id, { likes: card.likes });
    }));

    await Promise.all(cards.map(({ _id }) => Card.remove(_id)));

    return user;
  },
  async register({ password, ...data }) {
    data.password = await bcryptjs.hash(password, 10);
    const user = await add(data);
    return user;
  },
  async login(email, password) {
    const user = await findOne({ email });

    if (user && bcryptjs.compareSync(password, user.password)) {
      return generateToken(pick(user, ["_id", "isBusiness", "isAdmin"]));
    }
  }
};
