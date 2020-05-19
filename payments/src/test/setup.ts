import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";
declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock("../nats-wrapper");

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "testKey";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  //Make JWT payload
  const payload = {
    id: id ? id : new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Make JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //Build session object
  const session = { jwt: token };
  // Make JSON
  const sessionJSON = JSON.stringify(session);
  // Encode JSON as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  //Return cookie
  return [`express:sess=${base64}`];

  // const email = "test@test.com";
  // const password = "passwordTest";

  // const response = await request(app)
  //   .post("/api/users/signup")
  //   .send({
  //     email,
  //     password,
  //   })
  //   .expect(201);

  // const cookie = response.get("Set-Cookie");

  // return cookie;
};
