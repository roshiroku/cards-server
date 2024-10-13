import { axios, test } from "../utils/testUtils.js";
import { expect } from "chai";

test("Card Favorite API Endpoints", ({ businessUser, regularUser }) => {
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

  it("should allow any user to unlike a card", async () => {
    const response = await axios.patch(`/cards/${businessUser.card._id}`, {}, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data.likes).to.not.include(regularUser.user._id);
  });
}, { business: "card", user: "card" });
