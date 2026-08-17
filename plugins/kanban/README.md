# `@dddrop/dsh-plugin-kanban`

A Git-backed, automatically synchronized Kanban board for the DeepSeek Harness Web interface.

## Behavior

- Adds a `Kanban` conversation tab.
- Uses one global board shared by every DSH workspace and session.
- Stores the board at `<repositoryPath>/<dataDirectory>/board.json`.
- Pulls its configured Git remote with `--ff-only` and pushes explicit branch updates.
- Creates one semantic Git commit for every card addition, title edit, move, or deletion.
- Renders the local committed board immediately, then synchronizes Git in the background so network latency does not block the loading state.
- Polls for updates so separate browser tabs and sessions converge automatically.
- Enforces configured card-movement rules on both the client and Host.

The previous workspace-scoped domain data and legacy workspace `kanban.json` files are intentionally ignored.

## Architecture

The package has two faces mounted by one Cordis Loader row:

- The Host entry registers a fenced same-origin JSON endpoint through `ctx.webServer`. A repository manager uses both an in-process queue and a Git-directory lock to serialize synchronization, validation, atomic file writes, commits, and pushes across Host processes.
- The Client entry registers the `Kanban` tab in `conversation.view`, polls the Host endpoint, and sends an expected board revision with every mutation.

The browser bundle is committed at `lib/client.js` because DSH loads prebuilt client bundles. Rebuild it after changing `src/client.js`:

```sh
node plugins/kanban/scripts/build-client.mjs
```

## Configuration

Configure the plugin in the Web profile Cordis patch:

```yaml
- insert:
    - id: dddrop-kanban
      name: '@dddrop/dsh-plugin-kanban'
      config:
        repositoryPath: /absolute/path/to/dsh-data
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
            allowedTransitions: [review]
```

`repositoryPath` is required. The repository patch in this project reads `KANBAN_REPOSITORY_PATH` when set and otherwise uses `~/Development/dddrop.dsh.data`.

Column IDs are stable persisted identifiers. Renaming a column title is safe. Removing or changing an ID requires migrating every card that references it before the plugin can read the board.

The configured repository is a full code-execution trust boundary: repository and system Git configuration, credential helpers, transports, and content filters may execute programs. The plugin additionally disables Git hooks for commands it invokes, stages only the board file, and refuses to commit while the Git index or board path contains unrelated pending state.

## Git synchronization

The configured checkout must be on `branch` and must define `remote` when either automatic pull or automatic push is enabled. Authentication is delegated to the local Git credential setup.

The synchronization sequence for a mutation is:

1. Verify that the board path and Git index are clean.
2. Pull the configured remote and branch with `--ff-only`.
3. Read the latest board and verify the client's expected revision.
4. Apply and validate the mutation.
5. Create a detached temporary Git worktree from the current `HEAD`.
6. Atomically write, stage, and commit the board only inside that worktree.
7. Push the detached commit explicitly to the configured remote branch.
8. Fast-forward the primary local checkout only after the push succeeds.
9. Remove and prune the temporary worktree.

A stale browser revision or remote race returns HTTP 409. A dirty board path, staged Git changes, non-fast-forward pull, or failed push is reported in the Kanban UI instead of being overwritten, stashed, rebased, or force-pushed. A rejected or unavailable push leaves the primary local branch and board file unchanged, so the same mutation can be retried safely. If the push response is ambiguous, Kanban fetches the remote tip and treats the mutation as successful only when that tip is the detached commit it created.

## Installation

The repository Web profile declares this package in `profiles/web/plugins.json` and mounts it from `profiles/web/cordis.patch.yml`.

Apply the repository configuration with:

```sh
node scripts/sync-profile.mjs
```

Restart DSH Web after Host plugin or profile configuration changes. The running Web process does not reload Host plugin source automatically.

## Security boundaries

- The endpoint uses a dedicated path outside DSH-owned `/api` and `/plugins` prefixes.
- It accepts JSON `POST` requests only and limits request bodies to 64 KiB.
- It permits loopback and deployment-configured trusted Host values, rejects cross-site fetches, and requires Origin to match Host when present.
- Every mutation is validated against the latest repository revision and configured workflow.
- Git is invoked without a shell, with fixed argument arrays, bounded output, a timeout, and disabled hooks.
- The configured repository root, data directory, and board file must not be symlinks.
- Git errors returned to the browser do not include command stderr, remote URLs, or credentials.
