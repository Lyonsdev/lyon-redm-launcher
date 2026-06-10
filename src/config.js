const ARTIFACT_INDEX_URL = "https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/";

const FRAMEWORKS = {
  rsg: {
    id: "rsg",
    label: "RSG",
    subtitle: "Rexshack RedM Build",
    recipeUrl: "https://raw.githubusercontent.com/Rexshack-RedM/txAdminRecipe/main/rsgcore.yaml",
    defaultDatabase: "rsg_redm",
    defaultFolder: "RSG-Server",
    accent: "#b87336"
  },
  vorp: {
    id: "vorp",
    label: "VORP",
    subtitle: "VORPCore official",
    recipeUrl: "https://raw.githubusercontent.com/VORPCORE/VORP_txAdmin/main/vorp_recipe.yaml",
    defaultDatabase: "vorp_redm",
    defaultFolder: "VORP-Server",
    accent: "#d7a24a"
  },
  redemrp: {
    id: "redemrp",
    label: "RedEM:RP",
    subtitle: "RedEM-RP framework",
    recipeUrl: "https://raw.githubusercontent.com/RedEM-RP/txAdminRecipe/main/recipe.yaml",
    defaultDatabase: "redemrp_redm",
    defaultFolder: "RedEMRP-Server",
    accent: "#8e3d2c"
  }
};

const DEFAULT_PORTS = {
  game: 30120,
  txAdmin: 40120,
  database: 3306
};

const LINKS = {
  discord: "https://discord.gg/CmBhYeaZav",
  lyon: "https://www.lyonscripts.com/"
};

module.exports = {
  ARTIFACT_INDEX_URL,
  DEFAULT_PORTS,
  FRAMEWORKS,
  LINKS
};
