"use server";

import { cache } from "react";
import IORedis from "ioredis";
import { env } from "@/env";

const redisOptions = {
  port: 12701,
  host: "redis-12701.c325.us-east-1-4.ec2.cloud.redislabs.com",
  username: "default",
  password: env.REDIS_CLOUD_PASSWORD,
  maxRetriesPerRequest: null,
};

let sharedConnection: IORedis | null = null;

function createConnection(): IORedis {
  console.log("Creating new Redis connection...");
  const connection = new IORedis(redisOptions);

  connection.on("error", (error) => {
    console.error("Redis connection error:", error);
  });

  connection.on("connect", () => {
    console.log("Connected to Redis");
  });

  connection.on("ready", () => {
    console.log("Redis connection is ready");
  });

  return connection;
}

export const getSharedConnection = cache(() => {
  if (!sharedConnection) {
    sharedConnection = createConnection();
  } else {
    console.log("Reusing existing Redis connection");
  }

  return sharedConnection;
});

export async function getRedisConnection() {
  return getSharedConnection();
}
