import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const filter = { orderId: undefined };
  const tickets = await Ticket.find(filter);

  res.send(tickets);
});

export { router as indexTicketRouter };
