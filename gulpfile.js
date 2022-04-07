// @ts-check
/// <reference path="./node_modules/sg-resource/typings.d.ts" />
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { src, dest } = require("gulp");
const uglify = require("gulp-uglify");
var data = require("gulp-data");

exports.default = function () {
  return src("dist/client/site.config.js")
    .pipe(uglify())
    .pipe(
      data(function (file) {
        require(file.path);
        const config = getSiteConfig();
        const item = config.systems.find((val) => val.env === config.runtimes);
        const itemStr = JSON.stringify(item);
        let content = String(file.contents);
        const reg = new RegExp("systems:\\[(.)*\\]");
        content = content.replace(reg, `systems:[${itemStr}]`);
        file.contents = Buffer.from(content, "utf8");

        return file.attributes;
      })
    )
    .pipe(uglify())
    .pipe(dest("dist/client"));
};
