import express from "express";
import error from "./middleware/errorMiddleware.js";
import { connect } from "./db/dbProvider.js";
import authController from "./controllers/authController.js";
import usersController from "./controllers/usersController.js";
import cardsController from "./controllers/cardsController.js";
import cors from "./middleware/corsMiddleware.js";
import logging from "./middleware/loggingMiddleware.js";
import * as log from "./logging/loggingProvider.js";
import seedDatabase from "./seed.js";

const { PORT = 8181 } = process.env;

const app = express();

app.use(cors);
app.use(logging);
app.use(express.json());
app.use(express.static("./public"));

app.use(authController);
app.use("/users", usersController);
app.use("/cards", cardsController);

app.use(error);

app.listen(PORT, async () => {
  log.info("Listening to port " + PORT);
  await connect();
  await seedDatabase();
});

export default app;
