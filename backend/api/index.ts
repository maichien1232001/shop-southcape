import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

import app from '../src/app';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

async function connectToDatabase() {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  if (!MONGO_URI) {
    throw new Error('MONGO_URI environmental variable is missing.');
  }
  await mongoose.connect(MONGO_URI);
  isConnected = true;
}

export default async (req: any, res: any) => {
  try {
    await connectToDatabase();
  } catch (err: any) {
    return res.status(500).json({ error: 'Database connection failed: ' + err.message });
  }
  return app(req, res);
};
