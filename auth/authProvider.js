import passport from "passport";
import { auth } from "../config.js";

const providers = await Promise.all((auth.providers || []).map(provider => import(`./providers/${provider}.js`)));

providers.forEach(({ strategy }) => passport.use(strategy));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
