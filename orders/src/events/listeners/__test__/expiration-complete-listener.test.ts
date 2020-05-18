import { ExpirationCompletedListener } from "../expiration-completed-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompletedEvent, OrderStatus } from "@fan2fan/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";

const setup = async () => {
  //make listener
  const listener = new ExpirationCompletedListener(natsWrapper.client);

  //make ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 10,
  });
  await ticket.save();

  //make order
  const order = Order.build({
    userId: "test",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  //make data
  const data: ExpirationCompletedEvent["data"] = {
    orderId: order.id,
  };

  //make message
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

it("updates order status to cancelled", async () => {
  //call onMessage function of listener
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  // look for order in db by order if
  const updatedOrder = await Order.findById(order.id);

  //check if order is cancelled
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("publishes order cancelled event", async () => {
  //call onMessage function of listener
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  //check if ticket is created

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[1][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
  //call onMessage function of listener
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
