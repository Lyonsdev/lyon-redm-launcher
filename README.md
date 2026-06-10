# Lyon RedM Launcher

Lyon RedM Launcher is a Windows desktop launcher and installer for creating local RedM servers from prepared txAdmin recipes. It can install and start RSG, VORP, or RedEM:RP server builds with a guided UI inspired by classic game launchers.

The repository is source-available for non-commercial use under the PolyForm Noncommercial License 1.0.0. Commercial use, commercial redistribution, selling hosted bundles, paid repackaging, and distributing this project as part of a commercial product are not permitted without separate written permission from Lyon Scripts.

## Features

- Electron-based Windows desktop application.
- Custom themed UI with framework tabs, artifact selector, language selector, progress state, and launch controls.
- Supports three RedM framework recipes:
  - RSG: `https://raw.githubusercontent.com/Rexshack-RedM/txAdminRecipe/main/rsgcore.yaml`
  - VORP: `https://raw.githubusercontent.com/VORPCORE/VORP_txAdmin/main/vorp_recipe.yaml`
  - RedEM:RP: `https://raw.githubusercontent.com/RedEM-RP/txAdminRecipe/main/recipe.yaml`
- Fetches FXServer artifacts from `https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/`.
- Offers latest recommended, latest optional, listed builds, or manual `server.7z` URLs.
- Downloads and extracts server artifacts.
- Applies compatible txAdmin recipe tasks:
  - GitHub repository downloads
  - file downloads
  - unzip operations
  - path moves/removals
  - database connection and SQL import
  - `server.cfg` placeholder replacement
- Detects local MySQL/MariaDB.
- Can install MariaDB through `winget` when no local SQL service is detected.
- Can create Windows firewall rules for RedM and txAdmin ports.
- Generates `run.cmd` and `txadmin.cmd`.
- Remembers installed servers and can start them directly.
- Produces NSIS installer and portable `.exe` builds.
- Produces `latest.yml` and `.blockmap` release assets for future updater support.

## License

This project is licensed under the PolyForm Noncommercial License 1.0.0.

See [LICENSE](./LICENSE).

Important summary:

- Personal, educational, hobby, testing, research, and other non-commercial use is allowed.
- Commercial use is not allowed without separate written permission.
- Commercial redistribution is not allowed without separate written permission.
- This is a source-available non-commercial license, not an OSI-approved open source license.

This summary is only a convenience. The full license text controls.

## Requirements

### Runtime

- Windows 10 or Windows 11 x64.
- Administrator privileges for actions that install MariaDB or open firewall rules.
- Internet access for downloading artifacts, recipes, GitHub archives, and optional MariaDB install packages.
- A valid Cfx.re server license key for public server startup.
- A Steam Web API key if the selected framework or resources require one.

### Development

- Node.js 20 or newer. The project has been built with Node.js 24.
- npm 10 or newer.
- Git.
- GitHub CLI (`gh`) if you want to publish releases from the command line.
- Windows `winget` if you want to test automatic MariaDB installation.

## Project Structure

```text
app/
  index.html          Renderer markup
  renderer.js         Renderer UI logic
  styles.css          Launcher styling

assets/
  avatarinicio.png
  avatarloading.png
  avatarserverstart.png
  discordlogo.webp
  lyonlogo.png
  logo.png
  flags/
  fonts/

scripts/
  make-icon.js        Converts assets/logo.png to build/icon.ico
  capture-ui.js       Generates local UI preview screenshots
  preview-preload.js  Stub preload used by capture-ui.js

src/
  main.js             Electron main process and IPC handlers
  preload.js          Safe renderer bridge
  installer.js        Install/start orchestration
  recipeEngine.js     txAdmin recipe executor
  artifacts.js        FXServer artifact index parser
  windows.js          Windows, SQL, winget, firewall helpers
  state.js            Installed server state storage
  config.js           Framework and URL configuration
```

## Install Dependencies

From the project root:

```powershell
npm install
```

This installs Electron, Electron Builder, the 7zip helper, YAML parsing, ZIP support, and MySQL client dependencies.

## Run in Development

```powershell
npm start
```

The development build starts Electron directly from the local source files.

For full installer behavior, run PowerShell or the resulting app as Administrator when testing:

- MariaDB installation
- Windows service startup checks
- firewall rule creation

Without Administrator privileges, the UI can still run, but privileged install steps may fail.

## Validate the Source

```powershell
npm run lint
```

This project currently uses `node --check` validation for the Electron main process, preload bridge, installer modules, recipe engine, and renderer script.

## Generate the Windows Icon

```powershell
npm run icon
```

This converts:

```text
assets/logo.png
```

into:

```text
build/icon.ico
```

The generated `build/` directory is intentionally ignored by git.

## Build the App

### Unpacked Build

