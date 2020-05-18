import { Subjects, Publisher, ExpirationCompletedEvent } from "@fan2fan/common";

export class ExpirationCompletedPublisher extends Publisher<
  ExpirationCompletedEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
