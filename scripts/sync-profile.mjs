import {
  copyFile,
  lstat,
  mkdir,
  readFile,
  readlink,
  symlink,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'

import {
  filesEqual,
  isMainModule,
  pathExists,
  resolvePluginPath,
  resolveProfileManifest,
  resolveRuntimePaths,
  webProfilePatchSourcePath,
} from './lib/repository.mjs'

async function readPathStatus(targetPath) {
  try {
    return await lstat(targetPath)
  } catch (error) {
    if (error?.code === 'ENOENT') return undefined
    throw error
  }
}

function packageTargetPath(profileDirectory, packageName) {
  const parts = packageName.split('/')
  const valid = packageName.startsWith('@')
    ? parts.length === 2 && parts.every((part) => part.length > 1)
    : parts.length === 1 && parts[0].length > 0

  if (!valid || parts.some((part) => part === '.' || part === '..')) {
    throw new Error(`Plugin package name is invalid: ${packageName}`)
  }

  return path.join(profileDirectory, 'node_modules', ...parts)
}

async function linkPlugin(profileDirectory, pluginPath) {
  const absolutePluginPath = resolvePluginPath(pluginPath)
  const packagePath = path.join(absolutePluginPath, 'package.json')

  if (!(await pathExists(packagePath))) {
    throw new Error(
      `Plugin path ${pluginPath} does not contain a package.json file.`,
    )
  }

  const packageManifest = JSON.parse(await readFile(packagePath, 'utf8'))
  if (typeof packageManifest.name !== 'string') {
    throw new Error(`Plugin path ${pluginPath} does not define a package name.`)
  }

  const targetPath = packageTargetPath(
    profileDirectory,
    packageManifest.name,
  )
  const status = await readPathStatus(targetPath)

  if (status?.isSymbolicLink()) {
    const linkedPath = await readlink(targetPath)
    const resolvedPath = path.resolve(path.dirname(targetPath), linkedPath)

    if (resolvedPath !== absolutePluginPath) {
      throw new Error(
        `Plugin package ${packageManifest.name} is linked to ${resolvedPath}.`,
      )
    }

    return {
      changed: false,
      name: packageManifest.name,
      source: absolutePluginPath,
    }
  }

  if (status) {
    throw new Error(
      `Refusing to replace the existing plugin package at ${targetPath}.`,
    )
  }

  await mkdir(path.dirname(targetPath), { recursive: true })
  await symlink(
    absolutePluginPath,
    targetPath,
    process.platform === 'win32' ? 'junction' : 'dir',
  )

  return {
    changed: true,
    name: packageManifest.name,
    source: absolutePluginPath,
  }
}

async function updateProfileDependencies(profileDirectory, plugins) {
  const packagePath = path.join(profileDirectory, 'package.json')
  const profileManifest = JSON.parse(await readFile(packagePath, 'utf8'))
  const dependencies = { ...profileManifest.dependencies }
  let changed = false

  for (const plugin of plugins) {
    const specifier = `link:${plugin.source}`
    if (dependencies[plugin.name] !== specifier) {
      dependencies[plugin.name] = specifier
      changed = true
    }
  }

  if (!changed) return false

  profileManifest.dependencies = Object.fromEntries(
    Object.entries(dependencies).sort(([left], [right]) =>
      left.localeCompare(right),
    ),
  )
  await writeFile(packagePath, `${JSON.stringify(profileManifest, null, 2)}\n`)
  return true
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

  const plugins = []
  if (installPlugins) {
    for (const pluginPath of manifest.plugins) {
      plugins.push(await linkPlugin(runtime.profileDirectory, pluginPath))
    }
    await updateProfileDependencies(runtime.profileDirectory, plugins)
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
    installedPlugins: plugins.length,
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
