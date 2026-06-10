const $ = (selector) => document.querySelector(selector);

const LANGUAGES = [
  { id: "es", code: "ES", name: "Español" },
  { id: "en", code: "EN", name: "English" },
  { id: "pt", code: "PT", name: "Português" },
  { id: "nl", code: "NL", name: "Nederlands" },
  { id: "ko", code: "KO", name: "한국어" },
  { id: "it", code: "IT", name: "Italiano" },
  { id: "fr", code: "FR", name: "Français" },
  { id: "de", code: "DE", name: "Deutsch" },
  { id: "pl", code: "PL", name: "Polski" },
  { id: "ru", code: "RU", name: "Русский" },
  { id: "ar", code: "AR", name: "العربية" },
  { id: "mn", code: "MN", name: "Монгол" }
];

const STRINGS = {
  es: {
    admin: "Administrador",
    noAdmin: "Sin administrador",
    init: "Inicializando",
    tabs: { setup: "Servidor", advanced: "Avanzado", installations: "Instalados" },
    sections: { framework: "Framework", database: "Base de Datos", installed: "Instalados", progress: "Progreso" },
    labels: {
      folder: "Carpeta",
      artifact: "Artifact",
      artifactUrl: "URL artifact",
      name: "Nombre",
      license: "Licencia Cfx",
      slots: "Slots",
      sqlHost: "Host",
      sqlPort: "Puerto SQL",
      user: "Usuario",
      password: "Password",
      database: "Database",
      redmPort: "Puerto RedM",
      txAdminPort: "Puerto txAdmin",
      steamApi: "Steam Web API",
      adminIdentifier: "Admin identifier"
    },
    toggles: { autoSql: "Instalar MariaDB si falta", firewall: "Abrir firewall", exposeDb: "Abrir 3306" },
    togglesExtra: { reuseDb: "Usar DB existente" },
    buttons: {
      choose: "Elegir",
      folder: "Carpeta",
      txAdmin: "txAdmin",
      start: "Iniciar",
      install: "Instalar",
      cancel: "Cancelar",
      continue: "Continuar",
      accept: "Aceptar",
      use: "Usar"
    },
    placeholders: { optional: "Opcional", admin: "license:xxxxxxxx", artifact: "https://runtime.fivem.net/.../server.7z" },
    status: {
      ready: "Listo",
      installing: "Instalando",
      serverReady: "Servidor listo",
      error: "Error",
      pending: "Pendiente",
      noInstalled: "Sin instalaciones",
      noInstalledDesc: "No hay servidores registrados.",
      sqlActive: "SQL 3306 activo",
      sqlMissing: "SQL no detectado",
      notDetected: "No detectado",
      portBusy: "Puerto ocupado"
    },
    progress: {
      waitingTitle: "Esperando instalación",
      waitingDesc: "Selecciona framework, carpeta y artifact para preparar el servidor.",
      installingTitle: "Instalando servidor",
      readyTitle: "Servidor listo",
      readyDesc: "Ya puedes abrir txAdmin o iniciar FXServer.",
      errorTitle: "Instalación detenida",
      descriptions: {
        sql: "Detectando o instalando MariaDB y preparando la base de datos.",
        firewall: "Aplicando reglas de firewall para RedM y txAdmin.",
        artifact: "Descargando y extrayendo FXServer.",
        recipe: "Descargando recursos, ejecutando SQL y escribiendo server.cfg.",
        done: "Servidor preparado para iniciar."
      },
      portCheck: "Verificando puertos y base de datos antes de instalar."
    },
    steps: { sql: "SQL", firewall: "Firewall", artifact: "Artifacts", recipe: "Recipe", done: "Ready" },
    framework: {
      rsg: "Rexshack RedM Build",
      vorp: "VORPCore oficial",
      redemrp: "Framework RedEM-RP"
    },
    modals: {
      review: "Revisar",
      licenseTitle: "Licencia Cfx",
      licenseBody: "No cargaste sv_licenseKey. El servidor se instala igual, pero no va a iniciar públicamente hasta completar esa clave en server.cfg.",
      installTitle: "Instalar",
      errorTitle: "Error"
    },
    validation: {
      folder: "Selecciona carpeta de instalación.",
      artifact: "Selecciona un artifact.",
      artifactUrl: "El artifact debe apuntar a un server.7z.",
      dbName: "Indica el nombre de la base de datos.",
      dbNameChars: "La base de datos solo puede usar letras, números y guion bajo.",
      dbHost: "Indica host SQL.",
      dbUser: "Indica usuario SQL.",
      serverName: "Indica nombre del servidor."
    },
    logs: { done: "Instalación terminada." }
  },
  en: {
    admin: "Administrator",
    noAdmin: "No administrator",
    init: "Initializing",
    tabs: { setup: "Server", advanced: "Advanced", installations: "Installed" },
    sections: { framework: "Framework", database: "Database", installed: "Installed", progress: "Progress" },
    labels: {
      folder: "Folder",
      artifact: "Artifact",
      artifactUrl: "Artifact URL",
      name: "Name",
      license: "Cfx License",
      slots: "Slots",
      sqlHost: "Host",
      sqlPort: "SQL Port",
      user: "User",
      password: "Password",
      database: "Database",
      redmPort: "RedM Port",
      txAdminPort: "txAdmin Port",
      steamApi: "Steam Web API",
      adminIdentifier: "Admin identifier"
    },
    toggles: { autoSql: "Install MariaDB if missing", firewall: "Open firewall", exposeDb: "Open 3306" },
    togglesExtra: { reuseDb: "Use existing DB" },
    buttons: { choose: "Choose", folder: "Folder", txAdmin: "txAdmin", start: "Start", install: "Install", cancel: "Cancel", continue: "Continue", accept: "OK", use: "Use" },
    placeholders: { optional: "Optional", admin: "license:xxxxxxxx", artifact: "https://runtime.fivem.net/.../server.7z" },
    status: { ready: "Ready", installing: "Installing", serverReady: "Server ready", error: "Error", pending: "Pending", noInstalled: "No installs", noInstalledDesc: "No registered servers.", sqlActive: "SQL 3306 active", sqlMissing: "SQL not detected", notDetected: "Not detected", portBusy: "Port busy" },
    progress: {
      waitingTitle: "Waiting for install",
      waitingDesc: "Choose a framework, folder and artifact to prepare the server.",
      installingTitle: "Installing server",
      readyTitle: "Server ready",
      readyDesc: "You can open txAdmin or start FXServer.",
      errorTitle: "Install stopped",
      descriptions: { sql: "Detecting or installing MariaDB and preparing the database.", firewall: "Applying firewall rules for RedM and txAdmin.", artifact: "Downloading and extracting FXServer.", recipe: "Downloading resources, running SQL and writing server.cfg.", done: "Server prepared to start." },
      portCheck: "Checking ports and database before installing."
    },
    steps: { sql: "SQL", firewall: "Firewall", artifact: "Artifacts", recipe: "Recipe", done: "Ready" },
    framework: { rsg: "Rexshack RedM Build", vorp: "Official VORPCore", redemrp: "RedEM-RP framework" },
    modals: { review: "Review", licenseTitle: "Cfx License", licenseBody: "No sv_licenseKey was entered. The server will still install, but it will not start publicly until that key is added to server.cfg.", installTitle: "Install", errorTitle: "Error" },
    validation: { folder: "Select an installation folder.", artifact: "Select an artifact.", artifactUrl: "The artifact must point to a server.7z file.", dbName: "Enter a database name.", dbNameChars: "The database name can only use letters, numbers and underscores.", dbHost: "Enter the SQL host.", dbUser: "Enter the SQL user.", serverName: "Enter a server name." },
    logs: { done: "Installation finished." }
  }
};

