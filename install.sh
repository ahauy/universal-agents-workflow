#!/usr/bin/env bash
# ==============================================================================
# Universal Agents Workflow - Project Installer & Git Mode Integrator
# ==============================================================================
# Usage:
#   ./install.sh [TARGET_DIR]
#   ./install.sh --target=/path/to/project --mode=local -y
#   ./install.sh --update          (Smart Update Mode)
#
# Modes:
#   1) team    - Track all in Git (Shared AI Workflow)
#   2) local   - Add all workflow files to .gitignore (Private / Clean Repo)
#   3) stealth - Add all workflow files to .git/info/exclude (Zero changes to repo)
#   4) hybrid  - Track CONTEXT.md, adr/, .specify/; ignore .agents/, skills & AI rules
# ==============================================================================

set -euo pipefail

# Colors for terminal output
BOLD="\033[1m"
DIM="\033[2m"
GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
CYAN="\033[0;36m"
NC="\033[0m" # No Color

# Determine script source directory (safely handle piped execution with set -u)
SOURCE_DIR=""
if [ -n "${BASH_SOURCE[0]:-}" ]; then
  SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd || echo "")"
fi
TMP_DIR=""
CLEANUP_TMP=false

# Helper for interactive prompt reading (supports pipe from curl via /dev/tty)
prompt_read() {
  local prompt_text="$1"
  local __resultvar="$2"
  local input_val=""
  if [ -c /dev/tty ] && { : < /dev/tty ; } 2>/dev/null; then
    read -r -p "$prompt_text" input_val < /dev/tty || true
  else
    read -r -p "$prompt_text" input_val || true
  fi
  eval "$__resultvar=\"$input_val\""
}

TARGET_DIR=""
MODE=""
NON_INTERACTIVE=false
UPDATE_MODE=false

# ------------------------------------------------------------------------------
# 1. Parse CLI Arguments
# ------------------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
  case "$1" in
    --target=*)
      TARGET_DIR="${1#*=}"
      shift
      ;;
    --target)
      TARGET_DIR="$2"
      shift 2
      ;;
    --mode=*)
      MODE="${1#*=}"
      shift
      ;;
    --mode)
      MODE="$2"
      shift 2
      ;;
    -y|--yes|--non-interactive)
      NON_INTERACTIVE=true
      shift
      ;;
    --update|-u)
      UPDATE_MODE=true
      shift
      ;;
    -h|--help)
      cat << 'EOF'
Universal Agents Workflow - Installer

Usage:
  ./install.sh [TARGET_DIR] [OPTIONS]
  curl -fsSL https://raw.githubusercontent.com/ahauy/universal-agents-workflow/main/install.sh | bash

Options:
  --target <path>       Target project directory to install into (defaults to current dir)
  --mode <mode>         Git management mode:
                          team    : Track all files in Git (Share with team)
                          local   : Add all workflow files to target .gitignore
                          stealth : Add all workflow files to target .git/info/exclude
                          hybrid  : Track Specs/ADRs/CONTEXT, ignore .agents & AI rules
  -y, --yes             Non-interactive mode (use defaults or provided arguments)
  --update, -u          Smart Update Mode: update framework, protect all project data
  -h, --help            Show this help message

Examples:
  # Run directly inside your project:
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/ahauy/universal-agents-workflow/main/install.sh)"

  # Run from cloned repository:
  ./install.sh ../my-existing-project
  ./install.sh --target=../my-project --mode=local -y

  # Update existing installation (protects all project data):
  ./install.sh --update
  curl -fsSL https://raw.githubusercontent.com/ahauy/universal-agents-workflow/main/install.sh | bash -s -- --update
EOF
      exit 0
      ;;
    *)
      if [ -z "$TARGET_DIR" ]; then
        TARGET_DIR="$1"
      fi
      shift
      ;;
  esac
done

# If executed remotely via curl/pipe (no local .agents directory found)
if [ -z "$SOURCE_DIR" ] || [ ! -d "$SOURCE_DIR/.agents" ]; then
  echo -e "${BOLD}${CYAN}🌐 Phát hiện cài đặt trực tiếp từ xa (Remote One-Liner)...${NC}"
  echo -e "📥 Đang tải bộ khung Universal Agents Workflow từ GitHub..."
  TMP_DIR="$(mktemp -d 2>/dev/null || mktemp -d -t 'uaw-install')"
  git clone --depth=1 https://github.com/ahauy/universal-agents-workflow.git "$TMP_DIR" >/dev/null 2>&1
  SOURCE_DIR="$TMP_DIR"
  CLEANUP_TMP=true
  trap 'if [ "$CLEANUP_TMP" = true ] && [ -d "$TMP_DIR" ]; then rm -rf "$TMP_DIR"; fi' EXIT
