# Theme Blue

`@dddrop/dsh-plugin-theme-blue` provides a persistent blue visual layer for the DeepSeek Harness Web interface while preserving the built-in Light, Dark, and System preferences.

## Design

- Cool gray-white Light surfaces inspired by the reference workspace.
- Deep navy Dark application and sidebar surfaces.
- Blue primary accents (`#2563eb` in Light and `#3b8cff` in Dark).
- Compact Avenir-first typography.
- Restrained `4px`, `6px`, and `8px` corner radii.
- Native mode-aware elevation and visible blue keyboard focus states.

The Client plugin uses the DSH `theme` service to install paired Light and Dark token overrides, then adds supplementary typography and geometry styles through a Cordis-managed effect. The built-in appearance controls remain authoritative, so Light, Dark, and System continue to work normally.

## Build and test

```sh
npm run build
npm test
```

The repository Web profile links this package and mounts it through `profiles/web/cordis.patch.yml`. Run `node scripts/sync-profile.mjs` from the repository root after changing the package or profile source.

The dynamic Cordis package used during design is not required after the persistent profile is restarted. Do not run both implementations together because their theme token layers overlap.
