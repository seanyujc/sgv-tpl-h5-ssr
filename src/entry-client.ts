import { f7ready } from "framework7-vue";
import { createApp } from "./app/main";
import harlem from "@harlem/core";
import { createClientSSRPlugin } from "@harlem/plugin-ssr";

const { app, router } = createApp();
app.use(harlem, {
  plugins: [createClientSSRPlugin()],
});
router.isReady().then(() => {
  app.mount("#app");
});
