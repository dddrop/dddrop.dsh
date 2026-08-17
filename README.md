# dddrop.dsh

Version-controlled DeepSeek Harness plugins, agent presets, related skills, and profile configuration.

## Repository Layout

```text
.
├── agent-presets/       Agent-plane compositions and preset-owned skills
├── plugins/             Persistent Host and Client plugin packages
├── profiles/web/        Source configuration for the DSH Web profile
├── scripts/             Installation, synchronization, and validation tools
└── tests/               Repository-level validation tests
```

## Included Plugins

### Theme Blue

`plugins/theme-blue` provides the persistent dark blue Web theme, compact typography, restrained corner geometry, and blue-tinted depth used by this profile. See `plugins/theme-blue/README.md` for its design tokens and lifecycle.

### Kanban

`plugins/kanban` provides one shared, Git-backed board in the conversation view. Static profile configuration defines its columns, movement rules, repository checkout, and pull/push policy. See `plugins/kanban/README.md` for architecture, synchronization, and installation details.

## Requirements

- Node.js 20 or newer
- DeepSeek Harness available as the `dsh` command
- pnpm when installing or developing plugin packages

## Setup

Run the repository setup only after reviewing the source profile configuration:

```sh
node scripts/install.mjs
```

The setup performs two operations:

1. Links the DSH user preset root to `agent-presets/`.
2. Synchronizes `profiles/web/cordis.patch.yml` and linked plugin packages with the DSH Web profile.

The scripts refuse to overwrite an existing preset root or an uninitialized Web profile.

## Common Commands

```sh
node scripts/link-presets.mjs
node scripts/sync-profile.mjs
node scripts/doctor.mjs
node --test tests/*.test.mjs
```

Use `node scripts/doctor.mjs --strict` when integration warnings should fail validation.

## RC7 Compact Activity Shell Patch

The horizontal Think/Tool/context-injection activity grouping crosses sibling conversation nodes and therefore cannot be delivered entirely through a Client Plugin on DSH RC7. The version-locked source patch is stored at `patches/dsh-rc7-compact-activity.patch` and must be applied through the guarded installer:

```sh
node scripts/apply-dsh-shell-patch.mjs \
  --source /path/to/deepseek-harness-rc7 \
  --install /path/to/the/rc7/npx-install-root
```

Run a non-mutating compatibility check first when inspecting a new checkout:

```sh
node scripts/apply-dsh-shell-patch.mjs \
  --check \
  --source /path/to/deepseek-harness-rc7 \
  --install /path/to/the/rc7/npx-install-root
```

The installer accepts exactly DSH `0.1.0-rc.7`, applies the patch idempotently, installs the pinned pnpm dependencies unless `--skip-deps` is supplied, runs Host contract generation, Client typechecking, focused Oxlint checks and UI tests, builds the two affected Client bundles, and backs up target bundles before deployment. Omitting `--install` patches and builds the source checkout without changing a runtime installation.

Never reuse the RC7 patch or its compiled bundles on another DSH release. Port and validate a release-specific patch instead.

## Development Workflow

1. Add or update a package under `plugins/`.
2. Add the package path to `profiles/web/plugins.json` when the Web profile must install it.
3. Add Host or Client composition rows to `profiles/web/cordis.patch.yml` when required.
4. Create or update a preset under `agent-presets/` for agent-plane tools, prompts, skills, and policies.
5. Synchronize the profile and start a new DSH session for validation.
6. Commit one logical change using the rules in `CONTRIBUTING.md`.

## Repository Rules

- Use English throughout the repository.
- Use Semantic Commit Messages.
- Do not commit credentials, session data, generated runtime state, or machine-specific configuration.
- Do not edit presets shipped with DSH; create a user-owned preset instead.
