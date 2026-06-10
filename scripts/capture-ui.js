const fs = require("node:fs/promises");
const path = require("node:path");
const { app, BrowserWindow } = require("electron");

async function main() {
  const root = path.resolve(__dirname, "..");
  const output = path.join(root, "tmp", "ui-preview.png");
  const dropdownOutput = path.join(root, "tmp", "ui-preview-dropdown.png");
  await fs.mkdir(path.dirname(output), { recursive: true });

  await app.whenReady();
  const win = new BrowserWindow({
    width: 1149,
    height: 709,
    show: false,
    frame: false,
    backgroundColor: "#080604",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preview-preload.js")
    }
  });

  await win.loadFile(path.join(root, "app", "index.html"));
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const image = await win.webContents.capturePage();
  await fs.writeFile(output, image.toPNG());

  await win.webContents.executeJavaScript("document.getElementById('artifactDropdownButton')?.click()");
  await new Promise((resolve) => setTimeout(resolve, 250));
  const dropdownImage = await win.webContents.capturePage();
  await fs.writeFile(dropdownOutput, dropdownImage.toPNG());

  console.log(output);
  console.log(dropdownOutput);
  app.quit();
}

main().catch((error) => {
  console.error(error);
  app.quit();
  process.exitCode = 1;
});
