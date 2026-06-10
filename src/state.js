const fs = require("node:fs/promises");
const path = require("node:path");

function getStateFile(app) {
  return path.join(app.getPath("userData"), "installations.json");
}

async function readState(app) {
  const stateFile = getStateFile(app);

  try {
    const raw = await fs.readFile(stateFile, "utf8");
    const parsed = JSON.parse(raw);
    return {
      activeInstallationId: parsed.activeInstallationId || null,
      installations: Array.isArray(parsed.installations) ? parsed.installations : []
    };
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Could not read state: ${error.message}`);
    }

    return {
      activeInstallationId: null,
      installations: []
    };
  }
}

async function writeState(app, state) {
  const stateFile = getStateFile(app);
  await fs.mkdir(path.dirname(stateFile), { recursive: true });
  await fs.writeFile(stateFile, JSON.stringify(state, null, 2), "utf8");
}

async function upsertInstallation(app, installation) {
  const state = await readState(app);
  const index = state.installations.findIndex((item) => item.id === installation.id);

  if (index >= 0) {
    state.installations[index] = {
      ...state.installations[index],
      ...installation,
      updatedAt: new Date().toISOString()
    };
  } else {
    state.installations.push({
      ...installation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  state.activeInstallationId = installation.id;
  await writeState(app, state);
  return state;
}

module.exports = {
  getStateFile,
  readState,
  upsertInstallation,
  writeState
};
