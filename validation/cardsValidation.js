import { validation } from "../config";
import * as joi from "./providers/joi/cards";

const providers = { joi };
const { validateCard } = providers[validation.provider];

export { validateCard };
