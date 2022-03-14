import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import esbuild from "rollup-plugin-esbuild";

export default {
  input: {
    index: "src/index.ts",
    window_main_preload: "src/window/main/preload.ts",
  },
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [
    nodeResolve({ preferBuiltins: true, browser: true }), // 消除碰到 node.js 模块时⚠警告
    commonjs(),
    json(),
    esbuild({
      include: /\.[jt]sx?$/,
      exclude: /node_modules/,
      sourceMap: false,
      minify: process.env.NODE_ENV === "production",
      target: "esnext",
      loaders: {
        ".json": "json",
        ".js": "jsx",
        ".tsx": "tsx",
        ".ts": "ts",
      },
      exports: "auto",
    }),
  ],
  external: ["electron"],
};
