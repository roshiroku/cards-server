import { db } from "../config";
import * as morgan from "./providers/morgan";

const providers = { morgan };
const { } = providers[db.provider];

export { };
