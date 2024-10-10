import { errorBoundary, errorUnauthenticated } from "../utils/errorUtils.js";
import { verifyToken } from "../auth/authProvider.js";
import User from "../models/User.js";

export default errorBoundary(async (req, res) => {
  const user = await auth(req, res);

  if (!user) {
    throw errorUnauthenticated("Invalid token");
  }

  res.locals.auth = user;
});

export async function auth(req, res) {
  if (!res.locals.auth) {
    const token = req.header("x-auth-token");
    const payload = token && verifyToken(token);
    res.locals.auth = payload && await User.findById(payload._id);
  }

  return res.locals.auth;
}
