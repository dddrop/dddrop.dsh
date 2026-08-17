import { lstat, readFile, readlink } from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

import {
  filesEqual,
  isMainModule,
  pathExists,
  presetSourcePath,
  repositoryRoot,
  requiredRepositoryPaths,
  resolvePluginPath,
  resolveProfileManifest,
  resolveRuntimePaths,
  webProfilePatchSourcePath,
} from './lib/repository.mjs'

function result(level, message) {
  return { level, message }
}

async function inspectPresetLink(runtime) {
  if (!(await pathExists(runtime.presetRoot))) {
    return result(
      'warning',
      `DSH preset root is not linked: ${runtime.presetRoot}`,
    )
  }

  const status = await lstat(runtime.presetRoot)

  if (!status.isSymbolicLink()) {
    return result(
      'warning',
      `DSH preset root exists but is not a symbolic link: ${runtime.presetRoot}`,
    )
  }

  const linkedPath = await readlink(runtime.presetRoot)
  const resolvedPath = path.resolve(path.dirname(runtime.presetRoot), linkedPath)

  if (resolvedPath !== presetSourcePath) {
    return result(
      'warning',
      `DSH preset root points to a different path: ${resolvedPath}`,
    )
  }

  return result('pass', `DSH preset root points to ${presetSourcePath}`)
}

async function inspectPluginLink(profileDirectory, pluginPath) {
  const sourcePath = resolvePluginPath(pluginPath)
  const packagePath = path.join(sourcePath, 'package.json')
  if (!(await pathExists(packagePath))) {
    return result('error', `Plugin ${pluginPath} package is missing.`)
  }

  const packageManifest = JSON.parse(await readFile(packagePath, 'utf8'))
  const targetPath = path.join(
    profileDirectory,
    'node_modules',
    ...packageManifest.name.split('/'),
  )

  if (!(await pathExists(targetPath))) {
    return result(
      'warning',
      `Plugin ${packageManifest.name} is not linked into the Web profile.`,
    )
  }

  const status = await lstat(targetPath)
  if (!status.isSymbolicLink()) {
    return result(
      'warning',
      `Plugin ${packageManifest.name} exists in the Web profile but is not linked.`,
    )
  }

  const linkedPath = await readlink(targetPath)
  const resolvedPath = path.resolve(path.dirname(targetPath), linkedPath)
  if (resolvedPath !== sourcePath) {
    return result(
      'warning',
      `Plugin ${packageManifest.name} points to a different path: ${resolvedPath}`,
    )
  }

  return result('pass', `Plugin ${packageManifest.name} is linked.`)
}

function inspectDshCommand() {
  const command = spawnSync('dsh', ['--version'], { encoding: 'utf8' })

  if (command.error?.code === 'ENOENT') {
    return result('warning', 'The dsh command is not available on PATH.')
  }

  if (command.error || command.status !== 0) {
    return result('warning', 'The dsh command did not report a version.')
  }

  const version = command.stdout.trim() || 'available'
  return result('pass', `DSH command: ${version}`)
}

export async function runDoctor() {
  const results = []

  for (const relativePath of requiredRepositoryPaths) {
    const absolutePath = path.join(repositoryRoot, relativePath)
    results.push(
      result(
        (await pathExists(absolutePath)) ? 'pass' : 'error',
        `${relativePath}: ${
          (await pathExists(absolutePath)) ? 'present' : 'missing'
        }`,
      ),
    )
  }

  results.push(inspectDshCommand())

  let manifest
  try {
    manifest = await resolveProfileManifest()
    results.push(result('pass', 'Web profile plugin manifest is valid.'))
  } catch (error) {
    results.push(result('error', error.message))
  }

  if (manifest) {
    for (const pluginPath of manifest.plugins) {
      const packagePath = path.join(resolvePluginPath(pluginPath), 'package.json')
      results.push(
        result(
          (await pathExists(packagePath)) ? 'pass' : 'error',
          `Plugin ${pluginPath}: ${
            (await pathExists(packagePath)) ? 'package found' : 'package missing'
          }`,
        ),
      )
    }

    const runtime = resolveRuntimePaths(process.env, manifest.profile)
    results.push(await inspectPresetLink(runtime))

    if (!(await pathExists(runtime.profileDirectory))) {
      results.push(
        result(
          'warning',
          `DSH profile directory is not initialized: ${runtime.profileDirectory}`,
        ),
      )
    } else {
      for (const pluginPath of manifest.plugins) {
        results.push(
          await inspectPluginLink(runtime.profileDirectory, pluginPath),
        )
      }

      if (await filesEqual(webProfilePatchSourcePath, runtime.profilePatch)) {
        results.push(result('pass', 'Web profile patch is synchronized.'))
      } else {
        results.push(
          result(
            'warning',
            `Web profile patch differs from ${runtime.profilePatch}`,
          ),
        )
      }
    }
  }

  return results
}

function parseArguments(argumentsList) {
  const allowed = new Set(['--strict'])
  const unknown = argumentsList.filter((argument) => !allowed.has(argument))

  if (unknown.length > 0) {
    throw new Error(`Unknown argument: ${unknown.join(', ')}`)
  }

  return { strict: argumentsList.includes('--strict') }
}

if (isMainModule(import.meta.url)) {
  try {
    const { strict } = parseArguments(process.argv.slice(2))
    const results = await runDoctor()
    const labels = { error: 'ERROR', pass: 'PASS', warning: 'WARN' }

    for (const item of results) {
      console.log(`[${labels[item.level]}] ${item.message}`)
    }

    const errors = results.filter((item) => item.level === 'error').length
    const warnings = results.filter((item) => item.level === 'warning').length

    console.log(`Doctor summary: ${errors} error(s), ${warnings} warning(s).`)

    if (errors > 0 || (strict && warnings > 0)) {
      process.exitCode = 1
    }
  } catch (error) {
    console.error(`Doctor failed: ${error.message}`)
    process.exitCode = 1
  }
}
