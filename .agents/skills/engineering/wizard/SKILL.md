---
invocation: model
name: wizard
description: >
  MANDATORY when provisioning infrastructure, configuring environment secrets/keys,
  setting up third-party OAuth/API providers, running irreversible database migrations,
  or orchestrating human-in-the-loop cutovers. Generates an interactive, step-by-step
  bash wizard script to guide developers through manual procedures with URL opening,
  validation gates, and automated configuration.
metadata:
  origin: mattpocock/skills (adapted)
---

# Wizard

A **wizard** is an interactive bash script that guides a human step-by-step through a manual procedure that cannot (or should not) be automated end-to-end without human interaction. It opens relevant web dashboards, provides precise click-by-click instructions, captures values securely, writes variables directly to `.env` or GitHub Actions secrets (`gh secret`), prompts confirmation before destructive actions, and displays stage-by-stage progress.

The wizard UX engine is pre-built in [`template.sh`](./template.sh): terminal clearing per step, color-coded output, cross-platform browser opening (macOS, Linux, WSL, Windows), hidden secret entry, idempotent `.env` upserts, and GitHub CLI integration.

**Your primary role is to scope the procedure and author its stages.** The bash library above the `# STAGES` marker in `template.sh` is identical across every wizard; treat it as an immutable runtime library and never hand-edit code above the marker.

---

## When to Activate

- Onboarding a developer or setting up local environment variables (`.env`, `.env.local`)
- Configuring third-party OAuth applications (Google, GitHub, Auth0, Discord)
- Setting up external API keys and webhooks (Stripe, Resend, S3, OpenAI, Supabase)
- Provisioning repository secrets and variables in GitHub Actions (`gh secret set`, `gh variable set`)
- Executing one-off database migrations, schema cuts, or data backfills requiring human confirmation gates
- Executing infrastructure cutovers, domain DNS updates, or deployment promotions

---

## Core Principles

1. **Ephemeral by default**: Wizards are generated for immediate execution (e.g., in a scratch directory or `scripts/temp-wizard.sh`) and deleted after use. Only commit the wizard script to git when the user explicitly requests a permanent, repeatable onboarding/setup tool for the repository.
2. **Never edit above the STAGES marker**: Copy [`template.sh`](./template.sh) as the foundation and only author stages below the marker.
3. **Zero-leakage secret capture**: Always use `ask_secret` (masked terminal input) for API keys, passwords, JWT secrets, and tokens.
4. **Pre-flight URL dispatch**: Always open the required dashboard URL before asking the user for the value generated there.
5. **Idempotent execution**: Use `write_env` to safely update `.env` without duplicating keys or corrupting existing values.

---

## 4-Phase Authoring Process

```mermaid
flowchart LR
    A["1. Scope Procedure"] --> B["2. Map Stage Journey"]
    B --> C["3. Author Wizard"]
    C --> D["4. Verify & Handoff"]
```

### Phase 1: Scope the Procedure

Inspect the workspace thoroughly before asking the user for requirements:

- Analyze `.env.example`, `.env`, `.env.*` to identify all necessary configuration keys.
- Inspect `docker-compose.yml`, container configs, and database configurations (e.g., PostgreSQL ports, credentials).
- Scan `.github/workflows/*.yml` for `secrets.*` and `vars.*` references to detect CI requirements.
- Review recent migration files (e.g., Prisma schemas, migrations) or third-party service integrations.

Compile the proposed list of stages and present it to the user for confirmation:

- Stage name and goal
- Target destination (`.env`, GitHub Secrets, or database execution)
- Input sensitivity (public vs secret)

> **Done when:** An ordered list of stages is confirmed by the user, with all captured keys and destination targets mapped.

---

### Phase 2: Map Each Stage's Journey

For each stage, specify the exact user journey. Do not invent ambiguous or assumed UI paths:

