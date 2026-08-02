# Design

Architecture, invariants, and technical decisions for `discgen-cli`.

## Goals

`discgen-cli` should:

- turn a small set of explicit choices into a readable Discord.js starter;
- generate strict TypeScript that works in development and after compilation;
- keep the generated project understandable without a framework-specific runtime;
- make optional features composable and testable;
- avoid writing outside the user-selected project root;
- remain useful interactively and from automation.

It is a code generator, not a bot framework. Generated projects own their code after creation.

## Non-goals

- Web dashboards or HTTP APIs
- Hosting-provider configuration
- Containers by default
- A monorepo or plugin runtime
- Automatic mutation of an existing project beyond the explicit `generate` command
- Hiding database, Discord permission, or deployment decisions from the generated project

## System overview

There are two CLI flows:

```text
discgen-cli [name]
  └─ Commander
     └─ wizard
        ├─ prompts or preset
        ├─ central validation
        ├─ option-to-file manifest
        ├─ filesystem writes
        ├─ optional Git initialization
        └─ optional dependency installation

discgen-cli generate <type> [name]
  └─ Commander
     └─ generate flow
        ├─ alias resolution
        ├─ name/category validation
        ├─ one template selection
        ├─ overwrite confirmation
        └─ one filesystem write
```

`src/index.ts` is the process boundary. It owns Commander configuration, Node-version rejection,
fatal error presentation, and asynchronous parsing. Lower layers own domain logic and side effects,
but should not decide process exit status.

## Layers

| Layer         | Location                    | Responsibility                                       |
| ------------- | --------------------------- | ---------------------------------------------------- |
| Entry         | `src/index.ts`              | CLI grammar and top-level error boundary             |
| Orchestration | `src/cli/`                  | Prompts, presets, overwrite flow, external commands  |
| File manifest | `src/generators/files.ts`   | Convert `WizardOptions` into paths and content       |
| Package model | `src/generators/package.ts` | Generated scripts, engines, and dependencies         |
| Templates     | `src/templates/`            | Pure option-to-string transformations                |
| Domain types  | `src/types/index.ts`        | Features, databases, command modes, package managers |
| Utilities     | `src/utils/`                | Validation and package-manager behavior              |
| Verification  | `src/__tests__/`            | Unit tests and generated-output snapshots            |

The current architecture keeps rendering separate from side effects. The primary remaining
coupling is that feature metadata is repeated across types, prompts, file generation, help text,
package dependencies, and documentation. A typed feature registry is the intended replacement.

## Safety model

Project names and `generate` names/categories are untrusted input. They must be validated as one
filesystem segment before path construction.

Accepted names contain ASCII letters, numbers, hyphens, or underscores. Validation rejects:

- empty input;
- `/` and `\`;
- `.` and `..`;
- whitespace and shell punctuation;
- Windows device names such as `CON`, `NUL`, `COM1`, and `LPT1`;
- project names longer than 214 characters.

The resulting create-project path is `<cwd>/<projectName>`. The resulting one-file paths are rooted
under known `src/` subdirectories. Validation is necessary even though those paths are not
interpolated into shell commands: overwrite may recursively remove a target.

Dry-run is a hard side-effect boundary. It may render and list content, but must not write, delete,
install, or invoke Git.

The overwrite flow still deletes the existing target before the replacement is completely written.
A temporary-directory swap is tracked as a P1 improvement in [TODO.md](./TODO.md).

## Template model

Templates are TypeScript functions returning strings:

```ts
export function generateIndexTs(options: WizardOptions): string {
  // deterministic rendering only
}
```

This choice provides:

- direct typechecking of template inputs;
- ordinary unit testing and snapshots;
- no template-engine syntax or runtime dependency;
- explicit conditional composition.

Templates must not access the filesystem, environment, clock, network, or random values. Side
effects belong in orchestration or generated code.

Snapshot tests are review aids, not correctness proofs. A stable snapshot can preserve a broken
program; compiled generated-project smoke tests are therefore a release requirement.

## Build and module strategy

The CLI package and generated applications have different build needs.

### CLI package

The repository has one known entry point and builds with `tsup`:

```text
src/index.ts → dist/index.js + dist/index.mjs
```

The npm executable points to the CommonJS `dist/index.js`. ESM output remains available for package
consumers.

### Generated application

Generated bots discover commands, events, and interaction handlers by scanning directories at
runtime. A single-entry bundler cannot see all of those constructed dynamic imports. Generated
projects therefore use `tsc`, which preserves the complete tree:

```text
src/commands/**/*.ts     → dist/commands/**/*.js
src/events/**/*.ts       → dist/events/**/*.js
src/interactions/**/*.ts → dist/interactions/**/*.js
src/index.ts             → dist/index.js
```

Loaders accept `.ts` during `tsx` development and `.js` after compilation, while excluding
declaration files. Generated imports use explicit `.js` extensions under NodeNext resolution.

## Generated runtime

Startup order is intentional:

```text
load environment
  → construct Discord client and collections
  → initialize selected database
  → load commands
  → load component handlers
  → load events
  → register rejection logging
  → login to Discord
