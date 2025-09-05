import mongoose from "mongoose";

const handleCastError = (err: mongoose.Error.CastError) => {
  const errors: {
    path: string;
    message: string;
  }[] = [{ path: err.path, message: "Invalid Id" }];
  const statusCode = 400;
  return {
    statusCode,
    message: "Cast Error!",
    errorMessages: errors,
  };
};

export default handleCastError;
