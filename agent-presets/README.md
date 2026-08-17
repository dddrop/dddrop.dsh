# Agent Presets

Each direct child directory is a user-owned DeepSeek Harness agent preset.

## Required Files

```text
agent-presets/<preset-id>/
├── agent.cordis.yml
└── preset.yml
```

A preset may also own skills and assets:

```text
agent-presets/<preset-id>/
├── skills/<skill-name>/SKILL.md
└── assets/
```

## Naming

A preset ID is its directory name and must match:

```text
[a-z0-9][a-z0-9-]*
```

## Authoring Rules

- Start from a copy of a known-good DSH preset whenever possible.
- Keep display metadata in `preset.yml` and composition rows in `agent.cordis.yml`.
- Use relative plugin paths only for files intentionally owned by the preset.
- Use installed package names for shared plugins from `plugins/`.
- Place preset-owned services and all of their consumers behind an isolated realm.
- Validate a changed preset by mounting it and then starting a new session.
- Never copy session data, credentials, or generated runtime state into this directory.
