import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string,
) => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  } as jwt.SignOptions);
};

const verifyToken = (token: string, secret: Secret): string | JwtPayload => {
  const decoded = jwt.verify(token, secret);
  return decoded;
};

export const JwtHelpers = {
  createToken,
  verifyToken,
};
