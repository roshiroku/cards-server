import { logging } from "../config.js";
import { logger } from "../utils/loggingUtils.js";

export const {
  middleware,
  write = logger.write,
  info = logger.info,
  success = logger.success,
  error = logger.error
} = logging.provider ? await import(`./providers/${logging.provider}.js`) : {};
