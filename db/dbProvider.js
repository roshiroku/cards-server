import { db } from "../config";
import * as mongodb from "./providers/mongodb";

const providers = { mongodb };
const { connect } = providers[db.provider];

export { connect };
