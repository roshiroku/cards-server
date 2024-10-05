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
  log = console.log,
  info = message => log(format.info(message)),
  success = message => log(format.success(message)),
  error = message => log(format.error(message)),
} = providers[logging.provider];
