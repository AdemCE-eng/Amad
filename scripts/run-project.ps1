param(
  [switch]$Check
)

$ErrorActionPreference = 'Stop'

$ScriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$Root = Split-Path -Parent $ScriptDir
$BackendDir = Join-Path $Root 'backend'
$FrontendDir = Join-Path $Root 'frontend'
$MlDir = Join-Path $Root 'ml-service'
$FirebaseConfigPath = Join-Path $Root '.firebase.launcher.json'
$JavaDir = 'C:\Program Files\Eclipse Adoptium\jre-21.0.11.10-hotspot\bin'

function Write-Step {
  param([string]$Message)
  Write-Host "[INFO] $Message"
}

function Write-Warn {
  param([string]$Message)
  Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-Fail {
  param([string]$Message)
  Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Add-LocalJavaToPath {
  $javaExe = Join-Path $JavaDir 'java.exe'
  if (Test-Path -LiteralPath $javaExe) {
    $env:PATH = "$env:PATH;$JavaDir"
  }
}

function Test-Command {
  param([string]$Name)
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Assert-RequiredCommand {
  param(
    [string]$Name,
    [string]$InstallHint
  )

  if (-not (Test-Command $Name)) {
    throw "$Name is required. $InstallHint"
  }
}

function Test-PortAvailable {
  param([int]$Port)

  $existing = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if ($existing) {
    return $false
  }

  $listener = $null
  try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Parse('127.0.0.1'), $Port)
    $listener.Start()
    return $true
  } catch {
    return $false
  } finally {
    if ($listener) {
      $listener.Stop()
    }
  }
}

function Get-AvailablePort {
  param(
    [int]$PreferredPort,
    [System.Collections.Generic.HashSet[int]]$Reserved
  )

  for ($port = $PreferredPort; $port -lt ($PreferredPort + 1000); $port++) {
    if ($Reserved.Contains($port)) {
      continue
    }

    if (Test-PortAvailable $port) {
      [void]$Reserved.Add($port)
      return $port
    }
  }

  throw "Could not find an open port starting at $PreferredPort."
}

function Get-LaunchPorts {
  $reserved = [System.Collections.Generic.HashSet[int]]::new()

  return [pscustomobject]@{
    Database = Get-AvailablePort 9000 $reserved
    EmulatorUi = Get-AvailablePort 4000 $reserved
    EmulatorHub = Get-AvailablePort 4400 $reserved
    EmulatorLogging = Get-AvailablePort 4500 $reserved
    Backend = Get-AvailablePort 3000 $reserved
    Frontend = Get-AvailablePort 5173 $reserved
    Ml = Get-AvailablePort 8001 $reserved
  }
}

function Set-DotEnvValue {
  param([string]$Path, [string]$Name, [string]$Value)
  $lines = if (Test-Path -LiteralPath $Path) { @(Get-Content -LiteralPath $Path) } else { @() }
  $replacement = "$Name=$Value"
  $found = $false
  $updated = foreach ($line in $lines) {
    if ($line -match "^$([regex]::Escape($Name))=") {
      $found = $true
      $replacement
    } else {
      $line
    }
  }
  if (-not $found) { $updated += $replacement }
  $updated | Set-Content -LiteralPath $Path -Encoding UTF8
}

function Get-MlPython {
  return Join-Path $MlDir '.venv\Scripts\python.exe'
}

function Test-MlArtifacts {
  return (Test-Path -LiteralPath (Join-Path $MlDir 'artifacts\models\offer_model.joblib')) -and
    (Test-Path -LiteralPath (Join-Path $MlDir 'artifacts\models\purchase_model.joblib'))
}

function Test-MlRuntime {
  param([string]$Python)
  if (-not (Test-Path -LiteralPath $Python)) { return $false }
  & $Python -c "import fastapi, uvicorn, pandas, sklearn, catboost, joblib" 2>$null
  return $LASTEXITCODE -eq 0
}

function Wait-MlHealth {
  param([string]$Url, [int]$TimeoutSeconds)
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $health = Invoke-RestMethod -Uri "$Url/health" -TimeoutSec 2
      if ($health.ok -and $health.ready) { return $true }
    } catch {
      Start-Sleep -Milliseconds 500
    }
  }
  return $false
}

