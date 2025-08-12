import dotenv from "dotenv";

dotenv.config();

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
  BCRYPT_SALT_ROUNDS: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoose: {
    url: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/doodles-class",
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_SECRET_EXPIRES as string,
    refresh_secret: process.env.JWT_REFRESH_SECRET as string,
    refresh_secret_expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES as string,
  },
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
};

export default config;
