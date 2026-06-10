const fs = require("node:fs/promises");
const path = require("node:path");

const AdmZip = require("adm-zip");
const mysql = require("mysql2/promise");
const YAML = require("yaml");

function normalizeRelativePath(value) {
  return value.replaceAll("\\", "/").replace(/^\.?\//, "");
}

function resolveDataPath(dataDir, relativePath) {
  return path.resolve(dataDir, normalizeRelativePath(relativePath || ""));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeIdentifier(identifier) {
  if (!/^[a-zA-Z0-9_]+$/.test(identifier)) {
    throw new Error(`Invalid database name: ${identifier}`);
  }

  return `\`${identifier}\``;
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function movePath(source, destination) {
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.rm(destination, { recursive: true, force: true });

  try {
    await fs.rename(source, destination);
  } catch {
    await fs.cp(source, destination, { recursive: true, force: true });
    await fs.rm(source, { recursive: true, force: true });
  }
}

async function downloadFile(url, destination, onProgress) {
  await fs.mkdir(path.dirname(destination), { recursive: true });

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Lyon-RedM-Launcher"
    }
  });

  if (!response.ok) {
    throw new Error(`Download failed (${response.status}) ${url}`);
  }

  const total = Number.parseInt(response.headers.get("content-length") || "0", 10);
  const file = await fs.open(destination, "w");
  let received = 0;

  try {
    for await (const chunk of response.body) {
      const buffer = Buffer.from(chunk);
      received += buffer.length;
      await file.write(buffer);

      if (total > 0) {
        onProgress?.({
          received,
          total,
          percent: Math.round((received / total) * 100)
        });
      }
    }
  } finally {
    await file.close();
  }
}

function parseGitHubUrl(repoUrl) {
  const url = new URL(repoUrl);
  const [, owner, repo] = url.pathname.replace(/\.git$/, "").split("/");

  if (!owner || !repo) {
    throw new Error(`Unsupported GitHub URL: ${repoUrl}`);
  }

  return { owner, repo };
}

async function getDefaultBranch(owner, repo) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      "User-Agent": "Lyon-RedM-Launcher"
    }
  });

  if (!response.ok) {
    return "main";
  }

  const data = await response.json();
  return data.default_branch || "main";
}

async function downloadGitHubArchive({ src, ref, subpath, dest, dataDir, tempDir, onLog }) {
  const { owner, repo } = parseGitHubUrl(src);
  const branch = ref || await getDefaultBranch(owner, repo);
  const archivePath = path.join(tempDir, `${owner}-${repo}-${Date.now()}.zip`);
  const extractPath = path.join(tempDir, `${owner}-${repo}-${Date.now()}`);
  const candidates = [
    `https://codeload.github.com/${owner}/${repo}/zip/refs/heads/${encodeURI(branch)}`,
    branch === "main" ? `https://codeload.github.com/${owner}/${repo}/zip/refs/heads/master` : null
  ].filter(Boolean);

  let downloaded = false;
  let lastError = null;

  for (const url of candidates) {
    try {
      onLog?.(`Descargando ${owner}/${repo}@${branch}`);
      await downloadFile(url, archivePath);
      downloaded = true;
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!downloaded) {
    throw lastError || new Error(`Could not download ${src}`);
  }

  await fs.mkdir(extractPath, { recursive: true });
  const zip = new AdmZip(archivePath);
  zip.extractAllTo(extractPath, true);

  const children = await fs.readdir(extractPath);
  if (children.length === 0) {
    throw new Error(`Empty GitHub archive: ${src}`);
  }

  const archiveRoot = path.join(extractPath, children[0]);
  const source = subpath ? path.join(archiveRoot, normalizeRelativePath(subpath)) : archiveRoot;
  const destination = resolveDataPath(dataDir, dest);

  if (!await pathExists(source)) {
    throw new Error(`Subpath not found in ${src}: ${subpath || "."}`);
  }

  await fs.rm(destination, { recursive: true, force: true });
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.cp(source, destination, { recursive: true, force: true });
}

function buildConnectionString(db) {
  const user = encodeURIComponent(db.user || "root");
  const password = db.password ? `:${encodeURIComponent(db.password)}` : "";
  const host = db.host || "127.0.0.1";
  const port = db.port || 3306;
  const database = encodeURIComponent(db.database);
  return `mysql://${user}${password}@${host}:${port}/${database}?charset=utf8mb4`;
}

async function createDbConnection(db) {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: db.host || "127.0.0.1",
      port: Number(db.port || 3306),
      user: db.user || "root",
      password: db.password || "",
      multipleStatements: true
    });
  } catch (error) {
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      throw new Error("No se pudo conectar a MySQL/MariaDB: usuario o password incorrectos.");
    }
    if (error.code === "ECONNREFUSED") {
      throw new Error("No se pudo conectar a MySQL/MariaDB: el servicio no responde en el puerto indicado.");
    }
    throw error;
  }

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${safeIdentifier(db.database)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await connection.query(`USE ${safeIdentifier(db.database)}`);
  return connection;
}

