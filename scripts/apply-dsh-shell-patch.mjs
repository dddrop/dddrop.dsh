import { copyFile, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { isMainModule, pathExists, repositoryRoot } from './lib/repository.mjs'

export const expectedVersion = '0.1.0-rc.7'
export const patchPath = path.join(
  repositoryRoot,
  'patches',
  'dsh-rc7-compact-activity.patch',
)

const packageTargets = [
  {
    name: '@deepseek-ai/dsh-client-ui-conversation',
    source: 'packages/client/ui-conversation/lib/client.js',
  },
  {
    name: '@deepseek-ai/dsh-client-ui-tool',
    source: 'packages/client/ui-tool/lib/client.js',
  },
]

function packagePath(root, packageName, suffix = '') {
  return path.join(root, 'node_modules', ...packageName.split('/'), suffix)
}

async function readManifest(manifestPath, label) {
  let content
  try {
    content = await readFile(manifestPath, 'utf8')
  } catch (error) {
    throw new Error(`${label} manifest is unavailable at ${manifestPath}: ${error.message}`)
  }

  try {
    return JSON.parse(content)
  } catch (error) {
    throw new Error(`${label} manifest is invalid JSON: ${error.message}`)
  }
}

export function assertExactVersion(version, label) {
  if (version !== expectedVersion) {
    throw new Error(
      `${label} version ${String(version)} is unsupported; expected exactly ${expectedVersion}.`,
    )
  }
}

export function parseArguments(argumentsList) {
  const options = {
    check: false,
    install: undefined,
    skipDeps: false,
    source: undefined,
  }

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index]
    if (argument === '--check') {
      options.check = true
      continue
    }
    if (argument === '--skip-deps') {
      options.skipDeps = true
      continue
    }
    if (argument === '--source' || argument === '--install') {
      const value = argumentsList[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`${argument} requires a path.`)
      }
      options[argument === '--source' ? 'source' : 'install'] = path.resolve(value)
      index += 1
      continue
    }
    throw new Error(`Unknown argument: ${argument}`)
  }

  if (!options.source) {
    throw new Error('--source is required and must point to an RC7 source checkout.')
  }
  if (options.check && options.skipDeps) {
    throw new Error('--skip-deps has no effect with --check and must be removed.')
  }

  return options
}

function run(command, args, { cwd, allowFailure = false, env = process.env } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: allowFailure ? 'ignore' : 'inherit',
    })
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (code === 0) {
        resolve(true)
        return
      }
      if (allowFailure) {
        resolve(false)
        return
      }
      reject(
        new Error(
          `${command} ${args.join(' ')} failed${signal ? ` with signal ${signal}` : ` with exit code ${code}`}.`,
        ),
      )
    })
  })
}

async function inspectPatchState(source) {
  const forward = await run(
    'git',
    ['apply', '--check', '--whitespace=error-all', patchPath],
    { cwd: source, allowFailure: true },
  )
  if (forward) return 'ready'

  const reverse = await run(
    'git',
    ['apply', '--reverse', '--check', '--whitespace=error-all', patchPath],
    { cwd: source, allowFailure: true },
  )
  if (reverse) return 'applied'

  throw new Error(
    'The compact-activity patch neither applies nor reverses cleanly. ' +
      'The source is modified, incomplete, or not the supported RC7 tree.',
  )
}

async function verifySource(source) {
  const manifest = await readManifest(path.join(source, 'package.json'), 'DSH source')
  assertExactVersion(manifest.version, 'DSH source')

  if (!(await pathExists(path.join(source, '.git')))) {
    throw new Error(`DSH source is not a Git checkout: ${source}`)
  }
  if (!(await pathExists(patchPath))) {
    throw new Error(`Patch artifact is missing: ${patchPath}`)
  }

  return inspectPatchState(source)
}

async function verifyInstall(install) {
  for (const target of packageTargets) {
    const manifestPath = packagePath(install, target.name, 'package.json')
    const manifest = await readManifest(manifestPath, target.name)
    assertExactVersion(manifest.version, target.name)
  }
}

function packageManagerArgs(...args) {
  return ['--yes', 'pnpm@11.7.0', ...args]
}

