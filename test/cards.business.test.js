import { expect } from "chai";
import { axios, test } from "../utils/testUtils.js";
import Card, { generateBizNumber } from "../models/Card.js";

test("Business User and Admin Cards API Endpoints", ({ adminUser, businessUser, regularUser }) => {
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

  it("should allow an admin to edit a card's bizNumber if not already in use", async () => {
    const bizNumber = await generateBizNumber();
    const response = await axios.patch(`/cards/${cardId}/biz-number`, { bizNumber }, {
      headers: { "x-auth-token": adminUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data.bizNumber).to.equal(bizNumber);
  });

  it("should not allow editing a card's bizNumber if it is already in use", async () => {
    const bizNumber = regularUser.card.bizNumber;
    const response = await axios.patch(`/cards/${cardId}/biz-number`, { bizNumber }, {
      headers: { "x-auth-token": adminUser.token }
    });
    expect(response.status).to.equal(400);
    expect(response.data).to.include("bizNumber");
  });

  it("should not allow a non-admin user to edit a card's bizNumber", async () => {
    const bizNumber = await generateBizNumber();
    const response = await axios.patch(`/cards/${cardId}/biz-number`, { bizNumber }, {
      headers: { "x-auth-token": businessUser.token }
    });
    expect(response.status).to.equal(403);
  });

  it("should not allow a non-owner/non-admin to delete a card", async () => {
    const response = await axios.delete(`/cards/${cardId}`, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(403);
  });

  it("should allow an admin to delete any user's card", async () => {
    let response = await axios.delete(`/cards/${cardId}`, {
      headers: { "x-auth-token": adminUser.token }
    });
    expect(response.status).to.equal(200);

    response = await axios.get(`/cards/${cardId}`);
    expect(response.status).to.equal(404);
    await Card.remove(cardId);
  });
}, { admin: true, business: true, user: "card" });
