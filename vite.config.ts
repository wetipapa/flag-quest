import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  build: {
    // 국기 SVG(195개)를 JS/CSS 번들에 base64로 인라인하지 않고 항상 별도 파일로 분리한다.
    // 그래야 화면에 실제로 그려지는 국기만 브라우저가 그때그때 내려받는다(초기 로딩 최소화).
    assetsInlineLimit: 0,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "국기 콕콕",
        short_name: "국기콕콕",
        description: "국기를 맞히며 세계를 여행하는 어린이 학습 게임",
        theme_color: "#f0900c",
        background_color: "#fff7ea",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          { src: "pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
