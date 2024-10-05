import express from "express";
import error from "./middleware/errorMiddleware.js";
import { connect } from "./db/dbProvider.js";
import usersController from "./controllers/usersController.js";
import cardsController from "./controllers/cardsController.js";
import cors from "./middleware/corsMiddleware.js";
import loggingProvider from "./logging/loggingProvider.js";
import chalk from "chalk";

const { PORT = 8181 } = process.env;

const app = express();

app.use(cors);
app.use(express.json());
app.use(loggingProvider);

app.use("/users", usersController);
app.use("/cards", cardsController);

app.use(error);

app.listen(PORT, () => {
  console.log(chalk.yellow("app is listening to port " + PORT));
  connect();
});
