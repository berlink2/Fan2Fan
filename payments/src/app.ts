import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { errorHandler, NotFoundError, currentUser } from "@fan2fan/common";
import { createChargeRouter } from "./routes/new";
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);
app.use(currentUser);
app.use(createChargeRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.get("/api/users/currentUser", (req, res) => {
  res.send("Hello!!!");
});

export { app };
