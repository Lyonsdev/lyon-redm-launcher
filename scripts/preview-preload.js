const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("lyon", {
  app: {
    close: async () => undefined,
    minimize: async () => undefined,
    openExternal: async () => undefined
  },
  dialog: {
    selectFolder: async () => "C:\\LyonRedMServers\\RSG-Server"
  },
  installer: {
    checkPrereqs: async () => ({
      admin: true,
      database: { Services: [{ Name: "MariaDB", DisplayName: "MariaDB", Status: "Running" }], PortOpen: true }
    }),
    detectInstall: async () => ({ installed: false }),
    fetchArtifacts: async () => ([
      {
        build: 25770,
        channel: "recommended",
        label: "Latest recommended (25770)",
        url: "https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/25770/server.7z"
      },
      {
        build: 7290,
        channel: "optional",
        label: "Latest optional (7290)",
        url: "https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/7290/server.7z"
      }
    ]),
    getInitialState: async () => ({
      admin: true,
      defaultInstallRoot: "C:\\LyonRedMServers",
      defaultPorts: { game: 30120, txAdmin: 40120, database: 3306 },
      frameworks: [
        { id: "rsg", label: "RSG", subtitle: "Rexshack RedM Build", defaultDatabase: "rsg_redm", defaultFolder: "RSG-Server" },
        { id: "vorp", label: "VORP", subtitle: "VORPCore official", defaultDatabase: "vorp_redm", defaultFolder: "VORP-Server" },
        { id: "redemrp", label: "RedEM:RP", subtitle: "RedEM-RP framework", defaultDatabase: "redemrp_redm", defaultFolder: "RedEMRP-Server" }
      ],
      locale: "es",
      state: { installations: [] }
    }),
    install: async () => undefined,
    onProgress: () => () => undefined,
    openFolder: async () => undefined,
    start: async () => undefined
  }
});
