const fs = require("node:fs/promises");
const path = require("node:path");
const { spawn } = require("node:child_process");

const sevenZip = require("7zip-bin");

const { FRAMEWORKS } = require("./config");
const { downloadFile, executeRecipe, inspectDatabase } = require("./recipeEngine");
const {
  checkDatabaseService,
  checkPortUsage,
  getDefaultInstallRoot,
  installMariaDb,
  openServerFirewall,
  runCommand,
  startDatabaseServices
} = require("./windows");

function makeInstallationId(frameworkId, installPath) {
  return `${frameworkId}:${installPath.toLowerCase()}`;
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function getInstallLayout(installPath) {
  return {
    root: installPath,
    artifactDir: path.join(installPath, "artifact"),
    dataDir: path.join(installPath, "server-data"),
    logsDir: path.join(installPath, "logs"),
    downloadsDir: path.join(installPath, ".downloads"),
    fxServer: path.join(installPath, "artifact", "FXServer.exe"),
    serverCfg: path.join(installPath, "server-data", "server.cfg"),
    runCmd: path.join(installPath, "run.cmd"),
    txAdminCmd: path.join(installPath, "txadmin.cmd"),
    metadataFile: path.join(installPath, "lyon-install.json")
  };
}

async function writeRunScripts(layout, ports) {
  const runCmd = [
    "@echo off",
    "setlocal",
    "cd /d \"%~dp0server-data\"",
    "\"%~dp0artifact\\FXServer.exe\" +exec server.cfg +set gamename rdr3",
    "pause"
  ].join("\r\n");
  const txAdminCmd = [
    "@echo off",
    "setlocal",
    "cd /d \"%~dp0server-data\"",
    `"%~dp0artifact\\FXServer.exe" +set txAdminPort ${ports.txAdmin} +set gamename rdr3`,
    "pause"
  ].join("\r\n");

  await fs.writeFile(layout.runCmd, runCmd, "utf8");
  await fs.writeFile(layout.txAdminCmd, txAdminCmd, "utf8");
}

async function extract7z(source, destination, onData) {
  await fs.mkdir(destination, { recursive: true });
  const sevenZipPath = sevenZip.path7za.replace("app.asar", "app.asar.unpacked");
  const result = await runCommand(sevenZipPath, ["x", source, `-o${destination}`, "-y"], { onData });

  if (result.code !== 0) {
    throw new Error(`7z extraction failed: ${result.stderr || result.stdout}`);
  }
}

function emit(sender, payload) {
  sender?.send("installer:progress", payload);
}

async function ensureMariaDb(config, sender) {
  emit(sender, { step: "sql", label: "Revisando servicio SQL", percent: 5 });
  const current = await checkDatabaseService();
  const services = Array.isArray(current.Services) ? current.Services : current.Services ? [current.Services] : [];
  const running = current.PortOpen || services.some((service) => service.Status === "Running");

  if (running) {
    emit(sender, { step: "sql", label: "SQL activo detectado", percent: 100 });
    return { installed: false, detected: true };
  }

  if (!config.installSqlIfMissing) {
    emit(sender, { step: "sql", label: "SQL no detectado; instalación omitida", percent: 100 });
    return { installed: false, detected: false };
  }

  emit(sender, { step: "sql", label: "Instalando MariaDB con winget", percent: 15 });
  const result = await installMariaDb((line) => {
    emit(sender, { step: "sql", label: line.trim().slice(0, 120), percent: 45 });
  });

  if (result.code !== 0) {
    throw new Error(`MariaDB install failed: ${result.stderr || result.stdout}`);
  }

  await startDatabaseServices();
  emit(sender, { step: "sql", label: "MariaDB listo", percent: 100 });
  return { installed: true, detected: false };
}

async function preflight(config, sender) {
  emit(sender, { step: "prepare", label: "Verificando puertos y base de datos", percent: 5 });
  const busyPorts = await checkPortUsage([config.ports.game, config.ports.txAdmin]);

  if (busyPorts.length > 0) {
    const details = busyPorts
      .map((item) => `${item.Protocol} ${item.Port} (${item.ProcessName || "PID"} ${item.Pid || "?"})`)
      .join(", ");
    throw new Error(`Puerto ocupado: ${details}. Cambia los puertos en Avanzado o cierra el proceso que los usa.`);
  }

  let database = { exists: false, tableCount: 0 };
  try {
    database = await inspectDatabase(config.database);
  } catch (error) {
    if (!config.installSqlIfMissing) {
      throw error;
    }
    emit(sender, { step: "prepare", label: error.message, percent: 20 });
  }

  if (database.exists && database.tableCount > 0 && config.reuseExistingDatabase) {
    emit(sender, {
      step: "prepare",
      label: `DB existente detectada (${database.tableCount} tablas). Se omitira SQL.`,
      percent: 100
    });
  } else {
    emit(sender, { step: "prepare", label: "Preflight correcto", percent: 100 });
  }

  return {
    skipDatabaseSql: database.exists && database.tableCount > 0 && config.reuseExistingDatabase
  };
}

async function installArtifact(config, layout, sender) {
  if (await pathExists(layout.fxServer) && !config.forceArtifact) {
    emit(sender, { step: "artifact", label: "Artifact existente detectado", percent: 100 });
    return;
  }

  const artifactUrl = config.artifactUrl;
  if (!artifactUrl) {
    throw new Error("No artifact URL selected");
  }

  await fs.mkdir(layout.downloadsDir, { recursive: true });
  await fs.rm(layout.artifactDir, { recursive: true, force: true });
  await fs.mkdir(layout.artifactDir, { recursive: true });

  const archivePath = path.join(layout.downloadsDir, "server.7z");
  emit(sender, { step: "artifact", label: "Descargando artifact", percent: 0 });
  await downloadFile(artifactUrl, archivePath, (progress) => {
    emit(sender, {
      step: "artifact",
      label: `Descargando artifact ${progress.percent}%`,
      percent: progress.percent
    });
  });

  emit(sender, { step: "artifact", label: "Extrayendo artifact", percent: 80 });
  await extract7z(archivePath, layout.artifactDir, (line) => {
    const trimmed = line.trim();
    if (trimmed) {
      emit(sender, { step: "artifact", label: trimmed.slice(0, 120), percent: 90 });
    }
  });

  if (!await pathExists(layout.fxServer)) {
    throw new Error("FXServer.exe was not found after artifact extraction");
  }

  emit(sender, { step: "artifact", label: "Artifact instalado", percent: 100 });
}

async function installRecipe(config, layout, sender, options = {}) {
  const framework = FRAMEWORKS[config.frameworkId];
  if (!framework) {
    throw new Error(`Unknown framework: ${config.frameworkId}`);
  }

  if (await pathExists(layout.serverCfg) && !config.forceRecipe) {
    emit(sender, { step: "recipe", label: "Servidor ya preparado", percent: 100 });
    return null;
  }

  await fs.rm(layout.dataDir, { recursive: true, force: true });
  await fs.mkdir(layout.dataDir, { recursive: true });

  const recipe = await executeRecipe({
    recipeUrl: framework.recipeUrl,
    dataDir: layout.dataDir,
    context: {
      adminPrincipal: config.adminPrincipal,
      database: config.database,
      frameworkLabel: framework.label,
      licenseKey: config.licenseKey,
      maxClients: config.maxClients,
      ports: config.ports,
      serverName: config.serverName,
      steamWebApiKey: config.steamWebApiKey
    },
    onProgress: (payload) => emit(sender, payload),
    onLog: (line) => emit(sender, { step: "recipe-log", label: line, percent: null }),
    skipDatabaseSql: options.skipDatabaseSql
  });

  return recipe;
}

async function writeMetadata(config, layout, recipe) {
  const framework = FRAMEWORKS[config.frameworkId];
  const metadata = {
    id: makeInstallationId(config.frameworkId, layout.root),
    frameworkId: config.frameworkId,
    frameworkLabel: framework.label,
    installPath: layout.root,
    artifactUrl: config.artifactUrl,
    artifactLabel: config.artifactLabel,
    recipeName: recipe?.name || framework.subtitle,
    serverName: config.serverName,
    ports: config.ports,
    createdAt: new Date().toISOString()
  };

  await fs.writeFile(layout.metadataFile, JSON.stringify(metadata, null, 2), "utf8");
  return metadata;
}

async function installServer(config, sender) {
  const framework = FRAMEWORKS[config.frameworkId];
  if (!framework) {
    throw new Error("Selecciona un framework válido.");
  }

  const installPath = config.installPath || path.join(getDefaultInstallRoot(), framework.defaultFolder);
  const layout = getInstallLayout(installPath);

  emit(sender, { step: "prepare", label: "Preparando carpetas", percent: 0 });
  await fs.mkdir(layout.root, { recursive: true });
  await fs.mkdir(layout.logsDir, { recursive: true });

  await ensureMariaDb(config, sender);
  const preflightResult = await preflight(config, sender);

  if (config.openFirewall) {
    emit(sender, { step: "firewall", label: "Abriendo reglas de firewall", percent: 25 });
    await openServerFirewall({
      gamePort: config.ports.game,
      txAdminPort: config.ports.txAdmin,
      exposeDatabase: config.exposeDatabase,
      databasePort: config.ports.database
    });
    emit(sender, { step: "firewall", label: "Firewall listo", percent: 100 });
  } else {
    emit(sender, { step: "firewall", label: "Firewall omitido", percent: 100 });
  }

  await installArtifact(config, layout, sender);
  const recipe = await installRecipe(config, layout, sender, preflightResult);
  await writeRunScripts(layout, config.ports);
  const metadata = await writeMetadata(config, layout, recipe);

  emit(sender, { step: "done", label: "Servidor listo para iniciar", percent: 100, metadata });
  return metadata;
}

function startServer(installation, txAdmin = false) {
  const layout = getInstallLayout(installation.installPath);
  const command = txAdmin ? layout.txAdminCmd : layout.runCmd;
  const child = spawn("cmd.exe", ["/c", "start", "", command], {
    cwd: layout.root,
    detached: true,
    stdio: "ignore",
    windowsHide: false
  });

  child.unref();
}

async function detectInstallAt(frameworkId, installPath) {
  const layout = getInstallLayout(installPath);
  const installed = await pathExists(layout.fxServer) && await pathExists(layout.serverCfg);
  let metadata = null;

  if (await pathExists(layout.metadataFile)) {
    try {
      metadata = JSON.parse(await fs.readFile(layout.metadataFile, "utf8"));
    } catch {
      metadata = null;
    }
  }

  return {
    id: makeInstallationId(frameworkId, installPath),
    installed,
    installPath,
    frameworkId,
    metadata
  };
}

module.exports = {
  detectInstallAt,
  getInstallLayout,
  installServer,
  makeInstallationId,
  startServer
};
