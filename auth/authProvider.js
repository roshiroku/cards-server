import { auth } from "../config.js";

const { generateToken, verifyToken } = await import(`./providers/${auth.provider}.js`);

export { generateToken, verifyToken };
