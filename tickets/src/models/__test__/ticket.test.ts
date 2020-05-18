import { Ticket } from "../ticket";

it("successfully implements optimistic concurrency control", async (done) => {
  //make ticket
  const ticket = Ticket.build({
    title: "test",
    price: 10,
    userId: "user",
  });
  //save ticket to db
  await ticket.save();
  //get ticket twice
  const first = await Ticket.findById(ticket.id);
  const second = await Ticket.findById(ticket.id);
  //make two separate changes to the ticket
  first!.set({ price: 20 });
  second!.set({ price: 40 });
  //save first ticket
  await first!.save();
  //save second ticket
  try {
    await second!.save();
  } catch (e) {
    return done();
  }

  throw new Error("Code should not reach here");
});

it("increments version number each time ticket is updated", async () => {
  //make ticket
  const ticket = Ticket.build({
    title: "test",
    price: 10,
    userId: "user",
  });
  await ticket.save();

  //ticker version should be zero when first made
  expect(ticket.version).toEqual(0);

  await ticket.save();

  //ticket version will be incremented by 1
  expect(ticket.version).toEqual(1);
});
