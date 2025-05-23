import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { BASE_URL } from "./src/utils/constants";

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: [BASE_URL],
    watch: {
      usePolling: true,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/tests/**/*.test.jsx"],
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
    server: {
      deps: {
        inline: ["mui-color-input"],
      },
    },
  },
  resolve: {
    alias: {
      "@components": "/src/components",
    },
  },
});
