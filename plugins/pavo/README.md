# `@dddrop/dsh-plugin-pavo`

Pavo is a Git-backed Work board and dependency canvas for the DeepSeek Harness Web interface.

## Behavior

- Adds one `Pavo` conversation tab with `Flow Canvas` as the initial default and the Kanban `Board` as a secondary view, then remembers the selected view across conversation-tab switches and page reloads.
- Opens Flow Canvas at the fixed `Root Workflow`, supports nested Workflow containers, and uses breadcrumbs to navigate the hierarchy.
- Allows users and Agents to create Works and Workflows. Every Work belongs to exactly one Workflow; every non-root Workflow belongs to exactly one parent Workflow.
- Preserves the Kanban status columns, drag-and-drop movement rules, optimistic updates, polling, and Git synchronization behavior.
- Manages two Work types:
  - `goal`: finite Work with a concrete completion target.
  - `ongoing`: continuously maintained Work.
- Uses each Work's `Description` directly as the Prompt an Agent reads. Pavo does not interpret the Description or require a fixed result protocol.
- Stores dependency relationships and acknowledged upstream versions in each downstream Work's `upstreamWaterLevels` dictionary.
- Allows directed cycles and bidirectional dependencies without topological scheduling, WaterLevel propagation, loop termination, or automatic acknowledgement.
- Provides a persisted board-level automatic mode that promotes eligible Backlog Works to Ready, starts Ready Agent-assigned Works, and returns stale-dependency Done Ongoing Works to Backlog.
- Retains explicit user-triggered `Run` and `Re-run` actions; Goal re-runs create a new Session, while Ongoing re-runs preserve context by reusing their linked Session.
- Uses one global board shared by every DSH workspace and session.
- Creates one semantic Git commit for every Work, Workflow, or Template mutation.
- Provides a shared Git-backed Template Library for reusable Work records and complete nested Workflow subtrees.
- Uses process-monotonic UUIDv7 IDs as immutable Work, Workflow, and Template identities.
- Adds a `Pavo` Settings page for repository configuration and a read-only view of DSH Workspaces.

The Flow Canvas is a hierarchical dependency view powered by `@xyflow/react`. The fixed Root Workflow is the initial scope and is never rendered as a removable node. Each scope displays its direct Works and child Workflows. Double-click a Workflow to enter it and use the breadcrumb path to return to an ancestor. Workflow nodes have no dependency handles. Drag from an upstream Work's handle to a downstream Work in the same visible scope to add a dependency. Cross-Workflow dependencies remain valid and visible in the Work inspector even when both endpoints are not rendered together. The inspector can acknowledge the upstream Work's current WaterLevel or remove the relationship. Node positions are browser-only exploratory state, namespaced by repository and Workflow; Pavo does not duplicate dependency data outside the downstream Work.

## Work model

A normalized Work has this shape:

```json
{
  "id": "work-release",
  "type": "goal",
  "workspaceId": "019c-workspace-id",
  "sessionId": "session-019c-run-id",
  "key": "PAVO-12",
  "title": "Release v1.0.0",
  "description": "Complete checks and release v1.0.0.",
  "assignee": {
    "kind": "agent-preset",
    "presetId": "standard"
  },
  "waterLevel": "8",
  "upstreamWaterLevels": {
    "work-api": "12",
    "work-review": "5"
  },
  "workflowId": "workflow-release",
  "columnId": "in-progress",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-02T00:00:00.000Z"
}
```

A normalized Workflow container has this shape:

```json
{
  "id": "workflow-release",
  "title": "Release 1.0",
  "parentWorkflowId": "root",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-02T00:00:00.000Z"
}
```

The fixed Root Workflow uses ID `root`, title `Root Workflow`, and `parentWorkflowId: null`. It cannot be renamed, moved, or deleted. Non-root Workflows may be nested and renamed or moved explicitly, but their parent graph must remain a rooted tree. An empty non-root Workflow may be deleted; Pavo rejects deletion while it contains direct Works or child Workflows. Workflow containers do not have Descriptions, status columns, WaterLevels, dependencies, execution state, or automatic aggregation.

