import { errorBoundary, errorUnauthenticated } from "../utils/errorUtils.js";
import { verifyToken } from "../auth/authProvider.js";

export default errorBoundary((req, res) => {
  const user = auth(req, res);

  if (!user) {
    throw errorUnauthenticated("Invalid token");
  }

  res.locals.auth = user;
});

export function auth(req, res) {
  if (!res.locals.auth) {
    const token = req.header("x-auth-token");
    res.locals.auth = token && verifyToken(token);
  }

  return res.locals.auth;
}
