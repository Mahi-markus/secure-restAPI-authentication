const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server"); // your Express app
const User = require("../models/user.model");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Auth Controller", () => {
  const userData = {
    email: "test@example.com",
    password: "Password123",
    role: "user",
  };

  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(userData.email);
    expect(res.body.user.role).toBe(userData.role);
  });

  it("should login an existing user and return tokens", async () => {
    await request(app).post("/auth/register").send(userData);

    const res = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    expect(res.body.user.email).toBe(userData.email);
  });

  it("should not login with wrong password", async () => {
    await request(app).post("/auth/register").send(userData);

    const res = await request(app).post("/auth/login").send({
      email: userData.email,
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should return 403 on invalid refresh token", async () => {
    const res = await request(app).post("/auth/refresh").send({
      refreshToken: "invalidtoken",
    });

    expect(res.statusCode).toBe(403);
  });

  it("should return a new access token on valid refresh token", async () => {
    await request(app).post("/auth/register").send(userData);

    const loginRes = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    const refreshRes = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: loginRes.body.refreshToken });

    expect(refreshRes.statusCode).toBe(200);
    expect(refreshRes.body).toHaveProperty("accessToken");
  });

  it("should fetch profile of logged-in user", async () => {
    await request(app).post("/auth/register").send(userData);

    const loginRes = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${loginRes.body.accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(userData.email);
  });
});
