import express from "express";
// import swaggerUi from 'swagger-ui-express';
// import swaggerSpec from './swagger.config';

const router = express.Router();

// Note: Uncomment these lines after installing swagger packages
// Run: npm install swagger-jsdoc swagger-ui-express @types/swagger-jsdoc @types/swagger-ui-express

// router.use('/', swaggerUi.serve);
// router.get('/', swaggerUi.setup(swaggerSpec, {
//   explorer: true,
//   customCss: '.swagger-ui .topbar { display: none }',
//   customSiteTitle: 'Google Classroom Clone API Docs',
// }));

// Temporary placeholder route when swagger packages are not installed
router.get("/", (req, res) => {
  res.json({
    message:
      "API Documentation will be available here once swagger packages are installed",
    instructions:
      "Run: npm install swagger-jsdoc swagger-ui-express @types/swagger-jsdoc @types/swagger-ui-express",
    endpoints: {
      auth: {
        register: "POST /api/v1/auth/register",
        login: "POST /api/v1/auth/login",
        me: "GET /api/v1/auth/me",
        "refresh-token": "POST /api/v1/auth/refresh-token",
      },
      classrooms: {
        create: "POST /api/v1/classes",
        join: "POST /api/v1/classes/join",
        myClasses: "GET /api/v1/classes",
        getById: "GET /api/v1/classes/:id",
      },
      assignments: "API endpoints for assignment management",
      submissions: "API endpoints for submission management",
      dashboard: "API endpoints for dashboard data",
    },
  });
});

export default router;