fi

echo -e "${BOLD}${BLUE}╔═══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║       🌐 Universal Agents Workflow — Project Integrator                   ║${NC}"
echo -e "${BOLD}${BLUE}╚═══════════════════════════════════════════════════════════════════════════╝${NC}"

# ------------------------------------------------------------------------------
# 2. Resolve Target Directory
# ------------------------------------------------------------------------------
if [ -z "$TARGET_DIR" ]; then
  if [ "$NON_INTERACTIVE" = true ]; then
    TARGET_DIR="$(pwd)"
  else
    echo -e "\n${BOLD}Vui lòng chọn thư mục dự án cần tích hợp:${NC}"
    USER_INPUT_DIR=""
    prompt_read "👉 Đường dẫn dự án (nhấn Enter để dùng thư mục hiện tại: $(pwd)): " USER_INPUT_DIR
    if [ -z "$USER_INPUT_DIR" ]; then
      TARGET_DIR="$(pwd)"
    else
      TARGET_DIR="$USER_INPUT_DIR"
    fi
  fi
fi

# Convert to absolute path
TARGET_DIR="$(cd "$TARGET_DIR" 2>/dev/null && pwd || echo "$TARGET_DIR")"

if [ ! -d "$TARGET_DIR" ]; then
  echo -e "${RED}❌ Thư mục dự án không tồn tại: ${TARGET_DIR}${NC}"
  exit 1
fi

if [ "$CLEANUP_TMP" = false ] && [ "$TARGET_DIR" = "$SOURCE_DIR" ]; then
  echo -e "${YELLOW}⚠️ Thư mục đích chính là thư mục gốc của Universal-Agents-Workflow.${NC}"
  echo -e "Bộ khung đã có sẵn tại đây. Nếu bạn muốn cài vào dự án khác, hãy truyền đường dẫn dự án đó."
  exit 0
fi

echo -e "\n📁 ${CYAN}Thư mục nguồn:${NC} ${SOURCE_DIR}"
echo -e "🎯 ${CYAN}Dự án đích:${NC}    ${TARGET_DIR}"

# ------------------------------------------------------------------------------
# 3. Select Git Tracking Mode
# ------------------------------------------------------------------------------
if [ -z "$MODE" ]; then
  if [ "$NON_INTERACTIVE" = true ]; then
    MODE="local" # Default for non-interactive if unspecified
  else
    echo -e "\n${BOLD}Chọn chế độ quản lý Git cho Universal Agents Workflow trong dự án đích:${NC}"
    echo -e "  ${BOLD}1) 🌐 Team Mode (Shared)${NC}"
    echo -e "     - Đẩy toàn bộ lên GitHub/GitLab."
    echo -e "     - Chia sẻ quy chuẩn AI, rules và skills chung cho toàn bộ team."
    echo -e ""
    echo -e "  ${BOLD}2) 🔒 Local-Only Mode (Private .gitignore)${NC} [Khuyên dùng cho cá nhân]"
    echo -e "     - Tự động thêm các thư mục và tệp workflow vào ${CYAN}.gitignore${NC} của dự án."
    echo -e "     - Giữ remote repository 100% sạch sẽ, không ai trên GitHub thấy file AI."
    echo -e ""
    echo -e "  ${BOLD}3) 🕶️ Stealth Mode (Private .git/info/exclude)${NC}"
    echo -e "     - Giữ nguyên ${CYAN}.gitignore${NC} của repo (không làm đổi cả file gitignore chung)."
    echo -e "     - Đưa cấu hình ignore vào ${CYAN}.git/info/exclude${NC} cục bộ trên máy bạn."
    echo -e ""
    echo -e "  ${BOLD}4) ⚖️ Hybrid Mode (Specs on Git, Engine Ignored)${NC}"
    echo -e "     - Giữ lại tài liệu nghiệp vụ (${CYAN}CONTEXT.md${NC}, ${CYAN}adr/${NC}, ${CYAN}.specify/${NC}) trên Git."
    echo -e "     - Giấu toàn bộ bộ máy AI (${CYAN}.agents/${NC}, AI rules)."
    echo -e ""
    
    while true; do
      CHOICE=""
      prompt_read "👉 Lựa chọn của bạn [1/2/3/4] (mặc định: 2): " CHOICE
      case "${CHOICE:-2}" in
        1|team)
          MODE="team"
          break
          ;;
        2|local)
          MODE="local"
          break
          ;;
        3|stealth)
          MODE="stealth"
          break
          ;;
        4|hybrid)
          MODE="hybrid"
          break
          ;;
        *)
          echo -e "${RED}Lựa chọn không hợp lệ, vui lòng chọn 1, 2, 3 hoặc 4.${NC}"
          ;;
      esac
    done
  fi
