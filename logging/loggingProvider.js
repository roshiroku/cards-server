import { logging } from "../config";
import morgan from "./providers/morgan";

const providers = { morgan };

export default providers[logging.provider];
