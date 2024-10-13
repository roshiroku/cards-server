import { logging } from "../config.js";
import { format } from "../utils/loggingUtils.js";

export const {
  middleware,
  write = message => logging && console.log(message),
  info = message => write(format.info(message)),
  success = message => write(format.success(message)),
  error = message => write(format.error(message)),
} = logging.provider ? await import(`./providers/${logging.provider}.js`) : {};