```

Database initialization occurs before handlers can receive interactions:

- SQLite enables WAL/foreign keys and creates its `users` table.
- PostgreSQL validates `DATABASE_URL` and creates the minimal `users` table.
- MongoDB validates `MONGODB_URI` and connects with Mongoose.

The PostgreSQL initializer is deliberately small; migrations should replace startup DDL when schema
evolution is introduced.

## Command modes

| Capability                 | Slash | Prefix                  | Both          |
| -------------------------- | ----- | ----------------------- | ------------- |
| Core `help` and `ping`     | Yes   | Yes                     | Both variants |
| Slash feature packs        | Yes   | No                      | Yes           |
| `generate command`         | Yes   | With `--prefix`         | Both          |
| Slash deployment           | Yes   | No generated slash core | Yes           |
| Components/i18n command UI | Yes   | No                      | Slash side    |
| Prefix routing             | No    | Yes                     | Yes           |

The asymmetry is explicit. Prefix feature parity is unfinished and must not be represented as
complete in product documentation.

## Feature composition

`WizardOptions` is the render contract:

```ts
interface WizardOptions {
  projectName: string;
  commandType: 'slash' | 'prefix' | 'both';
  features: Feature[];
  database: 'none' | 'sqlite' | 'postgresql' | 'mongodb';
  packageManager: 'npm' | 'pnpm' | 'bun' | 'yarn';
  gitInit: boolean;
  installDeps: boolean;
  dryRun?: boolean;
}
```

Feature selection controls file presence; database selection controls files, dependencies,
environment examples, and startup initialization. These outputs must change together.

### Economy consistency

Economy commands share one storage contract per generated project. Without a database,
`src/economy/store.ts` is the single process-local owner of balances and daily timestamps. With a
database, the daily claim is atomic: SQLite wraps the read and upsert in a transaction, PostgreSQL
uses a per-user advisory transaction lock before a locked read and upsert, and MongoDB conditionally
updates only eligible records while resolving a concurrent first-write duplicate key as a rejected
claim. This protects a user from receiving two daily rewards during one cooldown window.

The `full` preset combines Both command modes, the main slash feature packs, and SQLite. Explicit
negative flags override preset Git/install defaults.

## Generated loader contracts

Generated modules follow these shapes:

```ts
interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute(interaction: ChatInputCommandInteraction, client: Client): Promise<void>;
}

interface PrefixCommand {
  name: string;
  description: string;
  execute(message: Message, args: string[], client: Client): Promise<void>;
}

interface Event {
  name: string;
  once?: boolean;
  execute(...args: unknown[]): Promise<void> | void;
}
```

Slash templates expose named `data` and `execute` exports plus a default object. Prefix commands,
events, and interaction handlers use default exports because their loaders consume that contract.

Dynamic imports are runtime trust boundaries. The present loaders use structural checks and casts;
explicit type guards, duplicate detection, and localized error reporting remain planned work.

## External commands

Git and package installation run only after successful scaffolding and only when selected.
Executable strings come from closed enums:

- npm: `npm install`
- pnpm: `pnpm install`
- Bun: `bun install`
- Yarn: `yarn`

Git uses fixed commands for initialization, staging, and the initial commit. Project names are used
as the child process working directory, not interpolated into command text.

These optional steps are non-fatal: failure leaves the generated source in place and prints a
manual recovery command.

## Dependency policy

Root and generated dependencies are versioned deliberately rather than using `latest`.

- The minimum Node runtime must satisfy every direct tool's engine range.
- `@types/node` targets the minimum supported Node major so generated code cannot accidentally use
  APIs absent from that runtime.
- TypeScript and `@typescript-eslint` must have intersecting peer ranges.
- Native dependencies such as `better-sqlite3` require CI coverage on supported Node versions and
  operating systems.
- Unused build or migration packages should not be emitted.

At the current compatibility point, TypeScript 6 is intentional because the selected
`@typescript-eslint` version excludes TypeScript 7.

## Quality gates

A repository change is ready when:

1. lint passes;
2. strict typecheck passes;
3. unit and snapshot tests pass;
4. CLI build passes;
5. generated-output changes were reviewed;
6. documentation and dependency metadata agree;
7. relevant findings are represented in `TODO.md`;
8. notable user-visible changes appear in `CHANGELOG.md`.

The target release gate additionally compiles representative generated projects and verifies
runtime loader discovery from `dist/`; this gate is not yet implemented.

## Versioning

The package follows Semantic Versioning:

- patch: compatible bug or template correction;
- minor: new option, feature, generator, or compatible generated structure;
- major: incompatible CLI grammar, minimum-runtime jump, loader contract, or generated project
  structure.

Unreleased work belongs under `Unreleased` in `CHANGELOG.md`. A release tag should match
`package.json`, the changelog heading, and the supported-version statement in `SECURITY.md`.
