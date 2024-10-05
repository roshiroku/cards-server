import { users as defaultUsers, cards as defaultCards } from "./config.js";
import { error, info, success } from "./logging/loggingProvider.js";
import Card from "./models/Card.js";
import User from "./models/User.js";

export default async function seedDatabase() {
  try {
    if (!defaultUsers?.length) return;

    const existingUsers = await User.find();

    if (existingUsers.length) return;

    info("Seeding initial data...");

    await Promise.all(defaultUsers.map(User.register));
    success("Users seeded successfully.");

    const [businessUser] = await User.find({ isBusiness: true });

    if (defaultCards?.length && businessUser) {
      await Promise.all(defaultCards.map(card => {
        return Card.add({ ...card, user_id: businessUser._id });
      }));
      success("Cards seeded successfully.");
    }

    success("Database seeded successfully.");
  } catch (e) {
    error(`Error seeding database:\n${e.message}`);
  }
}
