# DSH Source Patches

This directory stores version-locked source patches for DeepSeek Harness features that cannot be implemented entirely through public Plugin Slots.

## RC7 compact conversation activity

`dsh-rc7-compact-activity.patch` targets exactly DeepSeek Harness `0.1.0-rc.7`. It adds turn-level horizontal reasoning and Tool activity groups, one switchable inline detail panel, and the reasoning/tool detail Slots used by optional Client plugins.

Apply it only through `scripts/apply-dsh-shell-patch.mjs`. The installer verifies source and installed package versions, detects already-applied patches, runs typechecks and focused tests, builds RC7 Client bundles, backs up installed bundles, and refuses ambiguous source states.

Do not hand-apply this patch to another DSH release. Export and validate a release-specific successor instead.
