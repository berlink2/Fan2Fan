import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("Returns 404 if ticket does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("Returns ticket if ticket exists", async () => {
  const ticket = { title: "test", price: 50 };

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(ticket)
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(ticket.title);
  expect(ticketResponse.body.price).toEqual(ticket.price);
});
