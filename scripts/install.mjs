import { isMainModule } from './lib/repository.mjs'
import { linkPresets } from './link-presets.mjs'
import { syncProfile } from './sync-profile.mjs'

export async function installRepository({
  installPlugins = true,
  replaceEmpty = false,
} = {}) {
  const presetResult = await linkPresets({ replaceEmpty })
  const profileResult = await syncProfile({ installPlugins })

  return { presetResult, profileResult }
}

function parseArguments(argumentsList) {
  const allowed = new Set(['--replace-empty', '--skip-plugins'])
  const unknown = argumentsList.filter((argument) => !allowed.has(argument))

  if (unknown.length > 0) {
    throw new Error(`Unknown argument: ${unknown.join(', ')}`)
  }

  return {
    installPlugins: !argumentsList.includes('--skip-plugins'),
    replaceEmpty: argumentsList.includes('--replace-empty'),
  }
}

if (isMainModule(import.meta.url)) {
  try {
    const result = await installRepository(parseArguments(process.argv.slice(2)))
    console.log(
      `Preset root: ${result.presetResult.status} (${result.presetResult.presetRoot})`,
    )
    console.log(
      `Web profile: ${
        result.profileResult.changed ? 'synchronized' : 'already synchronized'
      } (${result.profileResult.profilePatch})`,
    )
    console.log('Repository setup completed.')
  } catch (error) {
    console.error(`Repository setup failed: ${error.message}`)
    process.exitCode = 1
  }
}