fi

# Normalize MODE
case "$MODE" in
  1|team) MODE="team" ;;
  2|local) MODE="local" ;;
  3|stealth) MODE="stealth" ;;
  4|hybrid) MODE="hybrid" ;;
  *)
    echo -e "${RED}❌ Chế độ không hợp lệ: $MODE (Chỉ chấp nhận: team, local, stealth, hybrid)${NC}"
    exit 1
    ;;
esac

echo -e "⚙️  Chế độ đã chọn: ${BOLD}${GREEN}${MODE}${NC}"

# ------------------------------------------------------------------------------
# 4. Copy Workflow Assets
# ------------------------------------------------------------------------------
echo -e "\n📦 ${BOLD}Đang sao chép các thành phần Universal Agents Workflow...${NC}"

# Ensure destination directories exist
mkdir -p "$TARGET_DIR"

# Project data paths that are NEVER overwritten (not even on fresh install if they already exist)
PROTECTED_DATA_PATHS=(
  "CONTEXT.md"
  "PRODUCT_BACKLOG_ROADMAP.md"
  "CHANGELOG.md"
  "UPGRADE_NOTICE.md"
  "adr"
  "docs/features"
  "docs/user-guides"
  "docs/architecture"
  "docs/RUN_AND_TEST.md"
  ".specify/features"
  "src"
)

# Top-level assets this workflow owns. If ANY of them already exists in the
# target, the target is not a clean slate and we must not blind-copy over it.
WORKFLOW_ASSETS=(
  ".agents"
  ".specify"
  "adr"
  "docs/architecture"
  "CONTEXT.md"
  "AGENTS.md"
  "GEMINI.md"
  "CLAUDE.md"
  ".cursorrules"
  ".windsurfrules"
  ".github/copilot-instructions.md"
)

# ── Smart Update Mode: delegate to the Python engine, then stop ──────────────
# --apply clones the remote repo and 3-way-merges it into the target, so it
# must NOT be preceded by a local copy: that copy would already have clobbered
# the user's files before the engine got a chance to compare them.
if [ "$UPDATE_MODE" = true ]; then
  ENGINE_SRC="$SOURCE_DIR/.agents/scripts/update-engine.py"
  if command -v python3 >/dev/null 2>&1 && [ -f "$ENGINE_SRC" ]; then
    echo -e "\n🔄 ${BOLD}Chạy Smart Update Engine (3-Way Hash)...${NC}"
    APPLY_ARGS=(--apply --target "$TARGET_DIR")
    [ "$NON_INTERACTIVE" = true ] && APPLY_ARGS+=(--yes)
    python3 "$ENGINE_SRC" "${APPLY_ARGS[@]}"
    exit $?
  else
    echo -e "${YELLOW}⚠️ Python 3 hoặc update engine không có sẵn.${NC}"
    echo -e "   Không thể chạy Smart Update. Hủy bỏ để tránh ghi đè dữ liệu dự án."
    exit 1
  fi
fi

# All installations share validated mappings, recorded hashes and ordered refresh.
ENGINE_SRC="$SOURCE_DIR/.agents/scripts/update-engine.py"
if ! command -v python3 >/dev/null 2>&1 || [ ! -f "$ENGINE_SRC" ]; then
  echo "Python 3 and the update engine are required for safe installation."
  exit 1
fi
SYNC_ARGS=(--sync --source "$SOURCE_DIR" --target "$TARGET_DIR" --git-mode "$MODE" --detect-packs --installer-paths)
[ "$NON_INTERACTIVE" = true ] && SYNC_ARGS+=(--yes)
if python3 "$ENGINE_SRC" "${SYNC_ARGS[@]}"; then
  echo "Source and derived phase results are shown above."
else
  echo "Installation is partial or rejected; inspect the phase results and retry."
  exit 1
fi

# ------------------------------------------------------------------------------
# 6. Configure Git Tracking & Ignore Rules
# ------------------------------------------------------------------------------
echo -e "\n🔒 ${BOLD}Cấu hình Git Tracking (${MODE})...${NC}"

