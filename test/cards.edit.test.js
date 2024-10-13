import { axios, test } from "../utils/testUtils.js";
import { expect } from "chai";
import { generateBizNumber } from "../models/Card.js";

test("Card Edit API Endpoints", ({ adminUser, businessUser, regularUser }) => {
  it("should not allow a user to edit someone else's card", async () => {
    const updatedCardData = { ...businessUser.cardData, title: "Hacked Card Title" };
    const response = await axios.put(`/cards/${businessUser.card._id}`, updatedCardData, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(403);
  });

  it("should allow any user to edit their own card", async () => {
    const updatedCardData = { ...regularUser.cardData, title: "Updated User Card" };
    const response = await axios.put(`/cards/${regularUser.card._id}`, updatedCardData, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data.title).to.equal("Updated User Card");
  });

  it("should fail when editing a non-existent card", async () => {
    const nonExistentCardId = "000000000000000000000000";
    const updatedCardData = { ...adminUser.cardData, title: "Non-Existent Card" };
    const response = await axios.put(`/cards/${nonExistentCardId}`, updatedCardData, {
      headers: { "x-auth-token": adminUser.token }
    });
    expect(response.status).to.equal(404);
  });

  it("should fail to edit a card without authentication", async () => {
    const updatedCardData = { ...regularUser.cardData, title: "Guest Edited Card" };
    const response = await axios.put(`/cards/${regularUser.card._id}`, updatedCardData);
    expect(response.status).to.equal(401);
  });

  it("should not allow a user to edit the user_id of their own card", async () => {
    const updatedCardData = { ...regularUser.cardData, user_id: businessUser.user._id };
    const response = await axios.put(`/cards/${regularUser.card._id}`, updatedCardData, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(400);
    expect(response.data).to.include("user_id");
  });

  it("should not allow a user to edit a card's email to match another card's email", async () => {
    const updatedCardData = { ...regularUser.cardData, email: businessUser.cardData.email };
    const response = await axios.put(`/cards/${regularUser.card._id}`, updatedCardData, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(400);
    expect(response.data).to.include("email");
  });

  it("should allow an admin to edit a card's bizNumber if not already in use", async () => {
    const bizNumber = await generateBizNumber();
    const response = await axios.patch(`/cards/${businessUser.card._id}/biz-number`, { bizNumber }, {
      headers: { "x-auth-token": adminUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data.bizNumber).to.equal(bizNumber);
  });

  it("should not allow editing a card's bizNumber if it is already in use", async () => {
    const bizNumber = regularUser.card.bizNumber;
    const response = await axios.patch(`/cards/${businessUser.card._id}/biz-number`, { bizNumber }, {
      headers: { "x-auth-token": adminUser.token }
    });
    expect(response.status).to.equal(400);
    expect(response.data).to.include("bizNumber");
  });

  it("should not allow a non-admin user to edit a card's bizNumber", async () => {
    const bizNumber = await generateBizNumber();
    const response = await axios.patch(`/cards/${businessUser.card._id}/biz-number`, { bizNumber }, {
      headers: { "x-auth-token": businessUser.token }
    });
    expect(response.status).to.equal(403);
  });
}, { admin: true, business: "card", user: "card" });
