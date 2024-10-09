import axios from "axios";
import { expect } from "chai";
import app from "../app.js";
import { createServer } from "http";

let server;
let jwtToken;
let userId;

before((done) => {
  server = createServer(app);
  server.listen(done);
});

after((done) => {
  server.close(done);
});

describe("Users API Endpoints", () => {
  const userData = {
    name: {
      first: "Test",
      last: "User"
    },
    email: "testuser@example.com",
    password: "Password1!",
    phone: "012-3456789",
    address: {
      country: "Country",
      city: "City",
      street: "Street",
      houseNumber: 1,
      zip: 12345
    },
    isBusiness: false
  };

  const baseURL = "http://localhost:8181";

  const instance = axios.create({
    baseURL,
    validateStatus: () => true
  });

  it("should register a new user", async () => {
    const response = await instance.post("/users", userData);
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("_id");
    userId = response.data._id;
  });

  it("should not register a user with invalid data", async () => {
    const invalidUserData = { ...userData, email: "invalid-email" };
    const response = await instance.post("/users", invalidUserData);
    expect(response.status).to.equal(400);
  });

  it("should login the user and receive JWT token", async () => {
    const response = await instance.post("/users/login", {
      email: userData.email,
      password: userData.password
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.be.a("string");
    jwtToken = response.data;
  });

  it("should not login with incorrect password", async () => {
    const response = await instance.post("/users/login", {
      email: userData.email,
      password: "wrongPassword"
    });
    expect(response.status).to.equal(401);
  });

  it("should edit the user profile", async () => {
    const updatedUserData = { ...userData, name: { first: "Updated", last: "User" } };
    const response = await instance.put(`/users/${userId}`, updatedUserData, {
      headers: { "x-auth-token": jwtToken }
    });
    expect(response.status).to.equal(200);
    expect(response.data.name.first).to.equal("Updated");
  });

  it("should not edit user profile without JWT token", async () => {
    const response = await instance.put(`/users/${userId}`, {
      name: { first: "Unauthorized" }
    });
    expect(response.status).to.equal(401);
  });

  it("should delete the user", async () => {
    const response = await instance.delete(`/users/${userId}`, {
      headers: { "x-auth-token": jwtToken }
    });
    expect(response.status).to.equal(200);
  });

  it("should not delete the user without JWT token", async () => {
    const response = await instance.delete(`/users/${userId}`);
    expect(response.status).to.equal(401);
  });
});
