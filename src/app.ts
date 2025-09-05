import express, { Express } from "express";
import helmet from "helmet";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
import ExpressMongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
// import passport from "passport";
import httpStatus from "http-status";
import config from "./config/config";
import { morgan } from "./logger";
// import { jwtStrategy } from "./modules/auth";
import authLimiter from "./utils/rateLimiter";
import routes from "./app/routes/v1";
import globalErrorHandle from "./app/middleware/globalErrorHandler";
import ApiError from "./errors/ApiError";

const app: Express = express();

if (config.nodeEnv !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// enable cors
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // Vite dev server
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "https://localhost:3000",
  "https://localhost:5173",
  process.env.CLIENT_URL, // Add your production client URL as environment variable
  // Add common Vercel app patterns - replace with your actual domain
  "https://doodles-classroom.vercel.app",
  "https://doodles-classroom.netlify.app",
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        config.nodeEnv === "development"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Handle preflight requests
app.options("*", cors());
app.use(cookieParser());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data

// sanitize request data
const window = new JSDOM("").window;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const purify = createDOMPurify(window as any);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sanitize = (obj: any) => {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = purify.sanitize(obj[key]);
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      obj[key] = sanitize(obj[key]);
    }
  }
  return obj;
};

app.use((req, res, next) => {
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
});

app.use(ExpressMongoSanitize());

// gzip compression
app.use(compression());

// jwt authentication
// app.use(passport.initialize());
// passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.nodeEnv === "production") {
  app.use("/api/v1/auth", authLimiter);
}

// v1 api routes
app.use("/api/v1", routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, " Api Not found"));
});

app.use(globalErrorHandle);
// convert error to ApiError, if needed
// app.use(errorConverter);

// handle error
// app.use(errorHandler);

export default app;
