import assert from 'node:assert/strict'
import test from 'node:test'

import { createClientPlugin } from '../src/client.js'

test('registers, selects, styles, and disposes theme-blue', () => {
  const registered = []
  const selected = []
  const appended = []
  const removed = []
  const disposers = []
  const element = {
    dataset: {},
    textContent: '',
    remove() {
      removed.push(this)
    },
  }
  const originalDocument = globalThis.document
  globalThis.document = {
    querySelector() {
      return null
    },
    createElement(tagName) {
      assert.equal(tagName, 'style')
      return element
    },
    head: {
      appendChild(value) {
        appended.push(value)
      },
    },
  }

  try {
    const plugin = createClientPlugin()
    const ctx = {
      theme: {
        register(definition) {
          registered.push(definition)
          return () => registered.push('disposed')
        },
        setTheme(id) {
          selected.push(id)
        },
      },
      effect(register) {
        const dispose = register()
        if (typeof dispose === 'function') disposers.push(dispose)
      },
    }

    assert.deepEqual(plugin.inject, ['theme'])
    plugin.apply(ctx)

    assert.equal(registered[0].id, 'theme-blue')
    assert.equal(registered[0].colorScheme, 'dark')
    assert.equal(registered[0].tokens['--dsw-alias-brand-primary'], '#3b8cff')
    assert.deepEqual(selected, ['theme-blue'])
    assert.deepEqual(appended, [element])
    assert.match(element.textContent, /Avenir Next/)
    assert.match(element.textContent, /border-radius: 6px/)

    for (const dispose of disposers.reverse()) dispose()
    assert.deepEqual(removed, [element])
    assert.equal(registered.at(-1), 'disposed')
  } finally {
    if (originalDocument === undefined) delete globalThis.document
    else globalThis.document = originalDocument
  }
})
