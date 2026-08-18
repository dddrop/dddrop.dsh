export function createClientPlugin(React, XYFlow, XYFLOW_STYLES) {
  const {
    Background,
    BackgroundVariant,
    Controls,
    Handle,
    MarkerType,
    MiniMap,
    Panel,
    Position,
    ReactFlow,
    useEdgesState,
    useNodesState,
  } = XYFlow
  const API_PATH = '/_dddrop/pavo'
  const STYLE_ID = '@dddrop/dsh-plugin-pavo/styles'
  const WATER_LEVEL_PATTERN = /^(\d+)(?:\.(\d+))?$/u
  const ROOT_WORKFLOW_ID = 'root'
  const STYLES = [
    '.pavo-root{box-sizing:border-box;display:flex;flex-direction:column;height:100%;min-height:0;overflow:hidden;padding:14px 18px;color:inherit}',
    '.pavo-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 0 12px}',
    '.pavo-heading{display:flex;align-items:baseline;gap:10px;min-width:0}',
    '.pavo-title{font-size:16px;font-weight:650;letter-spacing:-.01em}',
    '.pavo-status{font-size:12px;opacity:.62}',
    '.pavo-toolbar-actions{display:flex;align-items:center;gap:8px}',
    '.pavo-view-switch{display:inline-flex;border:1px solid rgba(128,128,128,.28);border-radius:9px;padding:2px;background:rgba(128,128,128,.055)}',
    '.pavo-view-switch button{min-height:30px;border:0;border-radius:6px;background:transparent;color:inherit;padding:4px 10px;cursor:pointer;font:inherit;font-size:12px;font-weight:620;opacity:.58}',
    '.pavo-view-switch button:hover{opacity:.9}',
    '.pavo-view-switch button[aria-pressed="true"]{background:rgba(80,120,255,.16);color:#2f5fc7;opacity:1}',
    '.pavo-field{display:grid;gap:6px;min-width:0}',
    '.pavo-field>span{font-size:11px;font-weight:650;opacity:.68}',
    '.pavo-input,.pavo-textarea,.pavo-select,.pavo-button{box-sizing:border-box;border:1px solid rgba(128,128,128,.34);border-radius:8px;background:transparent;color:inherit;font:inherit;font-size:13px}',
    '.pavo-input,.pavo-select,.pavo-button{min-height:36px}',
    '.pavo-input,.pavo-textarea{min-width:0;padding:7px 10px;outline:none}',
    '.pavo-textarea{min-height:160px;resize:vertical;line-height:1.5}',
    '.pavo-input:focus,.pavo-textarea:focus,.pavo-select:focus{border-color:rgba(80,120,255,.75);box-shadow:0 0 0 2px rgba(80,120,255,.12);outline:none}',
    '.pavo-select{width:100%;padding:5px 30px 5px 9px}',
    '.pavo-button{cursor:pointer;padding:5px 12px;font-weight:600;white-space:nowrap}',
    '.pavo-button:hover:not(:disabled){background:rgba(128,128,128,.1)}',
    '.pavo-button:active:not(:disabled){transform:translateY(1px)}',
    '.pavo-button:disabled{cursor:not-allowed;opacity:.45}',
    '.pavo-button-primary{border-color:#2f5fc7;background:#2f5fc7;color:#fff}',
    '.pavo-button-primary:hover:not(:disabled){background:#2854b2}',
    '.pavo-button-danger{color:#d85c5c}',
    '.pavo-error{margin:0 0 12px;border:1px solid rgba(220,70,70,.4);border-radius:8px;padding:8px 10px;color:#d85c5c;font-size:13px}',
    '.pavo-notice{margin:0 0 12px;border:1px solid rgba(128,128,128,.25);border-radius:8px;padding:9px 11px;font-size:12px;opacity:.75}',
    '.pavo-loading{padding:20px 0;font-size:13px;opacity:.68}',
    '.pavo-board{display:flex;align-items:stretch;gap:10px;flex:1;min-height:0;overflow-x:auto;padding:0 0 10px}',
    '.pavo-column{display:flex;flex:0 0 280px;flex-direction:column;min-height:0;border:1px solid rgba(128,128,128,.28);border-radius:12px;background:rgba(128,128,128,.045);padding:9px;transition:border-color .15s,background .15s}',
    '.pavo-column.pavo-drop-allowed{border-color:rgba(80,120,255,.58);background:rgba(80,120,255,.07)}',
    '.pavo-column.pavo-drop-blocked{opacity:.58}',
    '.pavo-column-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:2px 5px 9px;font-size:13px;font-weight:620}',
    '.pavo-count{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;border-radius:10px;background:rgba(128,128,128,.12);font-size:11px;font-weight:560;opacity:.7}',
    '.pavo-work-list{flex:1;min-height:46px;overflow-y:auto}',
    '.pavo-work{margin-bottom:8px;border:1px solid rgba(128,128,128,.27);border-radius:9px;background:rgba(128,128,128,.075);padding:0;cursor:grab;font-size:13px;transition:border-color .15s,background .15s,transform .15s}',
    '.pavo-work:hover{border-color:rgba(80,120,255,.42);background:rgba(128,128,128,.11)}',
    '.pavo-work:active{cursor:grabbing}',
    '.pavo-work-open{display:block;width:100%;border:0;background:transparent;color:inherit;padding:10px;text-align:left;cursor:pointer;font:inherit}',
    '.pavo-work-open:focus-visible{outline:2px solid rgba(80,120,255,.75);outline-offset:2px;border-radius:8px}',
    '.pavo-work-copy{display:grid;gap:7px;min-width:0}',
    '.pavo-work-kicker{display:flex;align-items:center;gap:6px;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;opacity:.62}',
    '.pavo-work-project{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.pavo-work-key{border:1px solid rgba(128,128,128,.25);border-radius:5px;padding:1px 4px}',
    '.pavo-work-title{font-weight:620;line-height:1.4;overflow-wrap:anywhere}',
    '.pavo-work-body{margin:0;max-height:120px;overflow:hidden;white-space:pre-wrap;font:inherit;font-size:12px;line-height:1.45;opacity:.76}',
    '.pavo-work-meta{display:flex;flex-wrap:wrap;gap:5px 9px;font-size:11px;opacity:.68}',
    '.pavo-work-id{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9px;opacity:.42}',
    '.pavo-flow-shell{display:flex;flex:1;min-height:0;flex-direction:column;gap:9px}',
    '.pavo-flow-breadcrumbs{display:flex;align-items:center;gap:5px;min-height:30px;overflow-x:auto;font-size:12px}',
    '.pavo-flow-breadcrumbs button{border:0;background:transparent;color:inherit;padding:4px 5px;cursor:pointer;font:inherit;font-weight:620;opacity:.58;white-space:nowrap}',
    '.pavo-flow-breadcrumbs button:hover{opacity:1}',
    '.pavo-flow-breadcrumbs button[aria-current="page"]{cursor:default;opacity:1}',
    '.pavo-flow-breadcrumb-separator{opacity:.3}',
    '.pavo-flow{display:grid;grid-template-columns:minmax(0,1fr) 308px;gap:12px;flex:1;min-height:0;overflow:hidden}',
    '.pavo-flow-canvas{position:relative;min-width:0;overflow:hidden;border:1px solid rgba(128,128,128,.24);border-radius:14px;background:rgba(128,128,128,.025)}',
    '.pavo-flow-canvas .react-flow{color:inherit;--xy-edge-stroke:#7d91bf;--xy-edge-stroke-width:1.6;--xy-edge-stroke-selected:#2f5fc7;--xy-connectionline-stroke:#2f5fc7;--xy-handle-background-color:#2f5fc7;--xy-handle-border-color:Canvas;--xy-minimap-background-color:Canvas;--xy-minimap-mask-background-color:rgba(80,120,255,.08)}',
    '.pavo-flow-canvas .react-flow__pane{cursor:grab}',
    '.pavo-flow-canvas .react-flow__pane.dragging{cursor:grabbing}',
    '.pavo-flow-canvas .react-flow__edge-path{transition:stroke .16s,stroke-width .16s}',
    '.pavo-flow-canvas .react-flow__edge.selected .react-flow__edge-path,.pavo-flow-canvas .react-flow__edge:focus .react-flow__edge-path{stroke:#2f5fc7;stroke-width:2.4}',
    '.pavo-flow-canvas .react-flow__controls{overflow:hidden;border:1px solid rgba(128,128,128,.24);border-radius:9px;box-shadow:none}',
    '.pavo-flow-canvas .react-flow__controls-button{border:0;border-bottom:1px solid rgba(128,128,128,.18);background:Canvas;color:CanvasText}',
    '.pavo-flow-canvas .react-flow__controls-button:hover{background:rgba(80,120,255,.1)}',
    '.pavo-flow-canvas .react-flow__minimap{overflow:hidden;border:1px solid rgba(128,128,128,.2);border-radius:9px;box-shadow:none}',
    '.pavo-flow-panel{display:flex;align-items:center;gap:8px;border:1px solid rgba(128,128,128,.22);border-radius:9px;background:Canvas;padding:6px 8px;color:CanvasText;font-size:11px}',
    '.pavo-flow-panel strong{font-size:12px;font-weight:680}',
    '.pavo-flow-panel span{opacity:.56}',
    '.pavo-work-node{position:relative;width:218px;overflow:hidden;border:1px solid rgba(128,128,128,.3);border-radius:12px;background:Canvas;color:CanvasText;box-shadow:0 8px 24px rgba(25,48,92,.08);transition:border-color .16s,box-shadow .16s,transform .16s}',
    '.pavo-work-node:hover{border-color:rgba(80,120,255,.6);box-shadow:0 10px 28px rgba(25,48,92,.13)}',
    '.pavo-work-node:focus-visible{border-color:#2f5fc7;box-shadow:0 0 0 3px rgba(47,95,199,.18);outline:none}',
    '.pavo-work-node.pavo-work-node-selected{border-color:#2f5fc7;box-shadow:0 0 0 2px rgba(47,95,199,.13),0 12px 30px rgba(25,48,92,.15)}',
    '.pavo-work-node-accent{height:3px;background:#2f5fc7;opacity:.28}',
    '.pavo-work-node-selected .pavo-work-node-accent{opacity:1}',
    '.pavo-work-node-body{display:grid;gap:11px;padding:13px 14px 12px}',
    '.pavo-work-node-topline{display:flex;align-items:center;justify-content:space-between;gap:10px}',
    '.pavo-work-node-index{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:.08em;opacity:.42}',
    '.pavo-work-node-count{display:inline-flex;align-items:center;justify-content:center;min-width:25px;height:20px;border-radius:10px;background:rgba(80,120,255,.12);color:#2f5fc7;font-size:10px;font-weight:750}',
    '.pavo-work-node-title{font-size:14px;font-weight:680;letter-spacing:-.015em;line-height:1.25}',
    '.pavo-work-node-metrics{display:grid;grid-template-columns:1fr auto;align-items:center;gap:10px}',
    '.pavo-work-node-progress{height:3px;overflow:hidden;border-radius:2px;background:rgba(128,128,128,.16)}',
    '.pavo-work-node-progress span{display:block;height:100%;border-radius:inherit;background:#2f5fc7}',
    '.pavo-work-node-exits{font-size:10px;opacity:.52}',
    '.pavo-work-node .react-flow__handle{width:8px;height:8px;border:2px solid Canvas;background:#2f5fc7}',
    '.pavo-workflow-node{position:relative;width:238px;overflow:hidden;border:1px solid rgba(96,118,158,.38);border-radius:14px;background:Canvas;color:CanvasText;box-shadow:0 8px 24px rgba(25,48,92,.08);cursor:pointer;transition:border-color .16s,box-shadow .16s,transform .16s}',
    '.pavo-workflow-node:hover,.pavo-workflow-node-selected{border-color:#7656b5;box-shadow:0 0 0 2px rgba(118,86,181,.12),0 12px 30px rgba(41,27,73,.14)}',
    '.pavo-workflow-node-accent{height:4px;background:#7656b5}',
    '.pavo-workflow-node-body{display:grid;gap:10px;padding:15px}',
    '.pavo-workflow-node-kicker{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:9px;font-weight:750;letter-spacing:.08em;text-transform:uppercase;color:#7656b5}',
    '.pavo-workflow-node-title{font-size:15px;font-weight:700;line-height:1.3;letter-spacing:-.015em}',
    '.pavo-workflow-node-meta{font-size:10px;opacity:.56}',
    '.pavo-work-type{display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:720;letter-spacing:.06em;text-transform:uppercase;opacity:.58}',
    '.pavo-work-type::before{content:"";width:6px;height:6px;border-radius:2px;background:#2f5fc7}',
    '.pavo-work-type-ongoing::before{border-radius:50%}',
    '.pavo-work-level{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;font-variant-numeric:tabular-nums;opacity:.56}',
    '.pavo-dependency-state{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:650}',
    '.pavo-dependency-state::before{content:"";width:6px;height:6px;border-radius:50%;background:#76907e}',
    '.pavo-dependency-state-changed::before{background:#c28a34}',
    '.pavo-dependency-state-rollback::before{background:#c65d5d}',
    '.pavo-flow-detail{display:flex;min-height:0;flex-direction:column;border:1px solid rgba(128,128,128,.22);border-radius:14px;background:rgba(128,128,128,.025);overflow:hidden}',
    '.pavo-flow-detail-head{display:grid;gap:10px;border-bottom:1px solid rgba(128,128,128,.18);padding:15px}',
    '.pavo-flow-detail-kicker{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.5}',
    '.pavo-flow-detail-title{display:grid;gap:4px}',
    '.pavo-flow-detail-title strong{font-size:16px;letter-spacing:-.02em}',
    '.pavo-flow-detail-title span{font-size:11px;line-height:1.45;opacity:.58}',
    '.pavo-flow-route-list{display:flex;flex-wrap:wrap;gap:6px}',
    '.pavo-flow-route{border-radius:6px;background:rgba(80,120,255,.1);padding:4px 6px;color:#2f5fc7;font-size:10px;font-weight:650}',
    '.pavo-flow-card-list{display:grid;align-content:start;gap:7px;overflow-y:auto;padding:10px}',
    '.pavo-flow-card{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;width:100%;border:1px solid transparent;border-radius:9px;background:rgba(128,128,128,.065);color:inherit;padding:10px;text-align:left;cursor:pointer;font:inherit}',
    '.pavo-flow-card:hover,.pavo-flow-card:focus-visible{border-color:rgba(80,120,255,.52);background:rgba(80,120,255,.07);outline:none}',
    '.pavo-flow-card-copy{display:grid;gap:4px;min-width:0}',
    '.pavo-flow-card small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px;font-weight:720;letter-spacing:.05em;opacity:.52}',
    '.pavo-flow-card span{font-size:12px;font-weight:620;line-height:1.4}',
    '.pavo-flow-card-arrow{align-self:center;font-size:14px;opacity:.32}',
    '.pavo-flow-empty{margin:10px;border:1px dashed rgba(128,128,128,.28);border-radius:9px;padding:18px;font-size:12px;line-height:1.5;opacity:.6}',
    '.pavo-flow-work-copy{display:grid;gap:8px;padding:14px 15px;overflow-y:auto}',
    '.pavo-flow-description{margin:0;white-space:pre-wrap;font-size:12px;line-height:1.55;opacity:.72}',
    '.pavo-upstream-list{display:grid;gap:7px;margin:0;padding:0;list-style:none}',
    '.pavo-upstream-row{display:grid;gap:7px;border:1px solid rgba(128,128,128,.2);border-radius:9px;padding:9px}',
    '.pavo-upstream-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}',
    '.pavo-upstream-title{display:grid;gap:2px;min-width:0;font-size:11px}',
    '.pavo-upstream-title strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.pavo-upstream-title span{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9px;opacity:.48}',
    '.pavo-upstream-levels{display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:10px;opacity:.68}',
    '.pavo-upstream-actions{display:flex;gap:6px}',
    '.pavo-upstream-actions .pavo-button{min-height:28px;padding:3px 8px;font-size:10px}',
    '.pavo-dependency-editor{display:grid;gap:9px;border-top:1px solid rgba(128,128,128,.2);padding-top:16px}',
    '.pavo-dependency-editor-head{display:grid;gap:3px}',
    '.pavo-dependency-editor-head strong{font-size:12px}',
    '.pavo-dependency-editor-head span{font-size:11px;line-height:1.45;opacity:.58}',
    '.pavo-dependency-choice{display:grid;grid-template-columns:auto minmax(0,1fr) 104px;align-items:center;gap:8px;border:1px solid rgba(128,128,128,.2);border-radius:8px;padding:8px}',
    '.pavo-dependency-choice label{display:grid;gap:2px;min-width:0;cursor:pointer}',
    '.pavo-dependency-choice strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}',
    '.pavo-dependency-choice small{font-size:9px;opacity:.5}',
    '.pavo-drawer-backdrop{position:fixed;inset:0;z-index:900;background:rgba(12,16,24,.42);animation:pavo-fade-in .18s ease-out}',
    '.pavo-drawer{position:absolute;inset:0 0 0 auto;display:flex;width:min(480px,100vw);box-sizing:border-box;flex-direction:column;border-left:1px solid rgba(128,128,128,.28);background:var(--color-background,Canvas);color:inherit;box-shadow:-18px 0 54px rgba(0,0,0,.24);animation:pavo-drawer-in .22s cubic-bezier(.2,.8,.2,1)}',
    '.pavo-drawer-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;border-bottom:1px solid rgba(128,128,128,.22);padding:18px 20px 16px}',
    '.pavo-drawer-heading{display:grid;gap:4px;min-width:0}',
    '.pavo-drawer-eyebrow{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;opacity:.55}',
    '.pavo-drawer-title{margin:0;font-size:20px;line-height:1.25;letter-spacing:-.02em}',
    '.pavo-drawer-close{display:inline-flex;align-items:center;justify-content:center;min-width:58px;height:34px;flex:none;padding:0 10px;border:1px solid rgba(128,128,128,.28);border-radius:8px;background:transparent;color:inherit;cursor:pointer;font-size:20px;line-height:1}',
    '.pavo-drawer-close:hover{background:rgba(128,128,128,.1)}',
    '.pavo-drawer-content{flex:1;min-height:0;overflow-y:auto;padding:20px}',
    '.pavo-drawer-form{display:grid;gap:16px}',
    '.pavo-drawer-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}',
    '.pavo-drawer-meta{display:grid;gap:10px;border-top:1px solid rgba(128,128,128,.2);padding-top:16px}',
    '.pavo-drawer-meta-row{display:grid;grid-template-columns:88px minmax(0,1fr);gap:12px;font-size:12px;line-height:1.45}',
    '.pavo-drawer-meta-label{font-weight:650;opacity:.55}',
    '.pavo-drawer-id{overflow-wrap:anywhere;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;opacity:.68}',
    '.pavo-drawer-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid rgba(128,128,128,.22);padding:14px 20px}',
    '.pavo-drawer-footer-end{display:flex;justify-content:flex-end;gap:8px;margin-left:auto}',
    '.pavo-template-list{display:grid;gap:10px}',
    '.pavo-template-row{display:grid;gap:10px;border:1px solid rgba(128,128,128,.24);border-radius:11px;padding:12px;background:rgba(128,128,128,.035)}',
    '.pavo-template-row-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}',
    '.pavo-template-row-title{display:grid;gap:3px;min-width:0}',
    '.pavo-template-row-title strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}',
    '.pavo-template-row-title span{font-size:10px;opacity:.56}',
    '.pavo-template-kind{display:inline-flex;border-radius:999px;padding:3px 7px;background:rgba(118,86,181,.12);color:#7656b5;font-size:9px;font-weight:750;letter-spacing:.05em;text-transform:uppercase}',
    '.pavo-template-row-actions{display:flex;flex-wrap:wrap;gap:6px}',
    '.pavo-template-row-actions .pavo-button{min-height:30px;padding:3px 8px;font-size:10px}',
    '.pavo-template-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}',
    '.pavo-template-summary{border:1px solid rgba(118,86,181,.22);border-radius:10px;padding:10px;background:rgba(118,86,181,.055);font-size:11px;line-height:1.5}',
    '.pavo-settings{box-sizing:border-box;display:grid;align-content:start;gap:18px;width:min(680px,100%);padding:4px 2px 24px;color:inherit}',
    '.pavo-settings h2{margin:0;font-size:22px;letter-spacing:-.02em}',
    '.pavo-settings-copy{margin:-8px 0 0;font-size:13px;line-height:1.55;opacity:.68}',
    '.pavo-settings-section{display:grid;gap:14px;border-top:1px solid rgba(128,128,128,.2);padding-top:18px}',
    '.pavo-settings-section:first-of-type{border-top:0;padding-top:0}',
    '.pavo-settings-section h3{margin:0;font-size:15px;letter-spacing:-.01em}',
    '.pavo-settings-section>p{margin:-8px 0 0;font-size:12px;line-height:1.5;opacity:.62}',
    '.pavo-settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '.pavo-settings-span{grid-column:1/-1}',
    '.pavo-checks{display:flex;flex-wrap:wrap;gap:10px 18px}',
    '.pavo-check{display:inline-flex;align-items:center;gap:7px;font-size:12px;cursor:pointer}',
    '.pavo-check input{accent-color:#2f5fc7}',
    '.pavo-settings-actions{display:flex;align-items:center;justify-content:space-between;gap:12px}',
    '.pavo-settings-saved{font-size:12px;color:#438a61}',
    '.pavo-settings-warning{border:1px solid rgba(210,145,45,.35);border-radius:9px;padding:10px 11px;font-size:12px;line-height:1.45;color:#b47b28}',
    '.pavo-project-add{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}',
    '.pavo-project-list{display:grid;gap:8px;margin:0;padding:0;list-style:none}',
    '.pavo-project-row{display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid rgba(128,128,128,.25);border-radius:9px;padding:9px 10px}',
    '.pavo-project-empty{border:1px dashed rgba(128,128,128,.3);border-radius:9px;padding:16px;font-size:13px;opacity:.62}',
    '.pavo-snackbar{position:fixed;right:22px;bottom:22px;z-index:1000;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:start;gap:10px;width:min(380px,calc(100vw - 32px));box-sizing:border-box;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(30,30,32,.96);box-shadow:0 14px 38px rgba(0,0,0,.28);padding:12px 13px;color:#fff;animation:pavo-snackbar-in .18s ease-out}',
    '.pavo-snackbar-icon{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:#d85c5c;color:#fff;font-size:12px;font-weight:750}',
    '.pavo-snackbar-copy{display:grid;gap:2px;min-width:0}',
    '.pavo-snackbar-title{font-size:13px;font-weight:650;line-height:1.35}',
    '.pavo-snackbar-message{font-size:12px;line-height:1.45;color:rgba(255,255,255,.7)}',
    '.pavo-snackbar-close{border:0;background:transparent;color:#fff;cursor:pointer;font-size:17px;line-height:1;opacity:.55;padding:1px 2px}',
    '.pavo-snackbar-close:hover{opacity:1}',
    '@keyframes pavo-snackbar-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}',
    '@keyframes pavo-fade-in{from{opacity:0}to{opacity:1}}',
    '@keyframes pavo-drawer-in{from{transform:translateX(100%)}to{transform:translateX(0)}}',
    '@media(prefers-reduced-motion:reduce){.pavo-snackbar,.pavo-drawer-backdrop,.pavo-drawer{animation:none}.pavo-work{transition:none}}',
    '@media(max-width:720px){.pavo-root{padding:12px}.pavo-column{flex-basis:84vw}.pavo-toolbar{align-items:flex-start;flex-wrap:wrap}.pavo-heading{display:grid;gap:2px}.pavo-toolbar-actions{width:100%;justify-content:space-between}.pavo-flow{grid-template-columns:1fr;overflow-y:auto}.pavo-flow-canvas{min-height:420px}.pavo-flow-detail{min-height:280px}.pavo-settings-grid{grid-template-columns:1fr}.pavo-settings-span{grid-column:auto}.pavo-drawer-grid{grid-template-columns:1fr}.pavo-drawer-header,.pavo-drawer-content,.pavo-drawer-footer{padding-left:16px;padding-right:16px}.pavo-snackbar{right:16px;bottom:16px}}',
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
      throw new Error(payload?.error || `Pavo request failed (${response.status}).`)
    }
    return payload.value
  }

  function compareWaterLevels(left, right) {
    const normalize = (value) => {
      const match = WATER_LEVEL_PATTERN.exec(String(value).trim())
      if (!match) return ['0', '']
      return [match[1].replace(/^0+(?=\d)/u, ''), (match[2] || '').replace(/0+$/u, '')]
    }
    const [leftInteger, leftFraction] = normalize(left)
    const [rightInteger, rightFraction] = normalize(right)
    if (leftInteger.length !== rightInteger.length) {
      return leftInteger.length < rightInteger.length ? -1 : 1
    }
    if (leftInteger !== rightInteger) return leftInteger < rightInteger ? -1 : 1
    const width = Math.max(leftFraction.length, rightFraction.length)
    const paddedLeft = leftFraction.padEnd(width, '0')
    const paddedRight = rightFraction.padEnd(width, '0')
    return paddedLeft === paddedRight ? 0 : paddedLeft < paddedRight ? -1 : 1
  }

  function dependencyState(current, acknowledged) {
    const comparison = compareWaterLevels(current, acknowledged)
    return comparison > 0 ? 'changed' : comparison < 0 ? 'rollback' : 'synchronized'
  }

  function emptyDraft(project = '', workflowId = ROOT_WORKFLOW_ID) {
    return {
      type: 'goal',
      project,
      workflowId,
      key: '',
      title: '',
      description: '',
      assignee: '',
      waterLevel: '0',
      upstreamWaterLevels: {},
    }
  }

  function isValidDraft(draft) {
    return (
      ['goal', 'ongoing'].includes(draft.type) &&
      draft.title.trim().length > 0 &&
      WATER_LEVEL_PATTERN.test(draft.waterLevel.trim()) &&
      Object.values(draft.upstreamWaterLevels).every((value) =>
        WATER_LEVEL_PATTERN.test(value.trim()),
      )
    )
  }

  function workMatchesDraft(work, draft) {
    if (!work) return false
    const fields = [
      'type',
      'project',
      'workflowId',
      'key',
      'title',
      'description',
      'assignee',
      'waterLevel',
    ]
    if (fields.some((name) => work[name] !== draft[name])) return false
    const left = Object.entries(work.upstreamWaterLevels)
    const right = Object.entries(draft.upstreamWaterLevels)
    return (
      left.length === right.length &&
      left.every(([id, value]) => draft.upstreamWaterLevels[id] === value)
    )
  }

  function field(label, control, className = '') {
    return React.createElement(
      'label',
      { className: `pavo-field${className ? ` ${className}` : ''}` },
      React.createElement('span', null, label),
      control,
    )
  }

  function projectOptions(projects) {
    const nodes = [
      React.createElement(
        'option',
        { key: '', value: '' },
        'No project',
      ),
    ]
    for (const project of projects) {
      nodes.push(
        React.createElement('option', { key: project, value: project }, project),
      )
    }
    return nodes
  }

  function workflowPath(workflows, workflowId) {
    const byId = new Map(workflows.map((workflow) => [workflow.id, workflow]))
    const result = []
    const visited = new Set()
    let current = byId.get(workflowId)
    while (current && !visited.has(current.id)) {
      visited.add(current.id)
      result.unshift(current)
      current = current.parentWorkflowId ? byId.get(current.parentWorkflowId) : undefined
    }
    return result
  }

  function workflowOptions(workflows) {
    return workflows.map((workflow) =>
      React.createElement(
        'option',
        { key: workflow.id, value: workflow.id },
        workflowPath(workflows, workflow.id).map((item) => item.title).join(' / '),
      ),
    )
  }

  function editFieldControls({
    draft,
    setDraft,
    projects,
    workflows,
    busy,
    compact = false,
  }) {
    const update = (name) => (event) =>
      setDraft((current) => ({ ...current, [name]: event.target.value }))
    const controls = [
      field(
        'Work type',
        React.createElement(
          'select',
          {
            className: 'pavo-select',
            value: draft.type,
            disabled: busy,
            onChange: update('type'),
          },
          React.createElement('option', { value: 'goal' }, 'Goal Work'),
          React.createElement('option', { value: 'ongoing' }, 'Ongoing Work'),
        ),
      ),
      field(
        'Project',
        React.createElement(
          'select',
          {
            className: 'pavo-select',
            value: draft.project,
            disabled: busy,
            onChange: update('project'),
          },
          projectOptions(projects),
        ),
      ),
      field(
        'Workflow',
        React.createElement(
          'select',
          {
            className: 'pavo-select',
            value: draft.workflowId,
            disabled: busy,
            onChange: update('workflowId'),
          },
          workflowOptions(workflows),
        ),
      ),
      field(
        'KEY',
        React.createElement('input', {
          className: 'pavo-input',
          value: draft.key,
          disabled: busy,
          maxLength: 128,
          onChange: update('key'),
        }),
      ),
      field(
        'Title',
        React.createElement('input', {
          className: 'pavo-input',
          value: draft.title,
          disabled: busy,
          maxLength: 500,
          onChange: update('title'),
        }),
        compact ? '' : 'pavo-field-title',
      ),
      field(
        'Assignee',
        React.createElement('input', {
          className: 'pavo-input',
          value: draft.assignee,
          disabled: busy,
          maxLength: 256,
          onChange: update('assignee'),
        }),
      ),
      field(
        'WaterLevel',
        React.createElement('input', {
          className: 'pavo-input',
          value: draft.waterLevel,
          disabled: busy,
          inputMode: 'decimal',
          pattern: '\\d+(?:\\.\\d+)?',
          onChange: update('waterLevel'),
        }),
      ),
      field(
        'Description',
        React.createElement('textarea', {
          className: 'pavo-textarea',
          value: draft.description,
          disabled: busy,
          maxLength: 50000,
          placeholder: 'Describe the Work. An Agent uses this text directly as its Prompt.',
          onChange: update('description'),
        }),
        compact ? '' : 'pavo-field-description',
      ),
    ]
    return controls
  }

  function DependencyEditor({ work, works, draft, setDraft, busy }) {
    const candidates = works.filter((candidate) => candidate.id !== work?.id)
    const toggle = (candidate, checked) => {
      setDraft((current) => {
        const upstreamWaterLevels = { ...current.upstreamWaterLevels }
        if (checked) upstreamWaterLevels[candidate.id] = candidate.waterLevel
        else delete upstreamWaterLevels[candidate.id]
        return { ...current, upstreamWaterLevels }
      })
    }
    const updateLevel = (id, value) => {
      setDraft((current) => ({
        ...current,
        upstreamWaterLevels: {
          ...current.upstreamWaterLevels,
          [id]: value,
        },
      }))
    }

    return React.createElement(
      'section',
      { className: 'pavo-dependency-editor' },
      React.createElement(
        'div',
        { className: 'pavo-dependency-editor-head' },
        React.createElement('strong', null, 'Upstream Works'),
        React.createElement(
          'span',
          null,
          'Select dependencies and record the last upstream WaterLevel this Work has handled.',
        ),
      ),
      candidates.length === 0
        ? React.createElement(
            'div',
            { className: 'pavo-flow-empty' },
            'Create another Work to add an upstream dependency.',
          )
        : candidates.map((candidate) => {
            const checked = Object.prototype.hasOwnProperty.call(
              draft.upstreamWaterLevels,
              candidate.id,
            )
            return React.createElement(
              'div',
              { className: 'pavo-dependency-choice', key: candidate.id },
              React.createElement('input', {
                id: `pavo-dependency-${candidate.id}`,
                type: 'checkbox',
                checked,
                disabled: busy,
                onChange: (event) => toggle(candidate, event.target.checked),
              }),
              React.createElement(
                'label',
                { htmlFor: `pavo-dependency-${candidate.id}` },
                React.createElement(
                  'strong',
                  null,
                  `${candidate.key || 'NO KEY'} · ${candidate.title}`,
                ),
                React.createElement(
                  'small',
                  null,
                  `Current WaterLevel ${candidate.waterLevel}`,
                ),
              ),
              checked
                ? React.createElement('input', {
                    className: 'pavo-input',
                    value: draft.upstreamWaterLevels[candidate.id],
                    disabled: busy,
                    inputMode: 'decimal',
                    'aria-label': `Acknowledged WaterLevel for ${candidate.title}`,
                    onChange: (event) => updateLevel(candidate.id, event.target.value),
                  })
                : React.createElement('span', null),
            )
          }),
    )
  }

  function WorkDrawer({
    mode,
    work,
    works,
    columns,
    projects,
    workflows,
    draft,
    setDraft,
    targetColumn,
    setTargetColumn,
    busy,
    stale,
    closeRef,
    onClose,
    onCreate,
    onSave,
    onRemove,
    onSaveTemplate,
  }) {
    if (!mode) return null
    const creating = mode === 'create'
    if (!creating && !work) return null
    const valid = !stale && isValidDraft(draft)
    const workIsSaved = creating || workMatchesDraft(work, draft)
    const column = work
      ? columns.find((candidate) => candidate.id === work.columnId)
      : undefined
    const heading = creating ? 'Create Work' : draft.title || 'Work details'
    const eyebrow = creating
      ? 'New Work'
      : [draft.key || 'NO KEY', draft.project || 'No project'].join(' · ')

    return React.createElement(
      'div',
      {
        className: 'pavo-drawer-backdrop',
        onMouseDown: (event) => {
          if (event.target === event.currentTarget) onClose()
        },
      },
      React.createElement(
        'aside',
        {
          className: 'pavo-drawer',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-labelledby': 'pavo-drawer-title',
        },
        React.createElement(
          'header',
          { className: 'pavo-drawer-header' },
          React.createElement(
            'div',
            { className: 'pavo-drawer-heading' },
            React.createElement('span', { className: 'pavo-drawer-eyebrow' }, eyebrow),
            React.createElement(
              'h2',
              { className: 'pavo-drawer-title', id: 'pavo-drawer-title' },
              heading,
            ),
          ),
          React.createElement(
            'button',
            {
              ref: closeRef,
              type: 'button',
              className: 'pavo-drawer-close',
              disabled: busy,
              onClick: onClose,
            },
            'Close',
          ),
        ),
        React.createElement(
          'div',
          { className: 'pavo-drawer-content' },
          stale
            ? React.createElement(
                'div',
                { className: 'pavo-notice' },
                'The board changed after this drawer opened. Close and reopen it to review the latest values before saving.',
              )
            : null,
          React.createElement(
            'div',
            { className: 'pavo-drawer-form' },
            ...editFieldControls({
              draft,
              setDraft,
              projects,
              workflows,
              busy,
              compact: true,
            }),
            React.createElement(DependencyEditor, {
              work,
              works,
              draft,
              setDraft,
              busy,
            }),
            creating
              ? field(
                  'Column',
                  React.createElement(
                    'select',
                    {
                      className: 'pavo-select',
                      value: targetColumn,
                      disabled: busy,
                      onChange: (event) => setTargetColumn(event.target.value),
                    },
                    columns.map((candidate) =>
                      React.createElement(
                        'option',
                        { key: candidate.id, value: candidate.id },
                        candidate.title,
                      ),
                    ),
                  ),
                )
              : React.createElement(
                  'div',
                  { className: 'pavo-drawer-meta' },
                  React.createElement(
                    'div',
                    { className: 'pavo-drawer-meta-row' },
                    React.createElement(
                      'span',
                      { className: 'pavo-drawer-meta-label' },
                      'Column',
                    ),
                    React.createElement('span', null, column?.title || work?.columnId || ''),
                  ),
                  React.createElement(
                    'div',
                    { className: 'pavo-drawer-meta-row' },
                    React.createElement(
                      'span',
                      { className: 'pavo-drawer-meta-label' },
                      'Created',
                    ),
                    React.createElement(
                      'span',
                      null,
                      work?.createdAt ? new Date(work.createdAt).toLocaleString() : '',
                    ),
                  ),
                  React.createElement(
                    'div',
                    { className: 'pavo-drawer-meta-row' },
                    React.createElement(
                      'span',
                      { className: 'pavo-drawer-meta-label' },
                      'Updated',
                    ),
                    React.createElement(
                      'span',
                      null,
                      work?.updatedAt ? new Date(work.updatedAt).toLocaleString() : '',
                    ),
                  ),
                  React.createElement(
                    'div',
                    { className: 'pavo-drawer-meta-row' },
                    React.createElement(
                      'span',
                      { className: 'pavo-drawer-meta-label' },
                      'ID',
                    ),
                    React.createElement(
                      'span',
                      { className: 'pavo-drawer-id' },
                      work?.id || '',
                    ),
                  ),
                ),
          ),
        ),
        React.createElement(
          'footer',
          { className: 'pavo-drawer-footer' },
          !creating
            ? React.createElement(
                'button',
                {
                  type: 'button',
                  className: 'pavo-button',
                  disabled: busy || stale || !workIsSaved,
                  title: workIsSaved
                    ? 'Save the current Work as a reusable template.'
                    : 'Save the Work changes before creating a template.',
                  onClick: () => onSaveTemplate(work),
                },
                'Save as template',
              )
            : null,
          !creating
            ? React.createElement(
                'button',
                {
                  type: 'button',
                  className: 'pavo-button pavo-button-danger',
                  disabled: busy || stale,
                  onClick: () => onRemove(work.id),
                },
                'Delete',
              )
            : null,
          React.createElement(
            'div',
            { className: 'pavo-drawer-footer-end' },
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'pavo-button',
                disabled: busy,
                onClick: onClose,
              },
              'Cancel',
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'pavo-button pavo-button-primary',
                disabled: busy || !valid,
                onClick: creating ? onCreate : onSave,
              },
              creating ? 'Create Work' : 'Save changes',
            ),
          ),
        ),
      ),
    )
  }

  function WorkflowDrawer({
    mode,
    workflow,
    title,
    setTitle,
    busy,
    stale,
    closeRef,
    onClose,
    onCreate,
    onSave,
  }) {
    if (!mode) return null
    const creating = mode === 'create-workflow'
    return React.createElement(
      'div',
      {
        className: 'pavo-drawer-backdrop',
        onMouseDown: (event) => {
          if (event.target === event.currentTarget) onClose()
        },
      },
      React.createElement(
        'aside',
        {
          className: 'pavo-drawer',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-labelledby': 'pavo-workflow-drawer-title',
        },
        React.createElement(
          'header',
          { className: 'pavo-drawer-header' },
          React.createElement(
            'div',
            { className: 'pavo-drawer-heading' },
            React.createElement(
              'span',
              { className: 'pavo-drawer-eyebrow' },
              creating ? 'New Workflow' : 'Workflow details',
            ),
            React.createElement(
              'h2',
              { className: 'pavo-drawer-title', id: 'pavo-workflow-drawer-title' },
              creating ? 'Create Workflow' : workflow?.title || 'Rename Workflow',
            ),
          ),
          React.createElement(
            'button',
            {
              ref: closeRef,
              type: 'button',
              className: 'pavo-drawer-close',
              disabled: busy,
              onClick: onClose,
            },
            'Close',
          ),
        ),
        React.createElement(
          'div',
          { className: 'pavo-drawer-content' },
          stale
            ? React.createElement(
                'div',
                { className: 'pavo-notice' },
                'The board changed after this drawer opened. Close and reopen it before saving.',
              )
            : null,
          field(
            'Workflow title',
            React.createElement('input', {
              className: 'pavo-input',
              value: title,
              disabled: busy,
              maxLength: 500,
              autoFocus: true,
              onChange: (event) => setTitle(event.target.value),
            }),
          ),
        ),
        React.createElement(
          'footer',
          { className: 'pavo-drawer-footer' },
          React.createElement(
            'div',
            { className: 'pavo-drawer-footer-end' },
            React.createElement(
              'button',
              { type: 'button', className: 'pavo-button', disabled: busy, onClick: onClose },
              'Cancel',
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'pavo-button pavo-button-primary',
                disabled: busy || stale || title.trim().length === 0,
                onClick: creating ? onCreate : onSave,
              },
              creating ? 'Create Workflow' : 'Save changes',
            ),
          ),
        ),
      ),
    )
  }

  function templateCounts(template) {
    if (template.kind === 'work') {
      return { works: 1, workflows: 0, dependencies: 0 }
    }
    return {
      works: template.content.works.length,
      workflows:
        template.content.workflows.length -
        (template.content.mapRootToTarget ? 1 : 0),
      dependencies: template.content.works.reduce(
        (count, work) => count + Object.keys(work.upstreamWaterLevels).length,
        0,
      ),
    }
  }

  let templateDraftIdSequence = 0

  function templateDraftId(prefix) {
    templateDraftIdSequence += 1
    return `${prefix}-${Date.now().toString(36)}-${templateDraftIdSequence}`
  }

  function WorkflowTemplateEditor({ draft, setDraft, projects, columns, busy }) {
    const content = draft.content
    if (!content) return null
    const setContent = (updater) =>
      setDraft((current) => ({
        ...current,
        content: updater(current.content),
      }))
    const childIds = (workflowId) => {
      const result = new Set([workflowId])
      let changed = true
      while (changed) {
        changed = false
        for (const workflow of content.workflows) {
          if (workflow.parentWorkflowId && result.has(workflow.parentWorkflowId) && !result.has(workflow.id)) {
            result.add(workflow.id)
            changed = true
          }
        }
      }
      return result
    }
    const updateWorkflow = (workflowId, fieldName, value) =>
      setContent((current) => ({
        ...current,
        workflows: current.workflows.map((workflow) =>
          workflow.id === workflowId
            ? { ...workflow, [fieldName]: value }
            : workflow,
        ),
      }))
    const addWorkflow = () => {
      const id = templateDraftId('workflow')
      setContent((current) => ({
        ...current,
        workflows: [
          ...current.workflows,
          {
            id,
            title: 'New Workflow',
            parentWorkflowId: current.rootWorkflowId,
          },
        ],
      }))
    }
    const removeWorkflow = (workflowId) =>
      setContent((current) => ({
        ...current,
        workflows: current.workflows.filter((workflow) => workflow.id !== workflowId),
      }))
    const addTemplateWork = () => {
      const id = templateDraftId('work')
      setContent((current) => ({
        ...current,
        works: [
          ...current.works,
          {
            id,
            type: 'goal',
            project: '',
            key: '',
            title: 'New Work',
            description: '',
            assignee: '',
            waterLevel: '0',
            upstreamWaterLevels: {},
            workflowId: current.rootWorkflowId,
            columnId: columns[0]?.id || '',
          },
        ],
      }))
    }
    const updateTemplateWork = (workId, fieldName, value) =>
      setContent((current) => ({
        ...current,
        works: current.works.map((work) =>
          work.id === workId ? { ...work, [fieldName]: value } : work,
        ),
      }))
    const removeTemplateWork = (workId) =>
      setContent((current) => ({
        ...current,
        works: current.works
          .filter((work) => work.id !== workId)
          .map((work) => {
            const upstreamWaterLevels = { ...work.upstreamWaterLevels }
            delete upstreamWaterLevels[workId]
            return { ...work, upstreamWaterLevels }
          }),
      }))
    const updateTemplateDependency = (workId, upstreamId, checked, value) =>
      setContent((current) => ({
        ...current,
        works: current.works.map((work) => {
          if (work.id !== workId) return work
          const upstreamWaterLevels = { ...work.upstreamWaterLevels }
          if (checked) upstreamWaterLevels[upstreamId] = value ?? '0'
          else delete upstreamWaterLevels[upstreamId]
          return { ...work, upstreamWaterLevels }
        }),
      }))

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        'div',
        { className: 'pavo-template-summary', 'data-testid': 'pavo-template-tree-editor' },
        `${content.workflows.length} Workflows · ${content.works.length} Works. Internal dependency cycles are allowed.`,
      ),
      React.createElement(
        'div',
        { className: 'pavo-template-list' },
        content.workflows.map((workflow) => {
          const root = workflow.id === content.rootWorkflowId
          const blockedRemoval =
            root ||
            content.workflows.some((item) => item.parentWorkflowId === workflow.id) ||
            content.works.some((work) => work.workflowId === workflow.id)
          const descendants = childIds(workflow.id)
          return React.createElement(
            'div',
            { className: 'pavo-template-row', key: workflow.id },
            React.createElement(
              'div',
              { className: 'pavo-template-row-head' },
              React.createElement('span', { className: 'pavo-template-kind' }, root ? 'Template root' : 'Workflow'),
              !root
                ? React.createElement(
                    'button',
                    {
                      type: 'button', className: 'pavo-button pavo-button-danger',
                      disabled: busy || blockedRemoval,
                      title: blockedRemoval ? 'Move or remove its contents first.' : 'Remove Workflow',
                      onClick: () => removeWorkflow(workflow.id),
                    },
                    'Remove',
                  )
                : null,
            ),
            field('Title', React.createElement('input', {
              className: 'pavo-input', value: workflow.title, disabled: busy,
              maxLength: 500,
              onChange: (event) => updateWorkflow(workflow.id, 'title', event.target.value),
            })),
            !root
              ? field(
                  'Parent Workflow',
                  React.createElement(
                    'select',
                    {
                      className: 'pavo-select', value: workflow.parentWorkflowId,
                      disabled: busy,
                      onChange: (event) => updateWorkflow(workflow.id, 'parentWorkflowId', event.target.value),
                    },
                    content.workflows
                      .filter((candidate) => !descendants.has(candidate.id))
                      .map((candidate) =>
                        React.createElement('option', { key: candidate.id, value: candidate.id }, candidate.title),
                      ),
                  ),
                )
              : null,
          )
        }),
      ),
      React.createElement(
        'button',
        { type: 'button', className: 'pavo-button', disabled: busy, onClick: addWorkflow },
        'Add child Workflow',
      ),
      content.works.length
        ? React.createElement(
            'div',
            { className: 'pavo-template-list' },
            content.works.map((work) =>
              React.createElement(
                'div',
                { className: 'pavo-template-row', key: work.id },
                React.createElement(
                  'div',
                  { className: 'pavo-template-row-head' },
                  React.createElement('span', { className: 'pavo-template-kind' }, work.type === 'goal' ? 'Goal Work' : 'Ongoing Work'),
                  React.createElement(
                    'button',
                    {
                      type: 'button', className: 'pavo-button pavo-button-danger', disabled: busy,
                      onClick: () => removeTemplateWork(work.id),
                    },
                    'Remove',
                  ),
                ),
                field('Title', React.createElement('input', {
                  className: 'pavo-input', value: work.title, disabled: busy, maxLength: 500,
                  onChange: (event) => updateTemplateWork(work.id, 'title', event.target.value),
                })),
                React.createElement(
                  'div',
                  { className: 'pavo-drawer-grid' },
                  field('Type', React.createElement(
                    'select',
                    {
                      className: 'pavo-select', value: work.type, disabled: busy,
                      onChange: (event) => updateTemplateWork(work.id, 'type', event.target.value),
                    },
                    React.createElement('option', { value: 'goal' }, 'Goal'),
                    React.createElement('option', { value: 'ongoing' }, 'Ongoing'),
                  )),
                  field('Workflow', React.createElement(
                    'select',
                    {
                      className: 'pavo-select', value: work.workflowId, disabled: busy,
                      onChange: (event) => updateTemplateWork(work.id, 'workflowId', event.target.value),
                    },
                    content.workflows.map((candidate) =>
                      React.createElement('option', { key: candidate.id, value: candidate.id }, candidate.title),
                    ),
                  )),
                  field('Project', React.createElement(
                    'select',
                    {
                      className: 'pavo-select', value: work.project, disabled: busy,
                      onChange: (event) => updateTemplateWork(work.id, 'project', event.target.value),
                    },
                    projectOptions(projects),
                  )),
                  field('KEY', React.createElement('input', {
                    className: 'pavo-input', value: work.key, disabled: busy, maxLength: 128,
                    onChange: (event) => updateTemplateWork(work.id, 'key', event.target.value),
                  })),
                  field('Assignee', React.createElement('input', {
                    className: 'pavo-input', value: work.assignee, disabled: busy, maxLength: 256,
                    onChange: (event) => updateTemplateWork(work.id, 'assignee', event.target.value),
                  })),
                  field('WaterLevel', React.createElement('input', {
                    className: 'pavo-input', value: work.waterLevel, disabled: busy, inputMode: 'decimal',
                    onChange: (event) => updateTemplateWork(work.id, 'waterLevel', event.target.value),
                  })),
                  field('Column', React.createElement(
                    'select',
                    {
                      className: 'pavo-select', value: work.columnId, disabled: busy,
                      onChange: (event) => updateTemplateWork(work.id, 'columnId', event.target.value),
                    },
                    columns.map((column) =>
                      React.createElement('option', { key: column.id, value: column.id }, column.title),
                    ),
                  )),
                ),
                field('Description', React.createElement('textarea', {
                  className: 'pavo-textarea', value: work.description, disabled: busy, maxLength: 50000,
                  onChange: (event) => updateTemplateWork(work.id, 'description', event.target.value),
                })),
                content.works.length > 1
                  ? React.createElement(
                      'div',
                      { className: 'pavo-dependency-editor' },
                      React.createElement('strong', null, 'Internal upstream Works'),
                      content.works
                        .filter((candidate) => candidate.id !== work.id)
                        .map((candidate) => {
                          const checked = Object.hasOwn(work.upstreamWaterLevels, candidate.id)
                          return React.createElement(
                            'div',
                            { className: 'pavo-dependency-choice', key: candidate.id },
                            React.createElement('input', {
                              type: 'checkbox', checked, disabled: busy,
                              onChange: (event) => updateTemplateDependency(work.id, candidate.id, event.target.checked, '0'),
                            }),
                            React.createElement('label', null, React.createElement('strong', null, candidate.title)),
                            checked
                              ? React.createElement('input', {
                                  className: 'pavo-input', value: work.upstreamWaterLevels[candidate.id],
                                  disabled: busy, inputMode: 'decimal',
                                  'aria-label': `Acknowledged WaterLevel for ${candidate.title}`,
                                  onChange: (event) => updateTemplateDependency(work.id, candidate.id, true, event.target.value),
                                })
                              : React.createElement('span', null),
                          )
                        }),
                    )
                  : null,
              ),
            ),
          )
        : null,
      React.createElement(
        'button',
        { type: 'button', className: 'pavo-button', disabled: busy, onClick: addTemplateWork },
        'Add Work',
      ),
    )
  }

  function TemplateLibraryDrawer({
    mode,
    templates,
    projects,
    columns,
    workflows,
    draft,
    setDraft,
    targetWorkflowId,
    setTargetWorkflowId,
    busy,
    stale,
    closeRef,
    onClose,
    onShowLibrary,
    onCreate,
    onEdit,
    onApply,
    onDelete,
    onSave,
    onInstantiate,
  }) {
    if (!mode) return null
    const update = (name) => (event) =>
      setDraft((current) => ({ ...current, [name]: event.target.value }))
    const selected = templates.find((template) => template.id === draft?.templateId)
    const editing = mode === 'template-edit'
    const applying = mode === 'template-apply'
    const title = editing
      ? draft?.templateId
        ? 'Edit template'
        : draft?.sourceWorkId || draft?.sourceWorkflowId
          ? 'Save as template'
          : 'Create template'
      : applying
        ? 'Use template'
        : 'Reusable structures'
    const workEditor = editing && draft?.kind === 'work'
    const workflowEditor = editing && draft?.kind === 'workflow'
    const scratch = !draft?.sourceWorkId && !draft?.sourceWorkflowId
    const workflowDraftValid =
      !workflowEditor ||
      !scratch ||
      Boolean(
        draft?.content?.workflows?.every((workflow) => workflow.title.trim()) &&
          draft?.content?.works?.every(
            (work) => work.title.trim() && /^\d+(?:\.\d+)?$/.test(work.waterLevel),
          ),
      )

    return React.createElement(
      'div',
      {
        className: 'pavo-drawer-backdrop',
        onMouseDown: (event) => {
          if (event.target === event.currentTarget) onClose()
        },
      },
      React.createElement(
        'aside',
        {
          className: 'pavo-drawer',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-labelledby': 'pavo-template-drawer-title',
          'data-testid': 'pavo-template-library',
        },
        React.createElement(
          'header',
          { className: 'pavo-drawer-header' },
          React.createElement(
            'div',
            { className: 'pavo-drawer-heading' },
            React.createElement(
              'span',
              { className: 'pavo-drawer-eyebrow' },
              'Template Library',
            ),
            React.createElement(
              'h2',
              { className: 'pavo-drawer-title', id: 'pavo-template-drawer-title' },
              title,
            ),
          ),
          React.createElement(
            'button',
            {
              ref: closeRef,
              type: 'button',
              className: 'pavo-drawer-close',
              disabled: busy,
              onClick: onClose,
            },
            'Close',
          ),
        ),
        React.createElement(
          'div',
          { className: 'pavo-drawer-content' },
          stale
            ? React.createElement(
                'div',
                { className: 'pavo-notice' },
                'The board changed after the Template Library opened. Reopen it before saving.',
              )
            : null,
          mode === 'template-library'
            ? React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  'div',
                  { className: 'pavo-template-actions' },
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'pavo-button',
                      disabled: busy,
                      onClick: () => onCreate('work'),
                    },
                    'New Work template',
                  ),
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'pavo-button',
                      disabled: busy,
                      onClick: () => onCreate('workflow'),
                    },
                    'New Workflow template',
                  ),
                ),
                templates.length === 0
                  ? React.createElement(
                      'div',
                      { className: 'pavo-flow-empty' },
                      'No templates yet. Create one from scratch or save a current Work or Workflow subtree.',
                    )
                  : React.createElement(
                      'div',
                      { className: 'pavo-template-list' },
                      templates.map((template) => {
                        const counts = templateCounts(template)
                        return React.createElement(
                          'article',
                          {
                            className: 'pavo-template-row',
                            key: template.id,
                            'data-testid': 'pavo-template-row',
                          },
                          React.createElement(
                            'div',
                            { className: 'pavo-template-row-head' },
                            React.createElement(
                              'div',
                              { className: 'pavo-template-row-title' },
                              React.createElement('strong', null, template.name),
                              React.createElement(
                                'span',
                                { 'data-testid': 'pavo-template-counts' },
                                `${counts.workflows} Workflows · ${counts.works} Works · ${counts.dependencies} internal dependencies`,
                              ),
                            ),
                            React.createElement(
                              'span',
                              { className: 'pavo-template-kind' },
                              template.kind === 'work' ? 'Work' : 'Workflow subtree',
                            ),
                          ),
                          template.excludedExternalDependencies > 0
                            ? React.createElement(
                                'div',
                                { className: 'pavo-notice' },
                                `${template.excludedExternalDependencies} external dependencies were excluded when captured.`,
                              )
                            : null,
                          React.createElement(
                            'div',
                            { className: 'pavo-template-row-actions' },
                            React.createElement(
                              'button',
                              {
                                type: 'button',
                                className: 'pavo-button pavo-button-primary',
                                disabled: busy,
                                onClick: () => onApply(template),
                              },
                              'Use',
                            ),
                            React.createElement(
                              'button',
                              {
                                type: 'button',
                                className: 'pavo-button',
                                disabled: busy,
                                onClick: () => onEdit(template),
                              },
                              'Edit',
                            ),
                            React.createElement(
                              'button',
                              {
                                type: 'button',
                                className: 'pavo-button pavo-button-danger',
                                disabled: busy,
                                onClick: () => onDelete(template.id),
                              },
                              'Delete',
                            ),
                          ),
                        )
                      }),
                    ),
              )
            : editing
              ? React.createElement(
                  'div',
                  { className: 'pavo-drawer-form', 'data-testid': 'pavo-template-editor' },
                  field(
                    'Template name',
                    React.createElement('input', {
                      className: 'pavo-input',
                      value: draft.name,
                      disabled: busy,
                      maxLength: 500,
                      onChange: update('name'),
                    }),
                  ),
                  !scratch
                    ? React.createElement(
                        'div',
                        { className: 'pavo-template-summary' },
                        draft.sourceWorkId
                          ? 'The current Work fields will be captured. External dependencies are excluded.'
                          : 'The selected Workflow, all descendants, Works, and internal dependencies will be captured.',
                      )
                    : null,
                  workEditor && scratch
                    ? React.createElement(
                        React.Fragment,
                        null,
                        field(
                          'Work type',
                          React.createElement(
                            'select',
                            {
                              className: 'pavo-select',
                              value: draft.type,
                              disabled: busy,
                              onChange: update('type'),
                            },
                            React.createElement('option', { value: 'goal' }, 'Goal Work'),
                            React.createElement('option', { value: 'ongoing' }, 'Ongoing Work'),
                          ),
                        ),
                        field(
                          'Project',
                          React.createElement(
                            'select',
                            {
                              className: 'pavo-select',
                              value: draft.project,
                              disabled: busy,
                              onChange: update('project'),
                            },
                            projectOptions(projects),
                          ),
                        ),
                        field('KEY', React.createElement('input', {
                          className: 'pavo-input', value: draft.key, disabled: busy,
                          maxLength: 128, onChange: update('key'),
                        })),
                        field('Work title', React.createElement('input', {
                          className: 'pavo-input', value: draft.title, disabled: busy,
                          maxLength: 500, onChange: update('title'),
                        })),
                        field('Assignee', React.createElement('input', {
                          className: 'pavo-input', value: draft.assignee, disabled: busy,
                          maxLength: 256, onChange: update('assignee'),
                        })),
                        field('WaterLevel', React.createElement('input', {
                          className: 'pavo-input', value: draft.waterLevel, disabled: busy,
                          inputMode: 'decimal', onChange: update('waterLevel'),
                        })),
                        field(
                          'Initial column',
                          React.createElement(
                            'select',
                            {
                              className: 'pavo-select', value: draft.columnId,
                              disabled: busy, onChange: update('columnId'),
                            },
                            columns.map((column) =>
                              React.createElement('option', { key: column.id, value: column.id }, column.title),
                            ),
                          ),
                        ),
                        field('Description', React.createElement('textarea', {
                          className: 'pavo-textarea', value: draft.description,
                          disabled: busy, maxLength: 50000, onChange: update('description'),
                        })),
                      )
                    : null,
                  workflowEditor && scratch
                    ? React.createElement(WorkflowTemplateEditor, {
                        draft,
                        setDraft,
                        projects,
                        columns,
                        busy,
                      })
                    : null,
                )
              : applying && selected
                ? React.createElement(
                    'div',
                    { className: 'pavo-drawer-form', 'data-testid': 'pavo-template-instantiate' },
                    React.createElement(
                      'div',
                      { className: 'pavo-template-summary', 'data-testid': 'pavo-template-preview' },
                      `${selected.name} creates passive Pavo records only. It does not run Agents, update WaterLevels, or acknowledge dependencies.`,
                    ),
                    field(
                      'Destination Workflow',
                      React.createElement(
                        'select',
                        {
                          className: 'pavo-select', value: targetWorkflowId,
                          disabled: busy, onChange: (event) => setTargetWorkflowId(event.target.value),
                          'data-testid': 'pavo-template-target-workflow',
                        },
                        workflowOptions(workflows),
                      ),
                    ),
                  )
                : null,
        ),
        mode === 'template-library'
          ? null
          : React.createElement(
              'footer',
              { className: 'pavo-drawer-footer' },
              React.createElement(
                'button',
                { type: 'button', className: 'pavo-button', disabled: busy, onClick: onShowLibrary },
                'Back to library',
              ),
              React.createElement(
                'div',
                { className: 'pavo-drawer-footer-end' },
                React.createElement(
                  'button',
                  {
                    type: 'button', className: 'pavo-button pavo-button-primary',
                    disabled:
                      busy || stale ||
                      (editing && (!draft?.name?.trim() || (scratch && workEditor && !draft?.title?.trim()) || !workflowDraftValid)),
                    onClick: applying ? onInstantiate : onSave,
                  },
                  applying ? 'Create from template' : 'Save template',
                ),
              ),
            ),
      ),
    )
  }

  function WorkNode({ data: nodeData }) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Handle, {
        id: 'target-left',
        type: 'target',
        position: Position.Left,
        style: { top: '38%' },
      }),
      React.createElement(Handle, {
        id: 'source-left',
        type: 'source',
        position: Position.Left,
        style: { top: '64%' },
      }),
      React.createElement(
        'article',
        {
          className: `pavo-work-node${nodeData.selected ? ' pavo-work-node-selected' : ''}`,
          role: 'button',
          tabIndex: 0,
          'aria-pressed': nodeData.selected,
          'aria-label': `${nodeData.title}, ${nodeData.type} Work, WaterLevel ${nodeData.waterLevel}`,
          onClick: () => nodeData.onSelect(nodeData.id),
          onKeyDown: (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              nodeData.onSelect(nodeData.id)
            }
          },
        },
        React.createElement('div', { className: 'pavo-work-node-accent' }),
        React.createElement(
          'div',
          { className: 'pavo-work-node-body' },
          React.createElement(
            'div',
            { className: 'pavo-work-node-topline' },
            React.createElement(
              'span',
              { className: `pavo-work-type pavo-work-type-${nodeData.type}` },
              nodeData.type === 'goal' ? 'Goal' : 'Ongoing',
            ),
            React.createElement(
              'span',
              { className: 'pavo-work-level' },
              `WL ${nodeData.waterLevel}`,
            ),
          ),
          React.createElement(
            'div',
            { className: 'pavo-work-node-title' },
            nodeData.title,
          ),
          React.createElement(
            'div',
            { className: 'pavo-work-node-metrics' },
            React.createElement(
              'span',
              { className: 'pavo-work-node-index' },
              nodeData.key || 'NO KEY',
            ),
            React.createElement(
              'span',
              { className: 'pavo-work-node-exits' },
              `${nodeData.upstreamCount} upstream`,
            ),
          ),
        ),
      ),
      React.createElement(Handle, {
        id: 'target-right',
        type: 'target',
        position: Position.Right,
        style: { top: '38%' },
      }),
      React.createElement(Handle, {
        id: 'source-right',
        type: 'source',
        position: Position.Right,
        style: { top: '64%' },
      }),
    )
  }

  function WorkflowNode({ data: nodeData }) {
    return React.createElement(
      'article',
      {
        className: `pavo-workflow-node${nodeData.selected ? ' pavo-workflow-node-selected' : ''}`,
        role: 'button',
        tabIndex: 0,
        'aria-pressed': nodeData.selected,
        'aria-label': `${nodeData.title}, Workflow, ${nodeData.workCount} Works and ${nodeData.workflowCount} Workflows`,
        onClick: () => nodeData.onSelect(nodeData.id),
        onKeyDown: (event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            nodeData.onOpen(nodeData.id)
          } else if (event.key === ' ') {
            event.preventDefault()
            nodeData.onSelect(nodeData.id)
          }
        },
      },
      React.createElement('div', { className: 'pavo-workflow-node-accent' }),
      React.createElement(
        'div',
        { className: 'pavo-workflow-node-body' },
        React.createElement(
          'div',
          { className: 'pavo-workflow-node-kicker' },
          React.createElement('span', null, 'Workflow'),
          React.createElement('span', null, 'Open →'),
        ),
        React.createElement('div', { className: 'pavo-workflow-node-title' }, nodeData.title),
        React.createElement(
          'div',
          { className: 'pavo-workflow-node-meta' },
          `${nodeData.workCount} Works · ${nodeData.workflowCount} Workflows`,
        ),
      ),
    )
  }

  const FLOW_NODE_TYPES = { work: WorkNode, workflow: WorkflowNode }
  const FLOW_POSITIONS_KEY = '@dddrop/dsh-plugin-pavo/flow-positions:v2'

  function readFlowPositions(layoutKey) {
    if (typeof localStorage === 'undefined') return {}
    try {
      const value = JSON.parse(
        localStorage.getItem(`${FLOW_POSITIONS_KEY}:${layoutKey}`) || '{}',
      )
      if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        return {}
      }
      return Object.fromEntries(
        Object.entries(value).filter(
          ([, position]) =>
            position &&
            Number.isFinite(position.x) &&
            Number.isFinite(position.y),
        ),
      )
    } catch {
      return {}
    }
  }

  function writeFlowPositions(layoutKey, positions) {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(
        `${FLOW_POSITIONS_KEY}:${layoutKey}`,
        JSON.stringify(positions),
      )
    } catch {
      // Browser storage can be disabled without affecting the canvas.
    }
  }

  const workNodeId = (id) => `work:${id}`
  const workflowNodeId = (id) => `workflow:${id}`
  const domainNodeId = (id, prefix) =>
    typeof id === 'string' && id.startsWith(prefix) ? id.slice(prefix.length) : ''

  function flowNodes(
    data,
    currentWorkflowId,
    selectedNodeId,
    positions,
    onSelectNode,
    onOpenWork,
    onOpenWorkflow,
  ) {
    const childWorkflows = data.workflows.filter(
      (workflow) => workflow.parentWorkflowId === currentWorkflowId,
    )
    const directWorks = data.works.filter(
      (work) => work.workflowId === currentWorkflowId,
    )
    const workflowNodes = childWorkflows.map((workflow, index) => {
      const id = workflowNodeId(workflow.id)
      return {
        id,
        type: 'workflow',
        position: positions[id] ?? { x: index * 286, y: 40 },
        selected: id === selectedNodeId,
        data: {
          id: workflow.id,
          onOpen: onOpenWorkflow,
          onSelect: (workflowId) => onSelectNode(workflowNodeId(workflowId)),
          selected: id === selectedNodeId,
          title: workflow.title,
          workCount: data.works.filter((work) => work.workflowId === workflow.id).length,
          workflowCount: data.workflows.filter(
            (candidate) => candidate.parentWorkflowId === workflow.id,
          ).length,
        },
      }
    })
    const workNodes = directWorks.map((work, index) => {
      const id = workNodeId(work.id)
      return {
        id,
        type: 'work',
        position: positions[id] ?? {
          x: (index % 4) * 286,
          y: Math.floor(index / 4) * 190 + (childWorkflows.length > 0 ? 240 : 48),
        },
        selected: id === selectedNodeId,
        data: {
          id: work.id,
          key: work.key,
          onOpen: (workId) =>
            onOpenWork(data.works.find((candidate) => candidate.id === workId)),
          onSelect: (workId) => onSelectNode(workNodeId(workId)),
          selected: id === selectedNodeId,
          title: work.title,
          type: work.type,
          upstreamCount: Object.keys(work.upstreamWaterLevels).length,
          waterLevel: work.waterLevel,
        },
      }
    })
    return [...workflowNodes, ...workNodes]
  }

  function flowEdges(data, currentWorkflowId) {
    const visibleWorks = data.works.filter(
      (work) => work.workflowId === currentWorkflowId,
    )
    const indexById = new Map(visibleWorks.map((work, index) => [work.id, index]))
    const workById = new Map(data.works.map((work) => [work.id, work]))
    const visibleIds = new Set(visibleWorks.map((work) => work.id))
    const edges = []
    for (const target of visibleWorks) {
      for (const [sourceId, acknowledged] of Object.entries(target.upstreamWaterLevels)) {
        const source = workById.get(sourceId)
        if (!source || !visibleIds.has(sourceId)) continue
        const forwards = indexById.get(target.id) >= indexById.get(sourceId)
        const state = dependencyState(source.waterLevel, acknowledged)
        const color = state === 'changed' ? '#b27b2d' : state === 'rollback' ? '#bd5b5b' : '#6f83ae'
        edges.push({
          id: `${workNodeId(sourceId)}::${workNodeId(target.id)}`,
          source: workNodeId(sourceId),
          sourceHandle: forwards ? 'source-right' : 'source-left',
          target: workNodeId(target.id),
          targetHandle: forwards ? 'target-left' : 'target-right',
          type: 'smoothstep',
          label: state === 'synchronized' ? undefined : state,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color,
            height: 14,
            width: 14,
          },
          style: { stroke: color, strokeWidth: state === 'synchronized' ? 1.6 : 2.2 },
        })
      }
    }
    return edges
  }

  function FlowCanvas({
    data,
    currentWorkflowId,
    selectedNodeId,
    onSelectNode,
    onOpenWork,
    onOpenWorkflow,
    onEditWorkflow,
    onRemoveWorkflow,
    onSaveWorkTemplate,
    onSaveWorkflowTemplate,
    onUpdateDependencies,
    busy,
    layoutKey,
  }) {
    const positionsRef = React.useRef(null)
    if (positionsRef.current === null) {
      positionsRef.current = readFlowPositions(layoutKey)
    }
    const generatedNodes = React.useMemo(
      () =>
        flowNodes(
          data,
          currentWorkflowId,
          selectedNodeId,
          positionsRef.current,
          onSelectNode,
          onOpenWork,
          onOpenWorkflow,
        ),
      [
        data,
        currentWorkflowId,
        selectedNodeId,
        onSelectNode,
        onOpenWork,
        onOpenWorkflow,
      ],
    )
    const generatedEdges = React.useMemo(
      () => flowEdges(data, currentWorkflowId),
      [data, currentWorkflowId],
    )
    const [nodes, setNodes, onNodesChange] = useNodesState(generatedNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(generatedEdges)
    const handleNodesChange = React.useCallback(
      (changes) => {
        onNodesChange(changes)
        let shouldWrite = false
        for (const change of changes) {
          if (change.type !== 'position' || !change.position) continue
          positionsRef.current[change.id] = {
            x: change.position.x,
            y: change.position.y,
          }
          if (change.dragging === false) shouldWrite = true
        }
        if (shouldWrite) writeFlowPositions(layoutKey, positionsRef.current)
      },
      [layoutKey, onNodesChange],
    )

    React.useEffect(() => {
      setNodes((current) => {
        const positions = new Map(current.map((node) => [node.id, node.position]))
        return generatedNodes.map((node) => ({
          ...node,
          position: positions.get(node.id) ?? node.position,
        }))
      })
    }, [generatedNodes, setNodes])

    React.useEffect(() => setEdges(generatedEdges), [generatedEdges, setEdges])

    const selectedWorkId = domainNodeId(selectedNodeId, 'work:')
    const selectedWorkflowId = domainNodeId(selectedNodeId, 'workflow:')
    const selected = data.works.find((work) => work.id === selectedWorkId)
    const selectedWorkflow = data.workflows.find(
      (workflow) => workflow.id === selectedWorkflowId,
    )
    const visibleWorks = data.works.filter(
      (work) => work.workflowId === currentWorkflowId,
    )
    const visibleWorkflows = data.workflows.filter(
      (workflow) => workflow.parentWorkflowId === currentWorkflowId,
    )
    const upstreams = selected
      ? Object.entries(selected.upstreamWaterLevels).map(([id, acknowledged]) => {
          const work = data.works.find((candidate) => candidate.id === id)
          return work
            ? {
                work,
                acknowledged,
                state: dependencyState(work.waterLevel, acknowledged),
              }
            : null
        }).filter(Boolean)
      : []

    const connect = (connection) => {
      if (busy || !connection.source || !connection.target) return
      if (connection.source === connection.target) return
      const sourceId = domainNodeId(connection.source, 'work:')
      const targetId = domainNodeId(connection.target, 'work:')
      const source = data.works.find((work) => work.id === sourceId)
      const target = data.works.find((work) => work.id === targetId)
      if (
        !source ||
        !target ||
        Object.prototype.hasOwnProperty.call(target.upstreamWaterLevels, source.id)
      ) return
      onUpdateDependencies(target.id, {
        ...target.upstreamWaterLevels,
        [source.id]: source.waterLevel,
      })
    }

    const validConnection = (connection) => {
      const sourceId = domainNodeId(connection.source, 'work:')
      const targetId = domainNodeId(connection.target, 'work:')
      return (
        sourceId.length > 0 &&
        targetId.length > 0 &&
        sourceId !== targetId &&
        visibleWorks.some((work) => work.id === sourceId) &&
        visibleWorks.some(
          (work) =>
            work.id === targetId &&
            !Object.prototype.hasOwnProperty.call(
              work.upstreamWaterLevels,
              sourceId,
            ),
        )
      )
    }

    return React.createElement(
      'div',
      { className: 'pavo-flow' },
      React.createElement(
        'div',
        {
          className: 'pavo-flow-canvas',
          role: 'region',
          'aria-label': 'Interactive Work dependency canvas',
        },
        React.createElement(
          ReactFlow,
          {
            nodes,
            edges,
            nodeTypes: FLOW_NODE_TYPES,
            onNodesChange: handleNodesChange,
            onEdgesChange,
            onConnect: connect,
            isValidConnection: validConnection,
            onNodeClick: (_event, node) => onSelectNode(node.id),
            onNodeDoubleClick: (_event, node) => {
              const workflowId = domainNodeId(node.id, 'workflow:')
              if (workflowId) onOpenWorkflow(workflowId)
              else {
                const workId = domainNodeId(node.id, 'work:')
                onOpenWork(data.works.find((work) => work.id === workId))
              }
            },
            fitView: true,
            fitViewOptions: { padding: 0.22, duration: 450 },
            minZoom: 0.3,
            maxZoom: 1.8,
            nodesConnectable: !busy,
            nodesDraggable: true,
            nodesFocusable: false,
            edgesFocusable: true,
            elementsSelectable: true,
            panOnScroll: true,
            selectionOnDrag: false,
            snapToGrid: true,
            snapGrid: [16, 16],
            proOptions: { hideAttribution: true },
            deleteKeyCode: null,
          },
          React.createElement(Background, {
            variant: BackgroundVariant.Dots,
            gap: 22,
            size: 1.2,
            color: 'rgba(108,124,158,.38)',
          }),
          React.createElement(Controls, {
            position: 'bottom-left',
            showInteractive: false,
          }),
          nodes.length > 3
            ? React.createElement(MiniMap, {
                position: 'bottom-right',
                pannable: true,
                zoomable: true,
                nodeColor: (node) =>
                  node.type === 'workflow'
                    ? '#7656b5'
                    : node.id === selectedNodeId
                      ? '#2f5fc7'
                      : '#8b96aa',
                nodeStrokeWidth: 2,
              })
            : null,
          React.createElement(
            Panel,
            { position: 'top-left' },
            React.createElement(
              'div',
              { className: 'pavo-flow-panel' },
              React.createElement(
                'strong',
                null,
                `${visibleWorks.length} Works · ${visibleWorkflows.length} Workflows`,
              ),
              React.createElement(
                'span',
                null,
                'Connect handles to add dependencies · cycles are allowed',
              ),
            ),
          ),
        ),
      ),
      React.createElement(
        'aside',
        { className: 'pavo-flow-detail', 'aria-live': 'polite' },
        selected
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement(
                'header',
                { className: 'pavo-flow-detail-head' },
                React.createElement(
                  'div',
                  { className: 'pavo-flow-detail-kicker' },
                  React.createElement('span', null, 'Work inspector'),
                  React.createElement(
                    'span',
                    { className: `pavo-work-type pavo-work-type-${selected.type}` },
                    selected.type === 'goal' ? 'Goal' : 'Ongoing',
                  ),
                ),
                React.createElement(
                  'div',
                  { className: 'pavo-flow-detail-title' },
                  React.createElement('strong', null, selected.title),
                  React.createElement(
                    'span',
                    null,
                    `${selected.key || 'NO KEY'} · WaterLevel ${selected.waterLevel}`,
                  ),
                ),
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'pavo-button',
                    disabled: busy,
                    onClick: () => onOpenWork(selected),
                  },
                  'Edit Work',
                ),
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'pavo-button',
                    disabled: busy,
                    onClick: () => onSaveWorkTemplate(selected),
                  },
                  'Save as template',
                ),
              ),
              React.createElement(
                'div',
                { className: 'pavo-flow-work-copy' },
                selected.description
                  ? React.createElement(
                      'p',
                      { className: 'pavo-flow-description' },
                      selected.description,
                    )
                  : React.createElement(
                      'div',
                      { className: 'pavo-flow-empty' },
                      'This Work has no Description yet.',
                    ),
                React.createElement(
                  'div',
                  { className: 'pavo-flow-detail-kicker' },
                  React.createElement('span', null, 'Upstream dependencies'),
                  React.createElement('span', null, String(upstreams.length)),
                ),
                upstreams.length === 0
                  ? React.createElement(
                      'div',
                      { className: 'pavo-flow-empty' },
                      'Drag from another Work handle to this Work to add an upstream dependency.',
                    )
                  : React.createElement(
                      'ul',
                      { className: 'pavo-upstream-list' },
                      upstreams.map(({ work, acknowledged, state }) =>
                        React.createElement(
                          'li',
                          { className: 'pavo-upstream-row', key: work.id },
                          React.createElement(
                            'div',
                            { className: 'pavo-upstream-head' },
                            React.createElement(
                              'span',
                              { className: 'pavo-upstream-title' },
                              React.createElement('strong', null, work.title),
                              React.createElement('span', null, work.id),
                            ),
                            React.createElement(
                              'span',
                              { className: `pavo-dependency-state pavo-dependency-state-${state}` },
                              state,
                            ),
                          ),
                          React.createElement(
                            'div',
                            { className: 'pavo-upstream-levels' },
                            React.createElement('span', null, `Current ${work.waterLevel}`),
                            React.createElement('span', null, `Handled ${acknowledged}`),
                          ),
                          React.createElement(
                            'div',
                            { className: 'pavo-upstream-actions' },
                            React.createElement(
                              'button',
                              {
                                type: 'button',
                                className: 'pavo-button',
                                disabled: busy || state === 'synchronized',
                                onClick: () =>
                                  onUpdateDependencies(selected.id, {
                                    ...selected.upstreamWaterLevels,
                                    [work.id]: work.waterLevel,
                                  }),
                              },
                              'Acknowledge current',
                            ),
                            React.createElement(
                              'button',
                              {
                                type: 'button',
                                className: 'pavo-button pavo-button-danger',
                                disabled: busy,
                                onClick: () => {
                                  const next = { ...selected.upstreamWaterLevels }
                                  delete next[work.id]
                                  onUpdateDependencies(selected.id, next)
                                },
                              },
                              'Remove',
                            ),
                          ),
                        ),
                      ),
                    ),
              ),
            )
          : selectedWorkflow
            ? React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  'header',
                  { className: 'pavo-flow-detail-head' },
                  React.createElement(
                    'div',
                    { className: 'pavo-flow-detail-kicker' },
                    React.createElement('span', null, 'Workflow inspector'),
                    React.createElement('span', null, 'Container'),
                  ),
                  React.createElement(
                    'div',
                    { className: 'pavo-flow-detail-title' },
                    React.createElement('strong', null, selectedWorkflow.title),
                    React.createElement(
                      'span',
                      null,
                      `${data.works.filter((work) => work.workflowId === selectedWorkflow.id).length} direct Works · ${data.workflows.filter((item) => item.parentWorkflowId === selectedWorkflow.id).length} child Workflows`,
                    ),
                  ),
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'pavo-button pavo-button-primary',
                      disabled: busy,
                      onClick: () => onOpenWorkflow(selectedWorkflow.id),
                    },
                    'Open Workflow',
                  ),
                ),
                React.createElement(
                  'div',
                  { className: 'pavo-flow-work-copy' },
                  React.createElement(
                    'div',
                    { className: 'pavo-flow-empty' },
                    'Workflow containers organize direct children only. They do not execute Works, own WaterLevels, or aggregate dependencies.',
                  ),
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'pavo-button',
                      disabled: busy,
                      onClick: () => onEditWorkflow(selectedWorkflow),
                    },
                    'Rename Workflow',
                  ),
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'pavo-button',
                      disabled: busy,
                      onClick: () => onSaveWorkflowTemplate(selectedWorkflow),
                    },
                    'Save subtree as template',
                  ),
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'pavo-button pavo-button-danger',
                      disabled: busy,
                      onClick: () => onRemoveWorkflow(selectedWorkflow.id),
                    },
                    'Delete empty Workflow',
                  ),
                ),
              )
            : React.createElement(
                'div',
                { className: 'pavo-flow-empty' },
                'Add a Work or Workflow to this container.',
              ),
      ),
    )
  }

  function Board() {
    const [snapshot, setSnapshot] = React.useState(null)
    const [error, setError] = React.useState(null)
    const [busy, setBusy] = React.useState(false)
    const [drawerMode, setDrawerMode] = React.useState('')
    const [drawerWorkId, setDrawerWorkId] = React.useState('')
    const [drawerRevision, setDrawerRevision] = React.useState('')
    const [drawerDraft, setDrawerDraft] = React.useState(() => emptyDraft())
    const [targetColumn, setTargetColumn] = React.useState('')
    const [viewMode, setViewMode] = React.useState('flow')
    const [currentWorkflowId, setCurrentWorkflowId] = React.useState(ROOT_WORKFLOW_ID)
    const [selectedFlowNodeId, setSelectedFlowNodeId] = React.useState('')
    const [workflowDrawerMode, setWorkflowDrawerMode] = React.useState('')
    const [workflowDrawerId, setWorkflowDrawerId] = React.useState('')
    const [workflowDrawerTitle, setWorkflowDrawerTitle] = React.useState('')
    const [workflowDrawerRevision, setWorkflowDrawerRevision] = React.useState('')
    const [templateDrawerMode, setTemplateDrawerMode] = React.useState('')
    const [templateDrawerRevision, setTemplateDrawerRevision] = React.useState('')
    const [templateDraft, setTemplateDraft] = React.useState(null)
    const [templateTargetWorkflowId, setTemplateTargetWorkflowId] = React.useState(ROOT_WORKFLOW_ID)
    const [draggedWorkId, setDraggedWorkId] = React.useState('')
    const [snackbar, setSnackbar] = React.useState(null)
    const drawerCloseRef = React.useRef(null)
    const lastFocusRef = React.useRef(null)
    const requestSequence = React.useRef(0)
    const busyRef = React.useRef(false)
    const pollInFlight = React.useRef(false)

    const applySnapshot = React.useCallback((next) => {
      setSnapshot((current) =>
        current?.revision === next.revision &&
        current?.repositoryRevision === next.repositoryRevision
          ? current
          : next,
      )
      setTargetColumn((current) => current || next.board.columns[0]?.id || '')
      setSelectedFlowNodeId((current) => current)
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
      if (
        !snapshot.board.workflows.some(
          (workflow) => workflow.id === currentWorkflowId,
        )
      ) {
        setCurrentWorkflowId(ROOT_WORKFLOW_ID)
        setSelectedFlowNodeId('')
        return
      }
      const selectedWorkId = domainNodeId(selectedFlowNodeId, 'work:')
      const selectedWorkflowId = domainNodeId(selectedFlowNodeId, 'workflow:')
      const selectedVisible =
        snapshot.board.works.some(
          (work) =>
            work.id === selectedWorkId && work.workflowId === currentWorkflowId,
        ) ||
        snapshot.board.workflows.some(
          (workflow) =>
            workflow.id === selectedWorkflowId &&
            workflow.parentWorkflowId === currentWorkflowId,
        )
      if (selectedFlowNodeId && !selectedVisible) setSelectedFlowNodeId('')
    }, [snapshot, targetColumn, currentWorkflowId, selectedFlowNodeId])

    React.useEffect(() => {
      if (!snackbar) return undefined
      const timer = setTimeout(() => setSnackbar(null), 6_000)
      return () => clearTimeout(timer)
    }, [snackbar])

    React.useEffect(() => {
      if (!drawerMode && !workflowDrawerMode && !templateDrawerMode) return undefined
      drawerCloseRef.current?.focus()
      const handleDrawerKeyDown = (event) => {
        if (event.key === 'Escape' && !busyRef.current) {
          if (templateDrawerMode) closeTemplateDrawer()
          else if (workflowDrawerMode) closeWorkflowDrawer()
          else closeDrawer()
          return
        }
        if (event.key !== 'Tab') return
        const drawer = drawerCloseRef.current?.closest('.pavo-drawer')
        const focusable = drawer
          ? Array.from(
              drawer.querySelectorAll(
                'button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled)',
              ),
            )
          : []
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
      document.addEventListener('keydown', handleDrawerKeyDown)
      return () => document.removeEventListener('keydown', handleDrawerKeyDown)
    }, [drawerMode, workflowDrawerMode, templateDrawerMode])

    React.useEffect(() => {
      if (!drawerWorkId || !snapshot) return
      if (!snapshot.board.works.some((card) => card.id === drawerWorkId)) {
        closeDrawer()
      }
    }, [drawerWorkId, snapshot])

    function friendlyMoveError(nextError) {
      const message =
        nextError instanceof Error ? nextError.message : String(nextError)
      if (/changed since it was loaded|stale|cannot move/iu.test(message)) {
        return 'The board changed elsewhere. The Work was restored while the latest board reloads.'
      }
      if (/git|repository|push|pull|sync/iu.test(message)) {
        return 'The move could not be synced to Git. The Work was restored; please try again.'
      }
      return 'The move could not be saved. The Work was restored; please try again.'
    }

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

    function rememberFocus() {
      if (typeof document !== 'undefined') {
        lastFocusRef.current = document.activeElement
      }
    }

    function openCreateDrawer() {
      if (!snapshot) return
      rememberFocus()
      setDrawerWorkId('')
      setDrawerRevision(snapshot.revision)
      setDrawerDraft(
        emptyDraft('', currentWorkflowId),
      )
      setTargetColumn(snapshot.board.columns[0]?.id || '')
      setDrawerMode('create')
    }

    function openDetailDrawer(work) {
      if (!work) return
      rememberFocus()
      setDrawerWorkId(work.id)
      setDrawerRevision(snapshot?.revision || '')
      setDrawerDraft({
        type: work.type,
        project: work.project,
        workflowId: work.workflowId,
        key: work.key,
        title: work.title,
        description: work.description,
        assignee: work.assignee,
        waterLevel: work.waterLevel,
        upstreamWaterLevels: { ...work.upstreamWaterLevels },
      })
      setDrawerMode('detail')
    }

    function closeDrawer() {
      if (busyRef.current) return
      setDrawerMode('')
      setDrawerWorkId('')
      setDrawerRevision('')
      setDrawerDraft(emptyDraft())
      lastFocusRef.current?.focus?.()
      lastFocusRef.current = null
    }

    function openCreateWorkflowDrawer() {
      if (!snapshot) return
      rememberFocus()
      setWorkflowDrawerId('')
      setWorkflowDrawerTitle('')
      setWorkflowDrawerRevision(snapshot.revision)
      setWorkflowDrawerMode('create-workflow')
    }

    function openEditWorkflowDrawer(workflow) {
      if (!snapshot || !workflow) return
      rememberFocus()
      setWorkflowDrawerId(workflow.id)
      setWorkflowDrawerTitle(workflow.title)
      setWorkflowDrawerRevision(snapshot.revision)
      setWorkflowDrawerMode('edit-workflow')
    }

    function closeWorkflowDrawer() {
      if (busyRef.current) return
      setWorkflowDrawerMode('')
      setWorkflowDrawerId('')
      setWorkflowDrawerTitle('')
      setWorkflowDrawerRevision('')
      lastFocusRef.current?.focus?.()
      lastFocusRef.current = null
    }

    function createWorkflow() {
      if (!snapshot || workflowDrawerTitle.trim().length === 0) return
      void run(() =>
        request('addWorkflow', {
          title: workflowDrawerTitle.trim(),
          parentWorkflowId: currentWorkflowId,
          expectedRevision: workflowDrawerRevision,
        }),
      ).then((saved) => {
        if (saved) closeWorkflowDrawer()
      })
    }

    function saveWorkflow() {
      if (!snapshot || !workflowDrawerId || workflowDrawerTitle.trim().length === 0) {
        return
      }
      void run(async () => {
        const next = await request('updateWorkflow', {
          workflowId: workflowDrawerId,
          title: workflowDrawerTitle.trim(),
          expectedRevision: workflowDrawerRevision,
        })
        setWorkflowDrawerRevision(next.revision)
        return next
      })
    }

    function removeWorkflow(workflowId) {
      if (!snapshot) return
      void run(() =>
        request('removeWorkflow', {
          workflowId,
          expectedRevision: snapshot.revision,
        }),
      ).then((saved) => {
        if (saved) setSelectedFlowNodeId('')
      })
    }

    function openWorkflow(workflowId) {
      if (!snapshot?.board.workflows.some((workflow) => workflow.id === workflowId)) {
        return
      }
      setCurrentWorkflowId(workflowId)
      setSelectedFlowNodeId('')
    }

    function openTemplateLibrary() {
      if (!snapshot) return
      rememberFocus()
      setTemplateDrawerRevision(snapshot.revision)
      setTemplateTargetWorkflowId(currentWorkflowId)
      setTemplateDraft(null)
      setTemplateDrawerMode('template-library')
    }

    function openCreateTemplate(kind) {
      if (!snapshot) return
      setTemplateDraft(
        kind === 'work'
          ? {
              kind: 'work',
              name: '',
              type: 'goal',
              project: '',
              key: '',
              title: '',
              description: '',
              assignee: '',
              waterLevel: '0',
              columnId: snapshot.board.columns[0]?.id || '',
            }
          : {
              kind: 'workflow',
              name: '',
              content: {
                rootWorkflowId: 'root',
                workflows: [
                  { id: 'root', title: 'New Workflow', parentWorkflowId: null },
                ],
                works: [],
              },
            },
      )
      setTemplateDrawerMode('template-edit')
    }

    function openCaptureTemplate(kind, source) {
      if (!snapshot || !source) return
      rememberFocus()
      setTemplateDrawerRevision(snapshot.revision)
      setTemplateDraft({
        kind,
        name: source.title,
        ...(kind === 'work'
          ? { sourceWorkId: source.id }
          : { sourceWorkflowId: source.id }),
      })
      setTemplateDrawerMode('template-edit')
    }

    function openEditTemplate(template) {
      if (!template) return
      if (template.kind === 'work') {
        setTemplateDraft({
          templateId: template.id,
          kind: 'work',
          name: template.name,
          ...template.content,
        })
      } else {
        setTemplateDraft({
          templateId: template.id,
          kind: 'workflow',
          name: template.name,
          content: template.content,
        })
      }
      setTemplateDrawerMode('template-edit')
    }

    function openApplyTemplate(template) {
      if (!template) return
      setTemplateDraft({ templateId: template.id, kind: template.kind })
      setTemplateTargetWorkflowId(currentWorkflowId)
      setTemplateDrawerMode('template-apply')
    }

    function showTemplateLibrary() {
      setTemplateDraft(null)
      setTemplateDrawerMode('template-library')
    }

    function closeTemplateDrawer() {
      if (busyRef.current) return
      setTemplateDrawerMode('')
      setTemplateDrawerRevision('')
      setTemplateDraft(null)
      lastFocusRef.current?.focus?.()
      lastFocusRef.current = null
    }

    function templateContentFromDraft() {
      if (templateDraft.kind === 'work') {
        return {
          type: templateDraft.type,
          project: templateDraft.project,
          key: templateDraft.key.trim(),
          title: templateDraft.title.trim(),
          description: templateDraft.description,
          assignee: templateDraft.assignee.trim(),
          waterLevel: templateDraft.waterLevel.trim(),
          columnId: templateDraft.columnId,
        }
      }
      return templateDraft.content
    }

    function saveTemplate() {
      if (!snapshot || !templateDraft?.name?.trim()) return
      const creating = !templateDraft.templateId
      const args = {
        name: templateDraft.name.trim(),
        expectedRevision: templateDrawerRevision,
        ...(creating
          ? { kind: templateDraft.kind }
          : { templateId: templateDraft.templateId }),
        ...(templateDraft.sourceWorkId
          ? { sourceWorkId: templateDraft.sourceWorkId }
          : templateDraft.sourceWorkflowId
            ? { sourceWorkflowId: templateDraft.sourceWorkflowId }
            : { content: templateContentFromDraft() }),
      }
      void run(async () => {
        const next = await request(
          creating ? 'addTemplate' : 'updateTemplate',
          args,
        )
        setTemplateDrawerRevision(next.revision)
        return next
      }).then((saved) => {
        if (saved) showTemplateLibrary()
      })
    }

    function deleteTemplate(templateId) {
      if (!snapshot) return
      if (
        typeof window !== 'undefined' &&
        typeof window.confirm === 'function' &&
        !window.confirm('Delete this template? Existing Works and Workflows are not affected.')
      ) {
        return
      }
      void run(async () => {
        const next = await request('removeTemplate', {
          templateId,
          expectedRevision: templateDrawerRevision,
        })
        setTemplateDrawerRevision(next.revision)
        return next
      })
    }

    function applySelectedTemplate() {
      if (!snapshot || !templateDraft?.templateId) return
      void run(async () => {
        const next = await request('instantiateTemplate', {
          templateId: templateDraft.templateId,
          targetWorkflowId: templateTargetWorkflowId,
          expectedRevision: templateDrawerRevision,
        })
        setTemplateDrawerRevision(next.revision)
        return next
      }).then((saved) => {
        if (saved) showTemplateLibrary()
      })
    }

    function addWork() {
      if (!snapshot || !isValidDraft(drawerDraft)) return
      const values = {
        type: drawerDraft.type,
        project: drawerDraft.project,
        workflowId: drawerDraft.workflowId,
        key: drawerDraft.key.trim(),
        title: drawerDraft.title.trim(),
        description: drawerDraft.description,
        assignee: drawerDraft.assignee.trim(),
        waterLevel: drawerDraft.waterLevel.trim(),
        upstreamWaterLevels: drawerDraft.upstreamWaterLevels,
        columnId: targetColumn,
      }
      void run(() =>
        request('addWork', { ...values, expectedRevision: drawerRevision }),
      ).then((saved) => {
        if (saved) closeDrawer()
      })
    }

    function moveCard(cardId, columnId) {
      if (!snapshot || busyRef.current) return
      const card = snapshot.board.works.find((candidate) => candidate.id === cardId)
      if (!card || card.columnId === columnId) return

      const previousSnapshot = snapshot
      const optimisticSnapshot = {
        ...previousSnapshot,
        board: {
          ...previousSnapshot.board,
          works: previousSnapshot.board.works.map((candidate) =>
            candidate.id === cardId ? { ...candidate, columnId } : candidate,
          ),
        },
      }
      const expectedRevision = previousSnapshot.revision
      busyRef.current = true
      setBusy(true)
      setError(null)
      setSnapshot(optimisticSnapshot)
      const sequence = ++requestSequence.current

      void request('moveWork', { workId: cardId, columnId, expectedRevision })
        .then((next) => {
          if (sequence === requestSequence.current) applySnapshot(next)
        })
        .catch((nextError) => {
          if (sequence !== requestSequence.current) return
          setSnapshot(previousSnapshot)
          setSnackbar({
            title: 'Move not saved',
            message: friendlyMoveError(nextError),
          })
        })
        .finally(() => {
          busyRef.current = false
          setBusy(false)
          if (sequence === requestSequence.current) void load(true)
        })
    }

    function removeWork(workId) {
      if (!snapshot) return
      void run(() =>
        request('removeWork', { workId, expectedRevision: drawerRevision }),
      ).then((saved) => {
        if (saved) closeDrawer()
      })
    }

    function saveDetails() {
      if (!drawerWorkId || !snapshot) return
      const currentCard = snapshot.board.works.find(
        (card) => card.id === drawerWorkId,
      )
      const valid = isValidDraft(drawerDraft)
      if (!currentCard || !valid) return
      const values = {
        workId: drawerWorkId,
        type: drawerDraft.type,
        project: drawerDraft.project,
        workflowId: drawerDraft.workflowId,
        key: drawerDraft.key.trim(),
        title: drawerDraft.title.trim(),
        description: drawerDraft.description,
        assignee: drawerDraft.assignee.trim(),
        waterLevel: drawerDraft.waterLevel.trim(),
        upstreamWaterLevels: drawerDraft.upstreamWaterLevels,
      }
      void run(async () => {
        const next = await request('updateWork', {
          ...values,
          expectedRevision: drawerRevision,
        })
        setDrawerRevision(next.revision)
        return next
      })
    }

    function updateDependencies(workId, upstreamWaterLevels) {
      if (!snapshot) return
      void run(() =>
        request(
          'updateWork',
          mutationArgs({ workId, upstreamWaterLevels }),
        ),
      )
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
        { className: 'pavo-root' },
        error
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement('div', { className: 'pavo-error' }, error),
              React.createElement(
                'button',
                { className: 'pavo-button', onClick: () => void load() },
                'Retry',
              ),
            )
          : React.createElement('div', { className: 'pavo-loading' }, 'Loading board…'),
      )
    }

    const data = snapshot.board
    const currentWorkflowPath = workflowPath(data.workflows, currentWorkflowId)
    const draggedCard = data.works.find((card) => card.id === draggedWorkId)
    const columns = data.columns.map((column) => {
      const cards = data.works.filter((card) => card.columnId === column.id)
      const cardNodes = cards.map((card) =>
        React.createElement(
          'article',
          {
            key: card.id,
            className: 'pavo-work',
            draggable: !busy,
            onDragStart: (event) => {
              setDraggedWorkId(card.id)
              event.dataTransfer.setData('text/plain', card.id)
              event.dataTransfer.effectAllowed = 'move'
            },
            onDragEnd: () => setDraggedWorkId(''),
          },
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'pavo-work-open',
              disabled: busy,
              'aria-label': `Open details for ${card.title}`,
              onClick: () => openDetailDrawer(card),
            },
            React.createElement(
              'div',
              { className: 'pavo-work-copy' },
              React.createElement(
                'div',
                { className: 'pavo-work-kicker' },
                React.createElement(
                  'span',
                  { className: 'pavo-work-key' },
                  card.key || 'NO KEY',
                ),
                React.createElement(
                  'span',
                  { className: 'pavo-work-project' },
                  card.project || 'No project',
                ),
              ),
              React.createElement('div', { className: 'pavo-work-title' }, card.title),
              card.description
                ? React.createElement(
                    'p',
                    { className: 'pavo-work-body' },
                    card.description,
                  )
                : null,
              React.createElement(
                'div',
                { className: 'pavo-work-meta' },
                React.createElement(
                  'span',
                  { className: `pavo-work-type pavo-work-type-${card.type}` },
                  card.type === 'goal' ? 'Goal' : 'Ongoing',
                ),
                React.createElement(
                  'span',
                  null,
                  `Assignee: ${card.assignee || 'Unassigned'}`,
                ),
                React.createElement('span', null, `WaterLevel: ${card.waterLevel}`),
                React.createElement(
                  'span',
                  null,
                  `${Object.keys(card.upstreamWaterLevels).length} upstream`,
                ),
              ),
            ),
          ),
        ),
      )

      const dropAllowed = draggedCard ? canMove(draggedCard, column.id) : false
      const dropBlocked =
        draggedCard && draggedCard.columnId !== column.id && !dropAllowed
      return React.createElement(
        'section',
        {
          key: column.id,
          className: `pavo-column${dropAllowed ? ' pavo-drop-allowed' : ''}${dropBlocked ? ' pavo-drop-blocked' : ''}`,
          onDragOver: (event) => {
            if (dropAllowed) event.preventDefault()
          },
          onDrop: (event) => {
            event.preventDefault()
            const cardId = event.dataTransfer.getData('text/plain')
            if (cardId && dropAllowed) moveCard(cardId, column.id)
            setDraggedWorkId('')
          },
        },
        React.createElement(
          'header',
          { className: 'pavo-column-head' },
          React.createElement('span', null, column.title),
          React.createElement('span', { className: 'pavo-count' }, String(cards.length)),
        ),
        React.createElement('div', { className: 'pavo-work-list' }, cardNodes),
      )
    })

    return React.createElement(
      'div',
      { className: 'pavo-root' },
      React.createElement(
        'div',
        { className: 'pavo-toolbar' },
        React.createElement(
          'div',
          { className: 'pavo-heading' },
          React.createElement('span', { className: 'pavo-title' }, 'Pavo'),
          React.createElement(
            'span',
            { className: 'pavo-status' },
            busy ? 'Committing and syncing…' : 'Git-backed · auto-sync on',
          ),
        ),
        React.createElement(
          'div',
          { className: 'pavo-toolbar-actions' },
          React.createElement(
            'div',
            { className: 'pavo-view-switch', 'aria-label': 'Pavo view' },
            React.createElement(
              'button',
              {
                type: 'button',
                'aria-pressed': viewMode === 'board',
                onClick: () => setViewMode('board'),
              },
              'Board',
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                'aria-pressed': viewMode === 'flow',
                onClick: () => setViewMode('flow'),
              },
              'Flow Canvas',
            ),
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'pavo-button',
              disabled: busy,
              onClick: openTemplateLibrary,
            },
            'Templates',
          ),
          viewMode === 'flow'
            ? React.createElement(
                'button',
                {
                  type: 'button',
                  className: 'pavo-button',
                  disabled: busy,
                  onClick: openCreateWorkflowDrawer,
                },
                'New Workflow',
              )
            : null,
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'pavo-button pavo-button-primary',
              disabled: busy,
              onClick: openCreateDrawer,
            },
            'New Work',
          ),
        ),
      ),
      error ? React.createElement('div', { className: 'pavo-error' }, error) : null,
      viewMode === 'flow'
        ? React.createElement(
            'div',
            { className: 'pavo-flow-shell' },
            React.createElement(
              'nav',
              { className: 'pavo-flow-breadcrumbs', 'aria-label': 'Workflow path' },
              ...currentWorkflowPath.flatMap((workflow, index) => [
                index > 0
                  ? React.createElement(
                      'span',
                      {
                        className: 'pavo-flow-breadcrumb-separator',
                        key: `separator-${workflow.id}`,
                      },
                      '/',
                    )
                  : null,
                React.createElement(
                  'button',
                  {
                    key: workflow.id,
                    type: 'button',
                    'aria-current': workflow.id === currentWorkflowId ? 'page' : undefined,
                    disabled: workflow.id === currentWorkflowId,
                    onClick: () => openWorkflow(workflow.id),
                  },
                  workflow.title,
                ),
              ]),
            ),
            React.createElement(FlowCanvas, {
              key: `${snapshot.repository?.repositoryPath || 'default'}:${snapshot.repository?.dataDirectory || 'kanban'}:${currentWorkflowId}`,
              layoutKey: `${snapshot.repository?.repositoryPath || 'default'}:${snapshot.repository?.dataDirectory || 'kanban'}:${currentWorkflowId}`,
              data,
              currentWorkflowId,
              selectedNodeId: selectedFlowNodeId,
              onSelectNode: setSelectedFlowNodeId,
              onOpenWork: openDetailDrawer,
              onOpenWorkflow: openWorkflow,
              onEditWorkflow: openEditWorkflowDrawer,
              onRemoveWorkflow: removeWorkflow,
              onSaveWorkTemplate: (work) => openCaptureTemplate('work', work),
              onSaveWorkflowTemplate: (workflow) =>
                openCaptureTemplate('workflow', workflow),
              onUpdateDependencies: updateDependencies,
              busy,
            }),
          )
        : React.createElement('div', { className: 'pavo-board' }, columns),
      React.createElement(WorkDrawer, {
        mode: drawerMode,
        work: data.works.find((work) => work.id === drawerWorkId),
        works: data.works,
        columns: data.columns,
        projects: data.projects,
        workflows: data.workflows,
        draft: drawerDraft,
        setDraft: setDrawerDraft,
        targetColumn,
        setTargetColumn,
        busy,
        stale: Boolean(drawerRevision && drawerRevision !== snapshot.revision),
        closeRef: drawerCloseRef,
        onClose: closeDrawer,
        onCreate: addWork,
        onSave: saveDetails,
        onRemove: removeWork,
        onSaveTemplate: (work) => {
          closeDrawer()
          openCaptureTemplate('work', work)
        },
      }),
      React.createElement(WorkflowDrawer, {
        mode: workflowDrawerMode,
        workflow: data.workflows.find(
          (workflow) => workflow.id === workflowDrawerId,
        ),
        title: workflowDrawerTitle,
        setTitle: setWorkflowDrawerTitle,
        busy,
        stale: Boolean(
          workflowDrawerRevision && workflowDrawerRevision !== snapshot.revision,
        ),
        closeRef: drawerCloseRef,
        onClose: closeWorkflowDrawer,
        onCreate: createWorkflow,
        onSave: saveWorkflow,
      }),
      React.createElement(TemplateLibraryDrawer, {
        mode: templateDrawerMode,
        templates: data.templates,
        projects: data.projects,
        columns: data.columns,
        workflows: data.workflows,
        draft: templateDraft,
        setDraft: setTemplateDraft,
        targetWorkflowId: templateTargetWorkflowId,
        setTargetWorkflowId: setTemplateTargetWorkflowId,
        busy,
        stale: Boolean(
          templateDrawerRevision && templateDrawerRevision !== snapshot.revision,
        ),
        closeRef: drawerCloseRef,
        onClose: closeTemplateDrawer,
        onShowLibrary: showTemplateLibrary,
        onCreate: openCreateTemplate,
        onEdit: openEditTemplate,
        onApply: openApplyTemplate,
        onDelete: deleteTemplate,
        onSave: saveTemplate,
        onInstantiate: applySelectedTemplate,
      }),
      snackbar
        ? React.createElement(
            'div',
            {
              className: 'pavo-snackbar',
              role: 'alert',
              'aria-live': 'assertive',
            },
            React.createElement('span', { className: 'pavo-snackbar-icon' }, '!'),
            React.createElement(
              'div',
              { className: 'pavo-snackbar-copy' },
              React.createElement(
                'strong',
                { className: 'pavo-snackbar-title' },
                snackbar.title,
              ),
              React.createElement(
                'span',
                { className: 'pavo-snackbar-message' },
                snackbar.message,
              ),
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'pavo-snackbar-close',
                title: 'Dismiss',
                'aria-label': 'Dismiss notification',
                onClick: () => setSnackbar(null),
              },
              '×',
            ),
          )
        : null,
    )
  }

  function PavoSettings() {
    const [snapshot, setSnapshot] = React.useState(null)
    const [repositoryInfo, setRepositoryInfo] = React.useState(null)
    const [repositoryDraft, setRepositoryDraft] = React.useState(null)
    const [project, setProject] = React.useState('')
    const [busy, setBusy] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [saved, setSaved] = React.useState(false)

    const applyRepositoryInfo = React.useCallback((info) => {
      setRepositoryInfo(info)
      setRepositoryDraft({ ...info.repository })
    }, [])

    const load = React.useCallback(async () => {
      try {
        const info = await request('repositorySettings', {})
        applyRepositoryInfo(info)
        try {
          setSnapshot(await request('overview', {}))
          setError(null)
        } catch (nextError) {
          setSnapshot(null)
          setError(nextError instanceof Error ? nextError.message : String(nextError))
        }
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : String(nextError))
      }
    }, [applyRepositoryInfo])

    React.useEffect(() => {
      void load()
    }, [load])

    async function mutate(method, args) {
      if (!snapshot || busy) return false
      setBusy(true)
      setSaved(false)
      try {
        const next = await request(method, {
          ...args,
          expectedRevision: snapshot.revision,
        })
        setSnapshot(next)
        applyRepositoryInfo(next)
        setError(null)
        return true
      } catch (nextError) {
        const message = nextError instanceof Error ? nextError.message : String(nextError)
        await load()
        setError(message)
        return false
      } finally {
        setBusy(false)
      }
    }

    function add() {
      const normalized = project.trim()
      if (!normalized) return
      void mutate('addProject', { project: normalized }).then((didSave) => {
        if (didSave) setProject('')
      })
    }

    function updateRepositoryField(name, value) {
      setRepositoryDraft((current) => ({ ...current, [name]: value }))
      setSaved(false)
    }

    function saveRepository() {
      if (!repositoryDraft || !repositoryInfo || busy) return
      setBusy(true)
      setSaved(false)
      const repository = {
        ...repositoryDraft,
        repositoryPath: repositoryDraft.repositoryPath.trim(),
        dataDirectory: repositoryDraft.dataDirectory.trim(),
        branch: repositoryDraft.branch.trim(),
        remote: repositoryDraft.remote.trim(),
        pollIntervalMs: Number(repositoryDraft.pollIntervalMs),
        pullIntervalMs: Number(repositoryDraft.pullIntervalMs),
      }
      void request('saveRepository', {
        repository,
        expectedRepositoryRevision: repositoryInfo.repositoryRevision,
      })
        .then(async (info) => {
          applyRepositoryInfo(info)
          setSaved(true)
          try {
            setSnapshot(await request('overview', {}))
            setError(null)
          } catch (nextError) {
            setSnapshot(null)
            const message =
              nextError instanceof Error ? nextError.message : String(nextError)
            setError(`Repository settings were saved, but Pavo could not load the board: ${message}`)
          }
        })
        .catch((nextError) => {
          setError(nextError instanceof Error ? nextError.message : String(nextError))
        })
        .finally(() => setBusy(false))
    }

    const repositoryValid =
      repositoryDraft &&
      repositoryDraft.repositoryPath.trim().length > 0 &&
      repositoryDraft.dataDirectory.trim().length > 0 &&
      repositoryDraft.branch.trim().length > 0 &&
      repositoryDraft.remote.trim().length > 0 &&
      Number.isSafeInteger(Number(repositoryDraft.pollIntervalMs)) &&
      Number(repositoryDraft.pollIntervalMs) >= 1_000 &&
      Number.isSafeInteger(Number(repositoryDraft.pullIntervalMs)) &&
      Number(repositoryDraft.pullIntervalMs) >= 1_000

    return React.createElement(
      'section',
      { className: 'pavo-settings' },
      React.createElement('h2', null, 'Pavo'),
      React.createElement(
        'p',
        { className: 'pavo-settings-copy' },
        'Manage the Git repository used by Pavo and the Project values available to every Work.'
      ),
      repositoryInfo?.settingsWarning
        ? React.createElement(
            'div',
            { className: 'pavo-settings-warning' },
            repositoryInfo.settingsWarning,
          )
        : null,
      error ? React.createElement('div', { className: 'pavo-error' }, error) : null,
      React.createElement(
        'section',
        { className: 'pavo-settings-section' },
        React.createElement('h3', null, 'Repository'),
        React.createElement(
          'p',
          null,
          'Pavo validates the checkout before switching. Saved values override the profile defaults on the next Host start.',
        ),
        repositoryDraft === null
          ? React.createElement(
              'div',
              { className: 'pavo-loading' },
              'Loading repository settings…',
            )
          : React.createElement(
              React.Fragment,
              null,
              React.createElement(
                'div',
                { className: 'pavo-settings-grid' },
                field(
                  'Repository path',
                  React.createElement('input', {
                    className: 'pavo-input',
                    value: repositoryDraft.repositoryPath,
                    disabled: busy,
                    spellCheck: false,
                    onChange: (event) =>
                      updateRepositoryField('repositoryPath', event.target.value),
                  }),
                  'pavo-settings-span',
                ),
                field(
                  'Data directory',
                  React.createElement('input', {
                    className: 'pavo-input',
                    value: repositoryDraft.dataDirectory,
                    disabled: busy,
                    spellCheck: false,
                    onChange: (event) =>
                      updateRepositoryField('dataDirectory', event.target.value),
                  }),
                ),
                field(
                  'Branch',
                  React.createElement('input', {
                    className: 'pavo-input',
                    value: repositoryDraft.branch,
                    disabled: busy,
                    spellCheck: false,
                    onChange: (event) =>
                      updateRepositoryField('branch', event.target.value),
                  }),
                ),
                field(
                  'Remote',
                  React.createElement('input', {
                    className: 'pavo-input',
                    value: repositoryDraft.remote,
                    disabled: busy,
                    spellCheck: false,
                    onChange: (event) =>
                      updateRepositoryField('remote', event.target.value),
                  }),
                ),
                field(
                  'Browser poll interval (ms)',
                  React.createElement('input', {
                    className: 'pavo-input',
                    type: 'number',
                    min: 1000,
                    step: 500,
                    value: repositoryDraft.pollIntervalMs,
                    disabled: busy,
                    onChange: (event) =>
                      updateRepositoryField('pollIntervalMs', event.target.value),
                  }),
                ),
                field(
                  'Git sync interval (ms)',
                  React.createElement('input', {
                    className: 'pavo-input',
                    type: 'number',
                    min: 1000,
                    step: 500,
                    value: repositoryDraft.pullIntervalMs,
                    disabled: busy,
                    onChange: (event) =>
                      updateRepositoryField('pullIntervalMs', event.target.value),
                  }),
                ),
              ),
              React.createElement(
                'div',
                { className: 'pavo-checks' },
                ...[
                  ['autoPull', 'Pull remote changes automatically'],
                  ['autoPush', 'Push Pavo commits automatically'],
                  ['initializeRepository', 'Initialize a missing repository'],
                ].map(([name, label]) =>
                  React.createElement(
                    'label',
                    { className: 'pavo-check', key: name },
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: repositoryDraft[name],
                      disabled: busy,
                      onChange: (event) =>
                        updateRepositoryField(name, event.target.checked),
                    }),
                    React.createElement('span', null, label),
                  ),
                ),
              ),
              React.createElement(
                'div',
                { className: 'pavo-settings-actions' },
                saved
                  ? React.createElement(
                      'span',
                      { className: 'pavo-settings-saved', role: 'status' },
                      'Repository settings saved.',
                    )
                  : React.createElement('span'),
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'pavo-button pavo-button-primary',
                    disabled: busy || !repositoryValid,
                    onClick: saveRepository,
                  },
                  busy ? 'Validating…' : 'Save repository',
                ),
              ),
            ),
      ),
      React.createElement(
        'section',
        { className: 'pavo-settings-section' },
        React.createElement('h3', null, 'Projects'),
        React.createElement(
          'p',
          null,
          'Project names become selectable values on every Work. A Project cannot be removed while a Work still uses it.',
        ),
        React.createElement(
          'div',
          { className: 'pavo-project-add' },
          React.createElement('input', {
            className: 'pavo-input',
            value: project,
            disabled: busy || !snapshot,
            maxLength: 128,
            placeholder: 'New project name',
            'aria-label': 'New project name',
            onChange: (event) => setProject(event.target.value),
            onKeyDown: (event) => {
              if (event.key === 'Enter') add()
            },
          }),
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'pavo-button',
              disabled: busy || !snapshot || project.trim().length === 0,
              onClick: add,
            },
            'Add project',
          ),
        ),
        snapshot === null
          ? React.createElement(
              'div',
              { className: 'pavo-project-empty' },
              'Connect a valid repository to manage projects.',
            )
          : snapshot.board.projects.length === 0
            ? React.createElement(
                'div',
                { className: 'pavo-project-empty' },
                'No projects are configured yet.',
              )
            : React.createElement(
                'ul',
                { className: 'pavo-project-list' },
                snapshot.board.projects.map((name) =>
                  React.createElement(
                    'li',
                    { className: 'pavo-project-row', key: name },
                    React.createElement('span', null, name),
                    React.createElement(
                      'button',
                      {
                        type: 'button',
                        className: 'pavo-button pavo-button-danger',
                        disabled: busy,
                        onClick: () =>
                          void mutate('removeProject', { project: name }),
                      },
                      'Remove',
                    ),
                  ),
                ),
              ),
      ),
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
      element.dataset.plugin = '@dddrop/dsh-plugin-pavo'
      element.dataset.pluginCss = STYLE_ID
      element.textContent = `${XYFLOW_STYLES}\n${STYLES}`
      document.head.appendChild(element)
      return () => element.remove()
    })

    slots.inject('conversation.view', () =>
      slots.register(
        {
          name: 'conversation.view',
          id: 'pavo',
          order: 5,
          label: 'Pavo',
        },
        () => React.createElement(Board),
      ),
    )

    slots.inject('settings.section', () =>
      slots.register(
        {
          name: 'settings.section',
          id: 'pavo',
          order: 60,
          label: 'Pavo',
        },
        () => React.createElement(PavoSettings),
      ),
    )
  }

  return { apply }
}
