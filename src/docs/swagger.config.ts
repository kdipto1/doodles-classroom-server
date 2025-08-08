// Note: This requires swagger-jsdoc and swagger-ui-express packages
// Run: npm install swagger-jsdoc swagger-ui-express @types/swagger-jsdoc @types/swagger-ui-express

// import swaggerJSDoc from 'swagger-jsdoc'; // Uncomment after installing swagger packages

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Google Classroom Clone API",
    version: "1.0.0",
    description:
      "A comprehensive API for managing classrooms, assignments, and user interactions in an educational platform.",
    contact: {
      name: "API Support",
      email: "support@classroom-clone.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Development Server",
    },
    {
      url: "https://api.classroom-clone.com/api/v1",
      description: "Production Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "JWT Authorization header using the Bearer scheme. Enter your token below.",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "User ID",
          },
          name: {
            type: "string",
            description: "Full name of the user",
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email address",
            example: "john.doe@example.com",
          },
          role: {
            type: "string",
            enum: ["student", "teacher"],
            description: "User role in the system",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password", "role"],
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 50,
            pattern: "^[a-zA-Z\\s]+$",
            description: "Full name (letters and spaces only)",
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            maxLength: 100,
            description: "Valid email address",
            example: "john.doe@example.com",
          },
          password: {
            type: "string",
            minLength: 8,
            maxLength: 100,
            pattern:
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]",
            description:
              "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
            example: "MySecure123!",
          },
          role: {
            type: "string",
            enum: ["student", "teacher"],
            description: "User role",
            example: "student",
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            description: "Email address",
            example: "john.doe@example.com",
          },
          password: {
            type: "string",
            description: "User password",
            example: "MySecure123!",
          },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          statusCode: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "User logged in successfully",
          },
          data: {
            type: "object",
            properties: {
              accessToken: {
                type: "string",
                description: "JWT access token",
              },
              role: {
                type: "string",
                enum: ["student", "teacher"],
              },
              name: {
                type: "string",
                example: "John Doe",
              },
            },
          },
        },
      },
      ApiResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          statusCode: {
            type: "integer",
          },
          message: {
            type: "string",
          },
          data: {
            type: "object",
            description: "Response data (varies by endpoint)",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          statusCode: {
            type: "integer",
            example: 400,
          },
          message: {
            type: "string",
            example: "Validation error",
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Uncomment these after installing swagger packages:
// const options = {
//   swaggerDefinition,
//   apis: [
//     "./src/app/modules/*/*.routes.ts",
//     "./src/app/modules/*/*.controller.ts",
//   ],
// };
// const specs = swaggerJSDoc(options);

// For now, export the swagger definition directly
export default swaggerDefinition;
