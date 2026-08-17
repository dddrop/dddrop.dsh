import { constants } from 'node:fs'
import { access, readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))

export const repositoryRoot = path.resolve(currentDirectory, '../..')
export const presetSourcePath = path.join(repositoryRoot, 'agent-presets')
export const webProfileSourcePath = path.join(repositoryRoot, 'profiles', 'web')
export const webProfilePatchSourcePath = path.join(
  webProfileSourcePath,
  'cordis.patch.yml',
)
export const webProfileManifestPath = path.join(
  webProfileSourcePath,
  'plugins.json',
)

export const requiredRepositoryPaths = [
  '.gitignore',
  'AGENTS.md',
  'CONTRIBUTING.md',
  'README.md',
  'package.json',
  'pnpm-workspace.yaml',
  'agent-presets/README.md',
  'plugins/README.md',
  'profiles/web/README.md',
  'profiles/web/cordis.patch.yml',
  'profiles/web/plugins.json',
]

export function resolveDshHome(environment = process.env) {
  const configuredHome = environment.DSH_HOME?.trim()

  if (!configuredHome) {
    return path.join(homedir(), '.dsh')
  }

  if (configuredHome === '~') {
    return homedir()
  }

  if (configuredHome.startsWith(`~${path.sep}`)) {
    return path.join(homedir(), configuredHome.slice(2))
  }

  return path.resolve(configuredHome)
}

export function resolveRuntimePaths(environment = process.env, profile = 'web') {
  const home = resolveDshHome(environment)
  const profileDirectory = path.join(home, 'profiles', profile)

  return {
    home,
    presetRoot: path.join(home, '.agent-presets'),
    profileDirectory,
    profilePatch: path.join(profileDirectory, 'cordis.patch.yml'),
  }
}

export async function pathExists(targetPath) {
  try {
    await access(targetPath, constants.F_OK)
    return true
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return false
    }
    throw error
  }
}

export async function filesEqual(leftPath, rightPath) {
  if (!(await pathExists(leftPath)) || !(await pathExists(rightPath))) {
    return false
  }

  const [left, right] = await Promise.all([
    readFile(leftPath),
    readFile(rightPath),
  ])

  return left.equals(right)
}

export async function resolveProfileManifest(
  manifestPath = webProfileManifestPath,
) {
  const rawManifest = await readFile(manifestPath, 'utf8')
  const manifest = JSON.parse(rawManifest)

  if (
    manifest === null ||
    typeof manifest !== 'object' ||
    Array.isArray(manifest)
  ) {
    throw new TypeError('The Web profile plugin manifest must be an object.')
  }

  if (
    typeof manifest.profile !== 'string' ||
    !/^[a-z0-9][a-z0-9-]*$/.test(manifest.profile)
  ) {
    throw new TypeError(
      'The Web profile plugin manifest must define a valid profile ID.',
    )
  }

  if (
    !Array.isArray(manifest.plugins) ||
    manifest.plugins.some(
      (pluginPath) =>
        typeof pluginPath !== 'string' || pluginPath.trim().length === 0,
    )
  ) {
    throw new TypeError(
      'The Web profile plugin manifest must define plugins as non-empty path strings.',
    )
  }

  return {
    profile: manifest.profile,
    plugins: manifest.plugins.map((pluginPath) => pluginPath.trim()),
  }
}

export function resolvePluginPath(pluginPath) {
  return path.resolve(webProfileSourcePath, pluginPath)
}

export function isMainModule(moduleUrl) {
  if (!process.argv[1]) {
    return false
  }

  return pathToFileURL(path.resolve(process.argv[1])).href === moduleUrl
}
