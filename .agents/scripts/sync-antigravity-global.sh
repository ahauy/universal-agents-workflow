#!/usr/bin/env bash
# ==============================================================================
# Universal Agents Workflow — Antigravity Global Customizations Sync
# ==============================================================================
# Syncs UI/UX, Design, Frontend, Question Analysis/Clarification skills,
# and Common Rules from this repository into the Antigravity Global Customizations
# Root (~/.gemini/config) and ~/.agents/skills.
#
# Usage:
#   ./.agents/scripts/sync-antigravity-global.sh [--symlink | --copy]
# ==============================================================================

set -euo pipefail

# Visual colors
BOLD="\033[1m"
GREEN="\033[0;32m"
BLUE="\033[0;34m"
CYAN="\033[0;36m"
YELLOW="\033[0;33m"
NC="\033[0m" # No Color

# Determine repo root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

MODE="symlink"
if [[ $# -gt 0 ]]; then
  case "$1" in
    --copy)
      MODE="copy"
      ;;
    --symlink)
      MODE="symlink"
      ;;
    *)
      echo "Unknown option: $1 (supported: --symlink, --copy)"
      exit 1
      ;;
  esac
fi

# Antigravity Global Customization Targets
GEMINI_CONFIG_DIR="$HOME/.gemini/config"
GLOBAL_SKILLS_DIR="$GEMINI_CONFIG_DIR/skills"
GLOBAL_RULES_DIR="$GEMINI_CONFIG_DIR/rules"
GLOBAL_RULES_COMMON_DIR="$GLOBAL_RULES_DIR/common"
AGENTS_GLOBAL_SKILLS_DIR="$HOME/.agents/skills"

mkdir -p "$GLOBAL_SKILLS_DIR"
mkdir -p "$GLOBAL_RULES_COMMON_DIR"
mkdir -p "$AGENTS_GLOBAL_SKILLS_DIR"

echo -e "${BOLD}${BLUE}╔═══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║       🌐 Antigravity CLI & Global Customizations Sync                     ║${NC}"
echo -e "${BOLD}${BLUE}╚═══════════════════════════════════════════════════════════════════════════╝${NC}"
echo -e "⚙️  Chế độ đồng bộ: ${BOLD}${GREEN}${MODE}${NC}"
echo -e "📁 Kho mã nguồn gốc: ${CYAN}${REPO_ROOT}${NC}"
echo -e "🎯 Thư mục cấu hình Antigravity: ${CYAN}${GEMINI_CONFIG_DIR}${NC}\n"

# ------------------------------------------------------------------------------
# 1. Skills to Sync
# ------------------------------------------------------------------------------

# Category 1: UI/UX, Design, Frontend
UI_DESIGN_SKILLS=(
  "engineering/design-taste-frontend"
  "engineering/design-taste-product"
  "engineering/frontend-design"
  "engineering/frontend-a11y"
  "engineering/motion-design"
  "engineering/ui-design-review"
  "engineering/ui-taste-pro"
  "engineering/prototype"
  "engineering/archify"
  "engineering/user-guide-with-screenshots"
)

# Category 2: Question Analysis, Requirements Clarification & Grilling
ANALYSIS_SKILLS=(
  "productivity/grilling"
  "engineering/elicitation-interview"
  "engineering/intake-classifier"
  "productivity/wait-what"
  "engineering/speckit-clarify"
  "productivity/to-questionnaire"
  "engineering/risk-contradiction-scanner"
)

install_skill() {
  local rel_path="$1"
  local skill_name
  skill_name="$(basename "$rel_path")"
  local src_dir="$REPO_ROOT/.agents/skills/$rel_path"

  if [ ! -d "$src_dir" ]; then
    echo -e "  ⚠️  ${YELLOW}Không tìm thấy skill nguồn: $src_dir${NC}"
    return 1
  fi

  # 1. Sync to ~/.gemini/config/skills/
  local dest_dir="$GLOBAL_SKILLS_DIR/$skill_name"
  if [ "$MODE" = "symlink" ]; then
    rm -rf "$dest_dir"
    ln -sfn "$src_dir" "$dest_dir"
  else
    rm -rf "$dest_dir"
    cp -R "$src_dir" "$dest_dir"
  fi

  # 2. Also sync to ~/.agents/skills/ for cross-agent compatibility
  local agents_dest="$AGENTS_GLOBAL_SKILLS_DIR/$skill_name"
  if [ "$MODE" = "symlink" ]; then
    rm -rf "$agents_dest"
    ln -sfn "$src_dir" "$agents_dest"
  else
    rm -rf "$agents_dest"
    cp -R "$src_dir" "$agents_dest"
  fi

  echo -e "  ✅ [Skill] ${CYAN}${skill_name}${NC} ➔ ${GREEN}~/.gemini/config/skills/${skill_name}${NC}"
}

echo -e "${BOLD}1. Đồng bộ Skills UI/UX, Design & Frontend:${NC}"
for s in "${UI_DESIGN_SKILLS[@]}"; do
  install_skill "$s"
done

echo -e "\n${BOLD}2. Đồng bộ Skills Phân tích câu hỏi & Làm rõ yêu cầu:${NC}"
for s in "${ANALYSIS_SKILLS[@]}"; do
  install_skill "$s"
done

# ------------------------------------------------------------------------------
# 2. Rules Common to Sync
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}3. Đồng bộ Quy tắc chung (rules/common):${NC}"
SRC_RULES_COMMON="$REPO_ROOT/.agents/rules/common"

if [ -d "$SRC_RULES_COMMON" ]; then
  for rule_file in "$SRC_RULES_COMMON"/*.md; do
    if [ -f "$rule_file" ]; then
      rule_basename="$(basename "$rule_file")"
      dest_common_file="$GLOBAL_RULES_COMMON_DIR/$rule_basename"
      dest_flat_file="$GLOBAL_RULES_DIR/$rule_basename"

      if [ "$MODE" = "symlink" ]; then
        rm -f "$dest_common_file"
        ln -sfn "$rule_file" "$dest_common_file"

        # Also provide top-level rule symlink for flat-scanner compatibility
        rm -f "$dest_flat_file"
        ln -sfn "$rule_file" "$dest_flat_file"
      else
        rm -f "$dest_common_file"
        cp "$rule_file" "$dest_common_file"

        rm -f "$dest_flat_file"
        cp "$rule_file" "$dest_flat_file"
      fi

      echo -e "  ✅ [Rule]  ${CYAN}${rule_basename}${NC} ➔ ${GREEN}~/.gemini/config/rules/${rule_basename}${NC}"
    fi
  done
else
  echo -e "  ⚠️  ${YELLOW}Không tìm thấy thư mục: $SRC_RULES_COMMON${NC}"
fi

echo -e "\n${BOLD}${GREEN}🎉 Hoàn tất đồng bộ toàn bộ Skills & Rules vào Antigravity CLI!${NC}"
