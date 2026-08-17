# Plugins

This directory contains persistent DeepSeek Harness plugin packages.

Each direct child should be an independently identifiable package with its own `package.json`, source, tests, and build configuration when a build step is required.

## Package Guidelines

- Use a stable package name, preferably under the `@dddrop` scope.
- Declare ESM with `"type": "module"` unless a dependency requires another format.
- Export built runtime files rather than uncompiled TypeScript.
- Keep Host and Client responsibilities explicit.
- Register and dispose of all side effects through Cordis lifecycle APIs.
- Document required DSH services, events, slots, and configuration.
- Add a relative package path to `profiles/web/plugins.json` when the Web profile must install the package.

Do not store temporary dynamic Cordis definitions here without converting them into maintainable package source.
