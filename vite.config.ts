import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    base: "/researchmethods.test/",
    prerender: {
      enabled: true,
      crawlLinks: true,
      // ⬇️ Forces the generator to map routes like "/" to a physical index.html file
      routes: ["/"],
    },
  },
});
