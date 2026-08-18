import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const packageRoot = new URL('../', import.meta.url)

test('declares a dual-face DSH package', async () => {
  const source = await readFile(new URL('package.json', packageRoot), 'utf8')
  const manifest = JSON.parse(source)

  assert.equal(manifest.name, '@dddrop/dsh-plugin-pavo')
  assert.equal(manifest.exports['.'], './src/index.js')
  assert.equal(manifest.exports['./client'], './lib/client.js')
  assert.equal(manifest.dsh.client.platform, 'web')
  assert.deepEqual(manifest.dsh.client.inject, [
    '@deepseek-ai/dsh-client-ui-conversation',
    '@deepseek-ai/dsh-client-ui-settings',
  ])
  assert.equal(manifest.devDependencies['@xyflow/react'], '12.11.3')
  assert.equal(manifest.devDependencies.esbuild, '0.28.2')
  assert.equal(manifest.peerDependencies['@deepseek-ai/dsh-tools'], undefined)
})

test('ships a DSH client module bundle', async () => {
  const bundle = await readFile(new URL('lib/client.js', packageRoot), 'utf8')

  assert.match(bundle, /window\.__ModuleLoader__\.load/)
  assert.match(bundle, /id: '@dddrop\/dsh-plugin-pavo'/)
  assert.match(bundle, /exports\.apply = plugin\.apply/)
  assert.match(bundle, /expectedRevision/)
  assert.match(bundle, /Git-backed · auto-sync on/)
  assert.match(bundle, /optimisticSnapshot/)
  assert.match(bundle, /pavo-snackbar/)
  assert.match(bundle, /Move not saved/)
  assert.match(bundle, /settings\.section/)
  assert.match(bundle, /Flow Canvas/)
  assert.match(bundle, /ROOT_WORKFLOW_ID = 'root'/)
  assert.match(bundle, /New Workflow/)
  assert.match(bundle, /Create Workflow/)
  assert.match(bundle, /Open Workflow/)
  assert.match(bundle, /pavo-flow-breadcrumbs/)
  assert.match(bundle, /aria-current/)
  assert.match(bundle, /Interactive Work dependency canvas/)
  assert.match(bundle, /pavo-work-node/)
  assert.match(bundle, /pavo-workflow-node/)
  assert.match(bundle, /flow-positions:v2/)
  assert.match(bundle, /react-flow__renderer/)
  assert.match(bundle, /Save repository/)
  assert.match(bundle, /repositorySettings/)
  assert.match(bundle, /WaterLevel/)
  assert.match(bundle, /Description/)
  assert.match(bundle, /No project/)
  assert.match(bundle, /pavo-drawer-backdrop/)
  assert.match(bundle, /aria-modal/)
  assert.match(bundle, /Create Work/)
  assert.match(bundle, /Work details/)
  assert.match(bundle, /Goal Work/)
  assert.match(bundle, /Ongoing Work/)
  assert.match(bundle, /Upstream Works/)
  assert.match(bundle, /cycles are allowed/)
  assert.match(bundle, /Save changes/)
  assert.doesNotMatch(bundle, /pavo-edit-form/)
  assert.doesNotMatch(bundle, /[\p{Script=Han}]/u)
})
