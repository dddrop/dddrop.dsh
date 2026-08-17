# Web Profile

This directory is the version-controlled source for custom DeepSeek Harness Web profile configuration.

## Files

- `cordis.patch.yml` contains composition patches applied after the shipped bundles.
- `plugins.json` lists local plugin package paths, resolved relative to this directory, that should be linked into the Web profile.

Run the synchronization script after changing either file:

```sh
node scripts/sync-profile.mjs
```

The runtime target is `${DSH_HOME:-$HOME/.dsh}/profiles/web`. Runtime-generated files remain outside this repository.
