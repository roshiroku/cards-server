import * as log from "../logging/loggingProvider.js";

export default function errorMiddleware(e, _, res) {
  const { message = "Internal Server Error", status = 500, validator } = e;
  const errorMessage = `${validator ? validator + " " : ""}Error: ${message}`;

  log.error(errorMessage);
  res.status(status).send(errorMessage);
}
