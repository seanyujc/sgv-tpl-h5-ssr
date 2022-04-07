import { createSSRApp } from "vue";
import App from "./App.vue";
import Framework7 from "framework7/lite-bundle";
import Framework7Vue, {
  f7Page,
} from "framework7-vue/bundle";
import { createRouter } from "./index.router";
import "framework7/framework7-bundle.min.css";

export function createApp() {
  Framework7.use(Framework7Vue);
  const app = createSSRApp(App);
  const router = createRouter();
  app.use(router);
  return { app, router };
}
