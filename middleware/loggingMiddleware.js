import { middleware } from "../logging/loggingProvider.js";
import { errorBoundary } from "../utils/errorUtils.js";

export default errorBoundary(async (req, res, next) => {
  await middleware(req, res, next);
});
