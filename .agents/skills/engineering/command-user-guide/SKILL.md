---
invocation: user
name: command-user-guide
description: "Verify the dev server, capture real Playwright screenshots, and write docs/user-guides/<slug>.md in non-technical language."
triggers:
  - "/command-user-guide"
  - "/user-guide"
  - "/guide"
  - "/auto-user-guide"
  - "create user guide"
  - "write user guide"
  - "user documentation"
---

# Command: User Guide Generator Workflow (/command-user-guide)

This command skill automates the creation and maintenance of end-user documentation with real application screenshots in compliance with [user-guide-with-screenshots](../../../skill-library/engineering/user-guide-with-screenshots/SKILL.md).

---

## Core Principles (User-First)

1. **Non-Technical Language**: Avoid developer jargon (e.g., _API, DTO, Endpoint, Database, State, Component, Payload_). Explain features plainly as if talking to an everyday user (e.g., use "popup window" instead of "modal").
2. **100% Real Screenshots (MANDATORY - NO TEXT-ONLY WORKAROUNDS)**: Capture images directly from the running web application (using the verified project URL). Never use fabricated mockups or write text-only guides for features with UI changes.
3. **Visual Annotations & Red Highlights (Red Highlights `#EF4444` & Badges ①, ②, ③)**:
   - Every screenshot **MUST FEATURE VIBRANT RED HIGHLIGHTS** (`outline: 3.5px solid #EF4444; box-shadow: 0 0 0 7px rgba(239, 68, 68, 0.3)`) bounding the target button, input, or container.
   - Attach a circular red numbered badge (**①, ②, ③**) with bold white text at the top-left corner of the highlighted element.
   - The generic capture script saves screenshots only; it does not inject highlights or badges. Add these in a browser automation step before capture or annotate the real captured image, then visually verify the result. Do not invent capture-plan fields for annotations.
   - In the guide text, every instructional bullet point must explicitly reference the corresponding badge number (e.g. `① Click the button...`, `② Enter the term...`).
4. **Visual Clarity**: 1 user action = 1 clear annotated screenshot + 1–2 concise explanatory sentences.
5. **File Locations**:
   - Document: `docs/user-guides/<slug>.md`
   - Images: `docs/user-guides/images/<slug>/` or `docs/user-guides/assets/<slug>/`

---

## 5-Step Execution Workflow

### Step 1: Identify Feature & Scope

1. Determine the `<slug>` of the target feature from command arguments (e.g. `/command-user-guide card-creation`) or recent UI changes in the actual project source tree.
2. Identify key screens, popups, and the main user flow (Happy path: navigate to page -> click action -> fill inputs -> confirm & save).

### Step 2: Verify Running Application

1. Read the target project manifest, lockfile, workspace configuration and app/server configuration. Identify the existing app package, start command and configured URL; confirm the actual listening URL from server output.
2. Check that URL. If the app is not running, start it using its documented command and package manager. Do not assume a port, `apps/web`, or a `web` workspace. Resolve any material unknown before capturing.
3. Use the project’s existing Playwright/browser setup or the available browser tool. If setup is missing, report the blocker and follow the project’s dependency approval policy before installing anything.

### Step 3: Plan & Capture Screenshots

1. Create a temporary screenshot plan (e.g., `<slug>-plan.json`) using the verified app URL, routes and selectors.
2. Run the automated Playwright capture script:
   ```bash
   node .agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-screenshots.mjs <slug>-plan.json
   ```
   _(Or use the browser tool to capture screenshots for each step into `docs/user-guides/images/<slug>/`)_.

3. A nonzero capture exit means the guide is not complete. Fix the failed action or unsupported action type and rerun; inspect every image for the intended state and required annotations.

### Step 4: Author User Guide Document

Create or update `docs/user-guides/<slug>.md` following the standard template:

```markdown
# 📖 User Guide: [Feature Name]

> **Audience:** End users  
> **Last Updated:** [Current Date]

---

## 🎯 Overview

[2-3 plain-language sentences describing how this feature helps learners]

---

## 🚀 Step-by-Step Instructions

### Step 1: [Step Title, e.g., Open Deck Details]

![Open Deck Details](./images/<slug>/step-01.png)

- [Action instruction 1]
- [Action instruction 2]

### Step 2: [Step Title, e.g., Fill in Word Details]

![Fill in Word Details](./images/<slug>/step-02.png)

- [Action instruction]

---

## 💡 Tips & Shortcuts

- **Tip 1:** ...
- **Tip 2:** ...

---

## ❓ Frequently Asked Questions (FAQ)

- **Q:** [Common Question]  
  **A:** [Direct, plain explanation]
```

### Step 5: Update User Guides Index

Add or update the link in `docs/user-guides/README.md` if an index exists. Report completion with the file path to the user.
