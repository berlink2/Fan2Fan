import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  //declare environment variables
  if (!process.env.JWT_KEY) {
    throw new Error("Please define JWT_KEY");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("Please define MONGO_URI for this service");
  }
  if (!process.env.NATS_URL) {
    throw new Error("Please define NATS_URL for this service");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("Please define NATS_CLIENT_ID for this service");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("Please define NATS_CLUSTER_ID for this service");
  }

  try {
    //connect to nats server
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("Nats connection closed.");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    //connect to mongodb
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
