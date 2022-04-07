// @ts-check
const fs = require("fs");
const path = require("path");
const express = require("express");

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

/**
 * 限制最大长度
 * @param {string} text
 * @param {number} maxlength
 */
function textLimitMaxLength(text, maxlength) {
  if (text.length > maxlength) {
    return text.substring(0, maxlength);
  } else {
    return text;
  }
}

async function createServer(root = process.cwd()) {
  const resolve = (/** @type {string} */ p) => path.resolve(__dirname, p);

  const manifest = {};

  const app = express();

  function sendHtml(
    res,
    template,
    /** @type {{title:string; description:string; keywords:string; preloadLinks:string; appHtml:string;}} */
    { title, description, keywords, preloadLinks, appHtml }
  ) {
    // console.log(appHtml);
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
      .replace(`<!--app-html-->`, appHtml);

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  }

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite = await require("vite").createServer({
    root,
    logLevel: isTest ? "error" : "info",
    server: {
      middlewareMode: true,
      watch: {
        // During tests we edit the files too fast and sometimes chokidar
        // misses change events, so enforce polling for consistency
        usePolling: true,
        interval: 100,
      },
    },
  });
  // use vite's connect instance as middleware
  app.use(vite.middlewares);

  app.use("*", async (req, res) => {
    const url = req.originalUrl;
    let template, render;
    // always read fresh template in dev
    template = fs.readFileSync(resolve("index.html"), "utf-8");
    template = await vite.transformIndexHtml(url, template);
    render = (await vite.ssrLoadModule("/src/entry-server.ts")).render;

    try {
      // console.log("server=======", ctx);
      const [appHtml, preloadLinks, title, keywords, description] =
        await render(url, req, manifest);
      // console.log(appHtml);
      sendHtml(res, template, {
        title,
        description,
        keywords,
        preloadLinks,
        appHtml,
      });
    } catch (e) {
      // console.log("渲染错误==============\n", e);
      if (e && e.status === 200 && e.data) {
        req.body = {
          ...e.data,
          config: e.config,
        };
      }

      vite && vite.ssrFixStacktrace(e);

      const [appHtml, preloadLinks, renderState, title, keywords, description] =
        await render("/error", req, manifest);
      sendHtml(res, template, {
        title,
        description,
        keywords,
        preloadLinks,
        appHtml,
      });
    }
  });

  // @ts-ignore
  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) => {
    delete require.cache[require.resolve("./public/site.config.js")];
    const { SITE_CONFIG } = require("./public/site.config");

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
}

// for test use
exports.createServer = createServer;
