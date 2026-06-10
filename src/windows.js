const { spawn } = require("node:child_process");
const os = require("node:os");

function runPowerShell(script, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script],
      {
        windowsHide: true,
        ...options
      }
    );

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("close", (code) => {
      resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() });
    });
  });
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      windowsHide: true,
      ...options
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
      options.onData?.(chunk.toString());
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      options.onData?.(chunk.toString());
    });

    child.on("error", reject);
    child.on("close", (code) => {
      resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() });
    });
  });
}

async function isAdmin() {
  const result = await runPowerShell(
    "([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)"
  );
  return /True/i.test(result.stdout);
}

async function checkDatabaseService() {
  const script = `
$services = Get-Service -ErrorAction SilentlyContinue | Where-Object { $_.Name -match 'mariadb|mysql' -or $_.DisplayName -match 'mariadb|mysql' }
$port = Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue
[PSCustomObject]@{
  Services = @($services | Select-Object Name, DisplayName, Status)
  PortOpen = [bool]$port
} | ConvertTo-Json -Depth 5
`;
  const result = await runPowerShell(script);

  try {
    return JSON.parse(result.stdout || "{}");
  } catch {
    return { Services: [], PortOpen: false, raw: result.stdout, error: result.stderr };
  }
}

async function checkPortUsage(ports) {
  const uniquePorts = [...new Set(ports.map((port) => Number(port)).filter(Boolean))];
  if (uniquePorts.length === 0) {
    return [];
  }

  const portList = uniquePorts.join(",");
  const script = `
$ports = @(${portList})
$items = @()
foreach ($port in $ports) {
  $tcp = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($tcp) {
    $process = Get-Process -Id $tcp.OwningProcess -ErrorAction SilentlyContinue
    $items += [PSCustomObject]@{
      Port = $port
      Protocol = 'TCP'
      Pid = $tcp.OwningProcess
      ProcessName = if ($process) { $process.ProcessName } else { '' }
    }
  }
  $udp = Get-NetUDPEndpoint -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($udp) {
    $process = Get-Process -Id $udp.OwningProcess -ErrorAction SilentlyContinue
    $items += [PSCustomObject]@{
      Port = $port
      Protocol = 'UDP'
      Pid = $udp.OwningProcess
      ProcessName = if ($process) { $process.ProcessName } else { '' }
    }
  }
}
$items | ConvertTo-Json -Depth 4
`;
  const result = await runPowerShell(script);

  if (!result.stdout) {
    return [];
  }

  try {
    const parsed = JSON.parse(result.stdout);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}

async function installMariaDb(onData) {
  return runCommand(
    "winget",
    [
      "install",
      "--id",
      "MariaDB.Server",
      "-e",
      "--accept-package-agreements",
      "--accept-source-agreements",
      "--silent"
    ],
    { onData }
  );
}

async function startDatabaseServices() {
  const script = `
Get-Service -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match 'mariadb|mysql' -or $_.DisplayName -match 'mariadb|mysql' } |
  ForEach-Object {
    if ($_.Status -ne 'Running') {
      Start-Service -Name $_.Name -ErrorAction SilentlyContinue
    }
  }
`;
  return runPowerShell(script);
}

async function addFirewallRule(name, protocol, port) {
  const script = `
$rule = Get-NetFirewallRule -DisplayName '${name.replaceAll("'", "''")}' -ErrorAction SilentlyContinue
if (-not $rule) {
  New-NetFirewallRule -DisplayName '${name.replaceAll("'", "''")}' -Direction Inbound -Action Allow -Protocol ${protocol} -LocalPort ${port} | Out-Null
}
`;
  return runPowerShell(script);
}

async function openServerFirewall({ gamePort, txAdminPort, exposeDatabase, databasePort }) {
  await addFirewallRule(`Lyon RedM TCP ${gamePort}`, "TCP", gamePort);
  await addFirewallRule(`Lyon RedM UDP ${gamePort}`, "UDP", gamePort);
  await addFirewallRule(`Lyon txAdmin TCP ${txAdminPort}`, "TCP", txAdminPort);

  if (exposeDatabase) {
    await addFirewallRule(`Lyon MariaDB TCP ${databasePort}`, "TCP", databasePort);
  }
}

function getDefaultInstallRoot() {
  return os.platform() === "win32" ? "C:\\LyonRedMServers" : process.cwd();
}

module.exports = {
  checkDatabaseService,
  checkPortUsage,
  getDefaultInstallRoot,
  installMariaDb,
  isAdmin,
  openServerFirewall,
  runCommand,
  runPowerShell,
  startDatabaseServices
};
