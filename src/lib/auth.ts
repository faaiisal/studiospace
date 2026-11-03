import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// Avoid build-time crash when MONGODB_URL is not set (e.g., frontend demo mode)
// Use a placeholder; actual DB operations will fail gracefully if not configured
const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017";
const client = new MongoClient(mongoUrl);
const db = client.db("studiospace");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  // Provide fallback secret for build; set BETTER_AUTH_SECRET in production
  secret: process.env.BETTER_AUTH_SECRET || "demo-secret-placeholder-not-for-prod",
});