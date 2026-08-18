import assert from 'node:assert/strict'
import test from 'node:test'

import { createClientPlugin } from '../src/client.js'

test('overrides both palette modes, installs styles, and disposes theme-blue', () => {
  const overrides = []
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
        overrideTokens(source, tokens) {
          overrides.push({ source, tokens })
          return () => overrides.push('disposed')
        },
      },
      effect(register) {
        const dispose = register()
        if (typeof dispose === 'function') disposers.push(dispose)
      },
    }

    assert.deepEqual(plugin.inject, ['theme'])
    plugin.apply(ctx)

    assert.equal(overrides[0].source, '@dddrop/dsh-plugin-theme-blue')
    assert.deepEqual(overrides[0].tokens['--dsw-alias-bg-base'], {
      light: '#f4f7fa',
      dark: '#070c14',
    })
    assert.deepEqual(overrides[0].tokens['--dsw-alias-brand-primary'], {
      light: '#2563eb',
      dark: '#3b8cff',
    })
    assert.deepEqual(appended, [element])
    assert.match(element.textContent, /Avenir Next/)
    assert.match(element.textContent, /\[data-input-scroll\] textarea/)
    assert.match(element.textContent, /font-feature-settings: inherit/)
    assert.match(element.textContent, /letter-spacing: inherit/)
    assert.match(element.textContent, /border-radius: 6px/)
    assert.doesNotMatch(element.textContent, /color-scheme: dark/)
    assert.doesNotMatch(element.textContent, /--dsw-alias-bg-base:/)
    assert.doesNotMatch(element.textContent, /--dsw-shadow-lv/)
    assert.doesNotMatch(element.textContent, /box-shadow:/)

    for (const dispose of disposers.reverse()) dispose()
    assert.deepEqual(removed, [element])
    assert.equal(overrides.at(-1), 'disposed')
  } finally {
    if (originalDocument === undefined) delete globalThis.document
    else globalThis.document = originalDocument
  }
})
