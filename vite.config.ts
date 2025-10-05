import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Improve development server performance
    hmr: {
      overlay: true, // Show error overlay in browser
    },
  },
  plugins: [
    react({
      // Optimize SWC plugin for faster compilation
      swcOptions: {
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Ensure compatibility with browser-based dependencies
      "react-beautiful-dnd": path.resolve(__dirname, "./node_modules/react-beautiful-dnd"),
      "framer-motion": path.resolve(__dirname, "./node_modules/framer-motion"),
      "emoji-picker-react": path.resolve(__dirname, "./node_modules/emoji-picker-react"),
    },
  },
  build: {
    // Optimize output for production
    minify: "esbuild", // Faster minification
    sourcemap: mode === "development" ? "inline" : false, // Sourcemaps only in development
    chunkSizeWarningLimit: 1000, // Increase limit for larger dependencies like framer-motion
    rollupOptions: {
      output: {
        // Manual chunking for large dependencies to improve caching
        manualChunks: {
          "vendor": ["react", "react-dom"],
          "ui-libs": ["framer-motion", "react-beautiful-dnd", "emoji-picker-react"],
          "markdown": ["react-markdown", "rehype-highlight", "rehype-raw", "remark-gfm"],
        },
      },
    },
  },
  optimizeDeps: {
    // Pre-bundle dependencies to reduce initial load time
    include: ["react", "react-dom", "framer-motion", "react-beautiful-dnd", "emoji-picker-react"],
  },
  // Improve CSS handling for Tailwind and animations
  css: {
    postcss: {
      plugins: [
        require("tailwindcss")({
          config: path.resolve(__dirname, "tailwind.config.js"),
        }),
        require("autoprefixer"),
      ],
    },
  },
  // Environment variables for Vercel
  envPrefix: ["VITE_", "REACT_"], // Support both Vite and legacy React env variables
}));
