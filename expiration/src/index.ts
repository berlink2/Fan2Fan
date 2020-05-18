import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "../src/events/listeners/order-created-listener";
const start = async () => {
  //declare environment variables
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

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (e) {
    console.error(e);
  }
};

start();
