import { Publisher, OrderCreatedEvent, Subjects } from "@fan2fan/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
