import request from "supertest";
import { app } from "../../app";

it("returns a 200 on successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "testpassword",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "testpassword",
    })
    .expect(200);
});

it("fails when email is not provided", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "testpassword",
    })
    .expect(400);
});

it("fails when wrong password is provided for an account", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "testpassword",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "wrongPassword",
    })
    .expect(400);
});

it("responds with a cookie with successful sign in", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "testpassword",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "testpassword",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
