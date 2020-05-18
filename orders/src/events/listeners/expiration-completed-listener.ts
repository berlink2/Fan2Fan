import {
  Listener,
  ExpirationCompletedEvent,
  Subjects,
  NotFoundError,
  OrderStatus,
} from "@fan2fan/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompletedListener extends Listener<
  ExpirationCompletedEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {
    const { orderId } = data;
    //check db for order
    const order = await Order.findById(orderId).populate("ticket");

    //throws error if order does not exist
    if (!order) {
      throw new NotFoundError();
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: orderId,
      version: order.version,
      userId: order.userId,
      status: order.status,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    msg.ack();
  }
}
