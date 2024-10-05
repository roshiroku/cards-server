import { error } from "../logging/loggingProvider.js";

/** @todo (final) consider if req param (& name) necessary */
export default function errorMiddleware(e, req, res) {
  const { message = "Internal Server Error", status = 500, validator } = e;
  const errorMessage = `${validator ? validator + " " : ""}Error: ${message}`;

  error(errorMessage);
  res.status(status).send(errorMessage);
}
