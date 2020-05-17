import express, { Request, Response } from "express";
import { User } from "../models/user";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@fan2fan/common";
import { Password } from "../utilities/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Please provide your password."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      throw new BadRequestError("Invalid email/password combination");
    }

    const doPasswordsMatch = await Password.compare(
      userExists.password,
      password
    );

    if (!doPasswordsMatch) {
      throw new BadRequestError("Incorrect password for that email.");
    }

    const userJwt = jwt.sign(
      {
        id: userExists.id,
        email: userExists.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(userExists);
  }
);

export { router as signInRouter };
