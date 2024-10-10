import { expect } from "chai";
import { axios, test } from "../utils/testUtils.js";
import Card from "../models/Card.js";

test("Business User Cards API Endpoints", ({ businessUser }) => {
  let cardId;

  it("should allow a business user to create a card", async () => {
    const response = await axios.post("/cards", businessUser.cardData, {
      headers: { "x-auth-token": businessUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("_id");
    cardId = response.data._id;
  });

  it("should not allow creating multiple cards with the same email", async () => {
    const response = await axios.post("/cards", businessUser.cardData, {
      headers: { "x-auth-token": businessUser.token }
    });
    expect(response.status).to.equal(400);
    expect(response.data).to.include("email");
  });

  it("should allow a business user to edit their card", async () => {
    const updatedCardData = {
      ...businessUser.cardData,
      title: "Updated Business Card",
      description: "Updated Description"
    };
    const response = await axios.put(`/cards/${cardId}`, updatedCardData, {
      headers: { "x-auth-token": businessUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data.title).to.equal("Updated Business Card");
    expect(response.data.description).to.equal("Updated Description");
  });

  it("should allow a business user to delete their own card", async () => {
    let response = await axios.delete(`/cards/${cardId}`, {
      headers: { "x-auth-token": businessUser.token }
    });
    expect(response.status).to.equal(200);

    response = await axios.get(`/cards/${cardId}`);
    expect(response.status).to.equal(404);

    await Card.remove(cardId);
  });
}, { business: true });
