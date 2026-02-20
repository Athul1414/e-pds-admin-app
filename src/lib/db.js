import { MongoClient } from 'mongodb';

const uri = process.env.DB_URI;
const dbName = process.env.DB;

let cached = global._mongo;

if (!cached) {
  cached = global._mongo = { client: null, promise: null };
}

export default async function connectToDatabase() {
  if (cached.client) {
    return cached.client.db(dbName);
  }

  if (!cached.promise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 30000, // allow Atlas wake-up
      connectTimeoutMS: 10000,
      socketTimeoutMS: 0,
      maxPoolSize: 5, // good for M0
    });

    cached.promise = client.connect();
  }

  try {
    cached.client = await cached.promise;
  } catch (err) {
    // retry ONCE (important for Atlas cold starts)
    cached.promise = null;

    const retryClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 0,
      maxPoolSize: 5,
    });

    cached.promise = retryClient.connect();
    cached.client = await cached.promise;
  }

  return cached.client.db(dbName);
}