const LANGUAGE_ALIASES = {
  "es": "es",
  "es-419": "es",
  "en": "en",
  "pt": "pt",
  "pt-BR": "pt",
  "nl": "nl",
  "ko": "ko",
  "it": "it",
  "fr": "fr",
  "de": "de",
  "pl": "pl",
  "ru": "ru",
  "ar": "ar",
  "mn": "mn"
};

const EXTRA_TRANSLATIONS = {
  pt: {
    tabs: { setup: "Servidor", advanced: "Avançado", installations: "Instalados" },
    sections: { database: "Base de Dados", progress: "Progresso" },
    buttons: { choose: "Escolher", start: "Iniciar", install: "Instalar", cancel: "Cancelar", continue: "Continuar", accept: "OK", use: "Usar" },
    togglesExtra: { reuseDb: "Usar DB existente" },
    status: { ready: "Pronto", installing: "Instalando", serverReady: "Servidor pronto", pending: "Pendente", sqlMissing: "SQL não detectado" },
    progress: { waitingTitle: "Aguardando instalação", installingTitle: "Instalando servidor", readyTitle: "Servidor pronto" }
  },
  nl: {
    tabs: { setup: "Server", advanced: "Geavanceerd", installations: "Geïnstalleerd" },
    sections: { database: "Database", progress: "Voortgang" },
    buttons: { choose: "Kiezen", start: "Starten", install: "Installeren", cancel: "Annuleren", continue: "Doorgaan", accept: "OK", use: "Gebruik" },
    togglesExtra: { reuseDb: "Bestaande DB gebruiken" },
    status: { ready: "Gereed", installing: "Installeren", serverReady: "Server gereed", pending: "In wachtrij", sqlMissing: "SQL niet gevonden" },
    progress: { waitingTitle: "Wacht op installatie", installingTitle: "Server installeren", readyTitle: "Server gereed" }
  },
  ko: {
    tabs: { setup: "서버", advanced: "고급", installations: "설치됨" },
    sections: { framework: "프레임워크", database: "데이터베이스", installed: "설치됨", progress: "진행률" },
    buttons: { choose: "선택", folder: "폴더", start: "시작", install: "설치", cancel: "취소", continue: "계속", accept: "확인", use: "사용" },
    togglesExtra: { reuseDb: "기존 DB 사용" },
    status: { ready: "준비됨", installing: "설치 중", serverReady: "서버 준비됨", pending: "대기 중", sqlMissing: "SQL 감지 안 됨" },
    progress: { waitingTitle: "설치 대기 중", installingTitle: "서버 설치 중", readyTitle: "서버 준비됨" }
  },
  it: {
    tabs: { setup: "Server", advanced: "Avanzate", installations: "Installati" },
    sections: { database: "Database", progress: "Progresso" },
    buttons: { choose: "Scegli", start: "Avvia", install: "Installa", cancel: "Annulla", continue: "Continua", accept: "OK", use: "Usa" },
    togglesExtra: { reuseDb: "Usa DB esistente" },
    status: { ready: "Pronto", installing: "Installazione", serverReady: "Server pronto", pending: "In attesa", sqlMissing: "SQL non rilevato" },
    progress: { waitingTitle: "In attesa", installingTitle: "Installazione server", readyTitle: "Server pronto" }
  },
  fr: {
    tabs: { setup: "Serveur", advanced: "Avancé", installations: "Installés" },
    sections: { database: "Base de données", progress: "Progression" },
    buttons: { choose: "Choisir", start: "Démarrer", install: "Installer", cancel: "Annuler", continue: "Continuer", accept: "OK", use: "Utiliser" },
    togglesExtra: { reuseDb: "Utiliser DB existante" },
    status: { ready: "Prêt", installing: "Installation", serverReady: "Serveur prêt", pending: "En attente", sqlMissing: "SQL non détecté" },
    progress: { waitingTitle: "En attente", installingTitle: "Installation du serveur", readyTitle: "Serveur prêt" }
  },
  de: {
    tabs: { setup: "Server", advanced: "Erweitert", installations: "Installiert" },
    sections: { database: "Datenbank", progress: "Fortschritt" },
    buttons: { choose: "Wählen", start: "Starten", install: "Installieren", cancel: "Abbrechen", continue: "Weiter", accept: "OK", use: "Nutzen" },
    togglesExtra: { reuseDb: "Vorhandene DB nutzen" },
    status: { ready: "Bereit", installing: "Installiere", serverReady: "Server bereit", pending: "Ausstehend", sqlMissing: "SQL nicht erkannt" },
    progress: { waitingTitle: "Warte auf Installation", installingTitle: "Server wird installiert", readyTitle: "Server bereit" }
  },
  pl: {
    tabs: { setup: "Serwer", advanced: "Zaawansowane", installations: "Zainstalowane" },
    sections: { database: "Baza danych", progress: "Postęp" },
    buttons: { choose: "Wybierz", start: "Start", install: "Instaluj", cancel: "Anuluj", continue: "Dalej", accept: "OK", use: "Użyj" },
    togglesExtra: { reuseDb: "Użyj istniejącej DB" },
    status: { ready: "Gotowe", installing: "Instalacja", serverReady: "Serwer gotowy", pending: "Oczekuje", sqlMissing: "Nie wykryto SQL" },
    progress: { waitingTitle: "Oczekiwanie", installingTitle: "Instalowanie serwera", readyTitle: "Serwer gotowy" }
  },
  ru: {
    tabs: { setup: "Сервер", advanced: "Дополнительно", installations: "Установлено" },
    sections: { framework: "Фреймворк", database: "База данных", installed: "Установлено", progress: "Прогресс" },
    buttons: { choose: "Выбрать", folder: "Папка", start: "Запуск", install: "Установить", cancel: "Отмена", continue: "Продолжить", accept: "OK", use: "Выбрать" },
    togglesExtra: { reuseDb: "Использовать DB" },
    status: { ready: "Готово", installing: "Установка", serverReady: "Сервер готов", pending: "Ожидание", sqlMissing: "SQL не найден" },
    progress: { waitingTitle: "Ожидание установки", installingTitle: "Установка сервера", readyTitle: "Сервер готов" }
  },
  ar: {
    tabs: { setup: "الخادم", advanced: "متقدم", installations: "المثبتة" },
    sections: { framework: "الإطار", database: "قاعدة البيانات", installed: "المثبتة", progress: "التقدم" },
    buttons: { choose: "اختيار", folder: "المجلد", start: "تشغيل", install: "تثبيت", cancel: "إلغاء", continue: "متابعة", accept: "موافق", use: "استخدام" },
    togglesExtra: { reuseDb: "استخدام DB موجودة" },
    status: { ready: "جاهز", installing: "جار التثبيت", serverReady: "الخادم جاهز", pending: "قيد الانتظار", sqlMissing: "لم يتم اكتشاف SQL" },
    progress: { waitingTitle: "بانتظار التثبيت", installingTitle: "تثبيت الخادم", readyTitle: "الخادم جاهز" }
  },
  mn: {
    tabs: { setup: "Сервер", advanced: "Нарийвчилсан", installations: "Суулгасан" },
    sections: { framework: "Framework", database: "Өгөгдлийн сан", installed: "Суулгасан", progress: "Явц" },
    buttons: { choose: "Сонгох", folder: "Хавтас", start: "Эхлүүлэх", install: "Суулгах", cancel: "Цуцлах", continue: "Үргэлжлүүлэх", accept: "OK", use: "Ашиглах" },
    togglesExtra: { reuseDb: "Одоо байгаа DB ашиглах" },
    status: { ready: "Бэлэн", installing: "Суулгаж байна", serverReady: "Сервер бэлэн", pending: "Хүлээгдэж байна", sqlMissing: "SQL илрээгүй" },
    progress: { waitingTitle: "Суулгалт хүлээгдэж байна", installingTitle: "Сервер суулгаж байна", readyTitle: "Сервер бэлэн" }
  }
};

