import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'

import {
  repositoryRoot,
  requiredRepositoryPaths,
  resolveProfileManifest,
} from '../scripts/lib/repository.mjs'

test('required repository paths exist', async () => {
  await Promise.all(
    requiredRepositoryPaths.map((relativePath) =>
      access(new URL(`../${relativePath}`, import.meta.url)),
    ),
  )
})

test('web profile manifest is valid', async () => {
  const manifest = await resolveProfileManifest()

  assert.equal(manifest.profile, 'web')
  assert.deepEqual(manifest.plugins, [
    '../../plugins/kanban',
    '../../plugins/theme-blue',
  ])
})

test('repository package is private', async () => {
  const packageFile = await readFile(
    new URL('../package.json', import.meta.url),
    'utf8',
  )
  const packageJson = JSON.parse(packageFile)

  assert.equal(packageJson.private, true)
  assert.equal(packageJson.type, 'module')
  assert.equal(typeof repositoryRoot, 'string')
})
