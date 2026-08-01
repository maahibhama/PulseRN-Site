// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://maahibhama.github.io",
  base: "/PulseRN-Site",
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "PulseRN",
      description:
        "The open-source React Native debugging desktop app and SDK.",
      favicon: "/favicon.svg",
      customCss: ["./src/styles/custom.css"],
      head: [
        { tag: "meta", attrs: { property: "og:type", content: "website" } },
        {
          tag: "meta",
          attrs: {
            property: "og:title",
            content: "PulseRN — Debug the whole story.",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:description",
            content:
              "The open-source desktop debugger for React Native, with every signal in one timeline.",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "https://maahibhama.github.io/PulseRN-Site/og.png",
          },
        },
        {
          tag: "meta",
          attrs: { property: "og:image:width", content: "1200" },
        },
        {
          tag: "meta",
          attrs: { property: "og:image:height", content: "630" },
        },
        {
          tag: "meta",
          attrs: { name: "twitter:card", content: "summary_large_image" },
        },
      ],
      logo: {
        dark: "./src/assets/pulsern-logo-dark.svg",
        light: "./src/assets/pulsern-logo.svg",
        alt: "",
        replacesTitle: true,
      },
      editLink: {
        baseUrl: "https://github.com/maahibhama/PulseRN-Site/edit/main/",
      },
      lastUpdated: true,
      social: [
        {
          icon: "github",
          label: "PulseRN on GitHub",
          href: "https://github.com/maahibhama/PulseRN",
        },
      ],
      sidebar: [
        {
          label: "Start Here",
          items: [
            { label: "Getting Started", slug: "getting-started" },
            { label: "Installation", slug: "installation" },
            { label: "SDK Setup", slug: "sdk" },
            { label: "Compatibility", slug: "compatibility" },
            { label: "Downloads", slug: "downloads" },
          ],
        },
        {
          label: "Use PulseRN",
          items: [
            { label: "Inspectors and features", slug: "features" },
            { label: "Timeline and sessions", slug: "timeline" },
            { label: "Connections and pairing", slug: "connections" },
            { label: "JavaScript debugger", slug: "debugger" },
            { label: "Automatic diagnostics", slug: "diagnostics" },
            { label: "MCP debugger", slug: "mcp" },
            { label: "Session archives", slug: "session-archives" },
            { label: "Guides", slug: "guides" },
            { label: "Troubleshooting", slug: "troubleshooting" },
            { label: "Reference", slug: "reference" },
          ],
        },
        {
          label: "Project",
          items: [
            { label: "Architecture", slug: "architecture" },
            { label: "Development", slug: "development" },
            { label: "Contributing", slug: "contributing" },
            { label: "Releasing", slug: "releasing" },
            { label: "Security", slug: "security" },
            { label: "Roadmap", slug: "roadmap" },
          ],
        },
      ],
    }),
  ],
});
