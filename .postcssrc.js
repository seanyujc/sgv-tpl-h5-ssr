const postcssPresetEnv = require("postcss-preset-env");
const pxtoviewport = require("postcss-px-to-viewport");

module.exports = ({ env }) => {
  return {
    plugins: [
      // postcssPresetEnv({
      //   autoprefixer: {},
      // }),
      pxtoviewport({
        exclude: [/framework7[\/\\]/],
        unitToConvert: "px",
        unitPrecision: 6,
        viewportWidth: 750,
        viewportUnit: "vw",
        fontViewportUnit: "vw",
      }),
      pxtoviewport({
        exclude: [/src[\/\\]/],
        unitToConvert: "px",
        unitPrecision: 6,
        viewportWidth: 375,
        viewportUnit: "vw",
        fontViewportUnit: "vw",
      }),
    ],
  };
};
