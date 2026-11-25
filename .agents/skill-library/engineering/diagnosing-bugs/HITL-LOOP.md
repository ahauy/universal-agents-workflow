# Human-in-the-Loop (HITL) Reproduction Loop

When an automated feedback loop cannot be fully executed unattended (e.g., requires 2FA authentication, third-party OAuth, manual canvas interactions, audio playback verification, or multi-device sync), use this structured **Human-in-the-Loop (HITL)** script pattern.

The agent prepares and executes the script; the user interacts via their terminal prompts. Upon completion, the script outputs structured `KEY=VALUE` pairs that the agent parses to obtain a deterministic verdict.

---

## When to Use HITL Loops

Use this script as a last resort in Phase 1 when:

1. **Third-party Auth**: Login requires SMS 2FA, biometric authentication, or external OAuth redirects that cannot be mocked safely in test environments.
2. **Sensory / Audio / Hardware**: Testing audio playback (e.g., pronunciation audio playback in flashcards), webcam access, or microphone input.
3. **Complex UI / Visual Canvas**: Verifying smooth 60fps animations, WebGL canvas rendering artifacts, or mobile touch gestures.
4. **Third-Party External Webhooks**: Verifying external sandbox callbacks (e.g. Stripe checkout redirect, Apple In-App Purchase sandbox).

---

## The HITL Script Template

Save this script as a temporary file in your project or scratch directory (e.g. `scripts/hitl-repro.sh`), make it executable (`chmod +x scripts/hitl-repro.sh`), and run it.

```bash
#!/usr/bin/env bash
# Human-in-the-loop reproduction loop.
# Copy this file, edit the steps below, and run it.
# The agent runs the script; the user follows prompts in their terminal.
#
# Usage:
#   bash scripts/hitl-repro.sh
#
# Two helpers:
#   step "<instruction>"          → show instruction, wait for Enter
#   capture VAR "<question>"      → show question, read response into VAR
#
# At the end, captured values are printed as KEY=VALUE for the agent to parse.
#
# `capture` prints its value back to the terminal, where the agent reads it,
# so capture observations, and leave signing in to the user as a `step`.

set -euo pipefail

step() {
  printf '\n>>> %s\n' "$1"
  read -r -p "    [Press Enter when done] " _
}

capture() {
  local var="$1" question="$2" answer
  printf '\n>>> %s\n' "$question"
  read -r -p "    > " answer
  printf -v "$var" '%s' "$answer"
}

# ==============================================================================
# --- EDIT SCENARIO BELOW ------------------------------------------------------
# ==============================================================================

step "Open the app at http://localhost:3000 and log in with your test account."

step "Navigate to the Study Deck page at http://localhost:3000/study/deck/deck-123"

capture ERRORED "Click the 'Audio Pronunciation' button. Did the audio fail or throw an error? (y/n)"

capture ERROR_MSG "If an error appeared in the browser console (F12 -> Console), paste it here (or type 'none'):"

capture AUDIO_PLAYED "Did you hear the audio play cleanly without stutter? (y/n)"

# ==============================================================================
# --- EDIT SCENARIO ABOVE ------------------------------------------------------
# ==============================================================================

printf '\n--- Captured Observations ---\n'
printf 'ERRORED=%s\n' "$ERRORED"
printf 'ERROR_MSG=%s\n' "$ERROR_MSG"
printf 'AUDIO_PLAYED=%s\n' "$AUDIO_PLAYED"
```

---

## Stack-Specific HITL Examples

### Example 1: OAuth + Refresh Token Race Condition

```bash
#!/usr/bin/env bash
set -euo pipefail

step() {
  printf '\n>>> %s\n' "$1"
  read -r -p "    [Press Enter when done] " _
}

capture() {
  local var="$1" question="$2" answer
  printf '\n>>> %s\n' "$question"
  read -r -p "    > " answer
  printf -v "$var" '%s' "$answer"
}

step "Clear browser storage (DevTools -> Application -> Clear site data) and open http://localhost:3000/login"
step "Click 'Sign in with Google' and complete the Google consent screen."
step "In DevTools Network tab, find the '/api/auth/callback' response status."

capture HTTP_STATUS "What HTTP status code was returned by /api/auth/callback? (e.g. 200, 302, 401, 500)"
capture REDIRECT_URL "What URL did the browser redirect to? (e.g. /dashboard or /login?error=oauth_failed)"

printf '\n--- Captured Observations ---\n'
printf 'HTTP_STATUS=%s\n' "$HTTP_STATUS"
printf 'REDIRECT_URL=%s\n' "$REDIRECT_URL"
```

### Example 2: WebSocket Real-Time Sync Bug

```bash
#!/usr/bin/env bash
set -euo pipefail

step() {
  printf '\n>>> %s\n' "$1"
  read -r -p "    [Press Enter when done] " _
}

capture() {
  local var="$1" question="$2" answer
  printf '\n>>> %s\n' "$question"
  read -r -p "    > " answer
  printf -v "$var" '%s' "$answer"
}

step "Open Window A (http://localhost:3000/study) and Window B (http://localhost:3000/study) side by side."
step "In Window A, complete 1 flashcard review."

capture SYNCED_WINDOW_B "Did Window B automatically update the review counter without manual refresh? (y/n)"
capture CONSOLE_WS_LOG "Paste any WebSocket error logs in Window B console (or 'none'):"

printf '\n--- Captured Observations ---\n'
printf 'SYNCED_WINDOW_B=%s\n' "$SYNCED_WINDOW_B"
printf 'CONSOLE_WS_LOG=%s\n' "$CONSOLE_WS_LOG"
```

---

## Agent Protocol for Executing HITL Loops

1. **Craft the Script**: Write the customized HITL script tailored to the specific defect scenario.
2. **Execute via CLI**: Propose running the bash script.
3. **Wait for Completion**: The user completes the steps and prompts in their terminal.
4. **Parse Results**: The agent parses the standard output block (`--- Captured Observations ---`).
5. **Evaluate Signal**:
   - If `ERRORED=y`, the loop is **RED**. Proceed to Phase 2 (Minimise).
   - If `ERRORED=n`, the scenario did not reproduce. Adjust parameters or tighten the reproduction steps.
6. **Cleanup**: Remove temporary HITL scripts in Phase 6.