`assignee` is always one structured value:

```json
{ "kind": "unassigned" }
```

```json
{ "kind": "human" }
```

```json
{ "kind": "agent-preset", "presetId": "standard" }
```

The browser labels `human` as `Me` and reads the current Agent Preset roster from the Host `agentPresets` Service. An Agent Preset assignment becomes executable only through explicit Run or enabled automatic mode. If a referenced Preset is deleted, broken, or otherwise unavailable, the Work retains its `presetId`, the UI marks it unavailable, and execution remains blocked instead of clearing or reassigning it. Legacy non-empty freeform Assignee labels migrate to an unassigned value with a preserved `legacyLabel` so Pavo does not invent an Agent Preset identity.

`workspaceId` is either an empty string or the stable ID of a Workspace registered in DSH. Pavo reads the current roster from the Host `workspaceRegistry` Service, displays the current Workspace title, and never creates, renames, reorders, or removes DSH Workspaces. Workspace renames therefore update the Pavo label without rewriting Work data. A deleted or unavailable Workspace remains referenced by ID and is visibly marked unavailable until the user clears or changes it. Browser and Agent payloads expose only Workspace ID, title, and availability—not directory paths or session membership. Legacy non-empty Project names migrate to an unassigned Workspace with a preserved `legacyWorkspaceTitle`; Pavo never guesses identity from a display title.

`upstreamWaterLevels` has two roles:

1. Each key defines an inbound edge from the immutable upstream Work ID.
2. Each value records the last upstream WaterLevel handled by the downstream Work.

Compare the upstream Work's current `waterLevel` with the recorded value:

- Equal: `synchronized`.
- Current is greater: `changed`.
- Current is lower: `rollback`.

WaterLevels are canonical non-negative decimal strings with arbitrary precision. Pavo never compares them through JavaScript floating-point numbers. Self-dependencies and references to missing Works are rejected. Multi-Work cycles are valid. A referenced upstream Work cannot be deleted until downstream references are removed.

## Automatic mode and Agent execution

The Board toolbar persists `autoMode.enabled` in `board.json`. Automatic mode is off for new and migrated boards until explicitly enabled. While enabled, Pavo repeatedly performs these conservative transitions:

1. A Backlog Work moves to Ready when it has a non-empty `workspaceId`, a Human or Agent Preset Assignee, and no upstream Work whose current WaterLevel is greater than the downstream Work's acknowledged value.
2. A Ready Work assigned to an Agent Preset starts immediately. Human-assigned Works remain Ready.
3. A Done `ongoing` Work moves to Backlog when any upstream Work advances beyond its acknowledged WaterLevel. Done Goal Works remain Done.

Rollback WaterLevels do not count as new upstream work. Automatic transitions preserve Session linkage, WaterLevels, and acknowledgements, honor the persisted column transition rules, and never infer completion, increment WaterLevels, or acknowledge upstream versions. A failed automatic Agent launch remains Ready and is retried with bounded in-memory backoff after transient failures or relevant Work changes.

Explicit `Run` and `Re-run` remain available when a Work is in Ready, references an available DSH Workspace, and is assigned to an available Agent Preset. Manual and automatic execution share one per-Work single-flight coordinator.

The first Run creates an idle top-level Agent Session using the current default model, mounts the selected Preset, attaches the Session to the Workspace, and pins the Session title to the Work title. A linked Work can be moved back to Ready and run again:

- A `goal` Re-run creates a new Session. The Work's `sessionId` changes to the newest Session; earlier Goal Sessions remain available in the DSH Workspace history.
- An `ongoing` Re-run reuses its linked Session. Pavo uses the live Agent when available or resumes the persisted Session after a Host restart. Because the Session's composition is durable, the Work must still reference the same Workspace and Agent Preset.

