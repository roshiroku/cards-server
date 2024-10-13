export default function errorMiddleware(e, _, res, __) {
  const { message = "Internal Server Error", status = 500, validator } = e;
  const errorMessage = `${validator ? validator + " " : ""}Error: ${message}`;
  res.locals.error = errorMessage;
  res.status(status).send(errorMessage);
}
