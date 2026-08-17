import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const packageRoot = new URL('../', import.meta.url)

test('declares a dual-face DSH package', async () => {
  const source = await readFile(new URL('package.json', packageRoot), 'utf8')
  const manifest = JSON.parse(source)

  assert.equal(manifest.name, '@dddrop/dsh-plugin-kanban')
  assert.equal(manifest.exports['.'], './src/index.js')
  assert.equal(manifest.exports['./client'], './lib/client.js')
  assert.equal(manifest.dsh.client.platform, 'web')
  assert.deepEqual(manifest.dsh.client.inject, [
    '@deepseek-ai/dsh-client-ui-conversation',
  ])
})

test('ships a DSH client module bundle', async () => {
  const bundle = await readFile(new URL('lib/client.js', packageRoot), 'utf8')

  assert.match(bundle, /window\.__ModuleLoader__\.load/)
  assert.match(bundle, /id: '@dddrop\/dsh-plugin-kanban'/)
  assert.match(bundle, /exports\.apply = plugin\.apply/)
  assert.match(bundle, /expectedRevision/)
  assert.match(bundle, /Git-backed · auto-sync on/)
  assert.match(bundle, /optimisticSnapshot/)
  assert.match(bundle, /ddk-snackbar/)
  assert.match(bundle, /Move not saved/)
  assert.doesNotMatch(bundle, /[\p{Script=Han}]/u)
})
