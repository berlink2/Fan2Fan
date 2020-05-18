import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@fan2fan/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  //make listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  //make data
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //make message
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("create and save ticket", async () => {
  //call onMessage function of listener
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  //check if ticket is created

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
});

it("acks the message", async () => {
  //call onMessage function of listener
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  //check if ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
