import { axios, test } from "../utils/testUtils.js";
import { expect } from "chai";
import User from "../models/User.js";

test("Non-Business User Cards API Endpoints", ({ businessUser, regularUser, otherUser }) => {
  it("should not allow a non-business user to create a card", async () => {
    const response = await axios.post("/cards", otherUser.cardData, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(403);
  });

  it("should fail to create a card without authentication", async () => {
    const response = await axios.post("/cards", otherUser.cardData);
    expect(response.status).to.equal(401);
  });

  it("should allow a guest to retrieve all cards", async () => {
    const response = await axios.get("/cards");
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an("array");
  });

  it("should allow a logged in user to retrieve their own cards", async () => {
    const response = await axios.get("/cards/my-cards", {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an("array");
    response.data.forEach(card => {
      expect(card.user_id).to.equal(`${regularUser.user._id}`);
    });
  });

  it("should fail when accessing a non-existent card", async () => {
    const nonExistentCardId = "000000000000000000000000";
    const response = await axios.get(`/cards/${nonExistentCardId}`);
    expect(response.status).to.equal(404);
  });

  it("should allow any user to like a card", async () => {
    const response = await axios.patch(`/cards/${businessUser.card._id}`, {}, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data.likes).to.include(`${regularUser.user._id}`);
  });

  it("should fail to like a card without authentication", async () => {
    const response = await axios.patch(`/cards/${businessUser.card._id}`);
    expect(response.status).to.equal(401);
  });

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
    const updatedCardData = { ...regularUser.cardData, title: "Non-Existent Card" };
    const response = await axios.put(`/cards/${nonExistentCardId}`, updatedCardData, {
      headers: { "x-auth-token": regularUser.token }
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

  it("should allow any user to unlike a card", async () => {
    const response = await axios.patch(`/cards/${businessUser.card._id}`, {}, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data.likes).to.not.include(regularUser.user._id);
  });

  it("should fail to delete a card without authentication", async () => {
    const response = await axios.delete(`/cards/${businessUser.card._id}`);
    expect(response.status).to.equal(401);
  });

  it("should allow any user to delete their own card", async () => {
    let response = await axios.delete(`/cards/${regularUser.card._id}`, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(200);

    response = await axios.get(`/cards/${regularUser.card._id}`);
    expect(response.status).to.equal(404);
  });

  it("should remove cards when a user is deleted", async () => {
    await User.remove(businessUser.user._id);

    const response = await axios.get(`/cards/${businessUser.card._id}`);
    expect(response.status).to.equal(404);
  });
}, { business: "card", user: "card" });
