import { NextFunction, Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { JwtPayload, Secret } from "jsonwebtoken";
import { JwtHelpers } from "../../utils/jwtHelpers";
import config from "../../config/config";
import { UserPayload } from "../../interfaces/user.payload";

// Extend Express Request interface
declare module "express" {
  interface Request {
    user?: UserPayload;
  }
}

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.replace("Bearer ", "");
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      let verifiedUser: JwtPayload | string = "";

      verifiedUser = JwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      if (typeof verifiedUser === "string") {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Token verification failed",
        );
      }
      const userPayload: UserPayload = {
        userId: verifiedUser.userId as string,
        role: verifiedUser.role as string,
      };

      req.user = userPayload;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
