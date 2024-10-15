import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../../models/User.js";
import { auth } from "../../config.js";

export const name = "google";

export const callbackURL = `/auth/${name}/success`;

export const options = { scope: ["profile", "email"] };

export const successOptions = {
  failureRedirect: auth.redirect?.error || undefined,
  session: false
};

export const strategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL
}, async (_, __, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      const imageUrl = profile.photos?.length && profile.photos[0].value;

      user = await User.add({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: {
          first: profile.name.givenName,
          last: profile.name.familyName
        },
        image: imageUrl ? { url: imageUrl, alt: "" } : undefined
      });
    }

    const token = User.generateToken(user);
    return done(null, token);
  } catch (error) {
    return done(error, false);
  }
});