append_if_not_present() {
  local file="$1"
  local content="$2"
  local marker="$3"

  mkdir -p "$(dirname "$file")"
  touch "$file"

  if grep -q "$marker" "$file" 2>/dev/null; then
    echo -e "  ℹ️  Đã cấu hình trước đó trong $(basename "$file") (bỏ qua ghi trùng)."
  else
    echo -e "\n$content" >> "$file"
    echo -e "  ✅ Đã cập nhật quy tắc Git vào ${GREEN}$file${NC}"
  fi
}

IGNORE_FULL_BLOCK="# --- Universal Agents Workflow (Local-Only Mode) ---
.agents/
.specify/
adr/
CONTEXT.md
GEMINI.md
CLAUDE.md
AGENTS.md
.cursorrules
.windsurfrules
# Generated by .agents/scripts/install-hooks.js - regenerate, never commit
.claude/settings.json"

IGNORE_HYBRID_BLOCK="# --- Universal Agents Workflow (Hybrid Mode: Private Engine) ---
.agents/
GEMINI.md
CLAUDE.md
AGENTS.md
.cursorrules
.windsurfrules
# Generated by .agents/scripts/install-hooks.js - regenerate, never commit
.claude/settings.json"

IGNORE_TEAM_BLOCK="# --- Universal Agents Workflow (Team Mode: Temp Logs Only) ---
.agents/scripts/hooks/*.log"

case "$MODE" in
  team)
    append_if_not_present "$TARGET_DIR/.gitignore" "$IGNORE_TEAM_BLOCK" "Universal Agents Workflow"
    ;;
  local)
    append_if_not_present "$TARGET_DIR/.gitignore" "$IGNORE_FULL_BLOCK" "Universal Agents Workflow"
    ;;
  stealth)
    if [ -d "$TARGET_DIR/.git" ]; then
      append_if_not_present "$TARGET_DIR/.git/info/exclude" "$IGNORE_FULL_BLOCK" "Universal Agents Workflow"
      echo -e "  💡 ${YELLOW}Lưu ý: .gitignore chung của repo hoàn toàn không bị sửa đổi.${NC}"
    else
      echo -e "  ⚠️ Dự án đích chưa khởi tạo Git (.git không tồn tại). Tự động ghi vào .gitignore thay thế."
      append_if_not_present "$TARGET_DIR/.gitignore" "$IGNORE_FULL_BLOCK" "Universal Agents Workflow"
    fi
    ;;
  hybrid)
    append_if_not_present "$TARGET_DIR/.gitignore" "$IGNORE_HYBRID_BLOCK" "Universal Agents Workflow"
    ;;
esac

# ------------------------------------------------------------------------------
# 7. Generate UPGRADE_NOTICE.md (hướng dẫn cập nhật cho người dùng)
# ------------------------------------------------------------------------------
if [ ! -f "$TARGET_DIR/UPGRADE_NOTICE.md" ]; then
  cat > "$TARGET_DIR/UPGRADE_NOTICE.md" << 'NOTICE_EOF'
# How to Get Updates — Universal Agents Workflow

This project uses **Universal Agents Workflow** as its AI agent framework.

## Check & Apply Updates

### Option 1 — In your AI Editor (recommended)

Type `/update` in the AI chat:
```
/update
```
The AI will check for a new version and apply it safely using the 3-Way Hash engine.

### Option 2 — CLI

```bash
curl -fsSL https://raw.githubusercontent.com/ahauy/universal-agents-workflow/main/install.sh | bash -s -- --update
```

### Option 3 — Python engine directly

```bash
# Check only (no changes)
python3 .agents/scripts/update-engine.py --check

# Apply update
python3 .agents/scripts/update-engine.py --apply
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

See: <https://github.com/ahauy/universal-agents-workflow/releases>
NOTICE_EOF
  echo -e "  📄 ${GREEN}Đã tạo UPGRADE_NOTICE.md${NC} — hướng dẫn cách cập nhật framework sau này."
fi

# ------------------------------------------------------------------------------
# 8. Final Summary & Next Steps
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}Installation results: see the source and phase summaries above.${NC}"
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "👉 ${BOLD}Bước tiếp theo:${NC}"
echo -e "  1. Mở dự án đích trong AI Editor (Antigravity IDE, Cursor, Windsurf, Claude Code)."
echo -e "  2. Gõ vào ô chat của Agent:"
echo -e "     ${CYAN}/skill-setup${NC} (hoặc ${CYAN}setup dự án${NC})"
echo -e "     để quét Tech Stack tự động và kích hoạt các kỹ năng chuyên biệt."
echo -e "  3. Để cập nhật framework sau này: gõ ${CYAN}/update${NC} trong chat."
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
