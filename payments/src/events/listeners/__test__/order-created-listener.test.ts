import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@fan2fan/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = async () => {
  //make listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  //make data
  const data: OrderCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: "whenever",
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

  expect(order!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
  //call onMessage function of listener
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
