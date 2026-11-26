# ==============================================================================
# Universal Agents Workflow - Project Installer for Windows (PowerShell)
# ==============================================================================
# Usage:
#   .\install.ps1 [TARGET_DIR]
#   irm https://raw.githubusercontent.com/ahauy/universal-agents-workflow/main/install.ps1 | iex
#
# Modes:
#   1) team    - Track all in Git (Shared AI Workflow)
#   2) local   - Add all workflow files to .gitignore (Private / Clean Repo)
#   3) stealth - Add all workflow files to .git/info/exclude (Zero changes to repo)
#   4) hybrid  - Track CONTEXT.md, adr/, .specify/; ignore .agents/ & AI rules
# ==============================================================================

[CmdletBinding()]
param (
    [Parameter(Position = 0)]
    [string]$Target = "",

    [Parameter()]
    [ValidateSet("team", "local", "stealth", "hybrid", "")]
    [string]$Mode = "",

    [Parameter()]
    [alias("y")]
    [switch]$Yes = $false,

    [Parameter()]
    [alias("u")]
    [switch]$Update = $false,

    [Parameter()]
    [alias("h")]
    [switch]$Help = $false
)

$ErrorActionPreference = "Stop"

if ($Help) {
    Write-Host @"
Universal Agents Workflow - PowerShell Installer

Usage:
  .\install.ps1 [TARGET_DIR] [OPTIONS]
  irm https://raw.githubusercontent.com/ahauy/universal-agents-workflow/main/install.ps1 | iex

Options:
  -Target <path>        Target project directory to install into (defaults to current dir)
  -Mode <mode>          Git management mode:
                          team    : Track all files in Git (Share with team)
                          local   : Add all workflow files to target .gitignore
                          stealth : Add all workflow files to target .git/info/exclude
                          hybrid  : Track Specs/ADRs/CONTEXT, ignore .agents & AI rules
  -Yes, -y              Non-interactive mode (use defaults or provided arguments)
  -Update, -u           Smart Update Mode: update framework, protect all project data
  -Help, -h             Show this help message

Examples:
  # Run directly inside your project via PowerShell:
  irm https://raw.githubusercontent.com/ahauy/universal-agents-workflow/main/install.ps1 | iex

  # Run from cloned repository:
  .\install.ps1 -Target "..\my-existing-project" -Mode "local" -Yes

  # Update existing installation (protects all project data):
  .\install.ps1 -Update
"@
    exit 0
}

$SourceDir = $PSScriptRoot
$CleanupTmp = $false
$TmpDir = ""

