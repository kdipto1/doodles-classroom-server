import { UserPayload } from "./user.payload";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// Also declare for @types/express compatibility
declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}

// Export the interface for use in other files
export { UserPayload };
