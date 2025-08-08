// This file ensures the type declarations are loaded
// Import this file in controllers that need the extended Request interface

// Re-export for convenience
export * from "./user.payload";

// Type augmentation for Express Request
// This will be automatically picked up by TypeScript