Pavo commits one optimistic Work claim that records the selected `sessionId` and moves `Ready` to `In Progress`. Only after that Git claim succeeds does Pavo submit the current Work `Description` unchanged as a new user Prompt. Automatic Prompt delivery may wait independently for a reused Session to become idle, so it does not block claims for other Ready Works. Concurrent manual and automatic requests for the same Work share one in-flight operation, and automatic execution failures surface in the board UI.

A recorded `sessionId` is durable transcript linkage. `Open Session` selects the current Session from the Work drawer or Flow inspector. Pavo does not move the Work beyond In Progress from Agent output; completion remains an explicit user or Agent mutation.

## Template Library

The Template Library is available from both Board and Flow Canvas. A Work template stores reusable Work content without a destination Workflow or dependencies. A Workflow template stores one complete Workflow subtree, all of its Works, their Workflow membership, and dependencies whose endpoints are both inside the captured subtree. Dependencies that point to Works outside a captured source are explicitly excluded and counted on the template.

Templates may be created from scratch, captured from an existing Work or Workflow, renamed, edited, deleted, and instantiated under an explicit destination Workflow. Instantiation is one optimistic Git mutation. It creates fresh UUIDv7 IDs for every Work and Workflow, remaps parent links and internal dependency keys atomically, and copies acknowledged WaterLevel strings exactly. A normal Workflow template's local root becomes a new child of the selected destination. When the fixed Root Workflow itself is captured, that local root is virtual and maps directly to the destination, so Pavo never creates a duplicate Root container.

Templates remain passive data. Creating or instantiating one does not itself execute an Agent, infer status, change a WaterLevel, acknowledge an upstream version, or propagate a dependency; enabled automatic mode may subsequently reconcile eligible instantiated Works. Templates retain stable Workspace IDs even when a referenced DSH Workspace is temporarily unavailable or has been removed; column values must still identify configured Pavo columns.

## Agent tools

When the Host provides the optional `tools` Service, Pavo registers seven global tools backed by the same `RepositoryController` as the browser API. Agent tools can inspect and edit records but intentionally cannot invoke Run directly; enabled automatic mode may react to their persisted mutations:

- `pavo_list_works`: lists Works, Workflow containers, status columns, sanitized DSH Workspace and Agent Preset choices, and the current board revision; it can filter exact Workspace ID, Workflow membership, or structured Assignee.
- `pavo_read_work`: reads one Work, its Description, upstream context, and Root-to-Work Workflow path.
- `pavo_update_work`: explicitly creates, edits, moves, or deletes one Work, including explicit Workflow assignment.
- `pavo_update_workflow`: explicitly creates, renames, moves, or deletes one Workflow container.
- `pavo_list_templates`: lists reusable Work and Workflow templates and their exact persisted content.
- `pavo_update_template`: explicitly creates, edits, refreshes from a current source, or deletes one template.
- `pavo_apply_template`: instantiates one template under an explicit destination Workflow with fresh IDs and remapped internal references.

Every mutation requires the exact revision returned by a recent read. Pavo does not automatically retry a stale mutation because the Agent must reconsider its intent against the latest Work state.

## Data compatibility

Pavo intentionally keeps the default `dataDirectory` as `kanban` and the existing `tickets/` directory so existing data remains in place.

```text
<dataDirectory>/
├── board.json
└── tickets/
    ├── <work-id>.json
    └── ...
```

`board.json` storage version 11 contains the board-level `autoMode` switch, columns with their `allowedTransitions`, the flat parent-linked Workflow table, the shared Template Library, and ordered Work placements under `works` (`id`, `columnId`, and `order`). Work documents use version 7 and contain `id`, `type`, `workspaceId`, `sessionId`, optional migration-only `legacyWorkspaceTitle`, `key`, `title`, `description`, structured `assignee`, `waterLevel`, `upstreamWaterLevels`, `workflowId`, and timestamps. DSH Workspace titles are live registry metadata and are not duplicated into canonical Pavo storage. Templates never capture Session IDs.

