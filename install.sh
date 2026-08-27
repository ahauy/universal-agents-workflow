#!/usr/bin/env bash
# ==============================================================================
# Universal Agents Workflow - Project Installer & Git Mode Integrator
# ==============================================================================
# Usage:
#   ./install.sh [TARGET_DIR]
#   ./install.sh --target=/path/to/project --mode=local -y
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

# Determine script source directory
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

TARGET_DIR=""
MODE=""
NON_INTERACTIVE=false

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
    -y|--yes)
      NON_INTERACTIVE=true
      shift
      ;;
    -h|--help)
      cat << 'EOF'
Universal Agents Workflow - Installer

Usage:
  ./install.sh [TARGET_DIR] [OPTIONS]

Options:
  --target <path>       Target project directory to install into
  --mode <mode>         Git management mode:
                          team    : Track all files in Git (Share with team)
                          local   : Add all workflow files to target .gitignore
                          stealth : Add all workflow files to target .git/info/exclude
                          hybrid  : Track Specs/ADRs/CONTEXT, ignore .agents & AI rules
  -y, --yes             Non-interactive mode (use defaults or provided arguments)
  -h, --help            Show this help message

Examples:
  ./install.sh ../my-existing-project
  ./install.sh --target=../my-project --mode=local -y
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

echo -e "${BOLD}${BLUE}╔═══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║       🌐 Universal Agents Workflow — Project Integrator                   ║${NC}"
echo -e "${BOLD}${BLUE}╚═══════════════════════════════════════════════════════════════════════════╝${NC}"

# ------------------------------------------------------------------------------
# 2. Resolve Target Directory
# ------------------------------------------------------------------------------
if [ -z "$TARGET_DIR" ]; then
  if [ "$NON_INTERACTIVE" = true ]; then
    echo -e "${RED}❌ Error: --target is required in non-interactive mode.${NC}"
    exit 1
  fi
  echo -e "\n${BOLD}Vui lòng nhập đường dẫn thư mục dự án cần tích hợp:${NC}"
  read -r -p "👉 Đường dẫn dự án (nhấn Enter để dùng thư mục hiện tại): " USER_INPUT_DIR
  if [ -z "$USER_INPUT_DIR" ]; then
    TARGET_DIR="$(pwd)"
  else
    TARGET_DIR="$USER_INPUT_DIR"
  fi
fi

# Convert to absolute path
TARGET_DIR="$(cd "$TARGET_DIR" 2>/dev/null && pwd || echo "$TARGET_DIR")"

if [ ! -d "$TARGET_DIR" ]; then
  echo -e "${RED}❌ Thư mục dự án không tồn tại: ${TARGET_DIR}${NC}"
  exit 1
fi

if [ "$TARGET_DIR" = "$SOURCE_DIR" ]; then
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
    MODE="team" # Default for non-interactive if unspecified
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
    echo -e "     - Giấu toàn bộ bộ máy AI (${CYAN}.agents/${NC}, ${CYAN}optional-stack-skills/${NC}, AI rules)."
    echo -e ""
    
    while true; do
      read -r -p "👉 Lựa chọn của bạn [1/2/3/4] (mặc định: 2): " CHOICE
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

copy_item() {
  local src="$1"
  local dest="$2"
  local name="$3"
  
  if [ -e "$src" ]; then
    if [ -d "$src" ]; then
      mkdir -p "$dest"
      cp -R "$src/"* "$dest/" 2>/dev/null || true
      # Also copy hidden files if any
      cp -R "$src/".[!.]* "$dest/" 2>/dev/null || true
    else
      cp -p "$src" "$dest"
    fi
    echo -e "  ✅ Đã tích hợp: ${CYAN}${name}${NC}"
  else
    echo -e "  ⚠️ Không tìm thấy nguồn: ${name}"
  fi
}

copy_item "$SOURCE_DIR/.agents" "$TARGET_DIR/.agents" ".agents/"
copy_item "$SOURCE_DIR/.specify" "$TARGET_DIR/.specify" ".specify/"
copy_item "$SOURCE_DIR/adr" "$TARGET_DIR/adr" "adr/"
copy_item "$SOURCE_DIR/CONTEXT.md" "$TARGET_DIR/CONTEXT.md" "CONTEXT.md"
copy_item "$SOURCE_DIR/GEMINI.md" "$TARGET_DIR/GEMINI.md" "GEMINI.md"

