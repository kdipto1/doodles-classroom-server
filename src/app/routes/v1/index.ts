import express, { Router } from "express";
import { AuthRoutes } from "../../modules/auth/auth.routes";
import { ClassesRoutes } from "../../modules/classroom/classroom.routes";
import { AssignmentRoutes } from "../../modules/assignment/assignment.routes";
import { SubmissionRoutes } from "../../modules/submission/submission.routes";
import { DashboardRoutes } from "../../modules/dashboard/dashboard.routes";
// import authRoute from "./auth.route";
// import docsRoute from "./swagger.route";
// import userRoute from "./user.route";

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/classes",
    route: ClassesRoutes,
  },
  {
    path: "/assignments",
    route: AssignmentRoutes,
  },
  {
    path: "/submissions",
    route: SubmissionRoutes,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
];

// const devIRoute: IRoute[] = [
//   // IRoute available only in development mode
//   {
//     path: "/docs",
//     route: docsRoute,
//   },
// ];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
// if (config.nodeEnv === "development") {
//   devIRoute.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

export default router;
