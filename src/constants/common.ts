// HTTP Status Codes (though we use http-status package, these are for reference)
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Validation Constants
export const VALIDATION_LIMITS = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,
  JWT_SECRET_MIN_LENGTH: 32,
} as const;

// Default Values
export const DEFAULT_VALUES = {
  PORT: 5000,
  BCRYPT_SALT_ROUNDS: 10,
  NODE_ENV: "development",
} as const;

// Regular Expressions
export const REGEX_PATTERNS = {
  NAME_PATTERN: /^[a-zA-Z\s]+$/,
  PASSWORD_PATTERN:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  BCRYPT_ROUNDS_PATTERN: /^\d+$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NAME_REQUIRED: "Name is required",
  NAME_TOO_LONG: "Name must be less than 50 characters",
  NAME_INVALID_FORMAT: "Name can only contain letters and spaces",
  EMAIL_INVALID: "Invalid email address",
  EMAIL_TOO_LONG: "Email must be less than 100 characters",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters long",
  PASSWORD_TOO_LONG: "Password must be less than 100 characters",
  PASSWORD_WEAK:
    "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
  PASSWORD_REQUIRED: "Password is required",
  MONGODB_URL_REQUIRED: "MongoDB URL is required",
  JWT_SECRET_REQUIRED: "JWT secret must be at least 32 characters long",
  JWT_EXPIRES_REQUIRED: "JWT expiration time is required",
  JWT_REFRESH_SECRET_REQUIRED:
    "JWT refresh secret must be at least 32 characters long",
  JWT_REFRESH_EXPIRES_REQUIRED: "JWT refresh expiration time is required",
  BCRYPT_ROUNDS_INVALID: "Bcrypt salt rounds must be a number",
  USER_ALREADY_EXISTS: "User already exists",
  USER_NOT_FOUND: "User not found",
  USER_ID_NOT_FOUND: "User ID not found in token",
  UNAUTHORIZED: "You are not authorized",
  TOKEN_VERIFICATION_FAILED: "Token verification failed",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not found",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_REGISTERED: "User registered successfully",
  USER_LOGGED_IN: "User logged in successfully",
  USER_PROFILE_RETRIEVED: "User profile retrieved successfully",
  TOKEN_REFRESHED: "Token refreshed successfully",
  CLASSROOM_CREATED: "Classroom created successfully",
  CLASSROOM_JOINED: "Joined class successfully",
  CLASSROOMS_RETRIEVED: "Classes retrieved successfully",
  CLASSROOM_RETRIEVED: "Classroom retrieved successfully",
  DASHBOARD_STATS_RETRIEVED: "Dashboard stats retrieved successfully",
  ASSIGNMENT_CREATED: "Assignment created successfully",
  ASSIGNMENTS_RETRIEVED: "Assignments retrieved successfully",
  ASSIGNMENT_RETRIEVED: "Assignment retrieved successfully",
  SUBMISSION_CREATED: "Assignment submitted successfully",
  SUBMISSIONS_RETRIEVED: "Submissions retrieved successfully",
  SUBMISSION_RETRIEVED: "Submission retrieved successfully",
  SUBMISSION_GRADED: "Submission graded successfully",
} as const;
