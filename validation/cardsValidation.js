import { validation } from "../config.js";
import * as joi from "./providers/joi/cards.js";

const providers = { joi };
const { validateCard } = providers[validation.provider];

export { validateCard };
