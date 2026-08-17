import assert from 'node:assert/strict'
import test from 'node:test'

import { createClientPlugin } from '../src/client.js'

test('registers, selects, styles, and disposes theme-blue', () => {
  const registered = []
  const selected = []
  const appended = []
  const removed = []
  const bodyAttributes = new Set()
  const disposers = []
  const listeners = new Map()
  const intervals = []
  const clearedIntervals = []
  let preference = 'system'
  const element = {
    dataset: {},
    textContent: '',
    remove() {
      removed.push(this)
    },
  }
  const originalDocument = globalThis.document
  const originalWindow = globalThis.window
  globalThis.window = {
    setInterval(callback, delay) {
      assert.equal(delay, 500)
      intervals.push(callback)
      return intervals.length
    },
    clearInterval(id) {
      clearedIntervals.push(id)
    },
  }
  globalThis.document = {
    body: {
      hasAttribute(name) {
        return bodyAttributes.has(name)
      },
      setAttribute(name) {
        bodyAttributes.add(name)
      },
      removeAttribute(name) {
        bodyAttributes.delete(name)
      },
    },
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
        getTheme() {
          return { preference }
        },
        register(definition) {
          registered.push(definition)
          return () => registered.push('disposed')
        },
        setTheme(id) {
          selected.push(id)
          preference = id
        },
      },
      effect(register) {
        const dispose = register()
        if (typeof dispose === 'function') disposers.push(dispose)
      },
      on(name, listener) {
        listeners.set(name, listener)
        return () => listeners.delete(name)
      },
    }

    assert.deepEqual(plugin.inject, ['theme'])
    plugin.apply(ctx)

    assert.equal(registered[0].id, 'theme-blue')
    assert.equal(registered[0].colorScheme, 'dark')
    assert.equal(registered[0].tokens['--dsw-alias-brand-primary'], '#3b8cff')
    assert.deepEqual(selected, ['theme-blue'])
    assert.equal(bodyAttributes.has('data-ds-dark-theme'), true)
    assert.equal(typeof listeners.get('theme/change'), 'function')
    preference = 'system'
    listeners.get('theme/change')()
    preference = 'light'
    intervals[0]()
    assert.deepEqual(selected, ['theme-blue', 'theme-blue', 'theme-blue'])
    assert.deepEqual(appended, [element])
    assert.match(element.textContent, /Avenir Next/)
    assert.match(element.textContent, /border-radius: 6px/)

    for (const dispose of disposers.reverse()) dispose()
    assert.deepEqual(removed, [element])
    assert.equal(bodyAttributes.has('data-ds-dark-theme'), false)
    assert.deepEqual(clearedIntervals, [1])
    assert.equal(registered.at(-1), 'disposed')
  } finally {
    if (originalDocument === undefined) delete globalThis.document
    else globalThis.document = originalDocument
    if (originalWindow === undefined) delete globalThis.window
    else globalThis.window = originalWindow
  }
})