try {
    # If executed remotely via irm ... | iex (no local .agents directory found)
    if ([string]::IsNullOrWhiteSpace($SourceDir) -or -not (Test-Path (Join-Path $SourceDir ".agents"))) {
        Write-Host "🌐 Phát hiện cài đặt trực tiếp từ xa qua PowerShell (Remote One-Liner)..." -ForegroundColor Cyan
        Write-Host "📥 Đang tải bộ khung Universal Agents Workflow từ GitHub..." -ForegroundColor Cyan
        $TmpDir = Join-Path $env:TEMP ("uaw-install-" + [System.Guid]::NewGuid().ToString("N"))
        New-Item -ItemType Directory -Path $TmpDir -Force | Out-Null
        git clone --depth=1 https://github.com/ahauy/universal-agents-workflow.git $TmpDir 2>$null
        $SourceDir = $TmpDir
        $CleanupTmp = $true
    }

    Write-Host "╔═══════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Blue
    Write-Host "║       🌐 Universal Agents Workflow — Project Integrator (PowerShell)      ║" -ForegroundColor Blue
    Write-Host "╚═══════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Blue

    # ------------------------------------------------------------------------------
    # 1. Resolve Target Directory
    # ------------------------------------------------------------------------------
    $CurrentLocation = (Get-Location).Path

    if ([string]::IsNullOrWhiteSpace($Target)) {
        if ($Yes) {
            $Target = $CurrentLocation
        } else {
            Write-Host "`nVui lòng chọn thư mục dự án cần tích hợp:" -ForegroundColor White
            $userInput = Read-Host "👉 Đường dẫn dự án (nhấn Enter để dùng thư mục hiện tại: $CurrentLocation)"
            if ([string]::IsNullOrWhiteSpace($userInput)) {
                $Target = $CurrentLocation
            } else {
                $Target = $userInput
            }
        }
    }

    if (-not (Test-Path $Target)) {
        Write-Host "❌ Thư mục dự án không tồn tại: $Target" -ForegroundColor Red
        exit 1
    }

    $Target = (Resolve-Path $Target).Path

    if (-not $CleanupTmp -and ($Target -eq $SourceDir)) {
        Write-Host "⚠️ Thư mục đích chính là thư mục gốc của Universal-Agents-Workflow." -ForegroundColor Yellow
        Write-Host "Bộ khung đã có sẵn tại đây. Nếu bạn muốn cài vào dự án khác, hãy truyền đường dẫn dự án đó."
        exit 0
    }

    Write-Host "`n📁 Thư mục nguồn: $SourceDir" -ForegroundColor Cyan
    Write-Host "🎯 Dự án đích:    $Target" -ForegroundColor Cyan

    # ------------------------------------------------------------------------------
    # 2. Select Git Tracking Mode
    # ------------------------------------------------------------------------------
    if ([string]::IsNullOrWhiteSpace($Mode)) {
        if ($Yes) {
            $Mode = "local"
        } else {
            Write-Host "`nChọn chế độ quản lý Git cho Universal Agents Workflow trong dự án đích:" -ForegroundColor White
            Write-Host "  1) 🌐 Team Mode (Shared)"
            Write-Host "     - Đẩy toàn bộ lên GitHub/GitLab."
            Write-Host "     - Chia sẻ quy chuẩn AI, rules và skills chung cho toàn bộ team.`n"
            Write-Host "  2) 🔒 Local-Only Mode (Private .gitignore) [Khuyên dùng cho cá nhân]"
            Write-Host "     - Tự động thêm các thư mục và tệp workflow vào .gitignore của dự án."
            Write-Host "     - Giữ remote repository 100% sạch sẽ, không ai trên GitHub thấy file AI.`n"
            Write-Host "  3) 🕶️ Stealth Mode (Private .git/info/exclude)"
            Write-Host "     - Giữ nguyên .gitignore của repo (không làm đổi cả file gitignore chung)."
            Write-Host "     - Đưa cấu hình ignore vào .git/info/exclude cục bộ trên máy bạn.`n"
            Write-Host "  4) ⚖️ Hybrid Mode (Specs on Git, Engine Ignored)"
            Write-Host "     - Giữ lại tài liệu nghiệp vụ (CONTEXT.md, adr/, .specify/) trên Git."
            Write-Host "     - Giấu toàn bộ bộ máy AI (.agents/, AI rules).`n"

            do {
                $choice = Read-Host "👉 Lựa chọn của bạn [1/2/3/4] (mặc định: 2)"
                if ([string]::IsNullOrWhiteSpace($choice)) { $choice = "2" }
                switch ($choice) {
                    "1" { $Mode = "team" }
                    "team" { $Mode = "team" }
                    "2" { $Mode = "local" }
                    "local" { $Mode = "local" }
                    "3" { $Mode = "stealth" }
                    "stealth" { $Mode = "stealth" }
                    "4" { $Mode = "hybrid" }
                    "hybrid" { $Mode = "hybrid" }
                    default { Write-Host "Lựa chọn không hợp lệ, vui lòng chọn 1, 2, 3 hoặc 4." -ForegroundColor Red }
                }
            } while ([string]::IsNullOrWhiteSpace($Mode))
        }
    }

    Write-Host "⚙️  Chế độ đã chọn: $Mode" -ForegroundColor Green

    $enginePath = Join-Path $SourceDir ".agents/scripts/update-engine.py"
    $pythonCmd = Get-Command python3 -ErrorAction SilentlyContinue
    if (-not $pythonCmd) { $pythonCmd = Get-Command python -ErrorAction SilentlyContinue }
    if (-not $pythonCmd -or -not (Test-Path $enginePath)) {
        throw "Python and the update engine are required for safe installation."
    }
    $engineArgs = if ($Update) { @("--apply", "--target", $Target) } else {
        @("--sync", "--source", $SourceDir, "--target", $Target, "--git-mode", $Mode, "--detect-packs", "--installer-paths")
    }
    if ($Yes) { $engineArgs += "--yes" }
    & $pythonCmd.Source $enginePath @engineArgs
    if ($LASTEXITCODE -ne 0) { throw "Installation partial or rejected (exit $LASTEXITCODE); inspect phase results and retry." }
    if ($Update) { return }

    # ------------------------------------------------------------------------------
    # 5. Configure Git Tracking & Ignore Rules
    # ------------------------------------------------------------------------------
    Write-Host "`n🔒 Cấu hình Git Tracking ($Mode)..." -ForegroundColor White

    function Append-IfNotPresent ($file, $content, $marker) {
        $parent = Split-Path -Parent $file
        if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
        if (-not (Test-Path $file)) { New-Item -ItemType File -Path $file -Force | Out-Null }
        $current = Get-Content $file -Raw -ErrorAction SilentlyContinue
        if ($current -and ($current -match [regex]::Escape($marker))) {
            Write-Host "  ℹ️  Đã cấu hình trước đó trong $(Split-Path -Leaf $file) (bỏ qua ghi trùng)."
        } else {
            Add-Content -Path $file -Value "`n$content"
            Write-Host "  ✅ Đã cập nhật quy tắc Git vào $file" -ForegroundColor Green
        }
    }

    $ignoreFull = @"
# --- Universal Agents Workflow (Local-Only Mode) ---
.agents/
.specify/
adr/
CONTEXT.md
GEMINI.md
CLAUDE.md
AGENTS.md
.cursorrules
.windsurfrules
"@

    $ignoreHybrid = @"
# --- Universal Agents Workflow (Hybrid Mode: Private Engine) ---
.agents/
GEMINI.md
CLAUDE.md
AGENTS.md
.cursorrules
.windsurfrules
"@

    $ignoreTeam = @"
# --- Universal Agents Workflow (Team Mode: Temp Logs Only) ---
.agents/scripts/hooks/*.log
"@

    switch ($Mode) {
        "team" {
            Append-IfNotPresent (Join-Path $Target ".gitignore") $ignoreTeam "Universal Agents Workflow"
        }
        "local" {
            Append-IfNotPresent (Join-Path $Target ".gitignore") $ignoreFull "Universal Agents Workflow"
        }
        "stealth" {
            $gitDir = Join-Path $Target ".git"
            if (Test-Path $gitDir) {
                Append-IfNotPresent (Join-Path $Target ".git\info\exclude") $ignoreFull "Universal Agents Workflow"
                Write-Host "  💡 Lưu ý: .gitignore chung của repo hoàn toàn không bị sửa đổi." -ForegroundColor Yellow
            } else {
                Write-Host "  ⚠️ Dự án đích chưa khởi tạo Git (.git không tồn tại). Tự động ghi vào .gitignore thay thế." -ForegroundColor Yellow
                Append-IfNotPresent (Join-Path $Target ".gitignore") $ignoreFull "Universal Agents Workflow"
            }
        }
        "hybrid" {
            Append-IfNotPresent (Join-Path $Target ".gitignore") $ignoreHybrid "Universal Agents Workflow"
        }
    }

    # ------------------------------------------------------------------------------
    # 6. Generate UPGRADE_NOTICE.md (hướng dẫn cập nhật cho người dùng)
    # ------------------------------------------------------------------------------
    $upgradeNoticePath = Join-Path $Target "UPGRADE_NOTICE.md"
    if (-not (Test-Path $upgradeNoticePath)) {
        $noticeContent = @"
# How to Get Updates — Universal Agents Workflow

This project uses **Universal Agents Workflow** as its AI agent framework.

## Check & Apply Updates

### Option 1 — In your AI Editor (recommended)

Type `/update` in the AI chat:
```
/update
```
The AI will check for a new version and apply it safely using the 3-Way Hash engine.

### Option 2 — CLI (PowerShell)

```powershell
irm https://raw.githubusercontent.com/ahauy/universal-agents-workflow/main/install.ps1 | iex -ArgumentList "-Update"
```

### Option 3 — Python engine directly

```bash
# Check only (no changes)
python .agents/scripts/update-engine.py --check

# Apply update
python .agents/scripts/update-engine.py --apply
```

## What Is Protected During Updates?

Your project data is **NEVER overwritten**:

| Protected | Description |
|---|---|
| `CONTEXT.md` | Project ubiquitous language |
| `PRODUCT_BACKLOG_ROADMAP.md` | Product backlog & roadmap |
| `CHANGELOG.md` | Project change history |
| `adr/` | Architecture Decision Records |
| `docs/features/` | Technical documentation |
| `docs/user-guides/` | End-user guides with screenshots |
| `docs/architecture/` | Architecture diagrams & docs |
| `.specify/features/` | Feature specs, test plans, baseline |
| `src/` | Your source code |
| `.env`, `.env.*` | Environment variables & secrets |

User-added custom skills in `.agents/` are also **never deleted**.

## Release Notes

See: https://github.com/ahauy/universal-agents-workflow/releases
"@
        Set-Content -Path $upgradeNoticePath -Value $noticeContent -Force
        Write-Host "  📄 Đã tạo UPGRADE_NOTICE.md — hướng dẫn cách cập nhật framework sau này." -ForegroundColor Green
    }

    Write-Host "`nInstallation results: see the source and phase summaries above."
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Write-Host "👉 Bước tiếp theo:"
    Write-Host "  1. Mở dự án đích trong AI Editor (Antigravity IDE, Cursor, Windsurf, Claude Code)."
    Write-Host "  2. Gõ vào ô chat của Agent:"
    Write-Host "     /skill-setup (hoặc setup dự án)"
    Write-Host "     để quét Tech Stack tự động và kích hoạt các kỹ năng chuyên biệt."
    Write-Host "  3. Để cập nhật framework sau này: gõ /update trong chat."
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"
}
finally {
    if ($CleanupTmp -and (Test-Path $TmpDir)) {
        Remove-Item -Path $TmpDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
