import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import {
  validateRequest,
  requireAuth,
  NotAuthorizedError,
  NotFoundError,
} from "@fan2fan/common";

/**
 * Router for updating ticket information
 */
const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title required."),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    //Checks if ticket exists
    if (!ticket) {
      throw new NotFoundError();
    }

    //checks if ticket belongs to user
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({ title: req.body.title, price: req.body.price });
    await ticket.save();
    //send updated ticket
    res.send(ticket);
  }
);

export { router as updateTicketRouter };
