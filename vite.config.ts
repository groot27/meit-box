import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    watch: {
      usePolling: false, // true for WSL/Docker/VMs
      interval: 500, // polling interval in ms
    },
    port: 5173, // customize port
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/components/*": path.resolve(__dirname, "./components/*"),
      "@/api/*": path.resolve(__dirname, "./api/*"),
      "@/stores/*": path.resolve(__dirname, "./stores/*"),
      "@/types/*": path.resolve(__dirname, "./types/*"),
      "@/utils/*": path.resolve(__dirname, "./utils/*"),
      "@/i18n/*": path.resolve(__dirname, "src/i18n/*"),
      "@/pages/*": path.resolve(__dirname, "./pages/*"),
    },
  },
});
