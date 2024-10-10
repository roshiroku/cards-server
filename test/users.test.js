import { expect } from "chai";
import { test, normalizeUser, axios } from "../utils/testUtils.js";
import User from "../models/User.js";

test("Users API Endpoints", ({ regularUser, otherUser }) => {
  let userId;
  let token;

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

  it("should login the user and receive token", async () => {
    const response = await axios.post("/users/login", {
      email: regularUser.data.email,
      password: regularUser.data.password
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.be.a("string");
    token = response.data;
  });

  it("should not login with invalid email", async () => {
    const response = await axios.post("/users/login", {
      email: "invalidemail@example.com",
      password: regularUser.data.password
    });
    expect(response.status).to.equal(401);
  });

  it("should not login with incorrect password", async () => {
    const response = await axios.post("/users/login", {
      email: regularUser.data.email,
      password: "wrongPassword!1"
    });
    expect(response.status).to.equal(401);
  });

  it("should edit the user profile", async () => {
    const updatedUserData = normalizeUser({ ...regularUser.data, name: { first: "Updated", last: "User" } });
    const response = await axios.put(`/users/${userId}`, updatedUserData, {
      headers: { "x-auth-token": token }
    });
    expect(response.status).to.equal(200);
    expect(response.data.name.first).to.equal("Updated");
  });

  it("should toggle user's business status", async () => {
    let response = await axios.patch(`/users/${userId}`, {}, {
      headers: { "x-auth-token": token }
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("isBusiness", true);

    response = await axios.patch(`/users/${userId}`, {}, {
      headers: { "x-auth-token": token }
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("isBusiness", false);
  });

  it("should not edit user profile with invalid data", async () => {
    const updatedUserData = normalizeUser({ ...regularUser.data, phone: "invalid-phone" });
    const response = await axios.put(`/users/${userId}`, updatedUserData, {
      headers: { "x-auth-token": token }
    });
    expect(response.status).to.equal(400);
    expect(response.data).to.include("phone");
  });

  it("should not edit user profile without token", async () => {
    const updatedUserData = normalizeUser({ ...regularUser.data, name: { first: "Unauthorized", last: "User" } });
    const response = await axios.put(`/users/${userId}`, updatedUserData);
    expect(response.status).to.equal(401);
  });

  it("should not edit another user's profile", async () => {
    const updatedUserData = normalizeUser({ ...otherUser.data, name: { first: "Hacked", last: "User" } });
    const response = await axios.put(`/users/${otherUser.user._id}`, updatedUserData, {
      headers: { "x-auth-token": token }
    });
    expect(response.status).to.equal(403);
  });

  it("should not allow a user to edit their own email", async () => {
    const updatedUserData = { ...normalizeUser(regularUser.data), email: "newemail@example.com" };
    const response = await axios.put(`/users/${userId}`, updatedUserData, {
      headers: { "x-auth-token": token }
    });
    expect(response.status).to.equal(400);
    expect(response.data).to.include("email");
  });

  it("should not allow a user to edit their own password", async () => {
    const updatedUserData = { ...normalizeUser(regularUser.data), password: "NewPassword!1" };
    const response = await axios.put(`/users/${userId}`, updatedUserData, {
      headers: { "x-auth-token": token }
    });
    expect(response.status).to.equal(400);
    expect(response.data).to.include("password");
  });

  it("should retrieve the logged in user's profile", async () => {
    const response = await axios.get(`/users/${userId}`, {
      headers: { "x-auth-token": token }
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("name");
    expect(response.data.name.first).to.equal("Updated");
  });

  it("should not delete another user's profile", async () => {
    const response = await axios.delete(`/users/${otherUser.user._id}`, {
      headers: { "x-auth-token": token }
    });
    expect(response.status).to.equal(403);
  });

  it("should not delete the user without token", async () => {
    const response = await axios.delete(`/users/${userId}`);
    expect(response.status).to.equal(401);
  });

  it("should delete the user", async () => {
    const response = await axios.delete(`/users/${userId}`, {
      headers: { "x-auth-token": token }
    });
    expect(response.status).to.equal(200);
    await User.remove(userId);
  });

  it("should not allow deleted user to authenticate", async () => {
    const response = await axios.get(`/users/${userId}`, {
      headers: { "x-auth-token": token }
    });
    expect(response.status).to.equal(401);
  });
}, { other: true });
