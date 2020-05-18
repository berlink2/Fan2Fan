import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@fan2fan/common";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";

const router = express.Router();

router.patch(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("ticket");

    //if no order exists throw error
    if (!order) {
      throw new NotFoundError();
    }

    //if user tries getting order of another user throw error
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    //change status of order to canceled
    order.status = OrderStatus.Cancelled;
    await order.save();

    //publish order cancelled event
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.status(200).send(order);
  }
);

export { router as cancelOrderRouter };
