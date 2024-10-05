import { generateToken } from "../auth/authProvider.js";
import { db } from "../config.js";
import { pick } from "../utils/objectUtils.js";
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
    /** @todo remove cards created by user */
    /** @todo remove card likes by user */
    return await remove(id);
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
