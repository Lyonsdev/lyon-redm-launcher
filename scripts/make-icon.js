const fs = require("node:fs/promises");
const path = require("node:path");
const pngToIcoModule = require("png-to-ico");
const pngToIco = pngToIcoModule.default || pngToIcoModule;

async function main() {
  const root = path.resolve(__dirname, "..");
  const source = path.join(root, "assets", "logo.png");
  const outputDir = path.join(root, "build");
  const output = path.join(outputDir, "icon.ico");

  await fs.mkdir(outputDir, { recursive: true });
  const ico = await pngToIco(source);
  await fs.writeFile(output, ico);
  console.log(`Wrote ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
