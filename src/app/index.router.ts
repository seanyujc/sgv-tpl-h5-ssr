import {
  createRouter as _createRouter,
  createWebHistory,
  createMemoryHistory,
} from "vue-router";
import * as pages from "./pages";
export function createRouter() {
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: [
      {
        path: "/error",
        name: "Error",
        component: pages.errorPagePreloading,
        children: [],
      },
      {
        path: "/home",
        alias: "/",
        name: "Home",
        component: pages.homePagePreloading,
        children: [],
      },
    ],
  });
}