async function inspectDatabase(db) {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: db.host || "127.0.0.1",
      port: Number(db.port || 3306),
      user: db.user || "root",
      password: db.password || ""
    });

    const [schemas] = await connection.query(
      "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?",
      [db.database]
    );
    const exists = schemas.length > 0;
    let tableCount = 0;

    if (exists) {
      const [tables] = await connection.query(
        "SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?",
        [db.database]
      );
      tableCount = Number(tables[0]?.count || 0);
    }

    return { exists, tableCount };
  } catch (error) {
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      throw new Error("No se pudo revisar la base de datos: usuario o password incorrectos.");
    }
    if (error.code === "ECONNREFUSED") {
      throw new Error("No se pudo revisar la base de datos: MySQL/MariaDB no responde.");
    }
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function runSqlFile(connection, filePath) {
  const sql = await fs.readFile(filePath, "utf8");
  const cleaned = sql
    .replace(/^\s*DELIMITER\s+.+$/gim, "")
    .replace(/^\s*--.*$/gm, "");

  await connection.query(cleaned);
}

function buildTemplateContext(context, recipe) {
  const dbConnectionString = buildConnectionString(context.database);
  const endpointLines = [
    `endpoint_add_tcp "0.0.0.0:${context.ports.game}"`,
    `endpoint_add_udp "0.0.0.0:${context.ports.game}"`
  ].join("\n");
  const adminPrincipal = (context.adminPrincipal || "").trim();

  return {
    addPrincipalsMaster: adminPrincipal
      ? `add_ace identifier.${adminPrincipal} group.admin command allow`
      : "",
    dbConnectionString,
    maxClients: String(context.maxClients || 48),
    principalMasterIdentifier: adminPrincipal,
    recipeAuthor: recipe.author || context.frameworkLabel,
    recipeDescription: recipe.description || "",
    recipeName: recipe.name || context.frameworkLabel,
    serverEndpoints: endpointLines,
    serverName: context.serverName || "Lyon RedM Server",
    steam_webApiKey: context.steamWebApiKey || "none",
    svLicense: context.licenseKey || "changeme"
  };
}

async function applyServerCfgTemplate(dataDir, context, recipe) {
  const cfgPath = path.join(dataDir, "server.cfg");
  if (!await pathExists(cfgPath)) {
    return;
  }

  const replacements = buildTemplateContext(context, recipe);
  let content = await fs.readFile(cfgPath, "utf8");

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(`{{${key}}}`, value);
  }

  content = content.replace(/\{\{[^}]+}}/g, "");
  await fs.writeFile(cfgPath, content, "utf8");
}

async function executeRecipe({ recipeUrl, dataDir, context, onProgress, onLog, skipDatabaseSql = false }) {
  const tempDir = path.join(dataDir, ".lyon-tmp");
  const recipePath = path.join(tempDir, "recipe.yaml");

  await fs.mkdir(tempDir, { recursive: true });
  onProgress?.({ step: "recipe", label: "Descargando receta txAdmin", percent: 0 });
  await downloadFile(recipeUrl, recipePath);

  const raw = await fs.readFile(recipePath, "utf8");
  const recipe = YAML.parse(raw);
  const tasks = Array.isArray(recipe.tasks) ? recipe.tasks : [];
  let connection = null;

  try {
    for (let index = 0; index < tasks.length; index += 1) {
      const task = tasks[index];
      const percent = Math.round(((index + 1) / Math.max(tasks.length, 1)) * 100);
      onProgress?.({
        step: "recipe",
        label: `${task.action || "task"} (${index + 1}/${tasks.length})`,
        percent
      });

      switch (task.action) {
        case "download_github":
          await downloadGitHubArchive({
            src: task.src,
            ref: task.ref,
            subpath: task.subpath,
            dest: task.dest,
            dataDir,
            tempDir,
            onLog
          });
          break;

        case "download_file":
          await downloadFile(task.url, resolveDataPath(dataDir, task.path), (progress) => {
            onProgress?.({
              step: "recipe",
              label: `Descargando ${path.basename(task.path)}`,
              percent: progress.percent
            });
          });
          break;

        case "unzip": {
          const source = resolveDataPath(dataDir, task.src);
          const destination = resolveDataPath(dataDir, task.dest);
          await fs.mkdir(destination, { recursive: true });
          new AdmZip(source).extractAllTo(destination, true);
          break;
        }

        case "move_path":
          await movePath(resolveDataPath(dataDir, task.src), resolveDataPath(dataDir, task.dest));
          break;

        case "remove_path":
          await fs.rm(resolveDataPath(dataDir, task.path), { recursive: true, force: true });
          break;

        case "connect_database":
          connection = await createDbConnection(context.database);
          break;

        case "query_database":
          if (skipDatabaseSql) {
            onLog?.(`SQL omitido por DB existente: ${task.file}`);
            break;
          }
          if (!connection) {
            connection = await createDbConnection(context.database);
          }
          await runSqlFile(connection, resolveDataPath(dataDir, task.file));
          break;

        case "waste_time":
          await sleep(Number(task.seconds || 1) * 1000);
          break;

        default:
          onLog?.(`Tarea ignorada: ${task.action}`);
          break;
      }
    }

    await applyServerCfgTemplate(dataDir, context, recipe);
    onProgress?.({ step: "recipe", label: "Receta aplicada", percent: 100 });
    return recipe;
  } finally {
    if (connection) {
      await connection.end();
    }
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

module.exports = {
  buildConnectionString,
  downloadFile,
  executeRecipe,
  inspectDatabase
};
