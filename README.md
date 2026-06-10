# Lyon RedM Launcher

Launcher e instalador open source para levantar servidores RedM desde cero con RSG, VORP o RedEM:RP.

## Qué hace

- Descarga artifacts de FXServer desde `runtime.fivem.net`.
- Permite elegir `Latest recommended`, `Latest optional`, una versión listada o una URL manual.
- Instala recetas txAdmin compatibles para:
  - VORP: `https://raw.githubusercontent.com/VORPCORE/VORP_txAdmin/main/vorp_recipe.yaml`
  - RSG: `https://raw.githubusercontent.com/Rexshack-RedM/txAdminRecipe/main/rsgcore.yaml`
  - RedEM:RP: `https://raw.githubusercontent.com/RedEM-RP/txAdminRecipe/main/recipe.yaml`
- Detecta MySQL/MariaDB local y puede instalar MariaDB con winget.
- Crea la base de datos y ejecuta los SQL de la receta.
- Abre reglas de firewall para RedM/txAdmin.
- Genera `run.cmd` y permite iniciar el servidor desde la app.
- Guarda instalaciones previas para iniciarlas directamente.

## Requisitos

- Windows 10/11 x64.
- Node.js 20+ para desarrollo.
- Winget para instalación automática de MariaDB.
- Licencia Cfx.re propia (`sv_licenseKey`) para arrancar servidores públicos.
- Steam Web API key si el framework la requiere.

## Desarrollo

```powershell
npm install
npm start
```

## Crear .exe

```powershell
npm run dist
```

El build genera un instalador NSIS y un portable en `dist/`. La app empaquetada solicita permisos de administrador porque puede instalar MariaDB y abrir reglas de firewall.

## Fuente principal

La UI usa `Chinese Rocks` para títulos y `Cinzel` para controles. Coloca fuentes con licencia válida en:

```text
assets/fonts/chinese-rocks.otf
assets/fonts/cinzel.otf
assets/fonts/cinzel-bold.otf
```

Chinese Rocks puede tener licencias distintas para desktop, web y app embedding. Antes de publicar el repositorio o distribuir el `.exe`, confirma que tu licencia permite redistribución/embedding.
Por defecto, `assets/fonts/chinese-rocks.otf` queda excluida del repositorio y de los builds públicos para evitar redistribuir una licencia incorrecta.

## Flags

Las banderas del selector de idioma se tomaron del repositorio `yammadev/flag-icons`:

```text
https://github.com/yammadev/flag-icons/tree/master/png
```

## Nota de seguridad

El launcher no abre el puerto `3306` por defecto. Solo abre `30120 TCP/UDP` y `40120 TCP` si se confirma en la UI. Exponer MySQL/MariaDB a internet no se recomienda salvo que sepas exactamente lo que estás haciendo.
