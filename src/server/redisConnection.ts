import IORedis from "ioredis";
import { env } from "@/env";

const redisOptions = {
  port: 12701,
  host: "redis-12701.c325.us-east-1-4.ec2.cloud.redislabs.com",
  username: "default",
  password: env.REDIS_CLOUD_PASSWORD,
  maxRetriesPerRequest: null,
  lazyConnect: true,
};

export const sharedConnection = new IORedis(redisOptions);

sharedConnection.on("error", (error) => {
  console.error("Redis connection error:", error);
});

sharedConnection.on("connect", () => {
  console.log("Connected to Redis");
});
