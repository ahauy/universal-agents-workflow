# Optional Stack & Language Skills

This directory contains modular, specialized skills and configuration templates organized by **language** and **framework**. They are kept separate from `.agents/skills/` to prevent context bloat and ensure that `Universal-Agents-Workflow` remains lean, polyglot, and fast.

---

## Directory Structure

```
optional-stack-skills/
├── catalog.json               # Centralized skill catalog with detection markers & descriptions
├── languages/                 # Language-specific patterns & architectural boundaries
│   ├── python/
│   │   ├── python-patterns/   # Deep modules, Pydantic, Ruff/Mypy, Pytest
│   │   ├── rules/             # Python coding style & rules
│   │   └── .importlinter.ini  # Seam enforcement config template
│   ├── go/
│   │   ├── go-patterns/       # internal/ package boundaries, interfaces, error wrapping
│   │   ├── rules/             # Go coding style & rules
│   │   └── depguard.yaml      # Golangci-lint boundary checker template
│   ├── rust/
│   │   ├── rust-patterns/     # Cargo workspaces, pub(crate), thiserror/anyhow
│   │   └── cargo-deny.toml    # Crate dependency verification template
│   └── typescript/
│       ├── rules/             # TypeScript clean architecture & boundary rules
│       └── dependency-cruiser.config.cjs # Deep module boundary checker template
└── frameworks/                # Framework & domain-specific skills
    ├── frontend-patterns/     # Modern component patterns
    ├── liquid-glass-design/   # Rich visual aesthetics & tokens
    ├── nestjs-patterns/       # NestJS enterprise architecture
    ├── prisma-patterns/       # Prisma ORM schema & migration conventions
    └── react-rules/           # React & Next.js best practices

```

---

## Curated Skills & Tools Catalog

Tất cả kỹ năng đều được định nghĩa chi tiết trong [catalog.json](./catalog.json):

| Kỹ năng / Công cụ           | Phân loại    | Khuyến nghị    | Mô tả ngắn gọn (Concise Summary)                                                                                                                                   |
| :-------------------------- | :----------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`go-patterns`**           | Language     | Recommended    | Chuẩn hóa boundary `internal/`, interface tối giản phía consumer, structured error wrapping, và chống anemic domain.                                               |
| **`go-rules`**              | Language     | Recommended    | Quy chuẩn coding style Go: đặt tên, an toàn concurrency, table-driven unit test, và defer cleanup.                                                                 |
| **`go-depguard`**           | Boundary     | Recommended    | File cấu hình Golangci-lint kiểm soát ranh giới gói, ngăn chặn import trái phép giữa các tầng kiến trúc.                                                           |
| **`python-patterns`**       | Language     | Recommended    | Tiêu chuẩn Python hiện đại: Pydantic v2 schemas, strict Mypy, Ruff linter và kiến trúc fixture Pytest đa tầng.                                                     |
| **`python-importlinter`**   | Boundary     | Recommended    | Ràng buộc phân lớp nghiêm ngặt (Domain -> Services -> Adapters) bằng hợp đồng import-linter.                                                                       |
| **`rust-patterns`**         | Language     | Recommended    | Kiến trúc Rust workspace: đóng gói `pub(crate)`, cây lỗi định kiểu với thiserror/anyhow, trừu tượng hóa bằng trait.                                                |
| **`typescript-patterns`**   | Language     | Recommended    | Kiến trúc TypeScript sạch: index.ts rõ ràng, branded types, schema validation Zod, loại bỏ phụ thuộc vòng lặp.                                                     |
| **`ts-dependency-cruiser`** | Boundary     | Recommended    | Tự động chặn mã UI rò rỉ vào Domain entity và phát hiện circular dependencies cho TypeScript/JavaScript.                                                           |
| **`react-rules`**           | Framework    | Recommended    | Chuẩn mực React & Next.js: hook purity, Server/Client component separation, kiểm soát re-render và chuẩn a11y.                                                     |
| **`nestjs-patterns`**       | Framework    | Recommended    | Mô hình NestJS doanh nghiệp: module DI, CQRS event sourcing, class-validator DTOs, và phân tách controller/service.                                                |
| **`prisma-patterns`**       | Database     | Recommended    | Tiến hóa schema an toàn, quan hệ dữ liệu, kịch bản migration zero-downtime và xử lý transaction bền vững.                                                          |
| **`frontend-patterns`**     | Frontend     | Recommended    | Kiến trúc UI hiện đại: compound components, headless state machines, CSS custom properties và keyboard navigation.                                                 |
| **`liquid-glass-design`**   | Design       | Optional       | Bộ token thiết kế giao diện cao cấp: chiều sâu kính mờ, viền hairline 1px, obsidian pills và tương phản WCAG AA.                                                   |
| **`postgres-patterns`**     | Database     | Recommended    | Tối ưu cơ sở dữ liệu: chiến lược composite index, truy vấn JSONB hiệu năng cao, optimistic locking và connection pool.                                             |
| **`docker-patterns`**       | DevOps       | Recommended    | Tiêu chuẩn container production: distroless base image, non-root user, multi-stage caching và healthcheck.                                                         |
| **`code-review-graph`**     | Intelligence | Optional (MCP) | Dựng đồ thị Tree-sitter + SQLite cục bộ cho phép subagent (`code-explorer`, `code-reviewer`) tra cứu caller/callee và blast-radius với chi phí token giảm tới 26x. |

---

## How to Use

1. **Tự động nhận diện & thiết lập thông minh**: Chạy lệnh `/skill-setup` (hoặc `/setup-workspace`). Hệ thống sẽ tự động quét dự án, hiển thị bảng danh sách kỹ năng tương thích kèm mô tả ngắn gọn để bạn xác nhận.
2. **Kiểm tra ranh giới Deep Modules**: Chạy `/setup-deep-modules`. Nhận diện ngôn ngữ và cấu hình công cụ kiểm soát boundary tương ứng.
3. **Kích hoạt thủ công**: Sao chép thư mục kỹ năng mong muốn vào `.agents/skills/engineering/` hoặc `.agents/rules/` khi cần.
