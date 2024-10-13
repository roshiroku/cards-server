import { validation } from "../config.js";

const { validateCard, validateBizNumber } = await import(`./providers/${validation.provider}/cards.js`);

export { validateCard, validateBizNumber };
