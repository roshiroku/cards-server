import { auth } from "../config";
import * as jwt from "./providers/jwt";

const providers = { jwt };
const { generateToken, verifyToken } = providers[auth.provider];

export { generateToken, verifyToken };
