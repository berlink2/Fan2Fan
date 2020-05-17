import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "testpassword",
    })
    .expect(201);
});

it("returns a 400 with invalid email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with invalid password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "a",
    })
    .expect(400);
});

it("returns a 400 with no email / password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "passwordtest",
    })
    .expect(400);
});

it("duplicate email error", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "testpassword",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "testpassword",
    })
    .expect(400);
});

it("successful signup and cookie", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "testpassword",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
