import { ErrorRequestHandler } from "express";

import ApiError from "../../errors/ApiError";
import handleValidationError from "../../errors/handleValidationError";
import handleCastError from "../../errors/handleCastError";
import config from "../../config/config";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandle: ErrorRequestHandler = (err, req, res, next) => {
  if (config.nodeEnv === "development")
    console.log("Global Error Handler:", err);
  let statusCode = 500;
  // let success = false;
  let message = "Something went wrong";
  let errorMessages: { path: string | number; message: string }[] = [];
  if (err instanceof ApiError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorMessages = err?.message
      ? [
          {
            path: "",
            message: err?.message,
          },
        ]
      : [];
  } else if (err?.name === "ValidationError") {
    const customErrorStack = handleValidationError(err);
    statusCode = customErrorStack.statusCode;
    message = customErrorStack.message;
    errorMessages = customErrorStack.errorMessages;
  } else if (err?.name === "CastError") {
    const customErrorStack = handleCastError(err);
    statusCode = customErrorStack.statusCode;
    message = customErrorStack.message;
    errorMessages = customErrorStack.errorMessages;
  } else if (err) {
    message = err?.message;
    errorMessages = err?.message
      ? [
          {
            path: "",
            message: err?.message,
          },
        ]
      : [];
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.nodeEnv !== "production" ? err?.stack : undefined,
  });
  // next();
};

export default globalErrorHandle;
