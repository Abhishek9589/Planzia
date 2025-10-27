import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    ssr: true,
    outDir: path.resolve(process.cwd(), "dist/server"),
    rollupOptions: {
      input: path.resolve(process.cwd(), "server/node-build.js"),
      output: {
        entryFileNames: "node-build.mjs",
      },
    },
  },
  resolve: {
    alias: {
      "@shared": path.resolve(process.cwd(), "./shared"),
    },
  },
  ssr: {
    noExternal: ["express"],
  },
});
