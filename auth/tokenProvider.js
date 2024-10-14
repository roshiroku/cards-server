import { auth } from "../config.js";

const { generateToken, verifyToken } = await import(`./token/${auth.token}.js`);

export { generateToken, verifyToken };
