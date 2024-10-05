import morgan from "morgan";
import { now } from "../../utils/timeUtils.js";
import chalk from "chalk";
import { logging } from "../../config.js";

const success = chalk[logging.colors?.success] ?? chalk.cyanBright;
const error = chalk[logging.colors?.error] ?? chalk.redBright;

export default morgan(logging.format == "custom" ? (
  (tokens, req, res) => {
    const { date, time } = now();
    const message = [
      `[${date} ${time}]`,
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      "-",
      `${tokens["response-time"](req, res)}ms`,
    ].join(" ");

    return res.statusCode < 400 ? success(message) : error(message);
  }) : (
  logging.format
));
