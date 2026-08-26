/**
 * Dependency-Cruiser Config — Enforcing Deep Modules in TypeScript / JavaScript
 *
 * Rules:
 * 1. Entry-point boundary: External code may only import package root files (index.ts, client.ts),
 *    never internal subfolders (lib/, internal/).
 * 2. Intra-package freedom: Files within a package can import each other freely.
 * 3. Tests through entry points: Tests test through public interfaces.
 * 4. No cycles: Zero circular dependencies permitted.
 */

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-subfolder-deep-imports',
      severity: 'error',
      comment: 'Deep modules: External packages must not import internal subfolders directly.',
      from: {
        path: '^src/packages/([^/]+)',
      },
      to: {
        path: '^src/packages/([^/]+)/.+',
        pathNot: '^src/packages/$1',
      },
    },
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies erode modularity and make code hard to reason about.',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'test-through-entry-points-only',
      severity: 'error',
      comment: 'Tests must interact with public package interfaces, not private internals.',
      from: {
        path: '^src/packages/[^/]+/tests/',
      },
      to: {
        path: '^src/packages/[^/]+/(lib|internal)/',
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
  },
};