The reader remains compatible with:

- Combined legacy `board.json` files with `cards` and `body`.
- Split board versions 2 and 3 with `tickets` placements.
- Split board versions 4 through 10 with `works` placements.
- Ticket versions 1 through 6.

Legacy `body` becomes `description`, missing `type` becomes `goal`, missing `upstreamWaterLevels` becomes `{}`, missing `sessionId` becomes an empty string, and data without Workflow membership is assigned to the synthesized Root Workflow. Boards that do not store transition rules receive the profile's bootstrap rules once during migration, and boards without `autoMode` migrate with automatic mode disabled. Legacy Assignee strings become structured values without being treated as Agent Preset IDs. Non-empty legacy Project names become `legacyWorkspaceTitle` with an empty `workspaceId`; migration deliberately does not guess a DSH Workspace ID from a mutable title. IDs, placement order, timestamps, WaterLevels, and dependencies are preserved. Old split and combined formats are rewritten once with `feat(pavo): persist automatic mode` when write policy permits it.

The Host keeps `/_dddrop/kanban` and the browser snapshot's derived `cards` alias for already-loaded legacy clients. Canonical storage and current clients use Works.

## Architecture

The package has two faces mounted by one Cordis Loader row:

- The Host registers fenced same-origin JSON endpoints through `ctx.webServer`. `GitBoardRepository` uses an in-process queue and a Git-directory lock to serialize synchronization, validation, atomic writes, commits, and pushes across Host processes.
- `RepositoryController` owns the active repository, validates and atomically persists Settings changes, and restores a saved override on Host startup.
- The Host requires `workspaceRegistry`, `agents`, `agentPresets`, `agentDefaultModel`, and `sessionTitle` for manual and automatic Run operations. It optionally registers record-management Agent tools through `ctx.get('tools')`; those tools do not expose Run directly.
- The Client registers the `Pavo` tab in `conversation.view`, bundles `@xyflow/react` into its committed browser module, and registers the consolidated Pavo page in `settings.section`.

The browser bundle is committed at `lib/client.js` because DSH loads prebuilt client bundles. Rebuild after changing `src/client.js`:

```sh
pnpm install
node plugins/pavo/scripts/build-client.mjs
```

The build keeps the Harness React and ReactDOM instances external while embedding React Flow and its stylesheet into Pavo's client module.

## Configuration

Configure bootstrap and recovery defaults in the Web profile Cordis patch:

```yaml
- insert:
    - id: dddrop-pavo
      name: '@dddrop/dsh-plugin-pavo'
      config:
        repositoryPath: /absolute/path/to/dsh-data
        settingsPath: ~/.dsh/pavo/repository.json
        dataDirectory: kanban
        branch: main
        remote: origin
        autoPull: true
        autoPush: true
        initializeRepository: false
        pollIntervalMs: 3000
        pullIntervalMs: 5000
        columns:
          - id: backlog
            title: Backlog
            allowedTransitions: [ready]
          - id: ready
            title: Ready
            allowedTransitions: [backlog, in-progress]
          - id: in-progress
            title: In Progress
            allowedTransitions: [ready, review]
          - id: review
            title: Review
            allowedTransitions: [in-progress, done]
          - id: done
            title: Done
            allowedTransitions: [review, backlog]
```

`repositoryPath` remains a required bootstrap value. `settingsPath` defaults to `$DSH_HOME/pavo/repository.json` or `~/.dsh/pavo/repository.json`. The profile reads `PAVO_REPOSITORY_PATH`, falls back to deprecated `KANBAN_REPOSITORY_PATH`, and then uses `~/Development/dddrop.dsh.data`.

