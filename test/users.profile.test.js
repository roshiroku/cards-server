import { expect } from "chai";
import { test, normalizeUser, axios } from "../utils/testUtils.js";

test("User Profile API Endpoints", ({ regularUser, otherUser }) => {
  it("should edit the user profile", async () => {
    const updatedUserData = normalizeUser({ ...regularUser.data, name: { first: "Updated", last: "User" } });
    const response = await axios.put(`/users/${regularUser.user._id}`, updatedUserData, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data.name.first).to.equal("Updated");
  });

  it("should toggle user's business status", async () => {
    let response = await axios.patch(`/users/${regularUser.user._id}`, {}, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("isBusiness", true);

    response = await axios.patch(`/users/${regularUser.user._id}`, {}, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("isBusiness", false);
  });

  it("should not edit user profile with invalid data", async () => {
    const updatedUserData = normalizeUser({ ...regularUser.data, phone: "invalid-phone" });
    const response = await axios.put(`/users/${regularUser.user._id}`, updatedUserData, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(400);
    expect(response.data).to.include("phone");
  });

  it("should not edit user profile without token", async () => {
    const updatedUserData = normalizeUser({ ...regularUser.data, name: { first: "Unauthorized", last: "User" } });
    const response = await axios.put(`/users/${regularUser.user._id}`, updatedUserData);
    expect(response.status).to.equal(401);
  });

  it("should not edit another user's profile", async () => {
    const updatedUserData = normalizeUser({ ...otherUser.data, name: { first: "Hacked", last: "User" } });
    const response = await axios.put(`/users/${otherUser.user._id}`, updatedUserData, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(403);
  });

  it("should retrieve the logged in user's profile", async () => {
    const response = await axios.get(`/users/${regularUser.user._id}`, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("name");
    expect(response.data.name.first).to.equal("Updated");
  });
}, { user: true, other: true });