function Wait-TcpPort {
  param(
    [string]$HostName,
    [int]$Port,
    [int]$TimeoutSeconds
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    $client = $null
    try {
      $client = [System.Net.Sockets.TcpClient]::new()
      $async = $client.BeginConnect($HostName, $Port, $null, $null)
      if ($async.AsyncWaitHandle.WaitOne(500)) {
        $client.EndConnect($async)
        return $true
      }
    } catch {
      Start-Sleep -Milliseconds 500
    } finally {
      if ($client) {
        $client.Close()
      }
    }
  }

  return $false
}

function Invoke-Npm {
  param(
    [string]$WorkingDirectory,
    [string[]]$Arguments
  )

  Push-Location $WorkingDirectory
  try {
    & npm @Arguments
    if ($LASTEXITCODE -ne 0) {
      throw "npm $($Arguments -join ' ') failed in $WorkingDirectory"
    }
  } finally {
    Pop-Location
  }
}

function Resolve-FirebaseRunner {
  if (Test-Command 'firebase') {
    return 'firebase'
  }

  Write-Step 'Firebase CLI not found. Installing firebase-tools globally...'
  & npm install -g firebase-tools | Out-Host
  if ($LASTEXITCODE -ne 0) {
    throw 'Could not install firebase-tools.'
  }

  if (Test-Command 'firebase') {
    return 'firebase'
  }

  if (Test-Command 'npx') {
    Write-Warn 'firebase was installed, but is not on PATH yet. Falling back to npx firebase-tools for this launch.'
    return 'npx -y firebase-tools'
  }

  throw 'firebase is not on PATH after install, and npx is unavailable.'
}

function Write-FirebaseLauncherConfig {
  param($Ports)

  $config = [ordered]@{
    database = [ordered]@{
      rules = 'database.rules.json'
    }
    emulators = [ordered]@{
      database = [ordered]@{
        host = '127.0.0.1'
        port = $Ports.Database
      }
      ui = [ordered]@{
        enabled = $true
        host = '127.0.0.1'
        port = $Ports.EmulatorUi
      }
      hub = [ordered]@{
        host = '127.0.0.1'
        port = $Ports.EmulatorHub
      }
      logging = [ordered]@{
        host = '127.0.0.1'
        port = $Ports.EmulatorLogging
      }
      singleProjectMode = $true
    }
  }

  $config | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $FirebaseConfigPath -Encoding UTF8
}

function Start-CmdWindow {
  param(
    [string]$Title,
    [string]$WorkingDirectory,
    [string[]]$Commands
  )

  $cmd = if ($env:ComSpec) { $env:ComSpec } else { 'cmd.exe' }
  $commandLine = "title $Title && " + ($Commands -join ' && ')
  Start-Process -FilePath $cmd -WorkingDirectory $WorkingDirectory -ArgumentList @('/k', $commandLine)
}

function Assert-ProjectShape {
  if (-not (Test-Path -LiteralPath (Join-Path $BackendDir 'package.json'))) {
    throw 'Missing backend\package.json.'
  }

  if (-not (Test-Path -LiteralPath (Join-Path $FrontendDir 'package.json'))) {
    throw 'Missing frontend\package.json.'
  }
  if (-not (Test-Path -LiteralPath (Join-Path $MlDir 'requirements.txt'))) {
    throw 'Missing ml-service\requirements.txt.'
  }
}

