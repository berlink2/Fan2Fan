import { Subjects, Publisher, PaymentCreatedEvent } from "@fan2fan/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
