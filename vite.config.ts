import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  root: "src/window",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        window_main: "src/window/main/index.html",
        window_viewer: "src/window/viewer/index.html",
      },
    },
    outDir: "../../dist",
    assetsDir: "assets",
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: [{ find: /^~/, replacement: "" }],
  },
});
