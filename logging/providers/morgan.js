import morgan from "morgan";
import { now } from "../../utils/timeUtils.js";
import { logging } from "../../config.js";
import { format } from "../../utils/loggingUtils.js";

morgan.token("date-format", (_, __, arg) => {
  const { year, month, day, hours, minutes, seconds } = now();
  return arg.replace("yyyy", year)
    .replace("MM", month)
    .replace("dd", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
});

const parse = logging && morgan.compile(logging.format);

export const middleware = logging && morgan((tokens, req, res) => {
  const message = parse(tokens, req, res);
  return res.statusCode < 400 ? format.success(message) : format.error(message);
});
