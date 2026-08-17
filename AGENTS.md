# Repository Instructions

## Language

Use English throughout the repository. This includes source code, identifiers, comments, documentation, configuration, scripts, tests, plugin metadata, agent presets, skills, commit messages, and contribution content.

Non-English content is allowed only when it is required as explicit localization data or test input.

## Commits

Follow the Semantic Commit Message rules documented in `CONTRIBUTING.md`.

Use this format:

```text
<type>[optional scope][optional !]: <description>
```

Prefer small, atomic commits. Do not create a commit unless the user explicitly requests one.

## Repository Scope

This repository manages persistent DeepSeek Harness plugins, agent presets, related skills, profile configuration sources, validation tooling, and documentation.

Do not store generated DSH runtime state, session data, credentials, machine-specific configuration, or unrelated project-management files in this repository.
