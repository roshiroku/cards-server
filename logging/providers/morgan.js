import morgan from "morgan";
import { now } from "../../utils/timeUtils.js";
import { logging } from "../../config.js";
import { format } from "../loggingProvider.js";

function customCallback(tokens, req, res) {
  const { date, time } = now();
  const message = [
    `[${date} ${time}]`,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    "-",
    `${tokens["response-time"](req, res)}ms`,
  ].join(" ");

  return res.statusCode < 400 ? format.success(message) : format.error(message);
}

export const middleware = morgan(logging.format == "custom" ? (
  customCallback
) : (
  logging.format
));