Profile `columns` are bootstrap and legacy-migration defaults only. Current boards persist each column's movement rules directly in `<repositoryPath>/<dataDirectory>/board.json`. For example, a Backlog column that may move to every other default column is stored as:

```json
{
  "id": "backlog",
  "title": "Backlog",
  "allowedTransitions": ["ready", "in-progress", "review", "done"],
  "order": 0
}
```

Open Settings → Pavo to change the repository path, managed data directory, branch, remote, synchronization flags, and polling intervals. The page also shows the sanitized DSH Workspace roster as read-only metadata; manage those Workspaces from the DSH sidebar. Pavo validates a candidate checkout before persisting it or replacing the active repository. If a saved override is unreadable, Pavo keeps profile defaults available for recovery and reports a warning.

Column IDs are stable persisted identifiers. Renaming a title or changing `allowedTransitions` is safe. Removing or changing an ID requires migrating every Work placement and transition reference first.

## Works, Workflows, and DSH Workspaces

Every new Work requires a non-empty `Title`, `type`, and an existing `workflowId`. `workspaceId`, `KEY`, `Description`, and `Assignee` may be empty. Existing compatibility clients may omit `workflowId`, which assigns the Work to Root. `WaterLevel` must be a non-negative decimal string without an exponent and has no configured upper bound. `ID` is generated by the Host and cannot be edited.

Every non-root Workflow requires a non-empty title and an existing parent Workflow. Pavo generates its immutable ID. Explicit reparenting is allowed only when it preserves a rooted, acyclic hierarchy. Work dependency cycles remain valid across Workflow boundaries because the Workflow hierarchy and Work dependency graph are separate structures.

Workspace identity belongs to DSH, not Pavo. Pavo stores only the optional stable `workspaceId` on each Work or template and resolves the current title from `workspaceRegistry`. Missing IDs remain valid references and are never cleared automatically. `KEY` is optional, user-defined, and need not be unique because `ID` is canonical.

## Git synchronization

The configured checkout must be on `branch` and must define `remote` when automatic pull or push is enabled. Authentication is delegated to local Git credential configuration.

For each mutation, Pavo:

1. Verifies that managed paths and the Git index are clean.
2. Pulls the configured remote and branch with `--ff-only`.
3. Reads the latest board and verifies the expected revision.
4. Applies and validates the explicit mutation.
5. Creates a detached temporary Git worktree from the current `HEAD`.
6. Writes, stages, and commits only managed board and Work files.
7. Pushes the detached commit explicitly to the configured remote branch.
8. Fast-forwards the primary checkout only after push success.
9. Removes and prunes the temporary worktree.

A stale browser or Agent revision returns HTTP 409. Pavo reports dirty paths, staged changes, non-fast-forward pulls, and failed pushes instead of overwriting, stashing, rebasing, force-pushing, or replaying intent.

## Installation

The repository Web profile declares this package in `profiles/web/plugins.json` and mounts it from `profiles/web/cordis.patch.yml`.

```sh
node scripts/sync-profile.mjs
```

Restart DSH Web after Host plugin or profile changes. The running Web process does not reload Host plugin source automatically.

## Security boundaries

- The endpoint uses a dedicated path outside DSH-owned `/api` and `/plugins` prefixes.
- It accepts JSON `POST` requests only, limits request bodies to 1 MiB, and requires same-origin access from a trusted Host. Repository changes additionally require browser same-origin Fetch Metadata headers.
- DSH and Pavo are local-user applications: another process running as the same OS account is inside the trust boundary.
- Repository settings are a code-execution trust boundary: Git configuration, credential helpers, transports, and content filters may execute programs.
- Candidate repository settings receive read-only validation before activation and are persisted with owner-only file permissions where supported.
- Git runs without a shell, with fixed argument arrays, bounded output, a timeout, and disabled hooks.
- Repository roots, managed directories, board files, Work files, and the settings file must not be symlinks.
- Git errors returned to the browser omit command stderr, remote URLs, and credentials.
