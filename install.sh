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

is_project_data() {
  local dest_rel="${1#$TARGET_DIR/}"
  for protected in "${PROTECTED_DATA_PATHS[@]}"; do
    if [ "$dest_rel" = "$protected" ] || \
       [ "$dest_rel" = "$protected/" ] || \
       [[ "$dest_rel" == "$protected/"* ]]; then
      return 0  # is protected
    fi
  done
  return 1  # not protected
}

copy_item() {
  local src="$1"
  local dest="$2"
  local name="$3"

  # HARD GUARD: TUYỆT ĐỐI KHÔNG sao chép vào thư mục root nếu target_path rỗng hoặc bằng TARGET_DIR
  if [ -z "$dest" ] || [ "$dest" = "$TARGET_DIR" ] || [ "$dest" = "$TARGET_DIR/" ]; then
    echo -e "  ⚠️  ${RED}CẢNH BÁO AN TOÀN: Phát hiện đường dẫn đích không hợp lệ hoặc trỏ vào root: ${name}. Bỏ qua!${NC}"
    return 1
  fi

  # PROTECTION GATE: Skip project data files that already exist
  if [ -e "$dest" ] && is_project_data "$dest"; then
    local rel_dest="${dest#$TARGET_DIR/}"
    echo -e "  🛡️  Bảo vệ dữ liệu dự án: ${CYAN}${name}${NC} ➔ ${YELLOW}${rel_dest} (đã tồn tại, bỏ qua)${NC}"
    return 0
  fi

  if [ -e "$src" ]; then
    if [ -d "$src" ]; then
      mkdir -p "$dest"
      cp -R "$src/"* "$dest/" 2>/dev/null || true
      # Also copy hidden files if any
      cp -R "$src/".[!.]* "$dest/" 2>/dev/null || true
    else
      mkdir -p "$(dirname "$dest")"
      cp -p "$src" "$dest"
    fi
    local rel_dest="${dest#$TARGET_DIR/}"
    echo -e "  ✅ Đã tích hợp: ${CYAN}${name}${NC} ➔ ${GREEN}${rel_dest}${NC}"
  else
    echo -e "  ⚠️ Không tìm thấy nguồn: ${name}"
  fi
}

copy_item "$SOURCE_DIR/.agents" "$TARGET_DIR/.agents" ".agents/"
copy_item "$SOURCE_DIR/.specify" "$TARGET_DIR/.specify" ".specify/"
copy_item "$SOURCE_DIR/adr" "$TARGET_DIR/adr" "adr/"
copy_item "$SOURCE_DIR/CONTEXT.md" "$TARGET_DIR/CONTEXT.md" "CONTEXT.md"
copy_item "$SOURCE_DIR/AGENTS.md" "$TARGET_DIR/AGENTS.md" "AGENTS.md"
copy_item "$SOURCE_DIR/GEMINI.md" "$TARGET_DIR/GEMINI.md" "GEMINI.md"
copy_item "$SOURCE_DIR/CLAUDE.md" "$TARGET_DIR/CLAUDE.md" "CLAUDE.md"
copy_item "$SOURCE_DIR/.cursorrules" "$TARGET_DIR/.cursorrules" ".cursorrules"
copy_item "$SOURCE_DIR/.windsurfrules" "$TARGET_DIR/.windsurfrules" ".windsurfrules"
copy_item "$SOURCE_DIR/.github/copilot-instructions.md" "$TARGET_DIR/.github/copilot-instructions.md" ".github/copilot-instructions.md"

# ── Smart Update Mode: delegate to Python engine if --update was passed ──────
if [ "$UPDATE_MODE" = true ]; then
  if command -v python3 >/dev/null 2>&1 && [ -f "$TARGET_DIR/.agents/scripts/update-engine.py" ]; then
    echo -e "\n🔄 ${BOLD}Chạy Smart Update Engine (3-Way Hash)...${NC}"
    python3 "$TARGET_DIR/.agents/scripts/update-engine.py" --apply --target "$TARGET_DIR"
    exit $?
  elif command -v python3 >/dev/null 2>&1; then
    # Engine not present yet — copy it first then run
    mkdir -p "$TARGET_DIR/.agents/scripts"
    cp "$SOURCE_DIR/.agents/scripts/update-engine.py" "$TARGET_DIR/.agents/scripts/update-engine.py"
    echo -e "\n🔄 ${BOLD}Chạy Smart Update Engine (3-Way Hash)...${NC}"
    python3 "$TARGET_DIR/.agents/scripts/update-engine.py" --apply --target "$TARGET_DIR"
    exit $?
  else
    echo -e "${YELLOW}⚠️ Python 3 không có sẵn. Tiến hành cài đặt bình thường (không có 3-way hash).${NC}"
  fi
