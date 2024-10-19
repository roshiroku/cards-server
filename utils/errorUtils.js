export function errorUnauthenticated(message) {
  return createError({ message, status: 401, validator: "Authentication" });
}

export function errorUnauthorized(message = "Unauthorized access") {
  return createError({ message, status: 403, validator: "Authorization" });
}

export function errorNotFound(message = "Resource not found") {
  return createError({ message, status: 404 });
}

export function createError({ message, status, validator }) {
  const e = new Error(message);
  e.status = status;
  e.validator = validator;
  return e;
}

export function errorBoundary(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);

      if (!res.headersSent) {
        next();
      }
    } catch (e) {
      next(e);
    }
  };
}
