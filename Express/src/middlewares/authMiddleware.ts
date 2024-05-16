import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

export const authMiddleware = ClerkExpressRequireAuth({
  onError: (err) => {
    console.error("Error occurred:", err);
    throw new Error("Unauthorized request!");
  },
});
