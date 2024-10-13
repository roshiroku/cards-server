import { axios, test } from "../utils/testUtils.js";
import { expect } from "chai";

test("Card Creation API Endpoints", ({ businessUser, regularUser }) => {
  it("should not allow a non-business user to create a card", async () => {
    const response = await axios.post("/cards", regularUser.cardData, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(403);
  });

  it("should fail to create a card without authentication", async () => {
    const response = await axios.post("/cards", regularUser.cardData);
    expect(response.status).to.equal(401);
  });

  it("should allow a business user to create a card", async () => {
    const response = await axios.post("/cards", businessUser.cardData, {
      headers: { "x-auth-token": businessUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("_id");
  });

  it("should not allow creating multiple cards with the same email", async () => {
    const response = await axios.post("/cards", businessUser.cardData, {
      headers: { "x-auth-token": businessUser.token }
    });
    expect(response.status).to.equal(400);
    expect(response.data).to.include("email");
  });
}, { business: true, user: true });
