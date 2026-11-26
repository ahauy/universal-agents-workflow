# Use the screenshot guide skill

The authoritative instructions are in
[SKILL.md](SKILL.md), under
`.agents/skill-library/engineering/user-guide-with-screenshots/`.
This is a cold skill: open it through `.agents/SKILLS.md` when needed. Harness
adapters expose it according to the project's harness configuration.

The reusable files are:

- `scripts/capture-screenshots.mjs`: capture from a running app with Playwright.
- `scripts/screenshot-plan.example.json`: generic route/action/selector plan.
- `templates/user-guide-template.md`: non-technical guide template.

Check the target project's manifests for Playwright and use its existing package
manager/setup. This framework does not assume an `apps/web` package or install a
browser globally. Before capture, start the app and replace the sample `baseUrl`,
route and selectors with actual values from that app.

From the project root:

```bash
node .agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-screenshots.mjs path/to/capture-plan.json
```

Review the real screenshots, then save the guide under
`docs/user-guides/<slug>.md` with its images. Reuse the generic template; no
application-specific scripts or prefilled product guide are required.

The generic script supports `click`, `fill`, `hover`, `waitForSelector` and `wait`.
A failed or unknown action exits nonzero; browser cleanup runs even if capture
fails. Fix the plan and rerun before reporting completion. The script does not
add highlights or numbered badges: use a browser automation step before capture
or annotate the real image afterward, then visually inspect it.
