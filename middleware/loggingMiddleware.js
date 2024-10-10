import { middleware } from "../logging/loggingProvider.js";

export default middleware || ((_, __, next) => next());
