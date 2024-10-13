import { expect } from "chai";
import { test, axios } from "../utils/testUtils.js";
import { verifyToken } from "../auth/authProvider.js";
import { loginAttempts as loginAttemptsConfig } from "../config.js";

test("User Login API Endpoints", ({ regularUser }) => {
  it("should not login with invalid email", async () => {
    const response = await axios.post("/users/login", {
      email: "invalid-email@example.com",
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

  it("should login the user and receive token", async () => {
    const response = await axios.post("/users/login", {
      email: regularUser.data.email,
      password: regularUser.data.password
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.be.a("string");
    expect(verifyToken(response.data)).to.have.property("_id", `${regularUser.user._id}`);
  });

  it("should lock the user out after maximum login attempts", async () => {
    // Perform invalid login attempts to exceed maxAttempts
    for (let i = 0; i < loginAttemptsConfig.maxAttempts - 1; i++) {
      const response = await axios.post("/users/login", {
        email: regularUser.data.email,
        password: "wrongPassword!1",
      });
      expect(response.status).to.equal(401);
    }

    const requestTime = Date.now();

    // Attempt to login again after reaching maxAttempts
    const lockoutResponse = await axios.post("/users/login", {
      email: regularUser.data.email,
      password: "wrongPassword!1",
    });

    expect(lockoutResponse.status).to.equal(403);
    expect(lockoutResponse.data).to.be.a("string");

    const lockoutResponseDate = new Date(lockoutResponse.data.split(" ").pop()).getTime();
    const lockoutLiftedDate = Date.now() + loginAttemptsConfig.banTime * 60 * 60 * 1000;

    // Check if the lockout message contains the correct ISO date
    expect(lockoutResponseDate).to.be.approximately(lockoutLiftedDate, Date.now() - requestTime);
  });

  it("should still fail login attempts while locked out", async () => {
    // Attempt another login after being locked out
    const response = await axios.post("/users/login", {
      email: regularUser.data.email,
      password: "wrongPassword!1",
    });

    expect(response.status).to.equal(403);
    expect(response.data).to.be.a("string");
  });
}, { user: true });
