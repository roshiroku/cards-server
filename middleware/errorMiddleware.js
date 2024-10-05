/** @todo (final) consider if req param (& name) necessary */
export default function errorMiddleware(e, req, res) {
  const { message = "Internal Server Error", status = 500, validator } = e;
  /** @todo log error */
  res.status(status).send(`${validator ? validator + " " : ""}Error: ${message}`);
}
