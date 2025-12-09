import { createRootRoute } from "@tanstack/react-router";
import App from "../App";
import { homePageRoute } from "./homePage.route.js";
import { authRoute } from "./auth.route.js";
import { dashboardRoute } from "./dashboard.route.js";
import { analyticsRoute, urlAnalyticsRoute } from "./analytics.route.js";
import { linkErrorRoute } from "./LinkError.route.jsx";

export const rootRoute = createRootRoute({
  component: App,
});

export const routeTree = rootRoute.addChildren([
  homePageRoute,
  authRoute,
  dashboardRoute,
  analyticsRoute,
  urlAnalyticsRoute,
  linkErrorRoute,
]);
