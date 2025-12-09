import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree.js";
import LinkErrorPage from "../pages/LinkErrorPage.jsx";

export const linkErrorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "error/$reason",
  component: LinkErrorPage,
});