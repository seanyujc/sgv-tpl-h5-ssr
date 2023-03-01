import fs from "fs";
import path from "path";
import express from "express";
import { render } from "./src/entry-server";
import compression from "compression";

async function createServer(root = process.cwd()) {
  console.log("server root", root);
  const resolve = (p: string) => path.resolve(root, p);

  const app = express();

  app.use(compression());
  app.use(
    require("serve-static")(resolve("./client"), {
      index: false,
    })
  );

  const manifest = require("../client/ssr-manifest.json");

  function sendHtml({
    res,
    title,
    description,
    keywords,
    preloadLinks,
    renderState,
    appHtml,
  }: {
    res: any;
    title: string;
    description: string;
    keywords: string;
    preloadLinks: string;
    renderState: string;
    appHtml: string;
  }) {
    const template = fs.readFileSync(resolve("./client/index.html"), "utf-8");
    const html = template
      .replace(`<!--title-->`, title)
      .replace(
        `<meta name="description" content=""`,
        `<meta name="description" content="${description}"`
      )
      .replace(
        `<meta name="keywords" content=""`,
        `<meta name="keywords" content="${keywords}"`
      )
      .replace(
        `<meta property="og:title" content=""`,
        `<meta property="og:title" content="${title}"`
      )
      .replace(
        `<meta property="og:description" content=""`,
        `<meta property="og:description" content="${description}"`
      )
      .replace(
        `<meta property="og:keywords" content=""`,
        `<meta property="og:keywords" content="${keywords}"`
      )
      .replace(`<!--preload-links-->`, preloadLinks)
      .replace(`<!--render-state-->`, renderState)
      .replace(`<!--app-html-->`, appHtml);

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  }
  app.use("*", async (req, res) => {
    const url = req.originalUrl;
    try {
      const [appHtml, preloadLinks, renderState, title, keywords, description] =
        await render(url, req, manifest);
      sendHtml({
        res,
        appHtml,
        preloadLinks,
        renderState,
        title,
        keywords,
        description,
      });
    } catch (error) {
      const _error: any = error;
      console.log(_error);
      if (_error && _error.status === 200 && _error.data) {
        req.body = {
          ..._error.data,
          config: _error.config,
        };
        // res.redirect(
        //   `/error?error_obj=${JSON.stringify(_error)}&url=${encodeURIComponent(
        //     url,
        //   )}`,
        // );
      }
      // else {
      // console.log(e.stack);
      // res.redirect(
      //   `/error?error_obj=${JSON.stringify(e)}&url=${encodeURIComponent(
      //     url,
      //   )}`,
      // );
      // res.status(500).end(e.stack);
      // }
      const [appHtml, preloadLinks, renderState, title, keywords, description] =
        await render("/error", req, manifest);
      sendHtml({
        res,
        appHtml,
        preloadLinks,
        renderState,
        title,
        keywords,
        description,
      });
    }
  });

  return { app };
}

createServer().then(({ app }) => {
  const {
    SITE_CONFIG,
  }: {
    SITE_CONFIG: ISiteConfig<"DEV" | "SIT" | "UAT" | "PROD", "default">;
  } = require("./site.config");

  const config = SITE_CONFIG.systems.find(
    (item) => item.env === SITE_CONFIG.runtimes
  );
  let port = 3000;
  if (config && config.local && config.local.port) {
    port = config.local.port;
  }
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
});

// for test use
exports.createServer = createServer;
