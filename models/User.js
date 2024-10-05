import { generateToken } from "../auth/authProvider.js";
import { db } from "../config.js";
import { pick } from "../utils/objectUtils.js";
import * as mongodb from "./providers/mongodb/userModel.js";
import bcryptjs from "bcryptjs";

const providers = { mongodb };
const { find, findById, add, edit, remove } = providers[db.provider];

export default {
  find,
  findById,
  add,
  edit,
  remove,
  async register({ password, ...data }) {
    data.password = await bcryptjs.hash(password, 10);
    const user = await add(data);
    return user;
  },
  async login(email, password) {
    const user = await find({ email });

    if (user && bcryptjs.compareSync(password, user.password)) {
      return generateToken(pick(user, ["_id", "isBusiness", "isAdmin"]));
    }
  }
};
