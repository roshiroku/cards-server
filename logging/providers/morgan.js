import morgan from "morgan";
import { now } from "../../utils/timeUtils";
import chalk from "chalk";

const success = chalk.cyanBright;
const error = chalk.redBright;

export default morgan((tokens, req, res) => {
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
});
