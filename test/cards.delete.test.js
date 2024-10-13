import { axios, test } from "../utils/testUtils.js";
import { expect } from "chai";
import User from "../models/User.js";

test("Card Deletion API Endpoints", ({ adminUser, businessUser, regularUser, otherUser }) => {
  it("should fail to delete a card without authentication", async () => {
    const response = await axios.delete(`/cards/${businessUser.card._id}`);
    expect(response.status).to.equal(401);
  });

  it("should not allow a non-owner/non-admin to delete a card", async () => {
    const response = await axios.delete(`/cards/${businessUser.card._id}`, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(403);
  });

  it("should allow any user to delete their own card", async () => {
    let response = await axios.delete(`/cards/${regularUser.card._id}`, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(200);

    response = await axios.get(`/cards/${regularUser.card._id}`);
    expect(response.status).to.equal(404);
  });

  it("should allow an admin to delete any user's card", async () => {
    let response = await axios.delete(`/cards/${businessUser.card._id}`, {
      headers: { "x-auth-token": adminUser.token }
    });
    expect(response.status).to.equal(200);

    response = await axios.get(`/cards/${businessUser.card._id}`);
    expect(response.status).to.equal(404);
    await User.remove(businessUser.user._id);
  });

  it("should remove cards when a user is deleted", async () => {
    let response = await axios.get(`/cards/${otherUser.card._id}`);
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("_id", `${otherUser.card._id}`);

    await User.remove(otherUser.user._id);

    response = await axios.get(`/cards/${otherUser.card._id}`);
    expect(response.status).to.equal(404);
  });
}, { admin: true, business: "card", user: "card", other: "card" });
