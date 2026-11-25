# Dùng một template cho mọi coding agent

> Nguyên tắc: **một nguồn, nhiều spokes**. Nội dung luật chỉ tồn tại ở `AGENTS.md`
> và `.agents/`. Mọi file mà từng harness đọc chỉ là **con trỏ 3–6 dòng**.
>
> Vì sao không copy nội dung: bản sao sẽ lệch nhau, và model sẽ làm theo bản nó
> đọc sau cùng. Đây chính là lỗi lớn nhất từng có trong repo này (5 file cầu nối
> chép tay, mỗi file một phiên bản luật).

## Chạy

```bash
# Sinh adapter cho mọi harness vào project hiện tại
node .agents/scripts/sync-harnesses.mjs

# Chỉ một vài harness, xem trước, hoặc copy thay vì symlink
node .agents/scripts/sync-harnesses.mjs --harnesses claude,cursor
node .agents/scripts/sync-harnesses.mjs --dry-run
node .agents/scripts/sync-harnesses.mjs --mode copy

# Gỡ sạch những gì đã sinh (dựa trên manifest)
node .agents/scripts/sync-harnesses.mjs --clean
```

`install.sh` gọi bước này tự động sau khi copy `.agents/`.

## Harness nào đọc gì

| Harness | File nó thực sự quét | Script sinh ra | Mức hỗ trợ |
| --- | --- | --- | --- |
| **Antigravity** | `AGENTS.md` + `.agents/` (rules, skills, agents, hooks) | không cần — native | **Đầy đủ** (gốc của framework) |
| **Claude Code** | `CLAUDE.md` (+ `@import`), `.claude/skills/`, `.claude/agents/`, `.claude/settings.json` | `CLAUDE.md`, fan-out skills, convert agents | **Đầy đủ** (hooks đã chuẩn hoá) |
| **WorkBuddy** | `AGENTS.md` (project guidance), `.workbuddy-ai/skills/`, `~/.workbuddy-ai/mcp.json` | fan-out skills + note | **Cao** (MCP tuỳ chọn) |
| **Cursor** | `.cursor/rules/*.mdc` (`alwaysApply`), `.cursorrules` (legacy), `AGENTS.md` | `.cursor/rules/00-uaw.mdc` + `.cursorrules` | **Cao** (không có hooks) |
| **Windsurf** | `.windsurf/rules/*.md` (`trigger`), `.windsurfrules` (legacy) | `.windsurf/rules/uaw.md` + `.windsurfrules` | **Cao** (không có hooks) |
| **GitHub Copilot** | `.github/copilot-instructions.md`, `.github/instructions/*.md` | `copilot-instructions.md` | **Trung bình** (không chạy skill, không hook) |
| **Gemini CLI** | `GEMINI.md` (root + `~/.gemini/`) | `GEMINI.md` | **Cao** |
| **Codex CLI / Aider / Cline / Roo** | `AGENTS.md` hoặc file riêng | thêm adapter vào `adapters` trong script | **Một phần** |

## Command surface (slash commands)

Một skill `invocation: user` **không tự thành** slash command. Harness chỉ hiện `/x`
khi thấy file trong thư mục command **của nó**. `sync-harnesses` sinh các wrapper
5 dòng trỏ về skill, nên vẫn chỉ có một nguồn.

| Harness | Thư mục | Định dạng | Placeholder | Alias |
| --- | --- | --- | --- | --- |
| Claude Code | `.claude/commands/` | `.md` | `$ARGUMENTS` | có |
| Cursor | `.cursor/commands/` | `.md` | — | có |
| Windsurf | `.windsurf/workflows/` | `.md` (workflow) | — | có |
| GitHub Copilot | `.github/prompts/` | `.prompt.md` | — | có |
| Gemini CLI | `.gemini/commands/` | `.toml` | `{{args}}` | có |
| **Antigravity** | skill dir (native) | `SKILL.md` | — | **không** |
| **WorkBuddy** | `.workbuddy-ai/skills/` | `SKILL.md` | — | **không** |

> **Antigravity đã bỏ `.agents/workflows/` từ 10/2026** và chuyển hẳn sang Agent
> Skills. Nghĩa là ở đó skill *chính là* command: `/command-git-push` chạy được,
> nhưng `/push` (alias) thì không. Nếu repo cũ còn `.agents/workflows/*.md`, gõ
> `/migrate-workflows` để chuyển.

Hiện có **7 command skill / 24 slash trigger**, sinh ra 24 file cho mỗi harness
hỗ trợ alias → 120 file. Đó là lý do các file này phải sinh tự động, không viết tay.

Nội dung một wrapper:

```markdown
---
description: <lấy từ frontmatter của skill>
---
Read `.agents/skills/engineering/command-git-push/SKILL.md` and follow it exactly.
User arguments: $ARGUMENTS
```

Không chép nội dung skill vào wrapper — chép là tạo nguồn thứ hai để lệch.

## Ba tầng khả chuyển

Chỉ tầng 1 là bắt buộc. Tầng 2–3 quyết định trải nghiệm, không quyết định tính đúng.

| Tầng | Nội dung | Cơ chế | Ghi chú |
| --- | --- | --- | --- |
| **1. Luật** | pipeline, gates, tier, standards | `AGENTS.md` + con trỏ | Chạy được ở **mọi** harness, kể cả harness chỉ đọc 1 file |
| **2. Skills** | 64 skill | fan-out symlink vào thư mục skill của harness | Claude Code, WorkBuddy, Antigravity đọc native; Cursor/Windsurf phải mở file tay |
| **3. Subagents & hooks** | 13 persona, 16 hook | convert frontmatter, chuẩn hoá payload | Chỉ Antigravity + Claude Code có hợp đồng hook tương đương |

## Điều gì suy giảm ở harness yếu

- **Không có hooks** (Cursor, Windsurf, Copilot): mất lớp ép luật bằng code — chặn
  `--no-verify`, chặn commit lên `main`, chặn secret. Luật vẫn còn trong
  `AGENTS.md` nhưng chỉ ở mức "model nên tuân theo". Bù lại bằng CI hoặc git hook
  native của repo.
- **Không có subagent** (Copilot, Cursor tuỳ phiên bản): pipeline chạy tuần tự
  trong một context. Vẫn đúng, chỉ tốn token hơn.
- **Không tự nạp skill**: model phải được bảo đọc một file cụ thể. Mở
  `.agents/SKILLS.md`, chọn một dòng, rồi đọc đúng `SKILL.md` đó. Con trỏ
  trong adapter đã ghi đường dẫn nên vẫn hoạt động.

## Thêm một harness mới

Mở `.agents/scripts/sync-harnesses.mjs`, thêm một entry vào object `adapters`:

```js
myTool() {
  writeGenerated("PATH_TOOL_READS", `${MARKER}\n# ...\nRead \`AGENTS.md\` ...`);
}
```

Rồi thêm tên vào `ALL`. Không cần sửa chỗ nào khác — đó là toàn bộ chi phí mở rộng.

## Bảo trì

- Sửa luật → sửa **`AGENTS.md`**, không sửa file adapter.
- Sửa xong chạy lại `sync-harnesses` (hoặc `install.sh`) để đồng bộ spokes.
- `.agents/harness-manifest.json` ghi những gì đã sinh; `--clean` dùng nó để gỡ.
- Script **không bao giờ** ghi đè file không có marker → file bạn tự viết được giữ nguyên.
