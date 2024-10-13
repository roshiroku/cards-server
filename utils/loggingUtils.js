import chalk from "chalk";
import { logging } from "../config.js";

export const format = {
  info: chalk[logging.colors?.info] ?? chalk.yellow,
  success: chalk[logging.colors?.success] ?? chalk.cyanBright,
  error: chalk[logging.colors?.error] ?? chalk.redBright,
};
