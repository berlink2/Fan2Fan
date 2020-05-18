import { Publisher, Subjects, TicketUpdatedEvent } from "@fan2fan/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
