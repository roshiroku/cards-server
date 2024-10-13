import chalk from "chalk";
import fs from "fs";
import { logging } from "../config.js";

export const format = {
  info: chalk[logging.colors?.info] ?? chalk.yellow,
  success: chalk[logging.colors?.success] ?? chalk.cyanBright,
  error: chalk[logging.colors?.error] ?? chalk.redBright,
};

export function write(message, format, target = logging.target) {
  if (!target) return;

  const targets = Array.isArray(target) ? target : [target];

  targets.forEach(target => {
    if (target == "console" || target == true) {
      console.log(format(message));
    } else {
      const [date] = new Date().toISOString().split("T");
      const path = target.replace("{date}", date);
      const dir = path.split("/").slice(0, -1).join("/");

      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      fs.appendFileSync(path, `${message}\n`);
    }
  });
}

export const logger = {
  write,
  info: message => write(message, format.info, logging.target?.info),
  success: message => write(message, format.success, logging.target?.success),
  error: message => write(message, format.error, logging.target?.error)
};
