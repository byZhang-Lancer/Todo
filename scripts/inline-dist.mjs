import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(rootDir, "dist");
const htmlPath = resolve(distDir, "index.html");

let html = await readFile(htmlPath, "utf8");

const cssMatch = html.match(/<link rel="stylesheet" crossorigin href="\.\/([^"]+)">/);
if (cssMatch) {
  const css = await readFile(resolve(distDir, cssMatch[1]), "utf8");
  html = html.replace(cssMatch[0], () => `<style>\n${css}\n</style>`);
}

const jsMatch = html.match(/<script type="module" crossorigin src="\.\/([^"]+)"><\/script>/);
if (jsMatch) {
  const js = await readFile(resolve(distDir, jsMatch[1]), "utf8");
  const safeJs = js.replaceAll("</script", "<\\/script");
  html = html.replace(jsMatch[0], "");
  html = html.replace("</body>", () => `    <script>\n${safeJs}\n</script>\n  </body>`);
}

await writeFile(htmlPath, html);
