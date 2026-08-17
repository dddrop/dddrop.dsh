export function createClientPlugin(React) {
  const API_PATH = '/_dddrop/kanban'
  const STYLE_ID = '@dddrop/dsh-plugin-kanban/styles'
  const STYLES = [
    '.ddk-root{box-sizing:border-box;display:flex;flex-direction:column;height:100%;min-height:0;overflow:hidden;padding:14px 18px;color:inherit}',
    '.ddk-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 0 12px}',
    '.ddk-heading{display:flex;align-items:baseline;gap:10px;min-width:0}',
    '.ddk-title{font-size:16px;font-weight:650;letter-spacing:-.01em}',
    '.ddk-status{font-size:12px;opacity:.62}',
    '.ddk-form{display:grid;grid-template-columns:minmax(180px,1fr) auto auto;gap:8px;padding-bottom:12px}',
    '.ddk-input,.ddk-select,.ddk-button{box-sizing:border-box;border:1px solid rgba(128,128,128,.34);border-radius:8px;background:transparent;color:inherit;font:inherit;font-size:13px;min-height:34px}',
    '.ddk-input{min-width:0;padding:6px 10px;outline:none}',
    '.ddk-input:focus{border-color:rgba(80,120,255,.75);box-shadow:0 0 0 2px rgba(80,120,255,.12)}',
    '.ddk-select{padding:5px 30px 5px 9px}',
    '.ddk-button{cursor:pointer;padding:5px 12px;font-weight:550}',
    '.ddk-button:hover:not(:disabled){background:rgba(128,128,128,.1)}',
    '.ddk-button:disabled{cursor:not-allowed;opacity:.45}',
    '.ddk-error{margin:0 0 12px;border:1px solid rgba(220,70,70,.4);border-radius:8px;padding:8px 10px;color:#d85c5c;font-size:13px}',
    '.ddk-loading{padding:20px 0;font-size:13px;opacity:.68}',
    '.ddk-board{display:flex;align-items:stretch;gap:10px;flex:1;min-height:0;overflow-x:auto;padding:0 0 10px}',
    '.ddk-column{display:flex;flex:0 0 250px;flex-direction:column;min-height:0;border:1px solid rgba(128,128,128,.28);border-radius:12px;background:rgba(128,128,128,.045);padding:9px;transition:border-color .15s,background .15s}',
    '.ddk-column.ddk-drop-allowed{border-color:rgba(80,120,255,.58);background:rgba(80,120,255,.07)}',
    '.ddk-column.ddk-drop-blocked{opacity:.58}',
    '.ddk-column-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:2px 5px 9px;font-size:13px;font-weight:620}',
    '.ddk-count{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;border-radius:10px;background:rgba(128,128,128,.12);font-size:11px;font-weight:560;opacity:.7}',
    '.ddk-card-list{flex:1;min-height:46px;overflow-y:auto}',
    '.ddk-card{margin-bottom:8px;border:1px solid rgba(128,128,128,.27);border-radius:9px;background:rgba(128,128,128,.075);padding:9px 10px;cursor:grab;font-size:13px}',
    '.ddk-card:active{cursor:grabbing}',
    '.ddk-card-row{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}',
    '.ddk-card-title{min-width:0;flex:1;font-weight:520;line-height:1.4;overflow-wrap:anywhere}',
    '.ddk-card-actions{display:flex;align-items:center;gap:2px;flex:none}',
    '.ddk-icon-button{border:0;background:transparent;color:inherit;cursor:pointer;font-size:14px;line-height:1;opacity:.38;padding:1px 2px}',
    '.ddk-icon-button:hover:not(:disabled){opacity:.9}',
    '.ddk-edit-form{display:grid;gap:7px}',
    '.ddk-edit-actions{display:flex;justify-content:flex-end;gap:6px}',
    '.ddk-edit-actions .ddk-button{min-height:28px;padding:3px 8px;font-size:12px}',
    '@media(max-width:720px){.ddk-root{padding:12px}.ddk-form{grid-template-columns:1fr auto}.ddk-select{grid-row:2}.ddk-button{grid-row:2}.ddk-column{flex-basis:82vw}}',
  ].join('\n')

  async function request(method, args) {
    const response = await fetch(API_PATH, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ method, args }),
    })
    const payload = await response.json().catch(() => null)

    if (!response.ok || payload?.ok !== true) {
      throw new Error(payload?.error || `Kanban request failed (${response.status}).`)
    }
    return payload.value
  }

  function Board() {
    const [snapshot, setSnapshot] = React.useState(null)
    const [error, setError] = React.useState(null)
    const [busy, setBusy] = React.useState(false)
    const [title, setTitle] = React.useState('')
    const [targetColumn, setTargetColumn] = React.useState('')
    const [draggedCardId, setDraggedCardId] = React.useState('')
    const [editingCardId, setEditingCardId] = React.useState('')
    const [editingTitle, setEditingTitle] = React.useState('')
    const requestSequence = React.useRef(0)
    const busyRef = React.useRef(false)
    const pollInFlight = React.useRef(false)

    const applySnapshot = React.useCallback((next) => {
      setSnapshot((current) =>
        current?.revision === next.revision ? current : next,
      )
      setTargetColumn((current) => current || next.board.columns[0]?.id || '')
      setError(typeof next.syncError === 'string' ? next.syncError : null)
    }, [])

    const load = React.useCallback(
      async (background = false) => {
        if (background && (pollInFlight.current || busyRef.current)) return
        if (background) pollInFlight.current = true
        const sequence = ++requestSequence.current
        try {
          const next = await request('overview', {})
          if (sequence === requestSequence.current) applySnapshot(next)
        } catch (nextError) {
          if (sequence === requestSequence.current) {
            setError(
              nextError instanceof Error ? nextError.message : String(nextError),
            )
          }
        } finally {
          if (background) pollInFlight.current = false
        }
      },
      [applySnapshot],
    )

    React.useEffect(() => {
      void load()
    }, [load])

    React.useEffect(() => {
      const intervalMs = snapshot?.pollIntervalMs
      if (!Number.isFinite(intervalMs) || intervalMs < 1_000) return undefined

      const timer = setInterval(() => {
        if (typeof document !== 'undefined' && document.hidden) return
        if (typeof navigator !== 'undefined' && navigator.onLine === false) return
        void load(true)
      }, intervalMs)
      return () => clearInterval(timer)
    }, [load, snapshot?.pollIntervalMs])

    React.useEffect(() => {
      const resume = () => {
        if (typeof document !== 'undefined' && document.hidden) return
        if (typeof navigator !== 'undefined' && navigator.onLine === false) return
        void load(true)
      }
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', resume)
      }
      if (typeof window !== 'undefined') {
        window.addEventListener('focus', resume)
        window.addEventListener('online', resume)
      }
      return () => {
        if (typeof document !== 'undefined') {
          document.removeEventListener('visibilitychange', resume)
        }
        if (typeof window !== 'undefined') {
          window.removeEventListener('focus', resume)
          window.removeEventListener('online', resume)
        }
      }
    }, [load])

    React.useEffect(() => {
      if (!snapshot) return
      if (!snapshot.board.columns.some((column) => column.id === targetColumn)) {
        setTargetColumn(snapshot.board.columns[0]?.id || '')
      }
    }, [snapshot, targetColumn])

    async function run(action) {
      if (busyRef.current) return false
      busyRef.current = true
      setBusy(true)
      const sequence = ++requestSequence.current
      try {
        const next = await action()
        if (sequence === requestSequence.current) applySnapshot(next)
        return true
      } catch (nextError) {
        if (sequence === requestSequence.current) {
          setError(nextError instanceof Error ? nextError.message : String(nextError))
        }
        return false
      } finally {
        busyRef.current = false
        setBusy(false)
      }
    }

    function mutationArgs(args) {
      return { ...args, expectedRevision: snapshot?.revision }
    }

    function addCard() {
      const normalizedTitle = title.trim()
      if (!normalizedTitle || !snapshot) return

      void run(async () => {
        const next = await request(
          'add',
          mutationArgs({ title: normalizedTitle, columnId: targetColumn }),
        )
        setTitle('')
        return next
      })
    }

    function moveCard(cardId, columnId) {
      if (!snapshot) return
      void run(() =>
        request('move', mutationArgs({ cardId, columnId })),
      )
    }

    function removeCard(cardId) {
      if (!snapshot) return
      void run(() => request('remove', mutationArgs({ cardId })))
    }

    function beginEditing(card) {
      setEditingCardId(card.id)
      setEditingTitle(card.title)
    }

    function saveEditing() {
      const normalizedTitle = editingTitle.trim()
      if (!normalizedTitle || !editingCardId || !snapshot) return
      const currentCard = snapshot.board.cards.find(
        (card) => card.id === editingCardId,
      )
      if (currentCard?.title === normalizedTitle) {
        cancelEditing()
        return
      }
      const cardId = editingCardId
      void run(() =>
        request('update', mutationArgs({ cardId, title: normalizedTitle })),
      ).then((saved) => {
        if (saved) {
          setEditingCardId('')
          setEditingTitle('')
        }
      })
    }

    function cancelEditing() {
      setEditingCardId('')
      setEditingTitle('')
    }

    function canMove(card, columnId) {
      if (!snapshot || card.columnId === columnId) return false
      const source = snapshot.workflow.find(
        (column) => column.id === card.columnId,
      )
      return source?.allowedTransitions.includes(columnId) === true
    }

    if (snapshot === null) {
      return React.createElement(
        'div',
        { className: 'ddk-root' },
        error
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement('div', { className: 'ddk-error' }, error),
              React.createElement(
                'button',
                { className: 'ddk-button', onClick: () => void load() },
                'Retry',
              ),
            )
          : React.createElement('div', { className: 'ddk-loading' }, 'Loading board…'),
      )
    }

    const data = snapshot.board
    const draggedCard = data.cards.find((card) => card.id === draggedCardId)
    const columns = data.columns.map((column) => {
      const cards = data.cards.filter((card) => card.columnId === column.id)
      const cardNodes = cards.map((card) => {
        const editing = editingCardId === card.id
        return React.createElement(
          'article',
          {
            key: card.id,
            className: 'ddk-card',
            draggable: !busy && !editing,
            onDragStart: (event) => {
              setDraggedCardId(card.id)
              event.dataTransfer.setData('text/plain', card.id)
              event.dataTransfer.effectAllowed = 'move'
            },
            onDragEnd: () => setDraggedCardId(''),
          },
          editing
            ? React.createElement(
                'div',
                { className: 'ddk-edit-form' },
                React.createElement('input', {
                  className: 'ddk-input',
                  value: editingTitle,
                  disabled: busy,
                  autoFocus: true,
                  'aria-label': 'Edit card title',
                  onChange: (event) => setEditingTitle(event.target.value),
                  onKeyDown: (event) => {
                    if (event.key === 'Enter') saveEditing()
                    if (event.key === 'Escape') cancelEditing()
                  },
                }),
                React.createElement(
                  'div',
                  { className: 'ddk-edit-actions' },
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'ddk-button',
                      disabled: busy,
                      onClick: cancelEditing,
                    },
                    'Cancel',
                  ),
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'ddk-button',
                      disabled: busy || editingTitle.trim().length === 0,
                      onClick: saveEditing,
                    },
                    'Save',
                  ),
                ),
              )
            : React.createElement(
                'div',
                { className: 'ddk-card-row' },
                React.createElement(
                  'div',
                  {
                    className: 'ddk-card-title',
                    onDoubleClick: () => beginEditing(card),
                  },
                  card.title,
                ),
                React.createElement(
                  'div',
                  { className: 'ddk-card-actions' },
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'ddk-icon-button',
                      title: 'Edit card',
                      'aria-label': `Edit ${card.title}`,
                      disabled: busy,
                      onClick: () => beginEditing(card),
                    },
                    '✎',
                  ),
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'ddk-icon-button',
                      title: 'Remove card',
                      'aria-label': `Remove ${card.title}`,
                      disabled: busy,
                      onClick: () => removeCard(card.id),
                    },
                    '×',
                  ),
                ),
              ),
        )
      })

      const dropAllowed = draggedCard ? canMove(draggedCard, column.id) : false
      const dropBlocked =
        draggedCard && draggedCard.columnId !== column.id && !dropAllowed
      return React.createElement(
        'section',
        {
          key: column.id,
          className: `ddk-column${dropAllowed ? ' ddk-drop-allowed' : ''}${dropBlocked ? ' ddk-drop-blocked' : ''}`,
          onDragOver: (event) => {
            if (dropAllowed) event.preventDefault()
          },
          onDrop: (event) => {
            event.preventDefault()
            const cardId = event.dataTransfer.getData('text/plain')
            if (cardId && dropAllowed) moveCard(cardId, column.id)
            setDraggedCardId('')
          },
        },
        React.createElement(
          'header',
          { className: 'ddk-column-head' },
          React.createElement('span', null, column.title),
          React.createElement('span', { className: 'ddk-count' }, String(cards.length)),
        ),
        React.createElement('div', { className: 'ddk-card-list' }, cardNodes),
      )
    })

    return React.createElement(
      'div',
      { className: 'ddk-root' },
      React.createElement(
        'div',
        { className: 'ddk-toolbar' },
        React.createElement(
          'div',
          { className: 'ddk-heading' },
          React.createElement('span', { className: 'ddk-title' }, 'Kanban'),
          React.createElement(
            'span',
            { className: 'ddk-status' },
            busy ? 'Committing and syncing…' : 'Git-backed · auto-sync on',
          ),
        ),
      ),
      error ? React.createElement('div', { className: 'ddk-error' }, error) : null,
      React.createElement(
        'div',
        { className: 'ddk-form' },
        React.createElement('input', {
          className: 'ddk-input',
          value: title,
          disabled: busy,
          placeholder: 'Add a card…',
          'aria-label': 'Card title',
          onChange: (event) => setTitle(event.target.value),
          onKeyDown: (event) => {
            if (event.key === 'Enter') addCard()
          },
        }),
        React.createElement(
          'select',
          {
            className: 'ddk-select',
            value: targetColumn,
            disabled: busy,
            'aria-label': 'Target column',
            onChange: (event) => setTargetColumn(event.target.value),
          },
          data.columns.map((column) =>
            React.createElement(
              'option',
              { key: column.id, value: column.id },
              column.title,
            ),
          ),
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'ddk-button',
            disabled: busy || title.trim().length === 0,
            onClick: addCard,
          },
          'Add',
        ),
      ),
      React.createElement('div', { className: 'ddk-board' }, columns),
    )
  }

  function apply(ctx) {
    const slots = ctx.get('slots')
    if (!slots) return

    ctx.effect(() => {
      if (typeof document === 'undefined') return () => {}
      if (document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`)) {
        return () => {}
      }

      const element = document.createElement('style')
      element.dataset.plugin = '@dddrop/dsh-plugin-kanban'
      element.dataset.pluginCss = STYLE_ID
      element.textContent = STYLES
      document.head.appendChild(element)
      return () => element.remove()
    })

    slots.inject('conversation.view', () =>
      slots.register(
        {
          name: 'conversation.view',
          id: 'kanban',
          order: 5,
          label: 'Kanban',
        },
        () => React.createElement(Board),
      ),
    )
  }

  return { apply }
}
