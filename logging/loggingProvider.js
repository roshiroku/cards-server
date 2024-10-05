import { logging } from "../config.js";
import morgan from "./providers/morgan.js";

const providers = { morgan };

export default providers[logging.provider];
