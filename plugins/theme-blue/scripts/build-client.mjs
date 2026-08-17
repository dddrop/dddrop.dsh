import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createClientPlugin } from '../src/client.js'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputPath = path.join(packageRoot, 'lib', 'client.js')
const factorySource = createClientPlugin.toString()
const output = `window.__ModuleLoader__.load({
  id: '@dddrop/dsh-plugin-theme-blue',
  factory: () => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    const plugin = (${factorySource})()
    exports.apply = plugin.apply
    exports.inject = plugin.inject
    return module.exports
  },
})
`

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, output)
console.log(`Built ${path.relative(packageRoot, outputPath)}`)
