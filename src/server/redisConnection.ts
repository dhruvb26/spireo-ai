import IORedis from "ioredis";
import { env } from "@/env";

console.log("Initializing Redis connection...");

const redisOptions = {
  port: 12701,
  host: "redis-12701.c325.us-east-1-4.ec2.cloud.redislabs.com",
  username: "default",
  password: env.REDIS_CLOUD_PASSWORD,
  maxRetriesPerRequest: null,
  lazyConnect: true,
};

let sharedConnection: IORedis | null = null;

export function getSharedConnection(): IORedis {
  if (!sharedConnection) {
    console.log("Creating new Redis connection...");
    sharedConnection = new IORedis(redisOptions);

    sharedConnection.on("error", (error) => {
      console.error("Redis connection error:", error);
    });

    sharedConnection.on("connect", () => {
      console.log("Connected to Redis");
    });

    sharedConnection.on("ready", () => {
      console.log("Redis connection is ready");
    });
  } else {
    console.log("Reusing existing Redis connection");
  }

  return sharedConnection;
}

export const redisConnection = getSharedConnection();
