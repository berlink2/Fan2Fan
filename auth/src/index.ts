import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("Please define JWT_KEY");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Please define MONRO_URI for this service");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("connected to db");
  } catch (e) {
    console.log("failed to connect to db");
    console.error(e);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();
