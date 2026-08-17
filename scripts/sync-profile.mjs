import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

import {
  filesEqual,
  isMainModule,
  pathExists,
  resolvePluginPath,
  resolveProfileManifest,
  resolveRuntimePaths,
  webProfilePatchSourcePath,
} from './lib/repository.mjs'

async function installPlugin(profile, pluginPath) {
  const absolutePluginPath = resolvePluginPath(pluginPath)
  const packagePath = path.join(absolutePluginPath, 'package.json')

  if (!(await pathExists(packagePath))) {
    throw new Error(
      `Plugin path ${pluginPath} does not contain a package.json file.`,
    )
  }

  const result = spawnSync(
    'dsh',
    ['plugin', '--profile', profile, 'add', `link:${absolutePluginPath}`],
    { encoding: 'utf8', stdio: 'inherit' },
  )

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    throw new Error(
      `DSH failed to install the linked plugin at ${absolutePluginPath}.`,
    )
  }
}

export async function syncProfile({ installPlugins = true } = {}) {
  const manifest = await resolveProfileManifest()
  const runtime = resolveRuntimePaths(process.env, manifest.profile)

  if (!(await pathExists(runtime.profileDirectory))) {
    throw new Error(
      `The DSH profile directory does not exist at ${runtime.profileDirectory}. ` +
        `Initialize it with dsh --profile ${manifest.profile} --dump-config first.`,
    )
  }

  if (installPlugins) {
    for (const pluginPath of manifest.plugins) {
      await installPlugin(manifest.profile, pluginPath)
    }
  }

  await mkdir(runtime.profileDirectory, { recursive: true })

  const changed = !(await filesEqual(
    webProfilePatchSourcePath,
    runtime.profilePatch,
  ))

  if (changed && (await pathExists(runtime.profilePatch))) {
    await copyFile(runtime.profilePatch, `${runtime.profilePatch}.bak`)
  }

  if (changed) {
    await copyFile(webProfilePatchSourcePath, runtime.profilePatch)
  }

  return {
    changed,
    installedPlugins: installPlugins ? manifest.plugins.length : 0,
    profile: manifest.profile,
    profilePatch: runtime.profilePatch,
  }
}

function parseArguments(argumentsList) {
  const allowed = new Set(['--skip-plugins'])
  const unknown = argumentsList.filter((argument) => !allowed.has(argument))

  if (unknown.length > 0) {
    throw new Error(`Unknown argument: ${unknown.join(', ')}`)
  }

  return { installPlugins: !argumentsList.includes('--skip-plugins') }
}

if (isMainModule(import.meta.url)) {
  try {
    const result = await syncProfile(parseArguments(process.argv.slice(2)))
    const action = result.changed ? 'Synchronized' : 'Verified'
    console.log(`${action} DSH profile patch: ${result.profilePatch}`)
    console.log(`Linked plugin packages processed: ${result.installedPlugins}`)
  } catch (error) {
    console.error(`Profile synchronization failed: ${error.message}`)
    process.exitCode = 1
  }
}
