import { auth } from "../config.js";
import * as jwt from "./providers/jwt.js";

const providers = { jwt };
const { generateToken, verifyToken } = providers[auth.provider];

export { generateToken, verifyToken };
