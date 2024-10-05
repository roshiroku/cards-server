import express from "express";
import error from "./middleware/errorMiddleware";
import { connect } from "./db/dbProvider";
import usersController from "./controllers/usersController";
import cardsController from "./controllers/cardsController";
import cors from "./middleware/corsMiddleware";
import loggingProvider from "./logging/loggingProvider";
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
