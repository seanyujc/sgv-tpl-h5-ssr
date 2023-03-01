// @ts-check
/// <reference path="../node_modules/sg-resource/typings.d.ts" />
 var SITE_CONFIG = (function () {
  var /** @type {ISiteConfig<"DEV" | "SIT" | "UAT" | "PROD", "default">} */ SITE_CONFIG =
      {
        systems: [
          {
            env: "DEV",
            remote: {
              hosts: {
                default:
                  "http://172.20.7.247:18081/api-gateway/api",
              },
            },
            local: {
              port: 8080,
            },
          },
          {
            env: "PROD",
            remote: {
              hosts: {
                default:
                  "https://172.20.7.247/api-gateway/api",
              },
            },
          },
        ],
        runtimes: "DEV",
      };
  if (typeof window === "object") {
    window.getSiteConfig = () => SITE_CONFIG;
  }
  if (typeof global == "object") {
    global.getSiteConfig = () => SITE_CONFIG;
  }
  if (typeof module === "object") {
    // console.log("SITE_CONFIG");
    module.exports = { SITE_CONFIG };
  }
  return SITE_CONFIG;
})();
