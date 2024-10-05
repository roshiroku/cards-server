import { db } from "../config.js";
import * as mongodb from "./providers/mongodb.js";

const providers = { mongodb };
const { connect } = providers[db.provider];

export { connect };
