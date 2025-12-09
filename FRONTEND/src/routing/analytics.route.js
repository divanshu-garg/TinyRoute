import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree.js";
import OverallAnalytics from "../pages/OverallAnalytics.jsx";
import { checkAuth } from "../utils/helper.js";
import perUrlAnalytics from "../pages/perUrlAnalytics.jsx";

export const analyticsRoute = createRoute({
    getParentRoute:()=> rootRoute,
    path: 'analytics',
    component: OverallAnalytics,
    beforeLoad:checkAuth,
})

export const urlAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "analytics/$urlId",
  component: perUrlAnalytics,
  beforeLoad: checkAuth,
});