import fs from "fs/promises";
import path from "path";
import { error, info, success } from "./logging/loggingProvider.js";
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

    if (!defaultUsers?.length) return;

    const existingUsers = await User.find();

    if (existingUsers.length) return;

    info("Seeding initial data...");

    await Promise.all(defaultUsers.map(User.register));
    success("Users seeded successfully.");

    const businessUsers = await User.find({ isBusiness: true });

    if (defaultCards?.length && businessUsers.length) {
      await Promise.all(defaultCards.map(card => {
        const user_id = businessUsers[Math.floor(Math.random() * businessUsers.length)]._id;
        return Card.add({ ...card, user_id });
      }));
      success("Cards seeded successfully.");
    }

    success("Database seeded successfully.");
  } catch (e) {
    error(`Error seeding database:\n${e.message}`);
  }
}
