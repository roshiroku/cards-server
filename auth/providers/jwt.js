import jwt from "jsonwebtoken";

const { TOKEN_SECRET } = process.env;

export function generateToken(payload) {
  return jwt.sign(payload, TOKEN_SECRET);
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch (e) {
    return null;
  }
}