async function buildAndVerify(source, { skipDeps }) {
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx'
  const npmCache = process.env.DSH_PATCH_NPM_CACHE || path.join(tmpdir(), 'npm-cache-dsh')
  const env = { ...process.env, npm_config_cache: npmCache }
  const invoke = (...args) => run(npx, packageManagerArgs(...args), { cwd: source, env })

  if (!skipDeps) {
    await invoke('install', '--frozen-lockfile', '--ignore-scripts')
  }

  await invoke('run', 'build:lib:host')
  await invoke('run', 'typecheck:contracts-ready')
  await invoke(
    'exec',
    'tsx',
    'scripts/run-oxlint.ts',
    'packages/client/ui-conversation/src/client/chat/ActivityCluster.tsx',
    'packages/client/ui-conversation/src/client/chat/activity-groups.ts',
    'packages/client/ui-conversation/src/client/chat/ChatNodeSeat.tsx',
    'packages/client/ui-conversation/src/client/chat/ChatView.tsx',
    'packages/client/ui-conversation/src/client/contract/slots.ts',
    'packages/client/ui-conversation/src/client/apply.ts',
    'packages/client/ui-conversation/src/client/locales.ts',
    'packages/client/ui-conversation/tests/activity-groups.client.spec.ts',
    'packages/client/ui-conversation/tests/activity-cluster.client.spec.tsx',
    'packages/client/ui-tool/src/client/apply.ts',
    'packages/client/ui-tool/src/client/contract/slots.ts',
  )
  await invoke(
    'exec',
    'vitest',
    'run',
    'packages/client/ui-conversation/tests/activity-groups.client.spec.ts',
    'packages/client/ui-conversation/tests/activity-cluster.client.spec.tsx',
    'packages/client/ui-conversation/tests/reasoning-row.client.spec.tsx',
    'packages/client/ui-tool/tests/tool-call-tree.client.spec.tsx',
  )
  await invoke(
    '--filter',
    '@deepseek-ai/dsh-client-ui-conversation',
    'exec',
    'tsdown',
    '--env.DSH_BUILD_FACE',
    'client',
  )
  await invoke(
    '--filter',
    '@deepseek-ai/dsh-client-ui-tool',
    'exec',
    'tsdown',
    '--env.DSH_BUILD_FACE',
    'client',
  )
}

async function deploy(source, install) {
  await verifyInstall(install)

  const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
  const backupRoot = path.join(install, '.dsh-patch-backups', timestamp)
  await mkdir(backupRoot, { recursive: true })

  for (const target of packageTargets) {
    const sourceBundle = path.join(source, target.source)
    const targetBundle = packagePath(install, target.name, path.join('lib', 'client.js'))
    if (!(await pathExists(sourceBundle))) {
      throw new Error(`Built bundle is missing: ${sourceBundle}`)
    }

    const backupBundle = path.join(backupRoot, ...target.name.split('/'), 'client.js')
    await mkdir(path.dirname(backupBundle), { recursive: true })
    await copyFile(targetBundle, backupBundle)
    await copyFile(sourceBundle, targetBundle)
  }

  return backupRoot
}

export async function applyDshShellPatch(options) {
  const state = await verifySource(options.source)

  if (options.install) {
    await verifyInstall(options.install)
  }

  if (options.check) {
    return { backup: undefined, state }
  }

  if (state === 'ready') {
    await run(
      'git',
      ['apply', '--whitespace=error-all', patchPath],
      { cwd: options.source },
    )
  }

  await buildAndVerify(options.source, options)
  const backup = options.install
    ? await deploy(options.source, options.install)
    : undefined

  return { backup, state: state === 'ready' ? 'applied' : state }
}

if (isMainModule(import.meta.url)) {
  try {
    const options = parseArguments(process.argv.slice(2))
    const result = await applyDshShellPatch(options)
    console.log(`Compact activity patch state: ${result.state}`)
    if (options.check) {
      console.log('Compatibility check completed without changing source or installation files.')
    } else if (options.install) {
      console.log(`RC7 bundles deployed. Backup: ${result.backup}`)
      console.log('Refresh the existing DSH Web page after restarting the RC7 process.')
    } else {
      console.log('RC7 source patched, validated, and built; no installation target was changed.')
    }
  } catch (error) {
    console.error(`DSH shell patch failed: ${error.message}`)
    process.exitCode = 1
  }
}
