// scripts/capture-screenshots.mjs
//
// Launches the running app, performs actions (click / fill / hover),
// and captures real screenshots for the user-facing guide.
//
// Setup: use the target project's existing Playwright and browser setup.
// Read its manifest, package manager and server configuration first.
//
// Usage:
//   node .agents/skill-library/engineering/user-guide-with-screenshots/scripts/capture-screenshots.mjs <path-to-plan.json>
//
// See scripts/screenshot-plan.example.json for the plan file structure.

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const planPath = process.argv[2];
if (!planPath) {
  console.error('Usage: node capture-screenshots.mjs <path-to-plan.json>');
  process.exit(1);
}

const plan = JSON.parse(fs.readFileSync(planPath, 'utf-8'));
const outDir = path.resolve(plan.outDir || 'docs/user-guides/assets');
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: plan.viewport || { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  for (const step of plan.steps) {
    console.log(`→ ${step.name}`);
    await page.goto(new URL(step.url, plan.baseUrl).toString(), {
      waitUntil: 'networkidle',
    });

    for (const action of step.actions || []) {
      try {
        switch (action.type) {
          case 'click':
            await page.click(action.selector, { timeout: action.timeout ?? 5000 });
            break;
          case 'fill':
            await page.fill(action.selector, action.value ?? '');
            break;
          case 'hover':
            await page.hover(action.selector);
            break;
          case 'waitForSelector':
            await page.waitForSelector(action.selector, { timeout: action.timeout ?? 5000 });
            break;
          case 'wait':
            await page.waitForTimeout(action.ms ?? 500);
            break;
          default:
            throw new Error(`Unsupported action type: ${action.type}`);
        }
      } catch (err) {
        console.error(`  ✖ Error at action ${action.type} (${action.selector ?? ''}): ${err.message}`);
        throw err;
      }
    }

    const file = path.join(outDir, `${step.name}.png`);
    if (step.screenshot?.selector) {
      await page.locator(step.screenshot.selector).screenshot({ path: file });
    } else {
      await page.screenshot({ path: file, fullPage: step.screenshot?.fullPage ?? true });
    }
    console.log(`  ✔ Saved: ${file}`);
  }
} finally {
  await browser.close();
}
console.log('\nDone! All screenshots saved to:', outDir);
