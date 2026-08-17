# Contributing

## Repository Language

English is the only language used in this repository.

This rule applies to:

- Source code and identifiers
- Comments and documentation
- Configuration descriptions
- Script output and error messages
- Commit messages
- Pull request and issue content
- Agent presets, skills, and plugin metadata

Use non-English text only when it is required as explicit localization test data or as a translated product resource. Keep the source key, surrounding explanation, and developer-facing documentation in English.

## Commit Messages

All commits must follow the Semantic Commit Message format, compatible with Conventional Commits:

```text
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

### Allowed Types

- `feat`: Add or change user-facing functionality
- `fix`: Correct a defect
- `docs`: Change documentation only
- `refactor`: Restructure code without changing behavior
- `test`: Add or update tests
- `perf`: Improve performance
- `build`: Change the build system or dependencies
- `ci`: Change continuous integration configuration
- `chore`: Perform repository maintenance
- `revert`: Revert an earlier commit

### Subject Rules

- Write the description in English.
- Use the imperative mood.
- Start with a lowercase letter.
- Do not end with a period.
- Keep the first line concise, preferably no longer than 72 characters.
- Add a scope when it makes the affected area clearer.

Examples:

```text
feat(presets): add frontend engineering agent
fix(loader): resolve local plugin entry paths
refactor(cli): simplify profile synchronization
docs: document plugin development workflow
chore: initialize repository structure
```

### Breaking Changes

Add `!` before the colon and explain the change in a `BREAKING CHANGE:` footer:

```text
feat(presets)!: change preset directory layout

BREAKING CHANGE: Presets now live under agent-presets instead of presets.
```

## Commit Quality

- Keep each commit focused on one logical change.
- Do not mix unrelated formatting, refactoring, and feature work.
- Ensure the repository is in a valid state after every commit.
- Do not commit generated runtime state, credentials, session data, or local machine configuration.
