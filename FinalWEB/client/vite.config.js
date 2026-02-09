import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

console.log("✅ VITE CONFIG LOADED");

export default defineConfig({
  plugins: [react()],
  server: {
    port: 6080,
    strictPort: true,
  },
});