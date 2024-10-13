import { db } from "../config.js";

const { connect } = await import(`./providers/${db.provider}.js`);

export { connect };
