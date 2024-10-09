import chalk from "chalk";
import { logging } from "../config.js";
import * as morgan from "./providers/morgan.js";

export const format = {
  info: chalk[logging.colors?.info] ?? chalk.yellow,
  success: chalk[logging.colors?.success] ?? chalk.cyanBright,
  error: chalk[logging.colors?.error] ?? chalk.redBright,
};

const providers = { morgan };

export const {
  middleware,
  write = message => logging && console.log(message),
  info = message => write(format.info(message)),
  success = message => write(format.success(message)),
  error = message => write(format.error(message)),
} = providers[logging.provider] || {};
