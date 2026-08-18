window.__ModuleLoader__.load({
  id: '@dddrop/dsh-plugin-theme-blue',
  factory: () => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    const plugin = (function createClientPlugin() {
  const PACKAGE_ID = '@dddrop/dsh-plugin-theme-blue'
  const STYLE_ID = `${PACKAGE_ID}/styles`
  const tokenOverrides = {
    '--dsw-alias-bg-base': { light: '#f4f7fa', dark: '#070c14' },
    '--dsw-alias-bg-layer-1': { light: '#ffffff', dark: '#0c1522' },
    '--dsw-alias-bg-layer-2': { light: '#eaf0f6', dark: '#111d2c' },
    '--dsw-alias-bg-overlay': { light: '#ffffff', dark: '#142236' },
    '--dsw-alias-border-l1': { light: '#d5e0e8', dark: '#1b3048' },
    '--dsw-alias-border-l2': { light: '#b8c9d8', dark: '#2b4f72' },
    '--dsw-alias-brand-primary': { light: '#2563eb', dark: '#3b8cff' },
    '--dsw-alias-label-primary': { light: '#1d2b38', dark: '#e8f1ff' },
    '--dsw-alias-label-secondary': { light: '#698096', dark: '#8ca6c2' },
    '--dsw-alias-state-error-primary': { light: '#d43f55', dark: '#ff7185' },
    '--dsw-alias-state-success-primary': { light: '#16856a', dark: '#4bc69a' },
    '--dsw-alias-state-warn-primary': { light: '#a96f16', dark: '#e8b65d' },
    '--dsw-specific-sidebar-fill': { light: '#f9fbfd', dark: '#09121f' },
  }
  const css = `
    body {
      --dsw-font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      --dsw-font-markdown-h1: 700 22px/30px var(--dsw-font-family);
      --dsw-font-markdown-h1-font-size: 22px;
      --dsw-font-markdown-h1-line-height: 30px;
      --dsw-font-markdown-h2: 700 20px/28px var(--dsw-font-family);
      --dsw-font-markdown-h2-font-size: 20px;
      --dsw-font-markdown-h2-line-height: 28px;
      --dsw-font-markdown-h3: 650 18px/26px var(--dsw-font-family);
      --dsw-font-markdown-h3-font-size: 18px;
      --dsw-font-markdown-h3-line-height: 26px;
      --dsw-font-markdown-h4: 600 15px/24px var(--dsw-font-family);
      --dsw-font-markdown-h4-font-size: 15px;
      --dsw-font-markdown-h4-line-height: 24px;
      --dsw-font-markdown-base: 15px/26px var(--dsw-font-family);
      --dsw-font-markdown-base-font-size: 15px;
      --dsw-font-markdown-base-line-height: 26px;
      --dsw-font-markdown-base-strong: 600 15px/26px var(--dsw-font-family);
      --dsw-font-xl-24: 650 22px/30px var(--dsw-font-family);
      --dsw-font-xl-24-font-size: 22px;
      --dsw-font-xl-24-line-height: 30px;
      --dsw-font-l-20: 600 18px/26px var(--dsw-font-family);
      --dsw-font-l-20-font-size: 18px;
      --dsw-font-l-20-line-height: 26px;
      --dsw-font-m-18: 600 15px/24px var(--dsw-font-family);
      --dsw-font-m-18-font-size: 15px;
      --dsw-font-m-18-line-height: 24px;
      --dsw-font-base-16: 14px/22px var(--dsw-font-family);
      --dsw-font-base-16-font-size: 14px;
      --dsw-font-base-16-line-height: 22px;
      --dsw-font-base-strong-16: 600 14px/22px var(--dsw-font-family);
      --dsw-font-s-14: 13px/20px var(--dsw-font-family);
      --dsw-font-s-14-font-size: 13px;
      --dsw-font-s-14-line-height: 20px;
      --dsw-font-s-strong-14: 600 13px/20px var(--dsw-font-family);
      --dsw-font-xs-13: 12px/18px var(--dsw-font-family);
      --dsw-font-xs-13-font-size: 12px;
      --dsw-font-xs-13-line-height: 18px;
      --dsw-font-xs-strong-13: 600 12px/18px var(--dsw-font-family);
      --dsw-font-xxs-12: 11px/17px var(--dsw-font-family);
      --dsw-font-xxs-12-font-size: 11px;
      --dsw-font-xxs-12-line-height: 17px;
      --dsw-font-xxs-strong-12: 600 11px/17px var(--dsw-font-family);
      font-feature-settings: 'kern' 1, 'ss01' 1;
      letter-spacing: 0.005em;
    }

    body [data-input-scroll] textarea {
      font-feature-settings: inherit;
      letter-spacing: inherit;
    }

    body :where(button, input, textarea, select, [role='button'], [role='textbox'], [role='combobox']) {
      border-radius: 6px !important;
      transition: border-color 180ms ease, background-color 180ms ease, color 180ms ease, transform 120ms ease;
    }

    body :where(button, [role='button']):active {
      transform: translateY(1px);
    }

    body :where([role='dialog'], [role='menu'], [role='listbox'], [role='tooltip'], [role='tabpanel']) {
      border-radius: 8px !important;
    }

    body :where([role='tab']) {
      border-radius: 4px 4px 0 0 !important;
      letter-spacing: 0.015em;
    }

    body :where(code, pre, kbd) {
      border-radius: 4px !important;
    }

    body :where(button, input, textarea, select, [role='button'], [role='textbox'], [role='combobox']):focus-visible {
      outline: 2px solid rgb(59 140 255 / 68%);
      outline-offset: 2px;
    }
  `

  function installStyles() {
    if (typeof document === 'undefined') return () => {}
    if (document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`)) {
      return () => {}
    }

    const element = document.createElement('style')
    element.dataset.plugin = PACKAGE_ID
    element.dataset.pluginCss = STYLE_ID
    element.textContent = css
    document.head.appendChild(element)
    return () => element.remove()
  }

  function apply(ctx) {
    ctx.effect(() => ctx.theme.overrideTokens(PACKAGE_ID, tokenOverrides))
    ctx.effect(installStyles)
  }

  return {
    inject: ['theme'],
    apply,
  }
})()
    exports.apply = plugin.apply
    exports.inject = plugin.inject
    return module.exports
  },
})
