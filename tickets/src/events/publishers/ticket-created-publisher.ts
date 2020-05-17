import { Publisher, Subjects, TicketCreatedEvent } from "@fan2fan/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
