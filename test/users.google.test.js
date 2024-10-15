import { expect } from "chai";
import { test, axios, normalizeUser } from "../utils/testUtils.js";

test("Google Login API Endpoints", ({ regularUser, googleUser }) => {
  it("should not login with regular login endpoint", async () => {
    const response = await axios.post("/users/login", {
      email: googleUser.data.email,
      password: "somePassword!1"
    });
    expect(response.status).to.equal(401);
  });

  it("should retrieve the logged-in user's profile", async () => {
    const response = await axios.get(`/users/${googleUser.user._id}`, {
      headers: { "x-auth-token": googleUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("name");
    expect(response.data.email).to.equal(googleUser.data.email);
  });

  it("should edit the Google user's profile", async () => {
    const updatedUserData = normalizeUser({ ...regularUser.data, name: { first: "Updated", last: "GoogleUser" } });
    const response = await axios.put(`/users/${googleUser.user._id}`, updatedUserData, {
      headers: { "x-auth-token": googleUser.token }
    });
    expect(response.status).to.equal(200);
    expect(response.data.name.first).to.equal("Updated");
  });

  it("should delete the Google user's profile", async () => {
    const response = await axios.delete(`/users/${googleUser.user._id}`, {
      headers: { "x-auth-token": googleUser.token }
    });
    expect(response.status).to.equal(200);
  });

  it("should not allow deleted Google user to authenticate", async () => {
    const response = await axios.get(`/users/${googleUser.user._id}`, {
      headers: { "x-auth-token": googleUser.token }
    });
    expect(response.status).to.equal(401);
  });
}, { google: true });