- **Target URL**: The exact dashboard page (e.g., `https://console.cloud.google.com/apis/credentials`).
- **Navigation trail**: Click-by-click breadcrumbs (e.g., `APIs & Services > Credentials > Create Credentials > OAuth client ID`).
- **Required inputs & settings**: Names, allowed origins, redirect URIs (e.g., `http://localhost:3000/api/auth/callback/google`).
- **Output variables**: The exact variable name in the project (e.g., `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).

If a third-party UI path is uncertain, search current documentation or verify directly with the user before authoring.

> **Done when:** Every stage contains concrete, step-by-step instructions that any team member can execute without prior knowledge of the dashboard.

---

### Phase 3: Author the Wizard Script

Copy [`template.sh`](./template.sh) to the destination path (e.g., `scripts/setup-wizard.sh`) and configure the stages:

1. Update `TOTAL_STAGES` to match the exact number of `stage` blocks.
2. Set `banner "Wizard Title"` describing the operation.
3. Write one `stage` block per step using the standard library helpers:

| Helper                    | Purpose                                                                    | Example                                                               |
| ------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `stage "Name"`            | Clears screen and displays stage progress (`Stage X/Y`)                    | `stage "Google OAuth Setup"`                                          |
| `say "text"`              | Prints an explanatory instruction line                                     | `say "Configure OAuth consent screen and credentials."`               |
| `step "text"`             | Prints a bulleted action item for the user to execute                      | `step "Click 'Create Credentials' > 'OAuth client ID'"`               |
| `note "text"`             | Prints dimmed context or helper information                                | `note "Authorized redirect URI: http://localhost:3000/auth/callback"` |
| `warn "text"`             | Prints a highlighted yellow warning                                        | `warn "Do not share client secrets in public channels."`              |
| `open_url "url"`          | Opens URL in the default browser cross-platform                            | `open_url "https://console.cloud.google.com/apis/credentials"`        |
| `pause "msg"`             | Waits for the user to press Enter after completing manual action           | `pause "Press Enter after creating the client credentials"`           |
| `confirm "msg"`           | Displays a `[y/N]` confirmation gate; returns exit code 0 on yes           | `confirm "Proceed with database migration?"`                          |
| `ask KEY "prompt"`        | Prompts for plain text input; retains existing `.env` value on Enter       | `ask DATABASE_PORT "Enter PostgreSQL port (default: 5432):"`          |
| `ask_secret KEY "prompt"` | Prompts for masked secret input                                            | `ask_secret JWT_SECRET "Enter JWT secret key:"`                       |
| `write_env KEY "$VAL"`    | Upserts `KEY=VAL` into `.env` idempotently                                 | `write_env JWT_SECRET "$JWT_SECRET"`                                  |
| `set_secret KEY "$VAL"`   | Sets GitHub Actions secret via `gh secret set` (warns if `gh` not ready)   | `set_secret JWT_SECRET "$JWT_SECRET"`                                 |
| `set_var KEY "$VAL"`      | Sets GitHub Actions repo variable via `gh variable set`                    | `set_var API_BASE_URL "$API_BASE_URL"`                                |
| `finish`                  | Clears screen and outputs final summary of saved configs and skipped items | `finish`                                                              |

> **Done when:** The script contains all required stages in valid dependency order ending with `finish`.

---

### Phase 4: Verify and Hand Off

Execute static validation checks on the generated script:

```bash
# 1. Syntax check
bash -n scripts/setup-wizard.sh

# 2. Linter check (if shellcheck is installed)
if command -v shellcheck >/dev/null 2>&1; then
  shellcheck scripts/setup-wizard.sh
fi

# 3. Grant execute permissions
chmod +x scripts/setup-wizard.sh
```

**Static Trace Verification**:

- Verify that every variable captured via `ask` or `ask_secret` is written via `write_env` or `set_secret`.
- Check that all GitHub secret names match references in `.github/workflows/`.
- Ensure all destructive actions (e.g., dropping tables, running schema push) are guarded by `confirm`.

**Handoff to User**:
Instruct the user how to run the script:

```bash
./scripts/setup-wizard.sh
```

If the script was intended as an ephemeral run, remind the user to delete it once finished:

```bash
rm scripts/setup-wizard.sh
```

---

## Common Wizard Patterns

### 1. Local PostgreSQL + Environment Setup

```bash
TOTAL_STAGES=3
banner "Local Environment & PostgreSQL Setup"

stage "Database Container"
say "Checking Docker and PostgreSQL container state..."
if docker ps --format '{{.Names}}' | grep -q "postgres"; then
  say "PostgreSQL container is already running."
else
  step "Starting database container via docker-compose..."
  docker compose up -d postgres
fi
ask POSTGRES_PORT "PostgreSQL Port [5432]:"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
write_env DATABASE_URL "postgresql://postgres:postgres@localhost:${POSTGRES_PORT}/wordstreak_dev?schema=public"

stage "Application Secrets"
say "Generating local development security tokens."
ask_secret JWT_SECRET "Enter JWT secret (or press Enter to keep existing):"
if [[ -z "$JWT_SECRET" ]]; then
  JWT_SECRET=$(openssl rand -base64 32)
  say "Generated random 32-byte JWT secret."
fi
write_env JWT_SECRET "$JWT_SECRET"

stage "Database Schema Initialization"
say "Synchronizing database schema with Prisma."
if confirm "Run prisma db push to sync schema now?"; then
  pnpm --filter api prisma db push
fi

finish
```

### 2. OAuth Provider Configuration (Google & GitHub)

```bash
TOTAL_STAGES=2
banner "OAuth Provider Setup"

stage "Google OAuth Credentials"
say "Create OAuth 2.0 Client ID in Google Cloud Console."
open_url "https://console.cloud.google.com/apis/credentials"
step "Click 'Create Credentials' -> 'OAuth client ID'."
step "Application type: Web application."
step "Add Authorized Redirect URI: http://localhost:3000/api/auth/callback/google"
ask GOOGLE_CLIENT_ID "Enter Google Client ID:"
ask_secret GOOGLE_CLIENT_SECRET "Enter Google Client Secret:"
write_env GOOGLE_CLIENT_ID "$GOOGLE_CLIENT_ID"
write_env GOOGLE_CLIENT_SECRET "$GOOGLE_CLIENT_SECRET"

stage "GitHub OAuth App"
say "Register a new GitHub OAuth Application."
open_url "https://github.com/settings/applications/new"
step "Application name: WordStreak Dev"
step "Homepage URL: http://localhost:3000"
step "Authorization callback URL: http://localhost:3000/api/auth/callback/github"
step "Click 'Register application' and generate a new client secret."
ask GITHUB_CLIENT_ID "Enter GitHub Client ID:"
ask_secret GITHUB_CLIENT_SECRET "Enter GitHub Client Secret:"
write_env GITHUB_CLIENT_ID "$GITHUB_CLIENT_ID"
write_env GITHUB_CLIENT_SECRET "$GITHUB_CLIENT_SECRET"

finish
```

### 3. CI/CD Secrets Setup for GitHub Actions

```bash
TOTAL_STAGES=2
banner "GitHub Actions CI Secrets Setup"

stage "Verify GitHub CLI"
if ! command -v gh >/dev/null 2>&1 || ! gh auth status >/dev/null 2>&1; then
  warn "GitHub CLI (gh) is not authenticated."
  say "Run 'gh auth login' before setting repository secrets."
  pause "Press Enter after authenticating with gh..."
fi

stage "Deploy & CI Secrets"
say "Configuring production/staging secrets in GitHub repository."
ask_secret PROD_DATABASE_URL "Enter Production DATABASE_URL:"
ask_secret PROD_JWT_SECRET "Enter Production JWT_SECRET:"
set_secret DATABASE_URL "$PROD_DATABASE_URL"
set_secret JWT_SECRET "$PROD_JWT_SECRET"

finish
```

### 4. Production Database Migration with Safety Gate

```bash
TOTAL_STAGES=2
banner "Production Prisma Database Migration"

stage "Pre-migration Safety Verification"
warn "You are about to execute a migration on the production database."
step "Ensure you have taken a database backup or snapshot before proceeding."
step "Review pending migrations with 'prisma migrate status'."
open_url "https://cloud.prisma.io"
pause "Verify production database health on your cloud dashboard"

stage "Execute Migration"
if confirm "Are you SURE you want to apply migrations to PRODUCTION?"; then
  say "Executing prisma migrate deploy..."
  DATABASE_URL="$PROD_DATABASE_URL" pnpm --filter api prisma migrate deploy
  say "Migration executed successfully."
else
  warn "Migration cancelled by user."
fi

finish
```
