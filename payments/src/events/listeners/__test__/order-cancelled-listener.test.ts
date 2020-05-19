import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent, OrderStatus } from "@fan2fan/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = async () => {
  //make listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 20,
    userId: "user",
    version: 0,
  });
  await order.save();
  //make data
  const data: OrderCancelledEvent["data"] = {
    version: 1,
    id: order.id,
    userId: "feferf",
    status: OrderStatus.Created,
    ticket: {
      id: "wfeuwf",
      price: 20,
    },
  };

  //make message
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates order info", async () => {
  //call onMessage function of listener
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  //check if 0rder is created

  const order = await Order.findById(data.id);

  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  //call onMessage function of listener
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
