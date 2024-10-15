import { Router } from "express";
import { auth as authConfig } from "../config.js";
import authProvider from "../auth/authProvider.js";

const { redirect, providers: providerNames = [] } = authConfig;

const authController = Router();

const providers = await Promise.all(providerNames.map(provider => import(`../auth/providers/${provider}.js`)));

providers.forEach(({ name, callbackURL, options, successOptions }) => {
  authController.get(`/auth/${name}`, authProvider.authenticate(name, options));

  authController.get(callbackURL || `/auth/${name}/success`, authProvider.authenticate(name, successOptions), (req, res) => {
    const redirectUrl = redirect?.success || (typeof redirect == "string" && redirect);
    const token = req.user;

    if (redirectUrl) {
      res.redirect(`${redirectUrl}?token=${token}`);
    } else {
      res.status(200).send(token);
    }
  });
});

export default authController;
