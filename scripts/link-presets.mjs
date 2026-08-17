import {
  lstat,
  mkdir,
  readlink,
  readdir,
  rm,
  symlink,
} from 'node:fs/promises'
import path from 'node:path'

import {
  isMainModule,
  presetSourcePath,
  resolveRuntimePaths,
} from './lib/repository.mjs'

async function readPathStatus(targetPath) {
  try {
    return await lstat(targetPath)
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return undefined
    }
    throw error
  }
}

async function pointsToSource(targetPath) {
  const linkedPath = await readlink(targetPath)
  const resolvedLinkedPath = path.resolve(path.dirname(targetPath), linkedPath)
  return resolvedLinkedPath === presetSourcePath
}

export async function linkPresets({ replaceEmpty = false } = {}) {
  const { presetRoot } = resolveRuntimePaths()

  await mkdir(presetSourcePath, { recursive: true })
  await mkdir(path.dirname(presetRoot), { recursive: true })

  const status = await readPathStatus(presetRoot)

  if (status?.isSymbolicLink()) {
    if (await pointsToSource(presetRoot)) {
      return { changed: false, presetRoot, status: 'already-linked' }
    }

    throw new Error(
      `Refusing to replace the existing preset symlink at ${presetRoot}.`,
    )
  }

  if (status?.isDirectory()) {
    const entries = await readdir(presetRoot)

    if (!replaceEmpty || entries.length > 0) {
      throw new Error(
        `Refusing to replace the existing preset directory at ${presetRoot}. ` +
          'Move its contents first, or pass --replace-empty for an empty directory.',
      )
    }

    await rm(presetRoot, { recursive: true })
  } else if (status) {
    throw new Error(
      `Refusing to replace the existing filesystem entry at ${presetRoot}.`,
    )
  }

  await symlink(
    presetSourcePath,
    presetRoot,
    process.platform === 'win32' ? 'junction' : 'dir',
  )

  return { changed: true, presetRoot, status: 'linked' }
}

function parseArguments(argumentsList) {
  const allowed = new Set(['--replace-empty'])
  const unknown = argumentsList.filter((argument) => !allowed.has(argument))

  if (unknown.length > 0) {
    throw new Error(`Unknown argument: ${unknown.join(', ')}`)
  }

  return { replaceEmpty: argumentsList.includes('--replace-empty') }
}

if (isMainModule(import.meta.url)) {
  try {
    const result = await linkPresets(parseArguments(process.argv.slice(2)))
    const verb = result.changed ? 'Linked' : 'Verified'
    console.log(`${verb} DSH presets: ${result.presetRoot} -> ${presetSourcePath}`)
  } catch (error) {
    console.error(`Preset linking failed: ${error.message}`)
    process.exitCode = 1
  }
}
