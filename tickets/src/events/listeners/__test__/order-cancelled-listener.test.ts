import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCancelledEvent, OrderStatus } from "@fan2fan/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

const setup = async () => {
  //make listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  //make ticket
  const ticket = Ticket.build({
    title: "test",
    price: 10,
    userId: "user1",
  });
  ticket.set({ orderId });
  await ticket.save();

  //make data

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    status: OrderStatus.Cancelled,
    userId: ticket.userId,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("updates ticket, published cancelled event, acks message", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