# Record workflow source repository metadata
cat > "$TARGET_DIR/.agents/workflow-source.json" << EOF
{
  "sourcePath": "$SOURCE_DIR",
  "version": "1.0.0",
  "installedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

# Ensure catalog.json exists inside .agents/
if [ -f "$SOURCE_DIR/optional-stack-skills/catalog.json" ] && [ ! -f "$TARGET_DIR/.agents/catalog.json" ]; then
  cp "$SOURCE_DIR/optional-stack-skills/catalog.json" "$TARGET_DIR/.agents/catalog.json"
fi

# ------------------------------------------------------------------------------
# 5. Smart Stack Scan & Selective Skill Injection (Zero Unused Files)
# ------------------------------------------------------------------------------
echo -e "\n🔍 ${BOLD}Đang quét Tech Stack của dự án đích...${NC}"

MATCHED_SKILLS=()

# Fast checks for detection markers
if [ -f "$TARGET_DIR/go.mod" ] || [ -f "$TARGET_DIR/main.go" ]; then
  MATCHED_SKILLS+=("go-patterns" "go-rules" "go-depguard")
fi

if [ -f "$TARGET_DIR/pyproject.toml" ] || [ -f "$TARGET_DIR/requirements.txt" ] || [ -f "$TARGET_DIR/poetry.lock" ]; then
  MATCHED_SKILLS+=("python-patterns" "python-importlinter")
fi

if [ -f "$TARGET_DIR/Cargo.toml" ]; then
  MATCHED_SKILLS+=("rust-patterns")
fi

if [ -f "$TARGET_DIR/package.json" ]; then
  MATCHED_SKILLS+=("typescript-patterns")
  if grep -q "@nestjs" "$TARGET_DIR/package.json" 2>/dev/null || [ -f "$TARGET_DIR/nest-cli.json" ]; then
    MATCHED_SKILLS+=("nestjs-patterns")
  fi
  if grep -q "react" "$TARGET_DIR/package.json" 2>/dev/null || [ -f "$TARGET_DIR/next.config.js" ] || [ -f "$TARGET_DIR/next.config.mjs" ] || [ -f "$TARGET_DIR/next.config.ts" ]; then
    MATCHED_SKILLS+=("react-rules" "frontend-patterns")
  fi
fi

if [ -f "$TARGET_DIR/prisma/schema.prisma" ]; then
  MATCHED_SKILLS+=("prisma-patterns")
fi

if [ -f "$TARGET_DIR/Dockerfile" ] || [ -f "$TARGET_DIR/docker-compose.yml" ] || [ -f "$TARGET_DIR/compose.yaml" ]; then
  MATCHED_SKILLS+=("docker-patterns")
fi

if [ ${#MATCHED_SKILLS[@]} -gt 0 ]; then
  echo -e "  🎯 ${GREEN}Phát hiện các kỹ năng stack phù hợp:${NC} ${MATCHED_SKILLS[*]}"
  
  DO_INJECT=true
  if [ "$NON_INTERACTIVE" != true ]; then
    read -r -p "👉 Bạn có muốn tự động nạp các kỹ năng trên vào .agents/skills/? [Y/n]: " INJECT_CHOICE
    case "${INJECT_CHOICE:-y}" in
      n|N) DO_INJECT=false ;;
      *) DO_INJECT=true ;;
    esac
  fi

  if [ "$DO_INJECT" = true ]; then
    for skill in "${MATCHED_SKILLS[@]}"; do
      case "$skill" in
        go-patterns)
          copy_item "$SOURCE_DIR/optional-stack-skills/languages/go/go-patterns" "$TARGET_DIR/.agents/skills/engineering/go-patterns" "go-patterns"
          ;;
        go-rules)
          copy_item "$SOURCE_DIR/optional-stack-skills/languages/go/rules/coding-style.md" "$TARGET_DIR/.agents/rules/go-coding-style.md" "go-rules"
          ;;
        go-depguard)
          copy_item "$SOURCE_DIR/optional-stack-skills/languages/go/depguard.yaml" "$TARGET_DIR/depguard.yaml" "depguard.yaml"
          ;;
        python-patterns)
          copy_item "$SOURCE_DIR/optional-stack-skills/languages/python/python-patterns" "$TARGET_DIR/.agents/skills/engineering/python-patterns" "python-patterns"
          ;;
        python-importlinter)
          copy_item "$SOURCE_DIR/optional-stack-skills/languages/python/.importlinter.ini" "$TARGET_DIR/.importlinter.ini" ".importlinter.ini"
          ;;
        rust-patterns)
          copy_item "$SOURCE_DIR/optional-stack-skills/languages/rust/rust-patterns" "$TARGET_DIR/.agents/skills/engineering/rust-patterns" "rust-patterns"
          ;;
        typescript-patterns)
          copy_item "$SOURCE_DIR/optional-stack-skills/languages/typescript/typescript-patterns" "$TARGET_DIR/.agents/skills/engineering/typescript-patterns" "typescript-patterns"
          ;;
        nestjs-patterns)
          copy_item "$SOURCE_DIR/optional-stack-skills/frameworks/nestjs-patterns" "$TARGET_DIR/.agents/skills/engineering/nestjs-patterns" "nestjs-patterns"
          ;;
        frontend-patterns)
          copy_item "$SOURCE_DIR/optional-stack-skills/frameworks/frontend-patterns" "$TARGET_DIR/.agents/skills/engineering/frontend-patterns" "frontend-patterns"
          ;;
        prisma-patterns)
          copy_item "$SOURCE_DIR/optional-stack-skills/frameworks/prisma-patterns" "$TARGET_DIR/.agents/skills/engineering/prisma-patterns" "prisma-patterns"
          ;;
        docker-patterns)
          copy_item "$SOURCE_DIR/.agents/skills/engineering/docker-patterns" "$TARGET_DIR/.agents/skills/engineering/docker-patterns" "docker-patterns"
          ;;
      esac
    done
  fi
else
  echo -e "  ℹ️  ${CYAN}Không phát hiện tech stack đặc thù trong danh mục ECC (ví dụ: dự án Swift, C/C++, Kotlin).${NC}"
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
.windsurfrules"

IGNORE_HYBRID_BLOCK="# --- Universal Agents Workflow (Hybrid Mode: Private Engine) ---
.agents/
GEMINI.md
CLAUDE.md
AGENTS.md
.cursorrules
.windsurfrules"

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
# 6. Final Summary & Next Steps
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${GREEN}🎉 Cài đặt hoàn tất thành công!${NC}"
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "👉 ${BOLD}Bước tiếp theo:${NC}"
echo -e "  1. Mở dự án đích trong AI Editor (Antigravity IDE, Cursor, Windsurf, Claude Code)."
echo -e "  2. Gõ vào ô chat của Agent:"
echo -e "     ${CYAN}/skill-setup${NC} (hoặc ${CYAN}setup dự án${NC})"
echo -e "     để quét Tech Stack tự động và kích hoạt các kỹ năng chuyên biệt."
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
