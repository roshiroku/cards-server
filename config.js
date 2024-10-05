import config from "config";

export const env = config.get("env");
export const db = config.get("db");
export const auth = config.get("auth");
export const validation = config.get("validation");
export const logging = config.get("logging");
export const cors = config.get("cors");
