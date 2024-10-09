import { errorBoundary, errorUnauthenticated } from "../utils/errorUtils.js";
import { verifyToken } from "../auth/authProvider.js";

export default errorBoundary((req, res, next) => {
  const user = auth(req, res);

  if (!user) {
    throw errorUnauthenticated("Invalid token");
  }

  res.locals.auth = user;

  next();
});

export function auth(req, res) {
  if (!res.locals.auth) {
    const token = req.header("x-auth-token");
    res.locals.auth = token && verifyToken(token);
  }

  return res.locals.auth;
}
