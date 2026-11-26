# Baseline: project-local final cleanup

**Status:** SIGNED-OFF v1.0 — explicit owner implementation directive, 2026-11-26.

The owner approved the concrete final-audit corrections and group A removal,
approved group B removal because only project-local installation is used, and
explicitly requested removing Archify and related active components. Quote:
“Mình duyệt sửa các điểm còn lệch và xóa nhóm A. Nhóm B cũng xóa vì mình chỉ dùng
cài đặt theo dự án và xóa cả các phần liên quan tới Archify.”

Scope supersedes the prior requirement to retain Archify for ACTIVE distribution;
prior signed baseline/ADR/history remains immutable evidence, not active guidance.
Remove source bundled/optional Archify, catalog entry, prompts/docs/routes/tests
that require it; diagrams use Mermaid. Remove global sync script and only approved
local cache, duplicate metrics active state and old handoff. Do not uninstall
anything from home/global directories or purge old customer installations.

Correct pack onboarding to use safe registered mappings/cold tier, separate Fast
verification from Full artifacts, repair real broken links and generic guide
assumptions, stop screenshot success after failed actions. Preserve custom data
through repeated update/reinstall and all prior safety guarantees. No Git writes,
remote customer updates, new runtime/dependency or unrelated feature changes.
