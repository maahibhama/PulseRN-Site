import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

const root = resolve("dist");
const htmlFiles = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (extname(entry.name) === ".html") htmlFiles.push(path);
  }
}

await walk(root);

const knownPaths = new Set(
  htmlFiles.flatMap((file) => {
    const path = `/${relative(root, file).replaceAll("\\", "/")}`;
    if (path === "/index.html") return ["/"];
    return [
      path,
      path.replace(/index\.html$/, ""),
      path.replace(/\.html$/, "/"),
    ];
  }),
);
const failures = [];
const attributePattern = /\b(?:href|src)=["']([^"'#]+)(?:#[^"']*)?["']/g;

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const [, target] of html.matchAll(attributePattern)) {
    if (/^(?:https?:|mailto:|tel:|data:|javascript:)/.test(target)) continue;
    const path = new URL(
      target,
      `https://maahibhama.github.io/${relative(root, file)}`,
    ).pathname;
    if (path.startsWith("/_astro/")) continue;
    if (knownPaths.has(path)) continue;
    try {
      await readFile(join(root, path));
    } catch {
      failures.push(`${relative(root, file)} -> ${target}`);
    }
  }
}

if (failures.length) {
  console.error(
    `Broken internal links:\n${failures.map((failure) => `- ${failure}`).join("\n")}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `Checked ${htmlFiles.length} HTML files: no broken internal links.`,
  );
}
