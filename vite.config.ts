import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: true, // Show error overlay in browser
    },
  },
  plugins: [
    react({
      swcOptions: {
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react-beautiful-dnd": path.resolve(__dirname, "./node_modules/react-beautiful-dnd"),
      "framer-motion": path.resolve(__dirname, "./node_modules/framer-motion"),
      "emoji-picker-react": path.resolve(__dirname, "./node_modules/emoji-picker-react"),
    },
  },
  build: {
    minify: "esbuild",
    sourcemap: mode === "development" ? "inline" : false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor": ["react", "react-dom"],
          "ui-libs": ["framer-motion", "react-beautiful-dnd", "emoji-picker-react"],
          "markdown": ["react-markdown", "rehype-highlight", "rehype-raw", "remark-gfm"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion", "react-beautiful-dnd", "emoji-picker-react"],
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(path.resolve(__dirname, "tailwind.config.js")),
        autoprefixer(),
      ],
    },
  },
  envPrefix: ["VITE_", "REACT_"],
}));
