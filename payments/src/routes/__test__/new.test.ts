import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { OrderStatus } from "@fan2fan/common";
import mongoose from "mongoose";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";
jest.mock("../../stripe");
it("order does not exist -> 404 error", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "testToken",
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("paying for order of another user -> 401 error", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.AwaitingPayment,
    price: 10,
    version: 0,
  });
  order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "testToken",
      orderId: order.id,
    })
    .expect(401);
});

it("paying for a cancelled order -> 400 error", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    status: OrderStatus.Cancelled,
    price: 10,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "testToken",
      orderId: order.id,
    })
    .expect(400);
});

// it("creates stripe charge -> 201", async () => {
//   const userId = mongoose.Types.ObjectId().toHexString();
//   const price = Math.floor(Math.random() * 100000);

//   const order = Order.build({
//     id: mongoose.Types.ObjectId().toHexString(),
//     userId,
//     status: OrderStatus.Created,
//     price: 10,
//     version: 0,
//   });
//   await order.save();

//   const response = await request(app)
//     .post("/api/payments")
//     .set("Cookie", global.signin(userId))
//     .send({
//       token: "tok_visa",
//       orderId: order.id,
//     })
//     .expect(201);

//   const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
//   expect(chargeOptions.source).toEqual("tok_visa");
//   expect(chargeOptions.amount).toEqual(1000);
//   expect(chargeOptions.currency).toEqual("usd");
// });
