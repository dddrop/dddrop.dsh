# Theme Blue

`@dddrop/dsh-plugin-theme-blue` provides a persistent dark blue theme for the DeepSeek Harness Web interface.

## Design

- Deep navy application and sidebar surfaces.
- Blue primary accent (`#3b8cff`).
- Compact Avenir-first typography.
- Restrained `4px`, `6px`, and `8px` corner radii.
- Blue-tinted depth shadows and visible keyboard focus states.

The Client plugin registers the `theme-blue` theme through the DSH `theme` service, installs the supplementary typography and geometry stylesheet through a Cordis-managed effect, and keeps the custom theme selected after the built-in durable preference finishes loading.

## Build and test

```sh
npm run build
npm test
```

The repository Web profile links this package and mounts it through `profiles/web/cordis.patch.yml`. Run `node scripts/sync-profile.mjs` from the repository root after changing the package or profile source.

The dynamic Cordis package used during design is not required after the persistent profile is restarted. Do not run both implementations in the same process because both register the same `theme-blue` theme id.
