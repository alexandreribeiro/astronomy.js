import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/main.js",
      name: "AstronomyJS",
      fileName: (format) =>
        format === "umd" ? "astronomy.min.js" : `astronomy.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
});
