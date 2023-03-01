import path from "path";
import vuePlugin from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  plugins: [
    vuePlugin(),
    vueJsx(),

    Components({
      resolvers: [
        (name) => {
          if (name.startsWith("F7")) {
            return {
              importName: name.replace(/^F/, 'f'),
              path: "framework7-vue/bundle",
            };
          }
        },
        (name) => {
          if (name.startsWith("My")) {
            const partialName = name.slice(2);
            const mres = partialName.match(/[A-Z][^A-Z]*/g);
            if (mres != null) {
              const path = `@/app/components`;
              return {
                importName: name,
                path,
              };
            }
          }
        },
      ],
    }),
  ],
  build: {
    minify: true,
  },
});
