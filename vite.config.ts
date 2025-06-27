import fs from "node:fs";
import {defineConfig} from "vite";
import GlslPlugin from "./glslPlugin";
function readSrc(rootPath: string) {
  const inputMap: {[n: string]: string} = {};
  const files = fs.readdirSync(rootPath);
  files.forEach((item: string) => {
    if (!["utils", "@types"].includes(item)) inputMap[item] = `${rootPath}/${item}/index.ts`;
  });
  return inputMap;
}
const pages = readSrc("./src");
fs.writeFileSync("./urls.ts", "export default " + JSON.stringify(pages));

export default defineConfig(({mode}) => {
  return {
    plugins: [GlslPlugin()],
    build: {
      minify: true,
      rollupOptions: {
        input: pages,
        output: {
          entryFileNames: "[name]/index.js"
        }
      }
    }
  };
});
