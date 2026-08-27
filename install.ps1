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
  -Help, -h             Show this help message

Examples:
  # Run directly inside your project via PowerShell:
  irm https://raw.githubusercontent.com/ahauy/universal-agents-workflow/main/install.ps1 | iex

  # Run from cloned repository:
  .\install.ps1 -Target "..\my-existing-project" -Mode "local" -Yes
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

    # ------------------------------------------------------------------------------
    # 3. Copy Workflow Assets
    # ------------------------------------------------------------------------------
    Write-Host "`n📦 Đang sao chép các thành phần Universal Agents Workflow..." -ForegroundColor White

    function Copy-WorkflowItem ($src, $dest, $name) {
        if (-not $dest -or $dest -eq $Target -or $dest -eq "$Target\" -or $dest -eq "$Target/") {
            Write-Host "  ⚠️  CẢNH BÁO AN TOÀN: Đường dẫn đích không hợp lệ hoặc trỏ vào root: $name. Bỏ qua!" -ForegroundColor Red
            return
        }
        if (Test-Path $src) {
            if (Test-Path -PathType Container $src) {
                if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest -Force | Out-Null }
                Copy-Item -Path "$src\*" -Destination $dest -Recurse -Force
            } else {
                $parent = Split-Path -Parent $dest
                if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
                Copy-Item -Path $src -Destination $dest -Force
            }
            $relPath = $dest.Replace($Target, "").TrimStart("\", "/")
            Write-Host "  ✅ Đã tích hợp: $name ➔ $relPath" -ForegroundColor Cyan
        }
    }

    Copy-WorkflowItem (Join-Path $SourceDir ".agents") (Join-Path $Target ".agents") ".agents/"
    Copy-WorkflowItem (Join-Path $SourceDir ".specify") (Join-Path $Target ".specify") ".specify/"
    Copy-WorkflowItem (Join-Path $SourceDir "adr") (Join-Path $Target "adr") "adr/"
    Copy-WorkflowItem (Join-Path $SourceDir "CONTEXT.md") (Join-Path $Target "CONTEXT.md") "CONTEXT.md"
    Copy-WorkflowItem (Join-Path $SourceDir "AGENTS.md") (Join-Path $Target "AGENTS.md") "AGENTS.md"
    Copy-WorkflowItem (Join-Path $SourceDir "GEMINI.md") (Join-Path $Target "GEMINI.md") "GEMINI.md"
    Copy-WorkflowItem (Join-Path $SourceDir "CLAUDE.md") (Join-Path $Target "CLAUDE.md") "CLAUDE.md"
    Copy-WorkflowItem (Join-Path $SourceDir ".cursorrules") (Join-Path $Target ".cursorrules") ".cursorrules"
    Copy-WorkflowItem (Join-Path $SourceDir ".windsurfrules") (Join-Path $Target ".windsurfrules") ".windsurfrules"
    Copy-WorkflowItem (Join-Path $SourceDir ".github\copilot-instructions.md") (Join-Path $Target ".github\copilot-instructions.md") ".github/copilot-instructions.md"

    # Record workflow source repository metadata
    $sourceMetadata = @{
        sourcePath = $SourceDir
        version = "1.0.0"
        installedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    } | ConvertTo-Json
    Set-Content -Path (Join-Path $Target ".agents\workflow-source.json") -Value $sourceMetadata -Force

    # Ensure catalog.json exists inside .agents/
    $catalogSrc = Join-Path $SourceDir "optional-stack-skills\catalog.json"
    $catalogDest = Join-Path $Target ".agents\catalog.json"
    if ((Test-Path $catalogSrc) -and -not (Test-Path $catalogDest)) {
        Copy-Item -Path $catalogSrc -Destination $catalogDest -Force
    }

    # ------------------------------------------------------------------------------
    # 4. Smart Stack Scan & Selective Skill Injection (Registry-Driven Engine)
    # ------------------------------------------------------------------------------
    Write-Host "`n🔍 Đang quét Tech Stack của dự án đích (Registry-Driven)..." -ForegroundColor White

    $catalogPath = Join-Path $SourceDir "optional-stack-skills\catalog.json"
    $matchedItems = @()

    if (Test-Path $catalogPath) {
        $catalog = Get-Content $catalogPath -Raw | ConvertFrom-Json
        foreach ($item in $catalog.items) {
            if ($item.target_type -eq "mcp") { continue }
            $isMatched = $false
            foreach ($m in $item.detection_markers) {
                if ($m -like "*:*") {
                    $parts = $m -split ":"
                    $filePath = Join-Path $Target $parts[0]
                    $kw = $parts[1].Trim('"' , "'")
                    if (Test-Path $filePath) {
                        try {
                            if ((Get-Content $filePath -Raw -ErrorAction SilentlyContinue) -match [regex]::Escape($kw)) {
                                $isMatched = $true; break
                            }
                        } catch {}
                    }
                } elseif ($m -like "*\**" -or $m -like "*.*") {
                    if (Get-ChildItem -Path $Target -Filter $m -Recurse -Depth 3 -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch "(\.git|\.agents|node_modules|DerivedData|\.build)" }) {
                        $isMatched = $true; break
                    }
                } else {
                    if (Test-Path (Join-Path $Target $m)) {
                        $isMatched = $true; break
                    }
                }
            }
            if ($isMatched) {
                $matchedItems += $item
            }
        }
    }

    if ($matchedItems.Count -gt 0) {
        Write-Host "  🎯 Phát hiện các thành phần tech stack phù hợp trong catalog.json:" -ForegroundColor Green
        foreach ($item in $matchedItems) {
            Write-Host "     - $($item.name) ($($item.id))" -ForegroundColor Cyan
        }
        $doInject = $true
        if (-not $Yes) {
            $injectChoice = Read-Host "👉 Bạn có muốn tự động nạp các thành phần trên vào dự án? [Y/n]"
            if ($injectChoice -match "^[nN]") { $doInject = $false }
        }
        if ($doInject) {
            foreach ($item in $matchedItems) {
                $srcPath = Join-Path $SourceDir $item.source_path
                $tgtPath = Join-Path $Target $item.target_path
                Copy-WorkflowItem $srcPath $tgtPath $item.name
            }
        }
    } else {
        Write-Host "  ℹ️  Không phát hiện tech stack đặc thù trong danh mục catalog.json." -ForegroundColor Cyan
        Write-Host "  ✨ Giữ dự án 100% sạch sẽ: Không sao chép các kỹ năng thừa!" -ForegroundColor Green
    }

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

    Write-Host "`n🎉 Cài đặt hoàn tất thành công!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Write-Host "👉 Bước tiếp theo:"
    Write-Host "  1. Mở dự án đích trong AI Editor (Antigravity IDE, Cursor, Windsurf, Claude Code)."
    Write-Host "  2. Gõ vào ô chat của Agent:"
    Write-Host "     /skill-setup (hoặc setup dự án)"
    Write-Host "     để quét Tech Stack tự động và kích hoạt các kỹ năng chuyên biệt."
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"
}
finally {
    if ($CleanupTmp -and (Test-Path $TmpDir)) {
        Remove-Item -Path $TmpDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
