import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
it("gets order", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concertName",
    price: 30,
  });

  await ticket.save();

  const user = global.signin();

  const { body: orderCreated } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: order } = await request(app)
    .get(`/api/orders/${orderCreated.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(order.id).toEqual(orderCreated.id);
});

it("tries to get order of a different user and gets 401 error", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concertName",
    price: 30,
  });

  await ticket.save();

  const user = global.signin();

  const { body: orderCreated } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${orderCreated.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});
