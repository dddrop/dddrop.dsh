import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import {
  assertExactVersion,
  expectedVersion,
  parseArguments,
  patchPath,
} from '../scripts/apply-dsh-shell-patch.mjs'

test('parses a version-locked shell patch invocation', () => {
  const options = parseArguments([
    '--source',
    './upstream',
    '--install',
    './runtime',
    '--skip-deps',
  ])

  assert.equal(options.source.endsWith('/upstream'), true)
  assert.equal(options.install.endsWith('/runtime'), true)
  assert.equal(options.skipDeps, true)
  assert.equal(options.check, false)
})

test('requires a source and rejects unsupported combinations', () => {
  assert.throws(() => parseArguments([]), /--source is required/)
  assert.throws(
    () => parseArguments(['--source', '.', '--check', '--skip-deps']),
    /--skip-deps has no effect/,
  )
  assert.throws(() => parseArguments(['--unknown']), /Unknown argument/)
})

test('accepts only the exact supported DSH release', () => {
  assert.doesNotThrow(() => assertExactVersion(expectedVersion, 'source'))
  assert.throws(
    () => assertExactVersion('0.1.0-rc.8', 'source'),
    /expected exactly 0\.1\.0-rc\.7/,
  )
})

test('ships a complete RC7 compact activity patch', async () => {
  const patch = await readFile(patchPath, 'utf8')

  assert.match(patch, /ActivityCluster\.tsx/)
  assert.match(patch, /activity-groups\.ts/)
  assert.match(patch, /conversation\.chat\.activity\.reasoningDetail/)
  assert.match(patch, /conversation\.chat\.activity\.toolDetail/)
  assert.match(patch, /activity-cluster\.client\.spec\.tsx/)
})
