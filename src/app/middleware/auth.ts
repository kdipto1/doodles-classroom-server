import { NextFunction, Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { JwtPayload, Secret } from "jsonwebtoken";
import { JwtHelpers } from "../../utils/jwtHelpers";
import config from "../../config/config";
import { ERROR_MESSAGES } from "../../constants/common";
// Import to ensure Request interface extension is loaded
import "../../interfaces";

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.replace("Bearer ", "");
      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          ERROR_MESSAGES.UNAUTHORIZED,
        );
      }

      let verifiedUser: JwtPayload | string = "";

      verifiedUser = JwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      if (typeof verifiedUser === "string") {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          ERROR_MESSAGES.TOKEN_VERIFICATION_FAILED,
        );
      }
      (req as any).user = verifiedUser as {
        userId: string;
        role: string;
        iat: number;
        exp: number;
      };

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