fi

# ==============================================================================
# BƯỘC 3.4 — XÁC MINH HỢP ĐỒNG AGENT (Layer A + Layer B)
# ==============================================================================
# validate-agents.py kiểm hai lớp lỗi làm hỏng việc phân phối subagent mà runtime
# không phát hiện được cho tới khi phiên chạy thất bại:
#   Layer B: model ID hardcode khiến harness loại agent khỏi registry
#   Layer A: ví dụ gọi agent dạng pseudo-JSON single-quote trong prompt/skill
# Bước này chỉ xác minh sau khi copy — không abort, vì cài đặt đã hoàn tất.
VALIDATE_SCRIPT="$TARGET_DIR/.agents/scripts/validate-agents.py"
if command -v python3 >/dev/null 2>&1 && [ -f "$VALIDATE_SCRIPT" ]; then
  echo ""
  echo -e "${YELLOW}🔎 Đang xác minh hợp đồng agent/tool-call...${NC}"
  if VALIDATE_OUT="$(python3 "$VALIDATE_SCRIPT" --root "$TARGET_DIR" 2>&1)"; then
    echo -e "  ${GREEN}✅ $(echo "$VALIDATE_OUT" | tail -1)${NC}"
  else
    echo -e "  ${RED}⚠️ Phát hiện vi phạm hợp đồng — subagent có thể không gọi được:${NC}"
    echo "$VALIDATE_OUT" | sed 's/^/     /'
    echo -e "  ${DIM}   Xem docs/architecture/MODEL_AND_TOOLCALL_CONTRACT.md để biết cách sửa.${NC}"
  fi
fi

# ==============================================================================
# BƯỘC 3.5 — ĐĂNG KÝ WORKFLOW HOOKS CHO HARNESS HIỆN TẠI
# ==============================================================================
# .agents/hooks.json là nguồn duy nhất, viết theo dialect của Antigravity.
# Với Claude Code, sinh .claude/settings.json từ nguồn đó (tên event và tool
# matcher đã được dịch). Script idempotent và không ghiè đấp hook người dùng
# tự thêm.
HOOK_SCRIPT="$TARGET_DIR/.agents/scripts/install-hooks.js"
if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo -e "  ${YELLOW}⚠️ Không tìm thấy 'node' — bỏ qua đăng ký hooks.${NC}"
  echo -e "  ${DIM}   Cài Node.js rồi chạy: node .agents/scripts/install-hooks.js --target .${NC}"
elif [ -f "$HOOK_SCRIPT" ]; then
  echo ""
  echo -e "${YELLOW}🪝 Đang đăng ký workflow hooks cho harness hiện tại...${NC}"
  if node "$HOOK_SCRIPT" --target "$TARGET_DIR" --harness auto; then
    echo -e "  ${GREEN}✅ Đã đồng bộ hooks (Antigravity: .agents/hooks.json │ Claude Code: .claude/settings.json).${NC}"
  else
    echo -e "  ${DIM}⏭️ Không sinh được settings hooks — bỏ qua, không ảnh hưởng cài đặt.${NC}"
  fi
fi

# Record workflow source repository metadata (with full protectedPaths)
INSTALL_DATE="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
cat > "$TARGET_DIR/.agents/workflow-source.json" << EOF
{
  "sourceRepo": "https://github.com/ahauy/universal-agents-workflow.git",
  "sourcePath": "$SOURCE_DIR",
  "version": "1.1.0",
  "gitMode": "$MODE",
  "installedAt": "$INSTALL_DATE",
  "lastCheckedAt": "$INSTALL_DATE",
  "protectedPaths": [
    "CONTEXT.md",
    "PRODUCT_BACKLOG_ROADMAP.md",
    "CHANGELOG.md",
    "UPGRADE_NOTICE.md",
    "adr/",
    "!adr/adr-template.md",
    "docs/features/",
    "docs/user-guides/",
    "docs/architecture/",
    "docs/RUN_AND_TEST.md",
    ".specify/features/",
    "src/",
    ".env",
    ".env.*",
    "*.local",
    "*.local.md"
  ],
  "manifest": {}
}
EOF

# Ensure catalog.json exists inside .agents/
if [ -f "$SOURCE_DIR/optional-stack-skills/catalog.json" ] && [ ! -f "$TARGET_DIR/.agents/catalog.json" ]; then
  cp "$SOURCE_DIR/optional-stack-skills/catalog.json" "$TARGET_DIR/.agents/catalog.json"
