import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@component": path.resolve(__dirname, "./src/component"),
      "@component/*": path.resolve(__dirname, "./src/component/*"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
    },
  },
  optimizeDeps: {
    include: ["monaco-editor"],
  },
});