function mergeDeep(base, override) {
  const result = { ...base };

  for (const [key, value] of Object.entries(override || {})) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = mergeDeep(result[key] || {}, value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

for (const [language, overrides] of Object.entries(EXTRA_TRANSLATIONS)) {
  STRINGS[language] = mergeDeep(STRINGS.en, overrides);
}

function getValue(source, key) {
  return key.split(".").reduce((current, part) => current?.[part], source);
}

function t(key) {
  return getValue(STRINGS[appState.language], key) || getValue(STRINGS.en, key) || key;
}

const steps = [
  { id: "sql", titleKey: "steps.sql" },
  { id: "firewall", titleKey: "steps.firewall" },
  { id: "artifact", titleKey: "steps.artifact" },
  { id: "recipe", titleKey: "steps.recipe" },
  { id: "done", titleKey: "steps.done" }
];

const ui = {
  adminStatus: $("#adminStatus"),
  artifactDropdown: $("#artifactDropdown"),
  artifactDropdownButton: $("#artifactDropdownButton"),
  artifactDropdownLabel: $("#artifactDropdownLabel"),
  artifactDropdownMenu: $("#artifactDropdownMenu"),
  artifactSelect: $("#artifactSelect"),
  autoSql: $("#autoSql"),
  avatarImage: $("#avatarImage"),
  closeBtn: $("#closeBtn"),
  databaseStatus: $("#databaseStatus"),
  dbHost: $("#dbHost"),
  dbName: $("#dbName"),
  dbPassword: $("#dbPassword"),
  dbPort: $("#dbPort"),
  dbUser: $("#dbUser"),
  discordBtn: $("#discordBtn"),
  exposeDatabase: $("#exposeDatabase"),
  frameworkGrid: $("#frameworkGrid"),
  frameworkStatus: $("#frameworkStatus"),
  gamePort: $("#gamePort"),
  installBtn: $("#installBtn"),
  installationCount: $("#installationCount"),
  installationsList: $("#installationsList"),
  installPath: $("#installPath"),
  languageButton: $("#languageButton"),
  languageFlag: $("#languageFlag"),
  languageLabel: $("#languageLabel"),
  languageMenu: $("#languageMenu"),
  languagePicker: $("#languagePicker"),
  licenseKey: $("#licenseKey"),
  logOutput: $("#logOutput"),
  lyonBtn: $("#lyonBtn"),
  manualArtifactUrl: $("#manualArtifactUrl"),
  manualArtifactWrap: $("#manualArtifactWrap"),
  maxClients: $("#maxClients"),
  minimizeBtn: $("#minimizeBtn"),
  modalBody: $("#modalBody"),
  modalCancel: $("#modalCancel"),
  modalConfirm: $("#modalConfirm"),
  modalTitle: $("#modalTitle"),
  openFirewall: $("#openFirewall"),
  openFolderBtn: $("#openFolderBtn"),
  overallStatus: $("#overallStatus"),
  progressDescription: $("#progressDescription"),
  progressFill: $("#progressFill"),
  progressTitle: $("#progressTitle"),
  reuseDatabase: $("#reuseDatabase"),
  selectFolderBtn: $("#selectFolderBtn"),
  serverName: $("#serverName"),
  startBtn: $("#startBtn"),
  steamWebApiKey: $("#steamWebApiKey"),
  adminPrincipal: $("#adminPrincipal"),
  stepList: $("#stepList"),
  txAdminBtn: $("#txAdminBtn"),
  txAdminPort: $("#txAdminPort")
};

const appState = {
  activeInstallation: null,
  artifacts: [],
  defaultInstallRoot: "C:\\LyonRedMServers",
  frameworkId: "rsg",
  frameworks: [],
  isAdmin: false,
  installing: false,
  language: "es",
  logs: [],
  overallPercent: 0,
  stepState: {},
  storedInstallations: []
};

function normalizeLanguage(locale) {
  if (!locale) {
    return "es";
  }

  const normalized = locale.replace("_", "-");
  return LANGUAGE_ALIASES[normalized] || LANGUAGE_ALIASES[normalized.split("-")[0]] || "en";
}

function renderLanguageSelect() {
  ui.languageMenu.innerHTML = "";

  for (const language of LANGUAGES) {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "language-option";
    option.dataset.language = language.id;
    option.setAttribute("role", "option");
    option.innerHTML = `
      <img src="../assets/flags/${language.id}.png" alt="" />
      <span>${language.code} ${language.name}</span>
    `;
    option.addEventListener("click", () => {
      setLanguage(language.id);
      closeLanguageMenu();
    });
    ui.languageMenu.appendChild(option);
  }
}

function setLanguage(languageId) {
  appState.language = STRINGS[languageId] ? languageId : "en";
  localStorage.setItem("lyon-language", appState.language);
  document.documentElement.lang = appState.language;
  document.documentElement.dir = appState.language === "ar" ? "rtl" : "ltr";
  const language = LANGUAGES.find((item) => item.id === appState.language) || LANGUAGES[1];
  ui.languageFlag.src = `../assets/flags/${language.id}.png`;
  ui.languageLabel.textContent = `${language.code} ${language.name}`;
  for (const option of ui.languageMenu.querySelectorAll(".language-option")) {
    option.classList.toggle("active", option.dataset.language === appState.language);
  }
  applyTranslations();
}

function closeLanguageMenu() {
  ui.languagePicker.classList.remove("open");
  ui.languageButton.setAttribute("aria-expanded", "false");
}

function toggleLanguageMenu() {
  const open = !ui.languagePicker.classList.contains("open");
  ui.languagePicker.classList.toggle("open", open);
  ui.languageButton.setAttribute("aria-expanded", String(open));
}

function closeArtifactDropdown() {
  ui.artifactDropdown.classList.remove("open");
  ui.artifactDropdownButton.setAttribute("aria-expanded", "false");
}

function toggleArtifactDropdown() {
  const open = !ui.artifactDropdown.classList.contains("open");
  ui.artifactDropdown.classList.toggle("open", open);
  ui.artifactDropdownButton.setAttribute("aria-expanded", String(open));
}

function setText(selector, value) {
  const node = $(selector);
  if (node) {
    node.textContent = value;
  }
}

function setFieldLabel(inputId, value) {
  const input = $(`#${inputId}`);
  const label = input?.closest(".field")?.querySelector("span");
  if (label) {
    label.textContent = value;
  }
}

function applyTranslations() {
  setText('.tab[data-panel="setup"]', t("tabs.setup"));
  setText('.tab[data-panel="advanced"]', t("tabs.advanced"));
  setText('.tab[data-panel="installations"]', t("tabs.installations"));
  setText("#setupPanel .section-title h2", t("sections.framework"));
  setText("#advancedPanel .section-title h2", t("sections.database"));
  setText("#installationsPanel .section-title h2", t("sections.installed"));
  setText(".progress-area .section-title h2", t("sections.progress"));

  setFieldLabel("installPath", t("labels.folder"));
  setFieldLabel("artifactSelect", t("labels.artifact"));
  setFieldLabel("manualArtifactUrl", t("labels.artifactUrl"));
  setFieldLabel("serverName", t("labels.name"));
  setFieldLabel("licenseKey", t("labels.license"));
  setFieldLabel("maxClients", t("labels.slots"));
  setFieldLabel("dbHost", t("labels.sqlHost"));
  setFieldLabel("dbPort", t("labels.sqlPort"));
  setFieldLabel("dbUser", t("labels.user"));
  setFieldLabel("dbPassword", t("labels.password"));
  setFieldLabel("dbName", t("labels.database"));
  setFieldLabel("gamePort", t("labels.redmPort"));
  setFieldLabel("txAdminPort", t("labels.txAdminPort"));
  setFieldLabel("steamWebApiKey", t("labels.steamApi"));
  setFieldLabel("adminPrincipal", t("labels.adminIdentifier"));

  $("#manualArtifactUrl").placeholder = t("placeholders.artifact");
  $("#steamWebApiKey").placeholder = t("placeholders.optional");
  $("#adminPrincipal").placeholder = t("placeholders.admin");

  ui.selectFolderBtn.textContent = t("buttons.choose");
  ui.openFolderBtn.textContent = t("buttons.folder");
  ui.txAdminBtn.textContent = t("buttons.txAdmin");
  ui.startBtn.textContent = t("buttons.start");
  ui.installBtn.textContent = t("buttons.install");
  ui.modalCancel.textContent = t("buttons.cancel");
  ui.modalConfirm.textContent = t("buttons.continue");

  const toggles = document.querySelectorAll(".toggle");
  if (toggles[0]) toggles[0].lastChild.textContent = ` ${t("toggles.autoSql")}`;
  if (toggles[1]) toggles[1].lastChild.textContent = ` ${t("toggles.firewall")}`;
  if (toggles[2]) toggles[2].lastChild.textContent = ` ${t("toggles.exposeDb")}`;
  if (toggles[3]) toggles[3].lastChild.textContent = ` ${t("togglesExtra.reuseDb")}`;

  if (!appState.installing && !appState.activeInstallation) {
    ui.adminStatus.textContent = appState.isAdmin ? t("admin") : t("noAdmin");
    ui.overallStatus.textContent = t("status.ready");
    ui.progressTitle.textContent = t("progress.waitingTitle");
    ui.progressDescription.textContent = t("progress.waitingDesc");
  }

  renderFrameworks();
  if (appState.artifacts.length > 0) {
    renderArtifacts();
  }
  renderSteps();
  renderInstallations();
}

function setAvatar(mode) {
  const image = mode === "loading"
    ? "../assets/avatarloading.png"
    : mode === "ready"
      ? "../assets/avatarserverstart.png"
      : "../assets/avatarinicio.png";
  ui.avatarImage.src = image;
}

function appendLog(line) {
  if (!line) {
    return;
  }

  appState.logs.push(line);
  appState.logs = appState.logs.slice(-80);
  ui.logOutput.textContent = appState.logs.join("\n");
  ui.logOutput.scrollTop = ui.logOutput.scrollHeight;
}

function renderSteps() {
  ui.stepList.innerHTML = "";

  for (const step of steps) {
    const state = appState.stepState[step.id] || {};
    const item = document.createElement("div");
    item.className = `step ${state.status || ""}`;
    item.innerHTML = `
      <strong>${t(step.titleKey)}</strong>
      <span>${state.label || t("status.pending")}</span>
    `;
    ui.stepList.appendChild(item);
  }
}

function updateStep(id, status, label) {
  appState.stepState[id] = {
    status,
    label
  };
  renderSteps();
}

function resetSteps() {
  appState.stepState = {};
  for (const step of steps) {
    updateStep(step.id, "", t("status.pending"));
  }
  updateProgressUi(0, t("progress.waitingTitle"), t("progress.waitingDesc"));
}

function updateProgressUi(percent, title, description) {
  appState.overallPercent = Math.max(0, Math.min(100, Math.round(percent)));
  ui.progressFill.style.width = `${appState.overallPercent}%`;
  ui.progressTitle.textContent = title;
  ui.progressDescription.textContent = description;
}

function localizeProgress(payload) {
  const stepId = payload.step === "prepare" ? "sql" : payload.step;
  const description = payload.step === "prepare" ? t("progress.portCheck") : t(`progress.descriptions.${stepId}`);
  const title = stepId === "done" ? t("progress.readyTitle") : t("progress.installingTitle");
  const index = Math.max(0, steps.findIndex((step) => step.id === stepId));
  const stepPercent = typeof payload.percent === "number" ? payload.percent : 0;
  const overall = stepId === "done"
    ? 100
    : ((index + stepPercent / 100) / steps.length) * 100;
  const label = typeof payload.percent === "number" && payload.percent > 0 && payload.percent < 100
    ? `${stepPercent}%`
    : description;

  return {
    description,
    label,
    overall,
    stepId,
    title
  };
}

function selectedFramework() {
  return appState.frameworks.find((framework) => framework.id === appState.frameworkId);
}

function frameworkDefaultPath(framework) {
  return `${appState.defaultInstallRoot}\\${framework.defaultFolder}`;
}

function setFramework(frameworkId, keepPath = false) {
  appState.frameworkId = frameworkId;
  const framework = selectedFramework();

  ui.frameworkStatus.textContent = framework.label;
  ui.dbName.value = framework.defaultDatabase;

  if (!keepPath) {
    ui.installPath.value = frameworkDefaultPath(framework);
  }

  renderFrameworks();
  detectSelectedInstall();
}

function renderFrameworks() {
  ui.frameworkGrid.innerHTML = "";

  for (const framework of appState.frameworks) {
    const button = document.createElement("button");
    button.className = `framework-card ${framework.id === appState.frameworkId ? "active" : ""}`;
    button.type = "button";
    button.innerHTML = `
      <strong>${framework.label}</strong>
      <span>${t(`framework.${framework.id}`)}</span>
    `;
    button.addEventListener("click", () => setFramework(framework.id));
    ui.frameworkGrid.appendChild(button);
  }
}

function renderArtifacts() {
  const selected = ui.artifactSelect.value;
  ui.artifactSelect.innerHTML = "";

  for (const artifact of appState.artifacts) {
    const option = document.createElement("option");
    option.value = artifact.url;
    option.dataset.label = artifact.label;
    option.textContent = artifact.label;
    ui.artifactSelect.appendChild(option);
  }

  const manual = document.createElement("option");
  manual.value = "__manual";
  manual.dataset.label = t("labels.artifactUrl");
  manual.textContent = t("labels.artifactUrl");
  ui.artifactSelect.appendChild(manual);
  if ([...ui.artifactSelect.options].some((option) => option.value === selected)) {
    ui.artifactSelect.value = selected;
  }

  renderArtifactDropdownOptions();
  syncArtifactDropdown();
}

function renderArtifactDropdownOptions() {
  ui.artifactDropdownMenu.innerHTML = "";

  for (const option of ui.artifactSelect.options) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "artifact-option";
    button.dataset.value = option.value;
    button.setAttribute("role", "option");
    button.textContent = option.dataset.label || option.textContent;
    button.addEventListener("click", () => {
      ui.artifactSelect.value = option.value;
      ui.artifactSelect.dispatchEvent(new Event("change", { bubbles: true }));
      closeArtifactDropdown();
    });
    ui.artifactDropdownMenu.appendChild(button);
  }
}

function syncArtifactDropdown() {
  const selectedOption = ui.artifactSelect.selectedOptions[0] || ui.artifactSelect.options[0];
  const label = selectedOption?.dataset.label || selectedOption?.textContent || t("labels.artifact");

  ui.artifactDropdownLabel.textContent = label;
  ui.artifactDropdownButton.title = label;

  for (const option of ui.artifactDropdownMenu.querySelectorAll(".artifact-option")) {
    const active = option.dataset.value === ui.artifactSelect.value;
    option.classList.toggle("active", active);
    option.setAttribute("aria-selected", String(active));
  }

  ui.manualArtifactWrap.classList.toggle("hidden", ui.artifactSelect.value !== "__manual");
}

function renderInstallations() {
  ui.installationsList.innerHTML = "";
  ui.installationCount.textContent = String(appState.storedInstallations.length);

  if (appState.storedInstallations.length === 0) {
    const empty = document.createElement("div");
    empty.className = "installation-item";
    empty.innerHTML = `<div><strong>${t("status.noInstalled")}</strong><span>${t("status.noInstalledDesc")}</span></div>`;
    ui.installationsList.appendChild(empty);
    return;
  }

  for (const installation of appState.storedInstallations) {
    const item = document.createElement("div");
    item.className = "installation-item";
    item.innerHTML = `
      <div>
        <strong>${installation.frameworkLabel || installation.frameworkId} · ${installation.serverName || "RedM Server"}</strong>
        <span>${installation.installPath}</span>
      </div>
      <button class="small-btn" type="button">${t("buttons.use")}</button>
    `;

    item.querySelector("button").addEventListener("click", () => {
      appState.activeInstallation = installation;
      appState.frameworkId = installation.frameworkId;
      ui.installPath.value = installation.installPath;
      ui.serverName.value = installation.serverName || ui.serverName.value;
      renderFrameworks();
      setReady(installation);
      switchPanel("setup");
    });

    ui.installationsList.appendChild(item);
  }
}

function setReady(installation) {
  appState.activeInstallation = installation;
  ui.startBtn.disabled = false;
  ui.txAdminBtn.disabled = false;
  ui.openFolderBtn.disabled = false;
  ui.overallStatus.textContent = t("status.serverReady");
  updateProgressUi(100, t("progress.readyTitle"), t("progress.readyDesc"));
  setAvatar("ready");
}

function setIdle() {
  if (!appState.installing) {
    ui.startBtn.disabled = true;
    ui.txAdminBtn.disabled = true;
    ui.openFolderBtn.disabled = true;
    ui.overallStatus.textContent = t("status.ready");
    updateProgressUi(0, t("progress.waitingTitle"), t("progress.waitingDesc"));
    setAvatar("idle");
  }
}

function switchPanel(panelName) {
  for (const tab of document.querySelectorAll(".tab")) {
    tab.classList.toggle("active", tab.dataset.panel === panelName);
  }

  $("#setupPanel").classList.toggle("active", panelName === "setup");
  $("#advancedPanel").classList.toggle("active", panelName === "advanced");
  $("#installationsPanel").classList.toggle("active", panelName === "installations");
}

function getArtifactSelection() {
  if (ui.artifactSelect.value === "__manual") {
    return {
      artifactUrl: ui.manualArtifactUrl.value.trim(),
      artifactLabel: "URL manual"
    };
  }

  const selectedOption = ui.artifactSelect.selectedOptions[0];
  return {
    artifactUrl: ui.artifactSelect.value,
    artifactLabel: selectedOption?.dataset.label || selectedOption?.textContent || "Artifact"
  };
}

function collectConfig() {
  const artifact = getArtifactSelection();

  return {
    adminPrincipal: ui.adminPrincipal.value.trim(),
    artifactLabel: artifact.artifactLabel,
    artifactUrl: artifact.artifactUrl,
    database: {
      database: ui.dbName.value.trim(),
      host: ui.dbHost.value.trim(),
      password: ui.dbPassword.value,
      port: Number(ui.dbPort.value || 3306),
      user: ui.dbUser.value.trim()
    },
    exposeDatabase: ui.exposeDatabase.checked,
    forceArtifact: false,
    forceRecipe: false,
    frameworkId: appState.frameworkId,
    installPath: ui.installPath.value.trim(),
    installSqlIfMissing: ui.autoSql.checked,
    licenseKey: ui.licenseKey.value.trim(),
    maxClients: Number(ui.maxClients.value || 48),
    openFirewall: ui.openFirewall.checked,
    ports: {
      database: Number(ui.dbPort.value || 3306),
      game: Number(ui.gamePort.value || 30120),
      txAdmin: Number(ui.txAdminPort.value || 40120)
    },
    reuseExistingDatabase: ui.reuseDatabase.checked,
    serverName: ui.serverName.value.trim(),
    steamWebApiKey: ui.steamWebApiKey.value.trim()
  };
}

function validateConfig(config) {
  const errors = [];

  if (!config.installPath) errors.push(t("validation.folder"));
  if (!config.artifactUrl) errors.push(t("validation.artifact"));
  if (!/^https?:\/\/.+\/server\.7z$/i.test(config.artifactUrl)) errors.push(t("validation.artifactUrl"));
  if (!config.database.database) errors.push(t("validation.dbName"));
  if (!/^[a-zA-Z0-9_]+$/.test(config.database.database)) errors.push(t("validation.dbNameChars"));
  if (!config.database.host) errors.push(t("validation.dbHost"));
  if (!config.database.user) errors.push(t("validation.dbUser"));
  if (!config.serverName) errors.push(t("validation.serverName"));

  return errors;
}

function showModal({ title, body, confirmText = "Continuar" }) {
  return new Promise((resolve) => {
    const dialog = $("#confirmDialog");
    ui.modalTitle.textContent = title;
    ui.modalBody.textContent = body;
    ui.modalConfirm.textContent = confirmText;

    const handler = () => {
      dialog.removeEventListener("close", handler);
      resolve(dialog.returnValue === "confirm");
    };

    dialog.addEventListener("close", handler);
    dialog.showModal();
  });
}

async function detectSelectedInstall() {
  if (!ui.installPath.value.trim()) {
    setIdle();
    return;
  }

  try {
    const result = await window.lyon.installer.detectInstall({
      frameworkId: appState.frameworkId,
      installPath: ui.installPath.value.trim()
    });

    if (result.installed) {
      const framework = selectedFramework();
      setReady(result.metadata || {
        id: result.id,
        frameworkId: appState.frameworkId,
        frameworkLabel: framework.label,
        installPath: result.installPath,
        serverName: ui.serverName.value
      });
    } else {
      setIdle();
    }
  } catch (error) {
    appendLog(error.message);
  }
}

async function refreshPrereqs() {
  try {
    const status = await window.lyon.installer.checkPrereqs();
    appState.isAdmin = status.admin;
    ui.adminStatus.textContent = appState.isAdmin ? t("admin") : t("noAdmin");

    const services = Array.isArray(status.database.Services)
      ? status.database.Services
      : status.database.Services
        ? [status.database.Services]
        : [];
    const service = services.find((item) => item.Status === "Running") || services[0];

    ui.databaseStatus.textContent = status.database.PortOpen
      ? t("status.sqlActive")
      : service
        ? `${service.DisplayName || service.Name}: ${service.Status}`
        : t("status.sqlMissing");
  } catch (error) {
    ui.databaseStatus.textContent = t("status.notDetected");
    appendLog(error.message);
  }
}

async function install() {
  if (appState.installing) {
    return;
  }

  const config = collectConfig();
  const errors = validateConfig(config);

  if (errors.length > 0) {
    await showModal({
      title: t("modals.review"),
      body: errors.join("\n"),
      confirmText: t("buttons.accept")
    });
    return;
  }

  if (!config.licenseKey) {
    const keepGoing = await showModal({
      title: t("modals.licenseTitle"),
      body: t("modals.licenseBody"),
      confirmText: t("buttons.install")
    });

    if (!keepGoing) {
      return;
    }
  }

  const framework = selectedFramework();
  const summary = [
    `${framework.label}`,
    config.installPath,
    `DB: ${config.database.database}`,
    `RedM: ${config.ports.game}`,
    `txAdmin: ${config.ports.txAdmin}`
  ].join("\n");

  const confirmed = await showModal({
    title: t("modals.installTitle"),
    body: summary,
    confirmText: t("buttons.install")
  });

  if (!confirmed) {
    return;
  }

  appState.installing = true;
  appState.logs = [];
  resetSteps();
  setAvatar("loading");
  ui.installBtn.disabled = true;
  ui.startBtn.disabled = true;
  ui.txAdminBtn.disabled = true;
  ui.openFolderBtn.disabled = true;
  ui.overallStatus.textContent = t("status.installing");
  updateProgressUi(1, t("progress.installingTitle"), t("progress.descriptions.sql"));

  try {
    const result = await window.lyon.installer.install(config);
    appState.storedInstallations = result.state.installations;
    renderInstallations();
    setReady(result.metadata);
    appendLog(t("logs.done"));
  } catch (error) {
    ui.overallStatus.textContent = t("status.error");
    setAvatar("idle");
    updateStep("done", "error", t("status.error"));
    updateProgressUi(appState.overallPercent, t("progress.errorTitle"), error.message);
    appendLog(error.message);
    await showModal({
      title: t("modals.errorTitle"),
      body: error.message,
      confirmText: t("buttons.accept")
    });
  } finally {
    appState.installing = false;
    ui.installBtn.disabled = false;
  }
}

async function start(txAdmin = false) {
  if (!appState.activeInstallation) {
    return;
  }

  await window.lyon.installer.start({
    installation: appState.activeInstallation,
    txAdmin
  });
}

function bindEvents() {
  ui.closeBtn.addEventListener("click", () => window.lyon.app.close());
  ui.minimizeBtn.addEventListener("click", () => window.lyon.app.minimize());
  ui.discordBtn.addEventListener("click", () => window.lyon.app.openExternal("discord"));
  ui.lyonBtn.addEventListener("click", () => window.lyon.app.openExternal("lyon"));
  ui.languageButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleLanguageMenu();
  });
  document.addEventListener("click", (event) => {
    if (!ui.languagePicker.contains(event.target)) {
      closeLanguageMenu();
    }
    if (!ui.artifactDropdown.contains(event.target)) {
      closeArtifactDropdown();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLanguageMenu();
      closeArtifactDropdown();
    }
  });

  for (const tab of document.querySelectorAll(".tab")) {
    tab.addEventListener("click", () => switchPanel(tab.dataset.panel));
  }

  ui.selectFolderBtn.addEventListener("click", async () => {
    const selected = await window.lyon.dialog.selectFolder(ui.installPath.value);
    if (selected) {
      ui.installPath.value = selected;
      detectSelectedInstall();
    }
  });

  ui.artifactDropdownButton.addEventListener("click", (event) => {
    event.stopPropagation();
    closeLanguageMenu();
    toggleArtifactDropdown();
  });
  ui.artifactSelect.addEventListener("change", () => {
    syncArtifactDropdown();
  });

  ui.installPath.addEventListener("change", detectSelectedInstall);
  ui.installBtn.addEventListener("click", install);
  ui.startBtn.addEventListener("click", () => start(false));
  ui.txAdminBtn.addEventListener("click", () => start(true));
  ui.openFolderBtn.addEventListener("click", () => {
    if (appState.activeInstallation?.installPath) {
      window.lyon.installer.openFolder(appState.activeInstallation.installPath);
    }
  });

  window.lyon.installer.onProgress((payload) => {
    if (payload.step === "recipe-log") {
      appendLog(payload.label);
      return;
    }

    const progress = localizeProgress(payload);
    const stepId = progress.stepId;
    if (steps.some((step) => step.id === stepId)) {
      updateStep(stepId, payload.step === "done" ? "done" : "active", progress.label);
    }

    if (payload.percent === 100 && stepId !== "done") {
      updateStep(stepId, "done", progress.description);
    }

    ui.overallStatus.textContent = payload.step === "done" ? t("status.serverReady") : t("status.installing");
    updateProgressUi(progress.overall, progress.title, progress.description);
  });
}

async function init() {
  bindEvents();
  resetSteps();

  const initial = await window.lyon.installer.getInitialState();
  const storedLanguage = localStorage.getItem("lyon-language");
  appState.language = storedLanguage || normalizeLanguage(initial.locale);
  appState.defaultInstallRoot = initial.defaultInstallRoot;
  appState.frameworks = initial.frameworks;
  appState.isAdmin = initial.admin;
  appState.storedInstallations = initial.state.installations || [];
  renderLanguageSelect();
  setLanguage(appState.language);
  ui.adminStatus.textContent = appState.isAdmin ? t("admin") : t("noAdmin");

  renderFrameworks();
  renderInstallations();
  setFramework("rsg");

  try {
    appState.artifacts = await window.lyon.installer.fetchArtifacts();
    renderArtifacts();
  } catch (error) {
    ui.artifactSelect.innerHTML = "<option value=\"__manual\">URL manual</option>";
    renderArtifactDropdownOptions();
    syncArtifactDropdown();
    appendLog(error.message);
  }

  await refreshPrereqs();
}

init().catch((error) => {
  appendLog(error.message);
});
