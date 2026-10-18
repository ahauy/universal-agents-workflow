# Code Review Standards

## Purpose

Code review ensures quality, security, and maintainability before code is merged. This rule defines when and how to conduct code reviews.

## When to Review

**MANDATORY review triggers:**

- After writing or modifying code
- Before any commit to shared branches
- When security-sensitive code is changed (auth, payments, user data)
- When architectural changes are made
- Before merging pull requests

**Pre-Review Requirements:**

Before requesting review, ensure:

- All automated checks (CI/CD) are passing
- Merge conflicts are resolved
- Branch is up to date with target branch

## Review Checklist

Before marking code complete:

- [ ] Code is readable and well-named
- [ ] Functions are focused (<50 lines)
- [ ] Files are cohesive (<800 lines)
- [ ] No deep nesting (>4 levels)
- [ ] Errors are handled explicitly
- [ ] No hardcoded secrets or credentials
- [ ] No console.log or debug statements
- [ ] Tests exist for new functionality
- [ ] Test coverage meets 80% minimum

## Security Review Triggers

**STOP and use security-reviewer agent when:**

- Authentication or authorization code
- User input handling
- Database queries
- File system operations
- External API calls
- Cryptographic operations
- Payment or financial code

## Review Severity Levels

| Level    | Meaning                                  | Action                             |
| -------- | ---------------------------------------- | ---------------------------------- |
| CRITICAL | Security vulnerability or data loss risk | **BLOCK** - Must fix before merge  |
| HIGH     | Bug or significant quality issue         | **WARN** - Should fix before merge |
| MEDIUM   | Maintainability concern                  | **INFO** - Consider fixing         |
| LOW      | Style or minor suggestion                | **NOTE** - Optional                |

## Agent Usage

Use these agents for code review:

| Agent                   | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| **code-reviewer**       | General code quality, patterns, best practices |
| **security-reviewer**   | Security vulnerabilities, OWASP Top 10         |
| **typescript-reviewer** | TypeScript/JavaScript specific issues          |
| **python-reviewer**     | Python specific issues                         |
| **go-reviewer**         | Go specific issues                             |
| **rust-reviewer**       | Rust specific issues                           |

## Review Workflow

```
1. Run git diff to understand changes (Full changeset in Round 1, incremental diff in Rounds 2-3)
2. Check security checklist first
3. Review code quality checklist
4. Run relevant tests
5. Verify coverage >= 80%
6. Use appropriate agent for detailed review (Cap at max 3 rounds)
```

## Review Termination & Iteration Protocol (4 Stopping Rules)

Review-fix loops must be tightly bounded to prevent infinite cycles, context drift, and nitpick fatigue:

1. **Rule 1: Maximum 3 Review Rounds (Stop Condition & Escalation)**:
   - Every review cycle is hard-capped at **3 rounds**:
     - `Round 1`: Initial adversarial review of the complete feature changeset.
     - `Round 2`: Verify fixes for Round 1 findings on the incremental diff.
     - `Round 3`: Final verification pass.
   - **Post-Round 3 Termination**:
     - If CRITICAL issues remain: **BLOCK** and escalate directly to the User / Tech Lead. Do NOT trigger Round 4 automatically.
     - If only HIGH / MEDIUM / LOW issues remain: Issue **CONDITIONAL APPROVE** or **WARNING**. Log residual issues as technical debt in `CHANGELOG.md` or backlog tickets and conclude review.

2. **Rule 2: Incremental Diff Only (Subsequent Rounds Scope Bounding)**:
   - `Round 1`: Full diff against base branch (`git diff <base>...HEAD`).
   - `Round 2 & 3`: **CHỈ review diff mới phát sinh** (`git diff HEAD~1` hoặc commit fix tương ứng).
   - Reviewer must verify only the targeted fix and its direct blast radius. Re-opening reviews on unmodified files or nitpicking already-approved lines is strictly forbidden.

3. **Rule 3: Group Bugs by Category & Pattern**:
   - Findings must be organized into structured categories rather than a flat, disorganized list:
     - 🛡️ `[SECURITY]` (Vulnerabilities, auth, sanitization, secrets)
     - 🎯 `[SPEC_FIDELITY]` (Spec alignment, BR-### rules, state transitions, domain vocabulary)
     - ⚡ `[RELIABILITY]` (Type safety, unhandled async/errors, concurrency)
     - 🏗️ `[ARCHITECTURE]` (Module boundaries, leaky seams, immutability, complexity)
     - ✂️ `[LEAN]` (Anti-overengineering via The Ladder / ponytail tags)
   - When the same defect pattern repeats across multiple files or lines, group them into a single consolidated finding with a unified fix pattern.

4. **Rule 4: Bug Deduplication & State Tracking (No Re-Reporting Old Bugs)**:
   - Assign immutable IDs (`[SEC-001]`, `[SPEC-001]`, etc.) in Round 1.
   - In Rounds 2 & 3, report status via a concise tracking table:
     - `[RESOLVED]`: Fixed correctly — acknowledge with a single line, no repeated explanations.
     - `[STILL OPEN]`: Incomplete fix — retain ID and state what remains missing in 1 sentence; never duplicate or create a new ID.
     - `[NEW]`: Regression introduced by the fix itself.
     - `[ACCEPTED / DEFERRED]`: Explicitly accepted risks or deferred items — **NEVER re-report in subsequent rounds**.

## Common Issues to Catch

### Security

- Hardcoded credentials (API keys, passwords, tokens)
- SQL injection (string concatenation in queries)
- XSS vulnerabilities (unescaped user input)
- Path traversal (unsanitized file paths)
- CSRF protection missing
- Authentication bypasses

### Code Quality

- Large functions (>50 lines) - split into smaller
- Large files (>800 lines) - extract modules
- Deep nesting (>4 levels) - use early returns
- Missing error handling - handle explicitly
- Mutation patterns - prefer immutable operations
- Missing tests - add test coverage

### Performance

- N+1 queries - use JOINs or batching
- Missing pagination - add LIMIT to queries
- Unbounded queries - add constraints
- Missing caching - cache expensive operations

## Approval Criteria

- **Approve**: No CRITICAL or HIGH issues
- **Warning**: Only HIGH issues (merge with caution)
- **Block**: CRITICAL issues found

## Integration with Other Rules

This rule works with:

- [testing.md](testing.md) - Test coverage requirements
- [security.md](security.md) - Security checklist
- [git-workflow.md](git-workflow.md) - Commit standards
- [agents.md](agents.md) - Agent delegation