```powershell
npm run pack
```

Output:

```text
dist/win-unpacked/
```

Use this when you want to inspect the packaged app before making release installers.

### Installer and Portable EXE

```powershell
npm run dist
```

Output:

```text
dist/Lyon RedM Launcher Setup 0.1.0.exe
dist/Lyon RedM Launcher Setup 0.1.0.exe.blockmap
dist/Lyon RedM Launcher 0.1.0.exe
dist/latest.yml
dist/win-unpacked/
```

Do not commit `dist/` to the repository. Release binaries belong in GitHub Releases.

## GitHub Release Workflow

Build release assets:

```powershell
npm run dist
```

Create a tag and release:

```powershell
gh release create v0.1.0 `
  "dist/Lyon RedM Launcher Setup 0.1.0.exe" `
  "dist/Lyon RedM Launcher Setup 0.1.0.exe.blockmap" `
  "dist/Lyon RedM Launcher 0.1.0.exe" `
  "dist/latest.yml" `
  --repo Lyonsdev/lyon-redm-launcher `
  --title "Lyon RedM Launcher v0.1.0" `
  --notes "Initial public release."
```

For future releases:

1. Update `version` in `package.json`.
2. Run `npm install` if package metadata changes need to update `package-lock.json`.
3. Run `npm run lint`.
4. Run `npm run dist`.
5. Commit source changes.
6. Push to `main`.
7. Create a new release tag such as `v0.1.1`.
8. Upload the generated `.exe`, `.blockmap`, and `latest.yml` files.

## Auto-Update Notes

The build already generates update metadata files used by Electron update flows:

- `latest.yml`
- `.blockmap`

The current application does not yet include an in-app updater check. To add automatic updates later, wire `electron-updater` in the main process and configure the publisher as GitHub releases for:

```text
Lyonsdev/lyon-redm-launcher
```

Until then, users can manually download new installers from the GitHub Releases page.

## Fonts

The UI is designed to use Chinese Rocks for display headings and Cinzel for supporting text.

Chinese Rocks is not included in public repository/build output by default because it may require a separate license for redistribution or application embedding.

If you have a valid license, place the font here for local/private builds:

```text
assets/fonts/chinese-rocks.otf
```

The file is ignored by git and excluded from packaged builds unless you intentionally change the build configuration.

Cinzel font files are included under their own license terms. Verify third-party font and asset licenses before redistributing modified builds.

## Assets

Expected image assets:

```text
assets/logo.png
assets/avatarinicio.png
assets/avatarloading.png
assets/avatarserverstart.png
assets/discordlogo.webp
assets/lyonlogo.png
assets/flags/*.png
```

The launcher changes the right-side avatar depending on install state:

- `avatarinicio.png`: idle/start screen
- `avatarloading.png`: installation in progress
- `avatarserverstart.png`: server ready/start state

## Configuration

Framework definitions live in:

```text
src/config.js
```

Each framework includes:

- internal ID
- display label
- recipe URL
- default database name
- default install folder

Default ports:

```text
RedM game: 30120 TCP/UDP
txAdmin: 40120 TCP
MariaDB/MySQL: 3306 TCP
```

The launcher does not expose SQL port `3306` by default. Exposing a database port to the internet is unsafe unless you have a specific network/security plan.

## Installer Behavior

The installer creates this layout inside the selected install folder:

```text
selected-folder/
  artifact/
    FXServer.exe
  server-data/
    server.cfg
    resources/
  logs/
  .downloads/
  run.cmd
  txadmin.cmd
  lyon-install.json
```

The launcher stores remembered installations in Electron's user data directory, not in the repository.

## Troubleshooting

### `gh` is not authenticated

```powershell
gh auth login --hostname github.com --web --git-protocol https --scopes repo,workflow
```

### Build fails during Electron download

Check network access and rerun:

```powershell
npm run dist
```

### Firewall or MariaDB install fails

Run the app or PowerShell as Administrator.

### SQL connection fails

Check:

- MariaDB/MySQL service is running.
- Host is usually `127.0.0.1`.
- Port is usually `3306`.
- User/password are correct.
- The selected database name only uses letters, numbers, and underscores.

### Recipe fails

Recipes are remote files controlled by their framework maintainers. If a recipe changes, inspect its tasks and update `src/recipeEngine.js` if the recipe starts using a task action that is not supported yet.

### Artifact download fails

Open:

```text
https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/
```

Confirm that the selected artifact URL still exists and ends in `server.7z`.

## Security Notes

- Do not publish server license keys.
- Do not publish database passwords.
- Do not expose SQL port `3306` unless absolutely necessary.
- Treat downloaded recipes and resources as third-party code.
- Review framework licenses before redistributing bundled server resources.

## Repository

```text
https://github.com/Lyonsdev/lyon-redm-launcher
```
