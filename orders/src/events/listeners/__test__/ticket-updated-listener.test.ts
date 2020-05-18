import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@fan2fan/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  //make listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  //make ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 10,
  });
  await ticket.save();

  //make data
  const data: TicketUpdatedEvent["data"] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: "new",
    price: 20,
    userId: "grtgrt",
  };

  //make message
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("updates a ticket", async () => {
  //call onMessage function of listener
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);
  //check if ticket is created

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  //call onMessage function of listener
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  //check if ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it("ack is not called if out of order event", async () => {
  const { msg, data, listener, ticket } = await setup();

  data.version = 100;
  try {
    await listener.onMessage(data, msg);
  } catch (e) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