fi

# ------------------------------------------------------------------------------
# 5. Smart Stack Scan & Selective Skill Injection (Registry-Driven Engine)
# ------------------------------------------------------------------------------
echo -e "\n🔍 ${BOLD}Đang quét Tech Stack của dự án đích (Registry-Driven)...${NC}"

CATALOG_PATH="$SOURCE_DIR/optional-stack-skills/catalog.json"
MATCHED_ENTRIES=""

if command -v python3 >/dev/null 2>&1 && [ -f "$CATALOG_PATH" ]; then
  MATCHED_ENTRIES=$(python3 -c '
import json, os, sys, fnmatch

target = sys.argv[1]
catalog_file = sys.argv[2]

try:
    with open(catalog_file) as f:
        data = json.load(f)
except Exception:
    sys.exit(0)

for item in data.get("items", []):
    if item.get("target_type") == "mcp":
        continue
    markers = item.get("detection_markers", [])
    is_matched = False
    for m in markers:
        if ":" in m:
            parts = m.split(":", 1)
            filepath = os.path.join(target, parts[0])
            keyword = parts[1].strip().strip("\"").strip("\x27")
            if os.path.isfile(filepath):
                try:
                    with open(filepath, "r", errors="ignore") as pf:
                        if keyword in pf.read():
                            is_matched = True
                            break
                except Exception:
                    pass
        elif "*" in m:
            for root, dirs, files in os.walk(target):
                dirs[:] = [d for d in dirs if d not in [".git", ".agents", "node_modules", "DerivedData", ".build"]]
                if any(fnmatch.fnmatch(fn, m) for fn in files + dirs):
                    is_matched = True
                    break
            if is_matched:
                break
        else:
            if os.path.exists(os.path.join(target, m)):
                is_matched = True
                break
    if is_matched:
        src = item.get("source_path", "").strip()
        tgt = item.get("target_path", "").strip()
        name = item.get("name", item.get("id", "")).strip()
        mid = item.get("id", "").strip()
        if src and tgt:
            print(src)
            print(tgt)
            print(name)
            print(mid)
' "$TARGET_DIR" "$CATALOG_PATH" 2>/dev/null)
fi

if [ -n "$MATCHED_ENTRIES" ]; then
  echo -e "  🎯 ${GREEN}Phát hiện các thành phần tech stack phù hợp trong catalog.json:${NC}"
  while read -r src && read -r tgt && read -r name && read -r mid; do
    [ -z "$name" ] && continue
    echo -e "     - ${CYAN}${name}${NC} (${mid}) ➔ ${tgt}"
  done <<< "$MATCHED_ENTRIES"
  
  DO_INJECT=true
  if [ "$NON_INTERACTIVE" != true ]; then
    INJECT_CHOICE=""
    prompt_read "👉 Bạn có muốn tự động nạp các thành phần trên vào dự án? [Y/n]: " INJECT_CHOICE
    case "${INJECT_CHOICE:-y}" in
      n|N) DO_INJECT=false ;;
      *) DO_INJECT=true ;;
    esac
  fi

  if [ "$DO_INJECT" = true ]; then
    while read -r src && read -r tgt && read -r name && read -r mid; do
      [ -z "$src" ] || [ -z "$tgt" ] && continue
      copy_item "$SOURCE_DIR/$src" "$TARGET_DIR/$tgt" "$name"
    done <<< "$MATCHED_ENTRIES"
  fi
else
  echo -e "  ℹ️  ${CYAN}Không phát hiện tech stack đặc thù trong danh mục catalog.json.${NC}"
  echo -e "  ✨ ${GREEN}Giữ dự án 100% sạch sẽ: Không sao chép các kỹ năng thừa!${NC}"
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
echo -e "\n${BOLD}${GREEN}🎉 Cài đặt hoàn tất thành công!${NC}"
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "👉 ${BOLD}Bước tiếp theo:${NC}"
echo -e "  1. Mở dự án đích trong AI Editor (Antigravity IDE, Cursor, Windsurf, Claude Code)."
echo -e "  2. Gõ vào ô chat của Agent:"
echo -e "     ${CYAN}/skill-setup${NC} (hoặc ${CYAN}setup dự án${NC})"
echo -e "     để quét Tech Stack tự động và kích hoạt các kỹ năng chuyên biệt."
echo -e "  3. Để cập nhật framework sau này: gõ ${CYAN}/update${NC} trong chat."
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
