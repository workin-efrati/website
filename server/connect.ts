// lib/mongodb.ts
import mongoose from "mongoose";

declare global {
  // allow caching the promise on globalThis in dev/HMR
  // eslint-disable-next-line no-var
  var _mongooseConnectionPromise: Promise<typeof mongoose> | null | undefined;
}

/**
 * Connect to MongoDB (Next.js safe).
 * - Reuses an in-progress connection attempt (prevents double connect).
 * - Returns the mongoose instance.
 */
export const connectToMongodb = async (): Promise<typeof mongoose> => {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    throw new Error("MONGO_URL environment variable is not defined");
  }

  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const ready = mongoose.connection.readyState;

  // already connected -> no-op
  if (ready === 1) {
    // console.debug("MongoDB: already connected");
    return mongoose;
  }

  // If a connection attempt is in progress, await it
  if (global._mongooseConnectionPromise) {
    // console.debug("MongoDB: waiting for in-flight connection");
    await global._mongooseConnectionPromise;
    return mongoose;
  }

  // Create and cache the connection promise so parallel calls reuse it
  global._mongooseConnectionPromise = mongoose
    .connect(mongoUrl, {
      // these options are optional depending on mongoose version
      // useUnifiedTopology: true,
      // useNewUrlParser: true,
      // autoIndex: process.env.NODE_ENV !== "production",
    })
    .then(() => mongoose);

  try {
    await global._mongooseConnectionPromise;
    // console.info("MongoDB: connected");
    return mongoose;
  } catch (err) {
    // clear cached promise on failure so next call can retry
    global._mongooseConnectionPromise = null;
    // rethrow so the caller can handle
    throw err;
  }
};
