# AGENTS.md

Repository instructions for AI coding agents working on `discgen-cli`.

This file is the single source of agent-specific guidance. Do not add parallel instruction
files such as `CLAUDE.md`, `PROMPT.md`, `.cursorrules`, or tool-specific copies. Put durable
project rules here and user-facing behavior in `README.md` or `DESIGN.md`.

## Project

`discgen-cli` is a published TypeScript CLI that scaffolds Discord.js bot projects and can add
individual files to an existing generated project.

- Runtime: Node.js `>=24`
- Language: strict TypeScript
- CLI entry point: `src/index.ts`
- Build output: `dist/index.js` (CJS) and `dist/index.mjs` (ESM), built with `tsup`
- Test runner: Vitest
- Package manager and lockfile: npm / `package-lock.json`
- Generated projects: NodeNext ESM, compiled as a complete source tree with `tsc`

## Source layout

```text
src/
├── cli/
│   ├── generate.ts       # `discgen-cli generate`
│   ├── prompts.ts        # all interactive prompt definitions
│   └── wizard.ts         # create-project orchestration and side effects
├── generators/
│   ├── files.ts          # maps options to files and writes the scaffold
│   └── package.ts        # generated package.json
├── templates/
│   ├── base/             # entry point, handlers, config, utilities, CI
│   ├── commands/         # bundled command feature templates
│   ├── database/         # SQLite, PostgreSQL, and MongoDB
│   ├── events/           # core Discord events
│   ├── features/         # optional cross-cutting features
│   ├── generate/         # one-file `generate` templates
│   ├── i18n/             # typed locale templates
│   └── interactions/     # button, select, and modal examples
├── types/index.ts        # shared CLI domain types
├── utils/
│   ├── pm.ts             # package-manager detection and commands
│   └── validate.ts       # input and runtime validation
├── __tests__/            # unit and snapshot tests
└── index.ts              # Commander setup and top-level error boundary
```

## Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test -- --run
npm run build
npm run format
```

Run lint, typecheck, tests, and build before handing off a code change. Update snapshots with
`npm run test -- --run -u` only after reviewing the generated diff.

## Working rules

- Inspect `git status` before editing. Preserve unrelated and pre-existing user changes.
- Use the existing architecture before introducing a new abstraction or dependency.
- Keep changes focused. Do not add web servers, dashboards, monorepo tooling, Docker, or hosting
  configuration unless the user explicitly expands project scope.
- Prefer native Node.js APIs when they are clear and sufficient.
- Never delete or overwrite a path derived from user input until it has passed central validation.
- Treat `TODO.md` as the authoritative backlog and known-issues list. Do not leave findings only
  in chat or duplicate them across documents.
- Keep `README.md`, `DESIGN.md`, `TODO.md`, `CHANGELOG.md`, and generated output synchronized with
  actual behavior.

## TypeScript and style

- Keep strict mode enabled; do not weaken compiler or lint rules.
- Do not use `any`, `@ts-ignore`, unchecked double assertions, or non-null assertions to bypass
  modeling. Narrow `unknown` at boundaries.
- Give every function an explicit return type.
- Prefer `interface` for object shapes and named exports in repository source.
- Default exports are allowed inside generated command, event, and interaction templates because
  the generated runtime loaders depend on that contract.
- Use 2-space indentation, single quotes, semicolons, and trailing commas in multiline constructs.
- Prettier is the formatting authority.
- Use `node:` prefixes for new Node.js standard-library imports.

## Boundaries and errors

The top-level CLI owns process termination and user-facing fatal-error formatting.

- `src/index.ts` may set an exit code or call `process.exit`.
- Lower layers should return, throw a typed error, or propagate an error.
- User cancellation is a normal control-flow outcome and should not print a stack trace.
- Never silently swallow an error. A deliberately non-fatal external step, such as optional Git
  initialization, must emit a clear warning.
- Spawned commands must use fixed executable/argument choices derived from validated enums. Never
  interpolate unchecked user input into a shell command.

Existing lower-level `process.exit` calls are technical debt tracked in `TODO.md`; do not copy
that pattern into new code.

## Template contracts

- Template content belongs under `src/templates/` as pure functions returning strings.
- A template must produce identical output for identical inputs.
- Do not introduce Handlebars, EJS, or another template engine.
- `src/generators/files.ts` is the only create-project file manifest.
- `src/generators/package.ts` is the only source for generated dependency versions.
- Keep generated imports compatible with NodeNext ESM and explicit `.js` extensions.
- Dynamic loaders must work in both `tsx` development (`.ts`) and compiled production (`.js`).
- Generated database code must validate required configuration and initialize before handlers run.
- Optional features must not produce commands that the selected command mode cannot load.

## Required safety and behavior invariants

When changing the wizard, generators, or templates, preserve these invariants:

1. A project name, generated file name, and category is one validated path segment.
2. Dry-run mode performs no filesystem writes, package installation, or Git commands.
3. Declining overwrite leaves the existing target untouched.
4. Every path listed by the generator is rooted below the selected project directory.
5. `npm run build` in a generated project emits every dynamically loaded command, event, and
   interaction file beneath `dist/`.
6. Every advertised command is generated and discoverable by the matching runtime loader.
7. Selecting a database produces its dependencies, environment example, initializer, and startup
   call as one coherent unit.
8. Preset flags such as `--no-install` and `--no-git` override preset defaults.

If a change cannot preserve one of these invariants, document the gap as a P1 issue before
shipping and avoid strengthening claims in the README.

## Testing

Add or update tests for:

- all validation and package-manager utilities;
- option-to-file mapping and every template variant;
- cancellation, overwrite, dry-run, and preset behavior;
- both success and failure branches of CLI orchestration;
- generated package dependencies and scripts;
- snapshots for intentional generated-output changes.

Unit tests should mock filesystem and child-process boundaries. A hermetic smoke test may scaffold
into an isolated temporary directory and run local syntax/type checks, but it must not install
packages, contact Discord, initialize a real repository, or write outside the temporary directory.

String-presence assertions are not sufficient evidence that generated TypeScript compiles. Favor
behavioral tests and generated-project typechecks for release-critical paths.

## Dependencies

- Upgrade to the newest mutually compatible versions, not blindly to incompatible latest majors.
- Confirm package engine and peer-dependency ranges before changing versions.
- Keep root `package.json`, `package-lock.json`, generated versions, Node engine, CI matrix, and
  documentation aligned.
- TypeScript 7 must not be adopted while the selected `@typescript-eslint` release excludes it.
- Avoid a dependency when a small, well-tested native implementation is clearer.
- Do not run automatic audit fixes without reviewing the proposed dependency changes.

## Documentation

- `README.md`: installation, real CLI behavior, generated output, supported features, limitations.
- `DESIGN.md`: architecture, flows, invariants, decisions, and compatibility matrix.
- `TODO.md`: prioritized unfinished work and confirmed findings.
- `CHANGELOG.md`: notable user-visible changes under `Unreleased` until release.
- `SECURITY.md`: reporting policy and supported released versions.

Do not hard-code test counts or claim “production-ready,” complete prefix parity, successful
security audits, or zero known issues unless the repository evidence supports the statement.

## Pull-request checklist

- [ ] Existing changes were preserved and the final diff was reviewed.
- [ ] User-controlled paths and command arguments are validated.
- [ ] Root and generated dependency metadata agree.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run test -- --run` passes.
- [ ] `npm run build` passes.
- [ ] Intentional snapshots were reviewed.
- [ ] `TODO.md` reflects fixed and newly discovered work.
- [ ] `CHANGELOG.md` includes notable changes.
- [ ] Commit messages follow Conventional Commits.
