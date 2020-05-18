import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  NotFoundError,
} from "@fan2fan/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Find ticket for an order
    const ticket = await Ticket.findById(data.ticket.id);

    //throw error if ticket is not found
    if (!ticket) {
      throw new NotFoundError();
    }
    //reserve ticket by setting the tickets orderid attribute
    ticket.set({ orderId: data.id });

    await ticket.save();

    //publish ticket updated event when order is created
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });
    //ack message
    msg.ack();
  }
}
