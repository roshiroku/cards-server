import { axios, test } from "../utils/testUtils.js";
import { expect } from "chai";

test("Card Retrieval API Endpoints", ({ regularUser }) => {
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
    response.data.forEach(card => expect(card.user_id).to.equal(`${regularUser.user._id}`));
  });

  it("should fail when accessing a non-existent card", async () => {
    const nonExistentCardId = "000000000000000000000000";
    const response = await axios.get(`/cards/${nonExistentCardId}`);
    expect(response.status).to.equal(404);
  });
}, { business: "card", user: "card" });
