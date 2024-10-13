import { loginAttempts as loginAttemptsConfig, db } from "../config.js";
import { errorUnauthorized } from "../utils/errorUtils.js";
import * as mongodb from "./providers/mongodb/loginAttemptsModel.js";

const providers = { mongodb };
const { count, find, findOne, findById, add, edit, remove } = providers[db.provider];
const { maxAttempts, resetTime: resetHours, banTime: banHours } = loginAttemptsConfig;

const RESET_TIME = resetHours * 60 * 60 * 1000;
const BAN_TIME = banHours * 60 * 60 * 1000;

export default {
  count,
  find,
  findOne,
  findById,
  add,
  edit,
  remove,
  async promise(email, cb) {
    let attempts = maxAttempts && await findOne({ email });
    let count = attempts ? countLoginAttempts(attempts) : 0;
    let promise;

    if (maxAttempts && count >= maxAttempts) {
      throw errorLockedout(attempts);
    }

    const resolve = token => {
      promise = async () => {
        attempts && await remove(attempts._id);
        return token;
      };
    };

    const reject = () => {
      promise = async () => {
        if (!maxAttempts) return;

        const data = { email, count: ++count, attemptTime: Date.now() };
        attempts = attempts ? await edit(attempts._id, data) : await add(data);

        if (count >= maxAttempts) {
          throw errorLockedout(attempts);
        }
      };
    };

    await cb(resolve, reject);

    return await promise();
  }
};

function errorLockedout({ attemptTime }) {
  return errorUnauthorized(`Too many login attempts. Login disabled until ${new Date(attemptTime.getTime() + BAN_TIME).toISOString()}`);
}

function countLoginAttempts({ count, attemptTime }) {
  const now = Date.now();

  if (attemptTime.getTime() + BAN_TIME < now) return 0;

  if (count >= maxAttempts) return count;

  if (attemptTime.getTime() + RESET_TIME < now) return 0;

  return count;
}
