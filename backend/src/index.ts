import type {
  Server,
} from "node:http";

import app from "./app";

import {
  env,
} from "./config";
import { connectDB, disconnectDB } from "./database/mongodb";


let server:
  Server | null = null;

let shuttingDown =
  false;

async function startServer():
  Promise<void> {
  try {
    console.log(
      "Starting CineTix backend...",
    );

    console.log(
      `Environment: ${env.nodeEnv}`,
    );

    console.log(
      `MongoDB URI configured: ${Boolean(
        env.mongodbUri,
      )}`,
    );

    await connectDB();

    server =
      app.listen(
        env.port,
        "0.0.0.0",
        () => {
          console.log(
            `✅ CineTix API running at http://localhost:${env.port}`,
          );

          console.log(
            `✅ Health endpoint: http://localhost:${env.port}/api/health`,
          );

          console.log(
            `✅ Frontend origin: ${env.frontendUrl}`,
          );
        },
      );

    server.on(
      "error",
      (error) => {
        console.error(
          "HTTP server error:",
          error,
        );

        process.exit(1);
      },
    );
  } catch (error) {
    console.error(
      "❌ Failed to start CineTix backend:",
      error,
    );

    process.exit(1);
  }
}

async function shutdown(
  signal: string,
): Promise<void> {
  if (shuttingDown) {
    return;
  }

  shuttingDown =
    true;

  console.log(
    `\n${signal} received. Shutting down...`,
  );

  try {
    if (
      server &&
      server.listening
    ) {
      await new Promise<void>(
        (
          resolve,
          reject,
        ) => {
          server?.close(
            (error) => {
              if (error) {
                reject(
                  error,
                );

                return;
              }

              resolve();
            },
          );
        },
      );

      console.log(
        "HTTP server closed",
      );
    }

    await disconnectDB();

    process.exit(0);
  } catch (error) {
    console.error(
      "Shutdown error:",
      error,
    );

    process.exit(1);
  }
}

process.on(
  "SIGINT",
  () => {
    void shutdown(
      "SIGINT",
    );
  },
);

process.on(
  "SIGTERM",
  () => {
    void shutdown(
      "SIGTERM",
    );
  },
);

process.on(
  "unhandledRejection",
  (reason) => {
    console.error(
      "Unhandled promise rejection:",
      reason,
    );
  },
);

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "Uncaught exception:",
      error,
    );

    process.exit(1);
  },
);

void startServer();