import { expect } from "chai";
import { test, axios } from "../utils/testUtils.js";
import User from "../models/User.js";

test("User Deletion API Endpoints", ({ regularUser, otherUser }) => {
  it("should not delete another user's profile", async () => {
    const response = await axios.delete(`/users/${otherUser.user._id}`, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(403);
  });

  it("should not delete the user without token", async () => {
    const response = await axios.delete(`/users/${regularUser.user._id}`);
    expect(response.status).to.equal(401);
  });

  it("should delete the user", async () => {
    const response = await axios.delete(`/users/${regularUser.user._id}`, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(200);
    await User.remove(regularUser.user._id);
  });

  it("should not allow deleted user to authenticate", async () => {
    const response = await axios.get(`/users/${regularUser.user._id}`, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(401);
  });
}, { user: true, other: true });
