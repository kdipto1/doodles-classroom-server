import dotenv from "dotenv";
import { z } from "zod";
import {
  DEFAULT_VALUES,
  VALIDATION_LIMITS,
  REGEX_PATTERNS,
  ERROR_MESSAGES,
} from "../constants/common";

dotenv.config();

// Environment validation schema
const envSchema = z.object({
  PORT: z.string().optional().default(DEFAULT_VALUES.PORT.toString()),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default(DEFAULT_VALUES.NODE_ENV),
  MONGODB_URL: z.string().url().min(1, ERROR_MESSAGES.MONGODB_URL_REQUIRED),
  JWT_SECRET: z
    .string()
    .min(
      VALIDATION_LIMITS.JWT_SECRET_MIN_LENGTH,
      ERROR_MESSAGES.JWT_SECRET_REQUIRED,
    ),
  JWT_SECRET_EXPIRES: z.string().min(1, ERROR_MESSAGES.JWT_EXPIRES_REQUIRED),
  JWT_REFRESH_SECRET: z
    .string()
    .min(
      VALIDATION_LIMITS.JWT_SECRET_MIN_LENGTH,
      ERROR_MESSAGES.JWT_REFRESH_SECRET_REQUIRED,
    ),
  JWT_REFRESH_SECRET_EXPIRES: z
    .string()
    .min(1, ERROR_MESSAGES.JWT_REFRESH_EXPIRES_REQUIRED),
  BCRYPT_SALT_ROUNDS: z
    .string()
    .regex(
      REGEX_PATTERNS.BCRYPT_ROUNDS_PATTERN,
      ERROR_MESSAGES.BCRYPT_ROUNDS_INVALID,
    )
    .default(DEFAULT_VALUES.BCRYPT_SALT_ROUNDS.toString()),
});

// Validate environment variables
const env = envSchema.parse(process.env);

interface Config {
  port: number;
  nodeEnv: string;
  mongoose: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refresh_secret: string;
    refresh_secret_expiresIn: string;
  };
  BCRYPT_SALT_ROUNDS: number;
}

const config: Config = {
  port: Number(env.PORT),
  nodeEnv: env.NODE_ENV,
  mongoose: {
    url: env.MONGODB_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_SECRET_EXPIRES,
    refresh_secret: env.JWT_REFRESH_SECRET,
    refresh_secret_expiresIn: env.JWT_REFRESH_SECRET_EXPIRES,
  },
  BCRYPT_SALT_ROUNDS: Number(env.BCRYPT_SALT_ROUNDS),
};

export default config;
