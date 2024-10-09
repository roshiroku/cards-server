import fs from "fs/promises";
import path from "path";
import * as log from "./logging/loggingProvider.js";
import Card from "./models/Card.js";
import User from "./models/User.js";

const USERS_PATH = path.resolve("./seed/users.json");
const CARDS_PATH = path.resolve("./seed/cards.json");

export default async function seedDatabase() {
  try {
    const usersFile = await fs.readFile(USERS_PATH, "utf-8");
    const cardsFile = await fs.readFile(CARDS_PATH, "utf-8");
    const defaultUsers = JSON.parse(usersFile);
    const defaultCards = JSON.parse(cardsFile);
    let seeded = false;

    if (defaultUsers?.length) {
      const existingUsers = await User.find();

      if (!existingUsers.length) {
        log.info("Seeding initial users...");
        await Promise.all(defaultUsers.map(User.register));
        (seeded = true) && log.success("Users seeded successfully.");
      }
    }

    const businessUsers = await User.find({ isBusiness: true });

    if (defaultCards?.length && businessUsers.length) {
      const existingCards = await Card.find();

      if (!existingCards.length) {
        log.info("Seeding initial cards...");
        await Promise.all(defaultCards.map(card => {
          const user_id = businessUsers[Math.floor(Math.random() * businessUsers.length)]._id;
          return Card.create({ ...card, user_id });
        }));
        (seeded = true) && log.success("Cards seeded successfully.");
      }
    }

    seeded && log.success("Database seeding process completed.");
  } catch (e) {
    log.error(`Error seeding database:\n${e.message}`);
  }
}
