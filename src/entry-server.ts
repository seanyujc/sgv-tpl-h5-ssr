import { createApp } from "./app/main";
import { renderToString } from "@vue/server-renderer";
import type { Request } from "express";
import { reactive } from "vue";
import { basename } from "path";
import harlem from "@harlem/core";
import {
  createServerSSRPlugin,
  getBridgingScriptBlock,
} from "@harlem/plugin-ssr";
import { setTokenFromHeader, state } from "./app/core/store";
export interface ISSRContext extends Record<string, any> {
  title: string;
  keywords: string;
  description: string;
  modules?: any[];
}
export async function render(url: string, request: Request, manifest: any) {
  const { app, router } = createApp();
  app.use(harlem, {
    plugins: [createServerSSRPlugin()],
  });
  const { headers } = request;
  setTokenFromHeader(headers);
  const ssrContext = reactive<ISSRContext>({
    title: "",
    keywords: "",
    description: "",
  });
  router.push(url);
  await router.isReady();
  let renderedHtml = await renderToString(app, ssrContext);
  renderedHtml += getBridgingScriptBlock();

  const preloadLinks = renderPreloadLinks(ssrContext.modules || [], manifest);
  return [
    renderedHtml,
    preloadLinks,
    state.title,
    state.keywords,
    state.description,
  ];
}

function renderPreloadLinks(modules: any[], manifest: any) {
  let links = "";
  const seen = new Set();
  modules.forEach((id) => {
    const files = manifest[id] as any[];
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file);
          const filename = basename(file);
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile);
              seen.add(depFile);
            }
          }
          links += renderPreloadLink(file);
        }
      });
    }
  });
  return links;
}

function renderPreloadLink(file: string) {
  if (file.endsWith(".js")) {
    return `<link rel="modulepreload" crossorigin href="${file}">`;
  } else if (file.endsWith(".css")) {
    return `<link rel="stylesheet" href="${file}">`;
  } else if (file.endsWith(".woff")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  } else if (file.endsWith(".woff2")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  } else if (file.endsWith(".gif")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
  } else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  } else if (file.endsWith(".png")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
  } else {
    // TODO
    return "";
  }
}