function Run-Check {
  Add-LocalJavaToPath

  Assert-RequiredCommand 'node' 'Install Node.js 20+ and run this again.'
  Assert-RequiredCommand 'npm' 'Install Node.js with npm enabled and run this again.'
  Assert-RequiredCommand 'java' 'Install a JDK/JRE 17+ or update JavaDir in scripts\run-project.ps1.'
  Assert-ProjectShape

  if (-not (Test-Command 'firebase')) {
    Write-Warn 'Firebase CLI is missing. A normal launch will install firebase-tools automatically.'
  }

  $ports = Get-LaunchPorts
  Write-Host "[OK] Launcher check passed."
  $mlPython = Get-MlPython
  $mlState = if ((Test-MlArtifacts) -and (Test-MlRuntime $mlPython)) { 'ready' } else { 'setup required or artifacts missing' }
  Write-Host "[OK] Available ports: backend=$($ports.Backend), frontend=$($ports.Frontend), firebase-db=$($ports.Database), firebase-ui=$($ports.EmulatorUi), ml=$($ports.Ml)"
  Write-Host "[OK] ML prerequisites: $mlState"
}

function Start-Project {
  Add-LocalJavaToPath

  Write-Host ''
  Write-Host '========================================'
  Write-Host '  Amad - one-click local launcher'
  Write-Host '========================================'
  Write-Host ''

  Assert-RequiredCommand 'node' 'Install Node.js 20+ and run this again.'
  Assert-RequiredCommand 'npm' 'Install Node.js with npm enabled and run this again.'
  Assert-RequiredCommand 'java' 'Install a JDK/JRE 17+ or update JavaDir in scripts\run-project.ps1.'
  Assert-ProjectShape

  $firebaseRunner = Resolve-FirebaseRunner
  $ports = Get-LaunchPorts

  $emulatorHost = "127.0.0.1:$($ports.Database)"
  $backendUrl = "http://127.0.0.1:$($ports.Backend)/"
  $frontendUrl = "http://127.0.0.1:$($ports.Frontend)/"
  $emulatorUiUrl = "http://localhost:$($ports.EmulatorUi)"
  $mlUrl = "http://127.0.0.1:$($ports.Ml)"

  Write-Host "[PORTS] Firebase DB: $($ports.Database)"
  Write-Host "[PORTS] Firebase UI: $($ports.EmulatorUi)"
  Write-Host "[PORTS] Backend + Cheat Controller: $($ports.Backend)"
  Write-Host "[PORTS] React frontend: $($ports.Frontend)"
  Write-Host "[PORTS] FastAPI ML: $($ports.Ml)"

  $backendEnv = Join-Path $BackendDir '.env'
  $backendEnvExample = Join-Path $BackendDir '.env.example'
  if (-not (Test-Path -LiteralPath $backendEnv)) {
    Write-Step 'Creating backend\.env from backend\.env.example...'
    Copy-Item -LiteralPath $backendEnvExample -Destination $backendEnv
  }
  Set-DotEnvValue $backendEnv 'USE_ML_SERVICE' 'true'
  Set-DotEnvValue $backendEnv 'ML_SERVICE_URL' $mlUrl
  Set-DotEnvValue $backendEnv 'ML_SERVICE_TIMEOUT_MS' '1500'

  if (-not (Test-Path -LiteralPath (Join-Path $BackendDir 'node_modules'))) {
    Write-Step 'Installing backend dependencies...'
    Invoke-Npm $BackendDir @('install')
  }

  if (-not (Test-Path -LiteralPath (Join-Path $FrontendDir 'node_modules'))) {
    Write-Step 'Installing frontend dependencies...'
    Invoke-Npm $FrontendDir @('install')
  }

  Write-FirebaseLauncherConfig $ports

  Write-Step 'Starting Firebase Realtime Database emulator...'
  Start-CmdWindow 'Amad Firebase Emulator' $Root @(
    "$firebaseRunner --config `"$FirebaseConfigPath`" emulators:start --only database --project amad-demo"
  )

  Write-Step "Waiting for Firebase on $emulatorHost..."
  if (-not (Wait-TcpPort '127.0.0.1' $ports.Database 90)) {
    throw "Firebase emulator did not start on $emulatorHost. Check the Firebase terminal window."
  }

  Write-Step 'Seeding demo data...'
  $oldEmulatorHost = $env:FIREBASE_DATABASE_EMULATOR_HOST
  try {
    $env:FIREBASE_DATABASE_EMULATOR_HOST = $emulatorHost
    Invoke-Npm $BackendDir @('run', 'seed')
  } finally {
    if ($null -eq $oldEmulatorHost) {
      Remove-Item Env:FIREBASE_DATABASE_EMULATOR_HOST -ErrorAction SilentlyContinue
    } else {
      $env:FIREBASE_DATABASE_EMULATOR_HOST = $oldEmulatorHost
    }
  }

  $mlPython = Get-MlPython
  $mlOnline = $false
  if (-not (Test-MlArtifacts)) {
    Write-Warn 'ML model artifacts are missing; the launcher will use deterministic fallback without retraining.'
  } else {
    if (-not (Test-Path -LiteralPath $mlPython)) {
      if (Test-Command 'python') {
        Write-Step 'Creating the optional ML virtual environment...'
        & python -m venv (Join-Path $MlDir '.venv')
      } else {
        Write-Warn 'Python is unavailable; the core application will continue with deterministic fallback.'
      }
    }
    if ((Test-Path -LiteralPath $mlPython) -and -not (Test-MlRuntime $mlPython)) {
      Write-Step 'Installing normal ML runtime dependencies (PyTorch is not included)...'
      & $mlPython -m pip install -r (Join-Path $MlDir 'requirements.txt')
    }
    if (Test-MlRuntime $mlPython) {
      Write-Step "Starting FastAPI ML service on $mlUrl..."
      Start-CmdWindow 'Namo FastAPI ML Service' $MlDir @(
        "`"$mlPython`" -m uvicorn app.main:app --host 127.0.0.1 --port $($ports.Ml)"
      )
      $mlOnline = Wait-MlHealth $mlUrl 60
    }
  }
  if ($mlOnline) {
    Write-Host 'ML service ready — live recommendations enabled' -ForegroundColor Green
  } else {
    Write-Host 'ML service unavailable — deterministic fallback enabled' -ForegroundColor Yellow
  }

  Write-Step "Starting backend and Cheat Controller on $backendUrl..."
  Start-CmdWindow 'Amad Backend + Cheat Controller' $BackendDir @(
    "set `"PORT=$($ports.Backend)`"",
    "set `"FIREBASE_DATABASE_EMULATOR_HOST=$emulatorHost`"",
    'set "USE_ML_SERVICE=true"',
    "set `"ML_SERVICE_URL=$mlUrl`"",
    'set "ML_SERVICE_TIMEOUT_MS=1500"',
    'npm run dev'
  )

  if (-not (Wait-TcpPort '127.0.0.1' $ports.Backend 45)) {
    throw "Backend did not start on port $($ports.Backend). Check the backend terminal window."
  }

  Write-Step "Starting React frontend on $frontendUrl..."
  Start-CmdWindow 'Amad React Frontend' $FrontendDir @(
    "set `"VITE_API_BASE_URL=http://127.0.0.1:$($ports.Backend)`"",
    "set `"VITE_FIREBASE_EMULATOR_HOST=$emulatorHost`"",
    "npm run dev -- --host 127.0.0.1 --port $($ports.Frontend) --strictPort"
  )

  if (-not (Wait-TcpPort '127.0.0.1' $ports.Frontend 60)) {
    throw "React frontend did not start on port $($ports.Frontend). Check the frontend terminal window."
  }

  Write-Step 'Opening browser tabs...'
  Start-Process $backendUrl
  Start-Process $frontendUrl

  Write-Host ''
  Write-Host 'Done. Keep the service windows open while using the demo.'
  Write-Host "Cheat Controller: $backendUrl"
  Write-Host "React app:        $frontendUrl"
  Write-Host "Firebase UI:      $emulatorUiUrl"
  Write-Host "FastAPI health:   $mlUrl/health"
  Write-Host ''
  Read-Host 'Press Enter to close this launcher window'
}

try {
  if ($Check) {
    Run-Check
  } else {
    Start-Project
  }
} catch {
  Write-Fail $_.Exception.Message
  if (-not $Check) {
    Read-Host 'Press Enter to close this launcher window'
  }
  exit 1
}
