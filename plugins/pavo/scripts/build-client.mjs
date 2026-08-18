import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

import { build } from 'esbuild'

import { createClientPlugin } from '../src/client.js'

const require = createRequire(import.meta.url)
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputPath = path.join(packageRoot, 'lib', 'client.js')
const factorySource = createClientPlugin.toString()
const flowStyles = await readFile(
  require.resolve('@xyflow/react/dist/style.css'),
  'utf8',
)
const flowBuild = await build({
  bundle: true,
  external: ['react', 'react/*', 'react-dom', 'react-dom/*'],
  format: 'cjs',
  minify: true,
  platform: 'browser',
  stdin: {
    contents: "module.exports = require('@xyflow/react')",
    loader: 'js',
    resolveDir: packageRoot,
  },
  target: ['chrome120'],
  write: false,
})
const flowBundle = flowBuild.outputFiles[0].text
const output = `window.__ModuleLoader__.load({
  id: '@dddrop/dsh-plugin-pavo',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    const React = require('react')
    const XYFlow = (() => {
      const module = { exports: {} }
      const exports = module.exports
      ${flowBundle}
      return module.exports
    })()
    const plugin = (${factorySource})(React, XYFlow, ${JSON.stringify(flowStyles)})
    exports.apply = plugin.apply
    return module.exports
  },
})
`

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, output)
console.log(`Built ${path.relative(packageRoot, outputPath)}`)
