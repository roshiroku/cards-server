import { expect } from "chai";
import { axios, normalizeUser, test } from "../utils/testUtils.js";

test("Admin API Endpoints", ({ adminUser, regularUser }) => {
  it("should get all users as an admin", async () => {
    const response = await axios.get("/users", {
      headers: { "x-auth-token": adminUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an("array");
    expect(response.data.length).to.be.greaterThan(0);
    response.data.forEach(user => expect(user).to.not.have.property("password"));
  });

  it("should get a specific user's profile as an admin", async () => {
    const response = await axios.get(`/users/${regularUser.user._id}`, {
      headers: { "x-auth-token": adminUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("_id", `${regularUser.user._id}`);
    expect(response.data).to.not.have.property("password");
  });

  it("should not allow an admin to edit another user's profile", async () => {
    const updatedData = normalizeUser({ ...regularUser.data, name: { first: "AdminUpdated", last: "User" } });
    const response = await axios.put(`/users/${regularUser.user._id}`, updatedData, {
      headers: { "x-auth-token": adminUser.token }
    });
    expect(response.status).to.equal(403);
  });

  it("should not allow a non-admin user to access the list of users", async () => {
    const response = await axios.get("/users", {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(403);
  });

  it("should not allow a regular user to edit their admin status", async () => {
    const updatedData = { ...normalizeUser(regularUser.data), isAdmin: true };
    const response = await axios.put(`/users/${regularUser.user._id}`, updatedData, {
      headers: { "x-auth-token": regularUser.token }
    });
    expect(response.status).to.equal(400);
    expect(response.data).to.include("isAdmin");
  });

  it("should delete a specific user's profile as an admin", async () => {
    let response = await axios.delete(`/users/${regularUser.user._id}`, {
      headers: { "x-auth-token": adminUser.token }
    });
    expect(response.status).to.equal(200);

    response = await axios.get(`/users/${regularUser.user._id}`, {
      headers: { "x-auth-token": adminUser.token }
    });
    expect(response.status).to.equal(404);
  });
}, { admin: true, user: true });
