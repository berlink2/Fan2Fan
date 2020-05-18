import { Publisher, OrderCancelledEvent, Subjects } from "@fan2fan/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
