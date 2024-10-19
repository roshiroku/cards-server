import { generateToken } from "../auth/tokenProvider.js";
import { db } from "../config.js";
import { pick } from "../utils/objectUtils.js";
import Card from "./Card.js";
import LoginAttempts from "./LoginAttempts.js";
import bcryptjs from "bcryptjs";

const { count, find, findOne, findById, add, edit, remove } = await import(`./providers/${db.provider}/userModel.js`);

const User = {
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
    const loginAttempts = user && await LoginAttempts.findOne({ email: user.email });

    await Promise.all(likedCards.map(card => {
      card.likes = card.likes.filter(userId => userId != id);
      return Card.edit(card._id, { likes: card.likes });
    }));

    await Promise.all(cards.map(({ _id }) => Card.remove(_id)));

    loginAttempts && await LoginAttempts.remove(loginAttempts._id);

    return user;
  },
  async register({ password, ...data }) {
    data.password = await bcryptjs.hash(password, 10);
    const user = await add(data);
    return user;
  },
  generateToken(user) {
    return generateToken(pick(user, ["_id", "isBusiness", "isAdmin"]));
  },
  async login(email, password, user = null) {
    user ??= await findOne({ email });

    if (user?.password && bcryptjs.compareSync(password, user.password)) {
      return User.generateToken(user);
    }
  },
  async attemptLogin(email, password, user = null) {
    user ??= await findOne({ email });

    if (!user?.password) return;

    const token = await LoginAttempts.promise(email, async (resolve, reject) => {
      const token = await this.login(email, password, user);
      token ? resolve(token) : reject();
    });

    return token;
  }
};

export default User;
