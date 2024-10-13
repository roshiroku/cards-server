import morgan from "morgan";
import { now } from "../../utils/timeUtils.js";
import { logging } from "../../config.js";
import { logger } from "../../utils/loggingUtils.js";

morgan.token("date-format", (_, __, arg) => {
  const { year, month, day, hours, minutes, seconds } = now();
  return arg
    .replace("yyyy", year)
    .replace("MM", month)
    .replace("dd", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
});

morgan.token("error", (_, res) => res.locals.error);

const format = typeof logging.format == "string" ? { default: logging.format } : logging.format;

const parse = morgan.compile(format.default);
const parseError = morgan.compile(format.error || format.default);

export const middleware = morgan((tokens, req, res) => {
  if (res.statusCode < 400) {
    logger.success(parse(tokens, req, res));
  } else {
    logger.error(parseError(tokens, req, res));
  }
});
