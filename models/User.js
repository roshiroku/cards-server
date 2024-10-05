import { generateToken } from "../auth/authProvider.js";
import { db } from "../config.js";
import { pick } from "../utils/objectUtils.js";
import * as mongodb from "./providers/mongodb/userModel.js";
import bcryptjs from "bcryptjs";

const providers = { mongodb };
const User = providers[db.provider];

User.register = async ({ password, ...data }) => {
  data.password = await bcryptjs.hash(password, 10);
  const user = await User.add(data);
  return user;
};

User.login = async (email, password) => {
  const user = await User.find({ email });

  if (user && bcryptjs.compareSync(password, user.password)) {
    return generateToken(pick(user, ["_id", "isBusiness", "isAdmin"]));
  }
};

export default User;
