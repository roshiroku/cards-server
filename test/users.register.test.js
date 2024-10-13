import { expect } from "chai";
import { test, axios } from "../utils/testUtils.js";
import User from "../models/User.js";

test("User Registration API Endpoints", ({ regularUser }) => {
  let userId;

  after(async () => await User.remove(userId));

  it("should register a new user", async () => {
    const response = await axios.post("/users", regularUser.data);
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("_id");
    userId = response.data._id;
  });

  it("should not register a user with invalid data", async () => {
    const invalidUserData = { ...regularUser.data, email: "invalid-email" };
    const response = await axios.post("/users", invalidUserData);
    expect(response.status).to.equal(400);
  });

  it("should not register a user with an already used email", async () => {
    const response = await axios.post("/users", regularUser.data);
    expect(response.status).to.equal(400);
  });
});
