import axios from "axios";
import app from "../app.js";
import { generateToken } from "../auth/authProvider.js";
import Card from "../models/Card.js";
import User from "../models/User.js";
import { pick } from "./objectUtils.js";
import { createServer } from "http";

const port = process.env.PORT || 8181;
const baseURL = `http://localhost:${port}`;
const instance = axios.create({ baseURL, validateStatus: () => true });

export function test(title, cb, { admin, business, user, other } = {}) {
  const data = generateTestData();

  const updateTestData = async (update, key) => {
    if (!update) return;

    const { user, token } = await createUser(data[key].data);

    data[key].user = user;
    data[key].token = token;

    if (update == "card") {
      data[key].card = await Card.create({
        ...data[key].cardData,
        user_id: data[key].user._id
      });
    }
  };

  const cleanup = async (update, key) => {
    if (update == "card") await Card.remove(data[key].card._id);
    if (update) await User.remove(data[key].user._id);
  };

  let server;

  before(async () => {
    server = createServer(app);
    server.listen();

    await updateTestData(admin, "adminUser");
    await updateTestData(business, "businessUser");
    await updateTestData(user, "regularUser");
    await updateTestData(other, "otherUser");
  });

  after(async () => {
    await cleanup(admin, "adminUser");
    await cleanup(business, "businessUser");
    await cleanup(user, "regularUser");
    await cleanup(other, "otherUser");

    server.close();
  });

  describe(title, () => cb(data));
}

export function generateTestData() {
  return {
    adminUser: {
      data: generateUserData({
        name: { first: "Admin", last: "User" },
        email: generateEmail("admin"),
        isAdmin: true
      }),
      cardData: generateCardData({
        title: "Admin User Card",
        email: generateEmail("admin")
      })
    },
    businessUser: {
      data: generateUserData({
        name: { first: "Business", last: "User" },
        email: generateEmail("biz"),
        isBusiness: true
      }),
      cardData: generateCardData({
        title: "Business User Card",
        email: generateEmail("biz")
      })
    },
    regularUser: {
      data: generateUserData(),
      cardData: generateCardData({
        title: "Regular User Card",
        email: generateEmail("user")
      })
    },
    otherUser: {
      data: generateUserData({
        name: { first: "Other", last: "User" },
        email: generateEmail("other")
      }),
      cardData: generateCardData({
        title: "Other User Card",
        email: generateEmail("other")
      })
    }
  };
}

export async function createUser(userData) {
  const user = await User.register(userData);
  const token = generateToken(pick(user, ["_id", "isBusiness", "isAdmin"]));
  return { user, token };
}

export function generateUserData({ email = generateEmail("user"), ...userData } = {}) {
  return {
    name: { first: "Test", last: "User" },
    email,
    password: "Password!1",
    phone: "012-3456789",
    address: {
      country: "Country",
      city: "City",
      street: "Street",
      houseNumber: 1,
      zip: 12345,
    },
    isBusiness: false,
    isAdmin: false,
    ...userData
  };
}

export function generateCardData({ email = generateEmail("card"), ...cardData } = {}) {
  return {
    title: "Test Card",
    subtitle: "Test Subtitle",
    description: "Test Description",
    phone: "012-3456789",
    email,
    web: "http://example.com",
    address: {
      country: "Country",
      city: "City",
      street: "Street",
      houseNumber: 1,
      zip: 12345,
    },
    ...cardData
  };
}

export function generateEmail(prefix) {
  return `${prefix}-${Date.now()}@example.com`;
}

export function normalizeUser(userData) {
  return pick(userData, ["name", "phone", "address"]);
}

export { instance as axios };
