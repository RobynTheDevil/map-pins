(function mapPins() {
const CSS = `
:root {
    --bg: #1e2126;
    --panel: #2a2e35;
    --line: #3a3f48;
    --btn: #353a43;
    --text: #e6e8eb;
    --muted: #9aa1ab;
    --accent: #4f9cff;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body {
    background: var(--bg);
    color: var(--text);
    font: 14px system-ui, -apple-system, "Segoe UI", sans-serif;
    display: grid;
    grid-template-columns: 260px 1fr;
    grid-template-rows: auto 1fr;
    height: 100vh;
}
body.reading { grid-template-columns: 1fr; }
body.reading aside, body.reading .edit-only { display: none !important; }
body:not(.reading) .read-only { display: none !important; }
.edge-tab {
    display: grid;
    place-items: center;
    padding: 10px 4px;
    background: var(--panel);
    color: var(--text);
    border: 1px solid var(--line);
    box-shadow: 0 4px 16px rgba(0, 0, 0, .35);
    z-index: 7;
}
.edge-tab:hover { color: var(--accent); }
.edge-tab svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
#modeBtn { position: absolute; left: 0; top: 12px; border-left: none; border-radius: 0 8px 8px 0; }
#modeBtn .chev { transition: transform .15s; transform-origin: 12px 12px; }
body.reading #modeBtn .chev { transform: scaleX(-1); }
#layerDock {
    position: absolute;
    top: 58px;
    left: 0;
    z-index: 5;
    display: flex;
    align-items: flex-start;
    max-height: calc(100% - 124px);
}
#layersBtn { border-left: none; border-radius: 0 8px 8px 0; padding: 8px 5px; }
#layersBtn[aria-expanded="true"] { border-left: 1px solid var(--panel); margin-left: -1px; color: var(--accent); }
header {
    grid-column: 1 / -1;
    display: flex;
    gap: 6px;
    padding: 8px;
    background: var(--panel);
    border-bottom: 1px solid var(--line);
    flex-wrap: wrap;
    align-items: center;
}
header .title { font-weight: 600; margin-right: 8px; }
header .spacer { flex: 1; }
#zoom { color: var(--muted); min-width: 48px; text-align: right; font-variant-numeric: tabular-nums; }
button, label.btn {
    background: var(--btn);
    color: var(--text);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
    font: inherit;
}
button:hover, label.btn:hover { border-color: var(--accent); }
button:disabled { opacity: .4; cursor: default; border-color: var(--line); }
input[type=file] { display: none; }
aside {
    background: var(--panel);
    border-right: 1px solid var(--line);
    overflow: auto;
    padding: 4px 10px 10px;
}
aside.drop { outline: 2px dashed var(--accent); outline-offset: -4px; }
h2 {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: var(--muted);
    margin: 14px 0 8px;
}
#palette {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
    max-height: 280px;
    overflow-y: auto;
    padding: 6px 6px 2px 0;
}
.icon {
    position: relative;
    aspect-ratio: 1;
    border: 2px solid transparent;
    border-radius: 8px;
    background: var(--btn);
    min-width: 0;
    overflow: hidden;
    cursor: pointer;
}
.icon img {
    position: absolute;
    left: 6px;
    top: 6px;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    object-fit: contain;
    pointer-events: none;
    image-rendering: pixelated;
}
.icon.active { border-color: var(--accent); }
.icon .rm {
    position: absolute;
    top: 2px;
    right: 2px;
    z-index: 1;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    padding: 0;
    font-size: 11px;
    line-height: 1;
    display: none;
}
.icon:hover .rm { display: block; }
#addIcons { display: block; text-align: center; margin-top: 8px; }
#mode { color: var(--muted); font-size: 12px; margin-top: 8px; min-height: 2.4em; }
.field { display: block; margin-bottom: 10px; color: var(--muted); font-size: 12px; }
.field input[type=text], .field input[type=number], .field select {
    display: block;
    width: 100%;
    margin-top: 4px;
    padding: 6px 8px;
    background: var(--bg);
    color: var(--text);
    border: 1px solid var(--line);
    border-radius: 6px;
    font: inherit;
}
.field input[type=range] { display: block; width: 100%; margin-top: 4px; }
.help { color: var(--muted); font-size: 12px; line-height: 1.6; margin: 0; padding-left: 16px; }
#viewport {
    position: relative;
    overflow: hidden;
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    background: repeating-conic-gradient(#23262c 0 25%, #1e2126 0 50%) 0 0 / 24px 24px;
}
#viewport.placing { cursor: crosshair; }
#viewport.panning { cursor: grabbing; }
#viewport.drop { outline: 2px dashed var(--accent); outline-offset: -4px; }
#world { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
#world > img.map { display: block; user-select: none; -webkit-user-drag: none; pointer-events: none; }
.ovl { position: absolute; }
.ovl img { width: 100%; height: 100%; display: block; pointer-events: none; -webkit-user-drag: none; }
.ovl.pixel img { image-rendering: pixelated; }
.ovl.sel { outline: calc(2px * var(--inv, 1)) solid var(--accent); }
.ovl .handle {
    display: none;
    position: absolute;
    right: calc(-7px * var(--inv, 1));
    bottom: calc(-7px * var(--inv, 1));
    width: calc(14px * var(--inv, 1));
    height: calc(14px * var(--inv, 1));
    background: var(--accent);
    border: calc(2px * var(--inv, 1)) solid #fff;
    border-radius: 50%;
    cursor: nwse-resize;
}
.ovl.sel .handle { display: block; }
#addImageBtn { display: block; text-align: center; }
.marker { position: absolute; transform: translate(-50%, -50%); cursor: pointer; border-radius: 50%; }
.marker img { width: 100%; height: 100%; object-fit: contain; display: block; pointer-events: none; -webkit-user-drag: none; image-rendering: pixelated; }
#layers { display: flex; flex-direction: column; gap: 2px; }
.layer { display: flex; align-items: center; gap: 6px; padding: 3px 6px; border-radius: 6px; cursor: pointer; }
.layer:hover { background: var(--btn); }
.layer.active { background: var(--btn); outline: 1px solid var(--accent); }
.layer .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.layer .count { color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; }
.layer .x { padding: 0 6px; line-height: 18px; font-size: 12px; visibility: hidden; }
.layer:hover .x { visibility: visible; }
#layers { padding-bottom: 14px; }
#layers.drop-end { box-shadow: inset 0 -2px 0 var(--accent); }
.layer.group { font-weight: 600; }
.layer.child { padding-left: 26px; }
.layer .caret { width: 10px; color: var(--muted); font-size: 11px; }
.layer.dragging { opacity: .4; }
.layer.drop-before { box-shadow: inset 0 2px 0 var(--accent); }
.layer.drop-after { box-shadow: inset 0 -2px 0 var(--accent); }
.layer.drop-into { outline: 1px dashed var(--accent); }
.palette-empty { grid-column: 1 / -1; color: var(--muted); font-size: 12px; line-height: 1.5; }
.marker.sel {
    outline: calc(2px * var(--inv, 1)) solid var(--accent);
    outline-offset: calc(2px * var(--inv, 1));
}
.marker .lbl {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 2px;
    white-space: nowrap;
    font-weight: 600;
    color: #fff;
    paint-order: stroke fill;
    -webkit-text-stroke: .25em rgba(0, 0, 0, .85);
    pointer-events: none;
    line-height: 1;
}
#cropRect {
    position: absolute;
    z-index: 100000;
    pointer-events: none;
    outline: calc(2px * var(--inv, 1)) dashed #ffd60a;
    box-shadow: 0 0 0 100000px rgba(0, 0, 0, .55);
}
#cropRect[hidden] { display: none; }
#viewport.cropping { cursor: crosshair; }
#viewport.drawing { cursor: none; }
.ovl.drawing { pointer-events: none; }
.ovl canvas { width: 100%; height: 100%; display: block; }
#brush {
    position: absolute;
    z-index: 99999;
    pointer-events: none;
    border-radius: 50%;
    outline: calc(1px * var(--inv, 1)) solid #fff;
    box-shadow: 0 0 0 calc(1px * var(--inv, 1)) #000;
}
#brush[hidden] { display: none; }
.tool.on { background: var(--accent); border-color: var(--accent); color: #fff; }
#drawDock {
    position: absolute;
    left: 8px;
    bottom: 8px;
    z-index: 6;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    max-width: calc(100% - 16px);
    padding: 6px 8px;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, .4);
    cursor: default;
}
#drawDock input[type=color] { width: 32px; height: 26px; padding: 0; border: 1px solid var(--line); border-radius: 6px; background: none; }
#drawDock input[type=range] { width: 90px; }
#drawDock select { background: var(--bg); color: var(--text); border: 1px solid var(--line); border-radius: 6px; padding: 4px 6px; font: inherit; max-width: 160px; }
#rPenSizeVal { color: var(--muted); font-size: 12px; min-width: 36px; font-variant-numeric: tabular-nums; }
.drawopts { display: flex; gap: 8px; align-items: center; margin-bottom: 4px; }
.drawopts input[type=color] { width: 36px; height: 28px; padding: 0; border: 1px solid var(--line); border-radius: 6px; background: none; }
.drawopts .field { flex: 1; margin: 0; }
#cropBar {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 6;
    display: flex;
    gap: 6px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    max-width: calc(100% - 16px);
    padding: 8px;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, .4);
    cursor: default;
}
#cropBar[hidden] { display: none; }
#cropInfo { color: var(--muted); font-size: 12px; margin-right: 4px; }
#layerPop {
    min-width: 200px;
    max-height: calc(100vh - 194px);
    overflow-y: auto;
    padding: 8px;
    background: var(--panel);
    border: 1px solid var(--line);
    border-left: none;
    border-radius: 0 0 8px 0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, .4);
    cursor: default;
}
#layerPop[hidden] { display: none; }
#layerPop label { display: flex; align-items: center; gap: 8px; padding: 3px 4px; border-radius: 6px; cursor: pointer; }
#layerPop label:hover { background: var(--btn); }
#layerPop .name { flex: 1; white-space: nowrap; }
#layerPop .count { color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; }
#layerPop .row { margin: 0 0 6px; }
#empty {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    gap: 10px;
    text-align: center;
    color: var(--muted);
}
#empty[hidden] { display: none; }
#atlasBtn { display: block; text-align: center; margin-top: 6px; }
dialog#importDlg {
    padding: 4px 16px 12px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--panel);
    color: var(--text);
    width: min(440px, 92vw);
    max-height: 88vh;
}
dialog#importDlg::backdrop { background: rgba(0, 0, 0, .6); }
#impList { max-height: 42vh; overflow-y: auto; margin-bottom: 6px; border: 1px solid var(--line); border-radius: 8px; padding: 4px; }
#impList .layer { cursor: pointer; }
#impBtn { display: block; text-align: center; margin-top: 6px; }
dialog#atlasDlg {
    padding: 0;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--panel);
    color: var(--text);
    width: min(1100px, 95vw);
    height: min(780px, 90vh);
}
dialog#atlasDlg::backdrop { background: rgba(0, 0, 0, .6); }
.dlg { display: grid; grid-template-columns: 250px 1fr; height: 100%; }
.dlg-side { padding: 4px 12px 12px; overflow: auto; border-right: 1px solid var(--line); }
.dlg-canvas {
    overflow: auto;
    background: repeating-conic-gradient(#3a3f48 0 25%, #2a2e35 0 50%) 0 0 / 16px 16px;
}
#atCanvas { display: block; cursor: crosshair; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 8px; }
.row { display: flex; gap: 6px; margin: 8px 0; }
.row button, .row > label.btn { flex: 1; text-align: center; }
.menu { position: relative; display: inline-block; }
#saveAsMenu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 100%;
    padding: 4px;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, .4);
}
#saveAsMenu[hidden] { display: none; }
#saveAsMenu button { text-align: left; }
#fileInfo { color: var(--muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 30ch; }
button.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
.check { display: flex; gap: 6px; align-items: center; color: var(--muted); font-size: 12px; margin-bottom: 10px; }
.note { color: var(--muted); font-size: 12px; line-height: 1.5; }
#atCount { color: var(--muted); font-size: 12px; }
`;

const MARKUP = `
<header>
    <span class="title">Map Pins</span>
    <button id="openBtn" class="edit-only" title="Open a saved map (HTML or JSON)">Open</button>
    <input id="projFile" type="file" accept=".html,.htm,.json,text/html,application/json">
    <button id="saveBtn" class="edit-only" disabled title="Save to the current file (Ctrl+S)">Save</button>
    <span class="menu edit-only">
        <button id="saveAsBtn" disabled aria-haspopup="true" aria-expanded="false">Save As ▾</button>
        <span id="saveAsMenu" hidden>
            <button data-fmt="png">PNG</button>
            <button data-fmt="html">HTML</button>
        </span>
    </span>
    <span id="fileInfo"></span>
    <span class="spacer"></span>
    <button id="zoomOut" title="Zoom out (-)">−</button>
    <span id="zoom"></span>
    <button id="zoomIn" title="Zoom in (+)">+</button>
    <button id="fit" title="Fit map (0)">Fit</button>
</header>
<aside id="side">
    <h2>Map</h2>
    <div class="row">
        <label class="btn">Open map image<input id="mapFile" type="file" accept="image/*"></label>
        <button id="cropBtn" disabled title="Crop the map image">Crop map</button>
    </div>
    <h2>Draw on layer</h2>
    <div class="row">
        <button id="penBtn" class="tool draw-pen" disabled title="Draw on the active layer (P)">Pencil</button>
        <button id="eraserBtn" class="tool draw-eraser" disabled title="Erase drawings and images on the active layer (E)">Eraser</button>
    </div>
    <div class="drawopts">
        <input id="penColor" class="draw-color" type="color" title="Pencil colour">
        <label class="field">Size <span id="penSizeVal" class="draw-size-val"></span><input id="penSize" class="draw-size" type="range" min="1" max="100" step="1" title="Size of the current tool"></label>
    </div>
    <p class="note">Works on the active layer. Middle-drag to pan while drawing, Esc to stop.</p>
    <h2>Icons</h2>
    <div id="palette"></div>
    <label class="btn" id="addIcons">Add icons…<input id="iconFile" type="file" accept="image/*" multiple></label>
    <label class="btn" id="atlasBtn">Split atlas…<input id="atlasFile" type="file" accept="image/*"></label>
    <div id="mode"></div>
    <h2>Layers</h2>
    <div id="layers"></div>
    <div class="row"><button id="addLayer">New layer</button><button id="addGroup">New group</button><button id="toggleLayers">Hide all</button></div>
    <label class="btn" id="addImageBtn" title="Add an image to the active layer, such as a map section that shows when the layer is on">Add image to layer…<input id="ovFile" type="file" accept="image/*" multiple></label>
    <label class="btn" id="impBtn" title="Copy chosen layers from another saved map into this one">Import layers…<input id="impFile" type="file" accept=".html,.htm,.json,text/html,application/json"></label>
    <p class="note">Drag layers to reorder them or drop them on a group. Layers higher in the list draw on top. Images sit under all markers.</p>
    <section id="labelPanel">
        <h2>Labels: <span id="lsLayer"></span></h2>
        <label class="check"><input id="lsShow" type="checkbox"> Show labels on this layer</label>
        <label class="field">Size <span id="lsSizeVal"></span><input id="lsSize" type="range" min="25" max="400" step="5"></label>
        <div class="grid2">
            <label class="field">Offset X (px)<input id="lsX" type="number" step="1"></label>
            <label class="field">Offset Y (px)<input id="lsY" type="number" step="1"></label>
        </div>
        <button id="lsReset">Reset labels</button>
    </section>
    <section id="selPanel" hidden>
        <h2>Selected marker</h2>
        <label class="field">Label<input id="lbl" type="text" placeholder="Optional"></label>
        <label class="field">Size <span id="sizeVal"></span><input id="size" type="range" min="4" max="400" step="1"></label>
        <label class="field">Layer<select id="mLayer"></select></label>
        <button id="del">Delete marker</button>
    </section>
    <section id="ovPanel" hidden>
        <h2>Selected image</h2>
        <label class="field">Name<input id="ovName" type="text"></label>
        <div class="grid2">
            <label class="field">X<input id="ovX" type="number" step="1"></label>
            <label class="field">Y<input id="ovY" type="number" step="1"></label>
            <label class="field">Width<input id="ovW" type="number" min="1" step="1"></label>
            <label class="field">Height<input id="ovH" type="number" min="1" step="1"></label>
        </div>
        <label class="check"><input id="ovLock" type="checkbox"> Keep aspect ratio</label>
        <label class="check"><input id="ovPixel" type="checkbox"> Sharp pixels</label>
        <label class="field">Opacity <span id="ovOpVal"></span><input id="ovOp" type="range" min="0" max="100" step="1"></label>
        <label class="field">Layer<select id="ovLayer"></select></label>
        <div class="row"><button id="ovNatural">Natural size</button><button id="ovDel">Delete image</button></div>
        <p class="note">Drag to move, drag the corner dot to resize. Arrow keys nudge 1px, Shift + arrow 10px.</p>
    </section>
    <h2>Controls</h2>
    <ul class="help">
        <li>Scroll or pinch to zoom</li>
        <li>Drag the map to pan</li>
        <li>Click the map to place the active icon</li>
        <li>Click a marker to select, drag to move</li>
        <li>Click an icon while a marker is selected to swap it</li>
        <li>Del deletes, Esc deselects, Ctrl+Z undoes</li>
        <li>Drop images here to add icons</li>
    </ul>
</aside>
<main id="viewport">
    <div id="world"><img class="map" id="mapImg" alt="" draggable="false"><div id="cropRect" hidden></div><div id="brush" hidden></div></div>
    <div id="cropBar" hidden>
        <span id="cropInfo"></span>
        <button id="cropAuto" title="Trim edges that match the corner colour">Auto-crop</button>
        <button id="cropReset">Full map</button>
        <button id="cropCancel">Cancel</button>
        <button id="cropApply" class="primary">Apply crop</button>
    </div>
    <button id="modeBtn" class="edge-tab" title="Collapse sidebar (read only)" aria-label="Collapse sidebar (read only)" aria-expanded="true">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path class="chev" d="M15 6l-6 6 6 6"/></svg>
    </button>
    <div id="drawDock" class="read-only">
        <button id="rPenBtn" class="tool draw-pen" disabled title="Pencil (P)">Pencil</button>
        <button id="rEraserBtn" class="tool draw-eraser" disabled title="Eraser (E)">Eraser</button>
        <input id="rPenColor" class="draw-color" type="color" title="Pencil colour">
        <input id="rPenSize" class="draw-size" type="range" min="1" max="100" step="1" title="Size of the current tool">
        <span id="rPenSizeVal" class="draw-size-val"></span>
        <select id="rLayer" title="Layer to draw on"></select>
    </div>
    <div id="layerDock" class="read-only">
        <div id="layerPop"></div>
        <button id="layersBtn" class="edge-tab" title="Hide layers" aria-label="Hide layers" aria-expanded="true">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/></svg>
        </button>
    </div>
    <div id="empty">
        <div>Open a map image to start, or drop one here.</div>
        <div><label class="btn">Open map image<input id="mapFile2" type="file" accept="image/*"></label></div>
    </div>
</main>
<dialog id="importDlg">
    <h2>Import layers from <span id="impSrc"></span></h2>
    <div id="impList"></div>
    <div class="row"><button id="impAll">Select all</button><button id="impNone">Select none</button></div>
    <label class="check"><input id="impGroups" type="checkbox" checked> Keep their groups</label>
    <label class="field">If a layer with the same name exists
        <select id="impConflict">
            <option value="rename">Import as a new layer (renamed)</option>
            <option value="merge">Add into the existing layer</option>
        </select>
    </label>
    <div class="grid2">
        <label class="field">Offset X (px)<input id="impDx" type="number" step="1" value="0"></label>
        <label class="field">Offset Y (px)<input id="impDy" type="number" step="1" value="0"></label>
    </div>
    <p class="note" id="impHint"></p>
    <div class="row"><button id="impCancel">Cancel</button><button id="impOk" class="primary">Import</button></div>
</dialog>
<dialog id="atlasDlg">
    <div class="dlg">
        <div class="dlg-side">
            <h2>Atlas splitter</h2>
            <label class="field">Name prefix<input id="atName" type="text"></label>
            <label class="field">Mode
                <select id="atMode">
                    <option value="auto">Auto-detect sprites</option>
                    <option value="grid">Grid</option>
                </select>
            </label>
            <div id="atAuto">
                <div class="grid2">
                    <label class="field">Merge gap (px)<input id="atGap" type="number" min="0" value="0"></label>
                    <label class="field">Min size (px)<input id="atMin" type="number" min="1" value="3"></label>
                </div>
            </div>
            <div id="atGrid" hidden>
                <div class="grid2">
                    <label class="field">Cell width<input id="atCw" type="number" min="1" value="16"></label>
                    <label class="field">Cell height<input id="atCh" type="number" min="1" value="16"></label>
                    <label class="field">Offset X<input id="atOx" type="number" min="0" value="0"></label>
                    <label class="field">Offset Y<input id="atOy" type="number" min="0" value="0"></label>
                    <label class="field">Spacing X<input id="atSx" type="number" min="0" value="0"></label>
                    <label class="field">Spacing Y<input id="atSy" type="number" min="0" value="0"></label>
                </div>
            </div>
            <label class="check"><input id="atTrim" type="checkbox"> Trim empty edges</label>
            <label class="field">Zoom <span id="atZoomVal"></span><input id="atZoom" type="range" min="1" max="16" step="1"></label>
            <div class="row"><button id="atAll">Select all</button><button id="atNone">Select none</button></div>
            <p class="note">Click a box to toggle it. Drag to draw your own box. Right-click a box to delete it.</p>
            <div id="atCount"></div>
            <div class="row"><button id="atCancel">Cancel</button><button id="atAdd" class="primary">Add icons</button></div>
        </div>
        <div class="dlg-canvas"><canvas id="atCanvas"></canvas></div>
    </div>
</dialog>
`;

const style = document.createElement('style');
style.textContent = CSS;
document.head.appendChild(style);
document.body.insertAdjacentHTML('afterbegin', MARKUP);

const $ = id => document.getElementById(id);
const AUTOSAVE_KEY = 'project:' + location.pathname;
let linked = window.mapPinsData ? linkedFiles() : null;
const vp = $('viewport');
const world = $('world');
const mapImg = $('mapImg');

const FALLBACK_ICON = {
    id: 'fallback',
    name: 'Missing icon',
    src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="#e5484d" stroke="#fff" stroke-width="3"/></svg>')
};

const state = { map: null, icons: [], markers: [], overlays: [], images: {}, layers: [{ name: 'Default', visible: true, group: '' }], groups: [], activeLayer: 'Default', activeIconId: null, newSize: 0 };
const view = { s: 1, x: 0, y: 0 };
const els = new Map();
const ovEls = new Map();
const history = [];
let selectedId = null;

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const allIcons = () => state.icons;
const iconById = id => allIcons().find(i => i.id === id) || FALLBACK_ICON;
const markerById = id => state.markers.find(m => m.id === id);
const overlayById = id => state.overlays.find(o => o.id === id);
const selectedItem = () => markerById(selectedId) || overlayById(selectedId);

function readUrl(file) {
    return new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = () => rej(r.error);
        r.readAsDataURL(file);
    });
}

function loadImg(src) {
    return new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => rej(new Error('Could not load image'));
        i.src = src;
    });
}

function download(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

const dbp = new Promise((res, rej) => {
    try {
        const r = indexedDB.open('map-pins', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('kv');
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
    } catch (e) {
        rej(e);
    }
});

async function idb(mode, fn) {
    const d = await dbp;
    return new Promise((res, rej) => {
        const t = d.transaction('kv', mode);
        const req = fn(t.objectStore('kv'));
        t.oncomplete = () => res(req.result);
        t.onerror = () => rej(t.error);
    });
}

function linkedFiles() {
    const name = suffix => {
        const el = [...document.scripts].find(s => (s.getAttribute('src') || '').endsWith(suffix));
        return el ? el.getAttribute('src').split('/').pop() : null;
    };
    return { data: name('.data.js'), images: name('.images.js') };
}

function hashKey(s) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i);
        h1 = Math.imul(h1 ^ c, 2654435761);
        h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
}

function mapStrings(v, fn) {
    if (typeof v === 'string') return fn(v);
    if (Array.isArray(v)) return v.map(x => mapStrings(x, fn));
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, mapStrings(x, fn)]));
    return v;
}

function splitImages(p) {
    const images = {};
    const data = mapStrings(p, s => {
        if (!s.startsWith('data:image/')) return s;
        const k = hashKey(s);
        images[k] = s;
        return '@img:' + k;
    });
    const keys = Object.keys(images).sort();
    return { data, images: Object.fromEntries(keys.map(k => [k, images[k]])) };
}

function joinImages(p, images) {
    return mapStrings(p, s => (s.startsWith('@img:') && images[s.slice(5)]) || s);
}

function jsBlock(name, obj) {
    const lines = Object.entries(obj).map(([k, v]) => '    ' + JSON.stringify(k) + ': ' + (Array.isArray(v) && v.length
        ? '[\n' + v.map(x => '        ' + JSON.stringify(x)).join(',\n') + '\n    ]'
        : JSON.stringify(v)));
    return `window.${name} = {\n${lines.join(',\n')}\n};\n`;
}

function projectData() {
    return {
        format: 'map-pins',
        version: 1,
        savedAt: Date.now(),
        map: state.map,
        icons: state.icons.map(({ id, name, src }) => ({ id, name, src })),
        markers: state.markers,
        overlays: state.overlays,
        images: Object.fromEntries([...new Set(state.overlays.map(o => o.imageId))].filter(id => state.images[id]).map(id => [id, state.images[id]])),
        layers: state.layers,
        groups: state.groups,
        activeLayer: state.activeLayer,
        activeIconId: state.activeIconId,
        newSize: state.newSize
    };
}

const layerByName = name => state.layers.find(l => l.name === name);
const groupByName = name => state.groups.find(g => g.name === name);
const layerVisible = name => {
    const l = layerByName(name);
    return !l || l.visible;
};
let layerZ = new Map();

function ensureLayers() {
    if (!state.layers.length) state.layers.push({ name: 'Default', visible: true, group: '' });
    for (const m of [...state.markers, ...state.overlays]) {
        if (!m.layer) m.layer = state.layers[0].name;
        if (!layerByName(m.layer)) state.layers.push({ name: m.layer, visible: true, group: '' });
    }
    for (const l of state.layers) {
        if (!l.group || !groupByName(l.group)) l.group = '';
    }
    if (!layerByName(state.activeLayer)) state.activeLayer = state.layers[0].name;
}

function orderedLayers() {
    const out = [];
    for (const g of state.groups) {
        for (const l of state.layers) {
            if (l.group === g.name) out.push(l);
        }
    }
    for (const l of state.layers) {
        if (!l.group) out.push(l);
    }
    return out;
}

function layerCounts() {
    const counts = {};
    for (const m of state.markers) counts[m.layer] = (counts[m.layer] || 0) + 1;
    for (const o of state.overlays) counts[o.layer] = (counts[o.layer] || 0) + 1;
    return counts;
}

function labelStyle(layerName) {
    const l = layerByName(layerName) || {};
    return {
        show: l.labels !== false,
        scale: Number.isFinite(l.labelScale) ? l.labelScale : 100,
        dx: Number.isFinite(l.labelDx) ? l.labelDx : 0,
        dy: Number.isFinite(l.labelDy) ? l.labelDy : 0
    };
}

function renderLabelPanel() {
    const l = layerByName(state.activeLayer);
    $('labelPanel').hidden = !l;
    if (!l) return;
    const s = labelStyle(l.name);
    $('lsLayer').textContent = l.name;
    $('lsShow').checked = s.show;
    $('lsSize').value = s.scale;
    $('lsSizeVal').textContent = s.scale + '%';
    if (document.activeElement !== $('lsX')) $('lsX').value = s.dx;
    if (document.activeElement !== $('lsY')) $('lsY').value = s.dy;
}

function editActiveLabels(fn) {
    const l = layerByName(state.activeLayer);
    if (!l) return;
    fn(l);
    renderLabelPanel();
    for (const m of state.markers) {
        if (m.layer === l.name) markerEl(m);
    }
    save();
}

function renderLayers() {
    const order = orderedLayers();
    layerZ = new Map(order.map((l, i) => [l.name, order.length - i]));
    for (const m of state.markers) {
        const el = els.get(m.id);
        if (el) el.style.zIndex = 10000 + (layerZ.get(m.layer) || 0);
    }
    for (const o of state.overlays) {
        const el = ovEls.get(o.id);
        if (el) el.style.zIndex = layerZ.get(o.layer) || 0;
    }
    const counts = layerCounts();
    buildLayerTree($('layers'), true, counts);
    $('toggleLayers').textContent = state.layers.every(l => l.visible) ? 'Hide all' : 'Show all';
    renderLayerPop(counts);
    renderLabelPanel();
    fillLayerSelect($('rLayer'), state.activeLayer);
}

let layerDrag = null;

function clearDropMarks() {
    document.querySelectorAll('.drop-before, .drop-after, .drop-into').forEach(el => el.classList.remove('drop-before', 'drop-after', 'drop-into'));
    $('layers').classList.remove('drop-end');
}

function dropPosition(row, e) {
    const r = row.getBoundingClientRect();
    return e.clientY > r.top + r.height / 2;
}

function makeDraggable(row, kind, name, target) {
    row.draggable = true;
    row.addEventListener('dragstart', e => {
        layerDrag = { kind, name };
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', name);
        row.classList.add('dragging');
    });
    row.addEventListener('dragend', () => {
        layerDrag = null;
        row.classList.remove('dragging');
        clearDropMarks();
    });
    row.addEventListener('dragover', e => {
        if (!layerDrag) return;
        e.preventDefault();
        e.stopPropagation();
        clearDropMarks();
        if (target.kind === 'group' && layerDrag.kind === 'layer') row.classList.add('drop-into');
        else row.classList.add(dropPosition(row, e) ? 'drop-after' : 'drop-before');
    });
    row.addEventListener('drop', e => {
        if (!layerDrag) return;
        e.preventDefault();
        e.stopPropagation();
        moveLayerItem(layerDrag, target, dropPosition(row, e));
    });
}

function moveLayerItem(drag, target, after) {
    clearDropMarks();
    if (drag.kind === 'layer') {
        const l = layerByName(drag.name);
        if (!l || (target.kind === 'layer' && target.name === l.name)) return;
        state.layers.splice(state.layers.indexOf(l), 1);
        if (target.kind === 'layer') {
            const t = layerByName(target.name);
            l.group = t.group;
            state.layers.splice(state.layers.indexOf(t) + (after ? 1 : 0), 0, l);
        } else if (target.kind === 'group') {
            const g = groupByName(target.name);
            l.group = g.name;
            g.collapsed = false;
            const first = state.layers.findIndex(x => x.group === g.name);
            if (first < 0) state.layers.push(l);
            else state.layers.splice(first, 0, l);
        } else {
            l.group = '';
            state.layers.push(l);
        }
    } else {
        const g = groupByName(drag.name);
        if (!g) return;
        let to = null;
        if (target.kind === 'group') to = groupByName(target.name);
        else if (target.kind === 'layer') {
            const t = layerByName(target.name);
            to = t && t.group ? groupByName(t.group) : null;
        }
        if (to === g) return;
        state.groups.splice(state.groups.indexOf(g), 1);
        if (to) state.groups.splice(state.groups.indexOf(to) + (after ? 1 : 0), 0, g);
        else state.groups.push(g);
    }
    renderLayers();
    renderPanel();
    save();
}

function layerRow(l, editable, counts, child) {
    const row = document.createElement(editable ? 'div' : 'label');
    row.className = 'layer' + (child ? ' child' : '') + (editable && l.name === state.activeLayer ? ' active' : '');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = l.visible;
    cb.title = 'Show or hide';
    cb.addEventListener('click', e => e.stopPropagation());
    cb.addEventListener('change', () => setLayerVisible(l, cb.checked));
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = l.name;
    const count = document.createElement('span');
    count.className = 'count';
    count.textContent = counts[l.name] || 0;
    row.append(cb, name, count);
    if (editable) {
        row.title = 'Click to place new markers on this layer. Double-click to rename. Drag to reorder or move into a group.';
        const x = document.createElement('button');
        x.className = 'x';
        x.textContent = '×';
        x.title = 'Delete layer';
        x.addEventListener('click', e => {
            e.stopPropagation();
            deleteLayer(l);
        });
        row.appendChild(x);
        row.addEventListener('click', () => {
            state.activeLayer = l.name;
            renderLayers();
            save();
        });
        row.addEventListener('dblclick', () => renameLayer(l));
        makeDraggable(row, 'layer', l.name, { kind: 'layer', name: l.name });
    }
    return row;
}

function groupRow(g, editable, counts) {
    const members = state.layers.filter(l => l.group === g.name);
    const shown = members.filter(l => l.visible).length;
    const row = document.createElement('div');
    row.className = 'layer group';
    const caret = document.createElement('span');
    caret.className = 'caret';
    caret.textContent = g.collapsed ? '▸' : '▾';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = members.length > 0 && shown === members.length;
    cb.indeterminate = shown > 0 && shown < members.length;
    cb.title = 'Show or hide the whole group';
    cb.addEventListener('click', e => e.stopPropagation());
    cb.addEventListener('change', () => {
        for (const l of members) l.visible = cb.checked;
        const m = selectedItem();
        if (!cb.checked && m && members.some(l => l.name === m.layer)) select(null);
        renderMarkers();
        renderLayers();
        save();
    });
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = g.name;
    const count = document.createElement('span');
    count.className = 'count';
    count.textContent = members.reduce((n, l) => n + (counts[l.name] || 0), 0);
    row.append(caret, cb, name, count);
    row.title = g.collapsed ? 'Expand group' : 'Collapse group';
    row.addEventListener('click', () => {
        g.collapsed = !g.collapsed;
        renderLayers();
        save();
    });
    if (editable) {
        row.title += '. Double-click to rename. Drag to reorder.';
        const x = document.createElement('button');
        x.className = 'x';
        x.textContent = '×';
        x.title = 'Delete group (its layers are kept)';
        x.addEventListener('click', e => {
            e.stopPropagation();
            deleteGroup(g);
        });
        row.appendChild(x);
        row.addEventListener('dblclick', e => {
            e.stopPropagation();
            renameGroup(g);
        });
        makeDraggable(row, 'group', g.name, { kind: 'group', name: g.name });
    }
    return { row, members };
}

function buildLayerTree(box, editable, counts) {
    box.replaceChildren();
    for (const g of state.groups) {
        const { row, members } = groupRow(g, editable, counts);
        box.appendChild(row);
        if (!g.collapsed) {
            for (const l of members) box.appendChild(layerRow(l, editable, counts, true));
        }
    }
    for (const l of state.layers) {
        if (!l.group) box.appendChild(layerRow(l, editable, counts, false));
    }
}

function setLayerPop(open) {
    $('layerPop').hidden = !open;
    const label = open ? 'Hide layers' : 'Show layers';
    $('layersBtn').title = label;
    $('layersBtn').setAttribute('aria-label', label);
    $('layersBtn').setAttribute('aria-expanded', String(open));
}

function renderLayerPop(counts) {
    const pop = $('layerPop');
    pop.replaceChildren();
    const row = document.createElement('div');
    row.className = 'row';
    const all = document.createElement('button');
    all.textContent = state.layers.every(l => l.visible) ? 'Hide all' : 'Show all';
    all.addEventListener('click', toggleAllLayers);
    row.appendChild(all);
    pop.appendChild(row);
    const tree = document.createElement('div');
    tree.className = 'layer-tree';
    buildLayerTree(tree, false, counts);
    pop.appendChild(tree);
}

function setLayerVisible(l, visible) {
    l.visible = visible;
    const m = selectedItem();
    if (!visible && m && m.layer === l.name) select(null);
    renderMarkers();
    renderLayers();
    save();
}

function askName(message, current, taken) {
    const name = (prompt(message, current || '') || '').trim();
    if (!name || name === current) return null;
    if (taken(name)) {
        alert('That name is already used.');
        return null;
    }
    return name;
}

function addLayer() {
    const name = askName('Layer name', '', layerByName);
    if (!name) return;
    const a = layerByName(state.activeLayer);
    const l = { name, visible: true, group: a ? a.group : '' };
    state.layers.splice(a ? state.layers.indexOf(a) + 1 : state.layers.length, 0, l);
    state.activeLayer = name;
    renderLayers();
    renderPanel();
    save();
}

function addGroup() {
    const name = askName('Group name', '', groupByName);
    if (!name) return;
    state.groups.push({ name, collapsed: false });
    renderLayers();
    renderPanel();
    save();
}

function renameLayer(l) {
    const name = askName('Rename layer', l.name, layerByName);
    if (!name) return;
    for (const m of [...state.markers, ...state.overlays]) {
        if (m.layer === l.name) m.layer = name;
    }
    if (state.activeLayer === l.name) state.activeLayer = name;
    l.name = name;
    renderLayers();
    renderPanel();
    save();
}

function renameGroup(g) {
    const name = askName('Rename group', g.name, groupByName);
    if (!name) return;
    for (const l of state.layers) {
        if (l.group === g.name) l.group = name;
    }
    g.name = name;
    renderLayers();
    renderPanel();
    save();
}

function deleteGroup(g) {
    for (const l of state.layers) {
        if (l.group === g.name) l.group = '';
    }
    state.groups = state.groups.filter(x => x !== g);
    renderLayers();
    renderPanel();
    save();
}

function deleteLayer(l) {
    const used = state.markers.filter(m => m.layer === l.name).length;
    const imgs = state.overlays.filter(o => o.layer === l.name).length;
    if (state.layers.length === 1 && !used && !imgs) return;
    const what = [used ? `${used} marker(s)` : '', imgs ? `${imgs} image(s)` : ''].filter(Boolean).join(' and ');
    if (what && !confirm(`Delete layer "${l.name}" and its ${what}?`)) return;
    if (what) snap();
    state.markers = state.markers.filter(m => m.layer !== l.name);
    state.overlays = state.overlays.filter(o => o.layer !== l.name);
    state.layers = state.layers.filter(x => x !== l);
    ensureLayers();
    if (!markerById(selectedId)) selectedId = null;
    renderMarkers();
    renderLayers();
    renderPanel();
    save();
}

let saveTimer = 0;
function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        idb('readwrite', s => s.put(projectData(), AUTOSAVE_KEY)).catch(e => console.warn('Autosave failed', e));
    }, 400);
}

function snap() {
    history.push(JSON.stringify({ m: state.markers, o: state.overlays }));
    if (history.length > 200) history.shift();
}

function undo() {
    if (!history.length) return;
    const h = JSON.parse(history.pop());
    if (Array.isArray(h)) {
        state.markers = h;
    } else {
        state.markers = h.m;
        state.overlays = h.o;
    }
    ensureLayers();
    if (!selectedItem()) selectedId = null;
    renderMarkers();
    renderLayers();
    renderPanel();
    save();
}

function apply() {
    world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.s})`;
    world.style.setProperty('--inv', 1 / view.s);
    $('zoom').textContent = state.map ? Math.round(view.s * 100) + '%' : '';
}

function fitScale() {
    const r = vp.getBoundingClientRect();
    return Math.min(r.width / state.map.w, r.height / state.map.h) * 0.95;
}

function fit() {
    if (!state.map) return;
    const r = vp.getBoundingClientRect();
    view.s = fitScale();
    view.x = (r.width - state.map.w * view.s) / 2;
    view.y = (r.height - state.map.h * view.s) / 2;
    apply();
}

function zoomAt(f, cx, cy) {
    if (!state.map) return;
    const fs = fitScale();
    const s = clamp(view.s * f, fs * 0.25, Math.max(8, fs * 40));
    const k = s / view.s;
    view.x = cx - (cx - view.x) * k;
    view.y = cy - (cy - view.y) * k;
    view.s = s;
    apply();
}

function zoomCenter(f) {
    const r = vp.getBoundingClientRect();
    zoomAt(f, r.width / 2, r.height / 2);
}

function toMap(cx, cy) {
    const r = vp.getBoundingClientRect();
    return { x: (cx - r.left - view.x) / view.s, y: (cy - r.top - view.y) / view.s };
}

function defaultSize() {
    return Math.max(16, Math.round(Math.min(state.map.w, state.map.h) * 0.04));
}

async function setMap(src, name, refit = true) {
    const img = await loadImg(src);
    state.map = { src, name: name || 'map', w: img.naturalWidth, h: img.naturalHeight };
    mapImg.src = src;
    world.style.width = state.map.w + 'px';
    world.style.height = state.map.h + 'px';
    if (!state.newSize) state.newSize = defaultSize();
    $('size').max = Math.max(64, Math.round(Math.min(state.map.w, state.map.h) / 4));
    $('empty').hidden = true;
    $('saveBtn').disabled = false;
    $('saveAsBtn').disabled = false;
    $('cropBtn').disabled = false;
    document.querySelectorAll('.draw-pen, .draw-eraser').forEach(b => { b.disabled = false; });
    if (refit) fit();
    renderMarkers();
    renderMode();
}

async function openMapFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    try {
        await setMap(await readUrl(file), file.name.replace(/\.[^.]+$/, ''));
        save();
    } catch (e) {
        alert('Could not open that image: ' + e.message);
    }
}

async function addIconFiles(files) {
    for (const f of files) {
        if (!f.type.startsWith('image/')) continue;
        try {
            const src = await readUrl(f);
            await loadImg(src);
            const icon = { id: 'u:' + uid(), name: f.name.replace(/\.[^.]+$/, ''), src };
            state.icons.push(icon);
            state.activeIconId = icon.id;
        } catch (e) {
            alert(`Could not add ${f.name}: ${e.message}`);
        }
    }
    renderPalette();
    renderMode();
    save();
}

function removeIcon(id) {
    const used = state.markers.filter(m => m.iconId === id).length;
    if (used && !confirm(`This icon is used by ${used} marker(s). Remove the icon and those markers?`)) return;
    if (used) snap();
    state.markers = state.markers.filter(m => m.iconId !== id);
    state.icons = state.icons.filter(i => i.id !== id);
    if (state.activeIconId === id) state.activeIconId = null;
    if (!markerById(selectedId)) selectedId = null;
    renderPalette();
    renderMarkers();
    renderLayers();
    renderPanel();
    renderMode();
    save();
}

function pickIcon(id) {
    const m = markerById(selectedId);
    if (m) {
        if (m.iconId !== id) {
            snap();
            m.iconId = id;
            markerEl(m);
        }
        state.activeIconId = id;
    } else {
        state.activeIconId = state.activeIconId === id ? null : id;
    }
    renderPalette();
    renderMode();
    save();
}

function renderPalette() {
    const p = $('palette');
    p.replaceChildren();
    if (!state.icons.length) {
        const hint = document.createElement('div');
        hint.className = 'palette-empty';
        hint.textContent = 'No icons yet. Add icons or split an atlas to start placing markers.';
        p.appendChild(hint);
    }
    for (const icon of allIcons()) {
        const d = document.createElement('div');
        d.className = 'icon' + (icon.id === state.activeIconId ? ' active' : '');
        d.title = icon.name;
        const img = document.createElement('img');
        img.src = icon.src;
        img.alt = icon.name;
        d.appendChild(img);
        d.addEventListener('click', () => pickIcon(icon.id));
        const rm = document.createElement('button');
        rm.className = 'rm';
        rm.textContent = '×';
        rm.title = 'Remove icon';
        rm.addEventListener('click', e => {
            e.stopPropagation();
            removeIcon(icon.id);
        });
        d.appendChild(rm);
        p.appendChild(d);
    }
}

let reading = false;

const crop = { active: false, rect: null };

function setCropRect(x0, y0, x1, y1) {
    const ax = clamp(Math.round(Math.min(x0, x1)), 0, state.map.w);
    const ay = clamp(Math.round(Math.min(y0, y1)), 0, state.map.h);
    const bx = clamp(Math.round(Math.max(x0, x1)), 0, state.map.w);
    const by = clamp(Math.round(Math.max(y0, y1)), 0, state.map.h);
    crop.rect = { x: ax, y: ay, w: bx - ax, h: by - ay };
    drawCropRect();
}

function drawCropRect() {
    const r = crop.rect;
    const el = $('cropRect');
    el.hidden = !crop.active || !r;
    if (!r) return;
    el.style.left = r.x + 'px';
    el.style.top = r.y + 'px';
    el.style.width = r.w + 'px';
    el.style.height = r.h + 'px';
    $('cropInfo').textContent = `Drag on the map to pick the area to keep. Middle-drag or scroll to move around. ${r.w} × ${r.h}px`;
    $('cropApply').disabled = r.w < 1 || r.h < 1 || (r.w === state.map.w && r.h === state.map.h);
}

const BLANK_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const draw = { tool: null, stroke: null, color: '#ff3b30', sizes: { pen: 6, eraser: 20 } };
try {
    const saved = JSON.parse(localStorage.getItem('map-pins-draw') || 'null');
    if (saved) {
        if (/^#[0-9a-f]{6}$/i.test(saved.color)) draw.color = saved.color;
        for (const k of ['pen', 'eraser']) {
            if (Number.isFinite(saved.sizes?.[k])) draw.sizes[k] = clamp(saved.sizes[k], 1, 100);
        }
    }
} catch (e) {}

function storeDrawPrefs() {
    try {
        localStorage.setItem('map-pins-draw', JSON.stringify({ color: draw.color, sizes: draw.sizes }));
    } catch (e) {}
}

function syncDrawUI() {
    const size = draw.sizes[draw.tool || 'pen'];
    document.querySelectorAll('.draw-pen').forEach(b => b.classList.toggle('on', draw.tool === 'pen'));
    document.querySelectorAll('.draw-eraser').forEach(b => b.classList.toggle('on', draw.tool === 'eraser'));
    document.querySelectorAll('.draw-color').forEach(c => {
        if (c !== document.activeElement) c.value = draw.color;
    });
    document.querySelectorAll('.draw-size').forEach(s => {
        s.value = size;
        s.title = `Size of the ${draw.tool === 'eraser' ? 'eraser' : 'pencil'}`;
    });
    document.querySelectorAll('.draw-size-val').forEach(v => { v.textContent = size + 'px'; });
}
const workCanvases = new Map();

function setTool(tool) {
    draw.tool = tool && state.map ? tool : null;
    if (draw.tool) {
        endCrop();
        select(null);
    }
    syncDrawUI();
    vp.classList.toggle('drawing', !!draw.tool);
    if (!draw.tool) $('brush').hidden = true;
}

function brushSize() {
    return Math.max(1, draw.sizes[draw.tool || 'pen'] || 1);
}

function moveBrush(p) {
    const b = $('brush');
    const s = brushSize();
    b.hidden = !draw.tool;
    b.style.left = p.x - s / 2 + 'px';
    b.style.top = p.y - s / 2 + 'px';
    b.style.width = b.style.height = s + 'px';
    b.style.background = draw.tool === 'pen' ? draw.color + '55' : 'rgba(255, 255, 255, .25)';
}

async function workCanvas(o) {
    const existing = workCanvases.get(o.id);
    if (existing && existing.imageId === o.imageId) return existing;
    if (existing) existing.canvas.remove();
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(o.nw || o.w));
    c.height = Math.max(1, Math.round(o.nh || o.h));
    const g = c.getContext('2d');
    const src = state.images[o.imageId];
    if (src && src !== BLANK_PNG) g.drawImage(await loadImg(src), 0, 0, c.width, c.height);
    const work = { canvas: c, g, imageId: o.imageId };
    workCanvases.set(o.id, work);
    return work;
}

async function beginStroke(p) {
    const layer = layerByName(state.activeLayer);
    if (!layer) return;
    snap();
    layer.visible = true;
    let targets;
    if (draw.tool === 'pen') {
        let o = state.overlays.find(x => x.drawing && x.layer === layer.name);
        if (!o) {
            const imageId = 'img-' + uid();
            state.images[imageId] = BLANK_PNG;
            o = {
                id: uid(), layer: layer.name, imageId, name: 'Drawing', drawing: true,
                x: 0, y: 0, w: state.map.w, h: state.map.h, nw: state.map.w, nh: state.map.h,
                opacity: 1, lock: true, pixelated: false
            };
            state.overlays.push(o);
        }
        targets = [o];
    } else {
        targets = state.overlays.filter(o => o.layer === layer.name);
    }
    const stroke = { works: [], last: p, done: false };
    draw.stroke = stroke;
    for (const o of targets) stroke.works.push({ o, work: await workCanvas(o) });
    renderMarkers();
    renderLayers();
    strokeTo(stroke, p, p);
    stroke.last = draw.pendingPoint || p;
    if (draw.pendingPoint) strokeTo(stroke, p, draw.pendingPoint);
    draw.pendingPoint = null;
    if (stroke.done) finishStroke(stroke);
}

function strokeTo(stroke, a, b) {
    for (const { o, work } of stroke.works) {
        const sx = work.canvas.width / o.w;
        const sy = work.canvas.height / o.h;
        const g = work.g;
        g.save();
        g.globalCompositeOperation = draw.tool === 'eraser' ? 'destination-out' : 'source-over';
        g.strokeStyle = draw.color;
        g.lineWidth = brushSize() * (sx + sy) / 2;
        g.lineCap = 'round';
        g.lineJoin = 'round';
        g.beginPath();
        g.moveTo((a.x - o.x) * sx, (a.y - o.y) * sy);
        g.lineTo((b.x - o.x) * sx + 0.01, (b.y - o.y) * sy);
        g.stroke();
        g.restore();
    }
}

function finishStroke(stroke) {
    for (const { o, work } of stroke.works) {
        const imageId = 'img-' + uid();
        state.images[imageId] = work.canvas.toDataURL('image/png');
        o.imageId = imageId;
        work.imageId = imageId;
        overlayEl(o);
    }
    save();
}

function startCrop() {
    if (!state.map || reading) return;
    setTool(null);
    select(null);
    crop.active = true;
    vp.classList.add('cropping');
    $('cropBar').hidden = false;
    setCropRect(0, 0, state.map.w, state.map.h);
}

function endCrop() {
    crop.active = false;
    vp.classList.remove('cropping');
    $('cropBar').hidden = true;
    $('cropRect').hidden = true;
}

async function autoCrop() {
    const img = await loadImg(state.map.src);
    const w = img.naturalWidth, h = img.naturalHeight;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, w, h).data;
    const bg = [d[0], d[1], d[2], d[3]];
    const differs = i => Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) + Math.abs(d[i + 3] - bg[3]) > 12;
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (differs((y * w + x) * 4)) {
                if (x < x0) x0 = x;
                if (x > x1) x1 = x;
                if (y < y0) y0 = y;
                if (y > y1) y1 = y;
            }
        }
    }
    if (x1 < 0) {
        alert('The whole map is one colour, so there is nothing to trim.');
        return;
    }
    setCropRect(x0, y0, x1 + 1, y1 + 1);
}

async function applyCrop() {
    const r = crop.rect;
    if (!r || r.w < 1 || r.h < 1) return;
    const outside = state.markers.filter(m => m.x < r.x || m.y < r.y || m.x > r.x + r.w || m.y > r.y + r.h);
    const msg = `Crop the map to ${r.w} × ${r.h}px?` +
        (outside.length ? ` ${outside.length} marker(s) outside the area will be removed.` : '') +
        ' This clears undo history.';
    if (!confirm(msg)) return;
    try {
        const img = await loadImg(state.map.src);
        const c = document.createElement('canvas');
        c.width = r.w;
        c.height = r.h;
        c.getContext('2d').drawImage(img, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h);
        const src = c.toDataURL('image/png');
        state.markers = state.markers
            .filter(m => !outside.includes(m))
            .map(m => ({ ...m, x: m.x - r.x, y: m.y - r.y }));
        for (const o of state.overlays) {
            o.x -= r.x;
            o.y -= r.y;
        }
        history.length = 0;
        selectedId = null;
        endCrop();
        await setMap(src, state.map.name, false);
        view.x += r.x * view.s;
        view.y += r.y * view.s;
        apply();
        renderLayers();
        renderPanel();
        save();
    } catch (err) {
        alert('Crop failed: ' + err.message);
    }
}

function setReading(on) {
    reading = !!(on && state.map);
    const before = vp.getBoundingClientRect();
    document.body.classList.toggle('reading', reading);
    const after = vp.getBoundingClientRect();
    view.x += before.left - after.left;
    view.y += before.top - after.top;
    const modeLabel = reading ? 'Expand sidebar (edit)' : 'Collapse sidebar (read only)';
    $('modeBtn').title = modeLabel;
    $('modeBtn').setAttribute('aria-label', modeLabel);
    $('modeBtn').setAttribute('aria-expanded', String(!reading));
    setTool(null);
    if (reading) {
        setLayerPop(true);
        endCrop();
        select(null);
        if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    }
    try {
        localStorage.setItem('map-pins-mode:' + location.pathname, reading ? 'read' : 'edit');
    } catch (e) {}
    renderMode();
    apply();
}

function renderMode() {
    const icon = state.activeIconId && allIcons().find(i => i.id === state.activeIconId);
    vp.classList.toggle('placing', !!(icon && state.map && !reading));
    $('mode').textContent = icon
        ? `Click the map to place: ${icon.name}`
        : 'No icon active. Clicking the map selects and pans only.';
}

function markerEl(m) {
    let el = els.get(m.id);
    if (!el) {
        el = document.createElement('div');
        el.className = 'marker';
        el.dataset.id = m.id;
        el.innerHTML = '<img alt="" draggable="false"><span class="lbl"></span>';
        world.appendChild(el);
        els.set(m.id, el);
    }
    const icon = iconById(m.iconId);
    el.style.left = m.x + 'px';
    el.style.top = m.y + 'px';
    el.style.width = el.style.height = m.size + 'px';
    const img = el.firstChild;
    if (img.getAttribute('src') !== icon.src) img.src = icon.src;
    el.title = m.label || icon.name;
    const lbl = el.lastChild;
    const ls = labelStyle(m.layer);
    lbl.textContent = m.label || '';
    lbl.style.display = ls.show && m.label ? '' : 'none';
    lbl.style.fontSize = Math.max(6, m.size * 0.38) * ls.scale / 100 + 'px';
    lbl.style.transform = `translate(calc(-50% + ${ls.dx}px), ${ls.dy}px)`;
    el.classList.toggle('sel', m.id === selectedId);
    el.style.display = layerVisible(m.layer) ? '' : 'none';
    el.style.zIndex = 10000 + (layerZ.get(m.layer) || 0);
    return el;
}

function overlayEl(o) {
    let el = ovEls.get(o.id);
    if (!el) {
        el = document.createElement('div');
        el.className = 'ovl';
        el.dataset.id = o.id;
        el.innerHTML = '<img alt="" draggable="false"><div class="handle" title="Drag to resize"></div>';
        mapImg.after(el);
        ovEls.set(o.id, el);
    }
    const src = state.images[o.imageId] || FALLBACK_ICON.src;
    const img = el.querySelector('img');
    if (img.getAttribute('src') !== src) img.src = src;
    el.style.left = o.x + 'px';
    el.style.top = o.y + 'px';
    el.style.width = o.w + 'px';
    el.style.height = o.h + 'px';
    el.style.opacity = o.opacity ?? 1;
    el.title = o.name || 'Image';
    el.classList.toggle('pixel', !!o.pixelated);
    el.classList.toggle('drawing', !!o.drawing);
    el.classList.toggle('sel', o.id === selectedId);
    const work = workCanvases.get(o.id);
    const live = work && work.imageId === o.imageId;
    if (work && !live) {
        work.canvas.remove();
        workCanvases.delete(o.id);
    } else if (live && work.canvas.parentNode !== el) {
        el.insertBefore(work.canvas, img);
    }
    img.style.display = live ? 'none' : '';
    el.style.display = layerVisible(o.layer) ? '' : 'none';
    el.style.zIndex = layerZ.get(o.layer) || 0;
    return el;
}

function renderMarkers() {
    const ids = new Set(state.markers.map(m => m.id));
    for (const [id, el] of els) {
        if (!ids.has(id)) {
            el.remove();
            els.delete(id);
        }
    }
    state.markers.forEach(markerEl);
    const ovIds = new Set(state.overlays.map(o => o.id));
    for (const [id, el] of ovEls) {
        if (!ovIds.has(id)) {
            el.remove();
            ovEls.delete(id);
        }
    }
    state.overlays.forEach(overlayEl);
}

function fillLayerSelect(sel, value) {
    sel.replaceChildren();
    for (const g of state.groups) {
        const og = document.createElement('optgroup');
        og.label = g.name;
        for (const l of state.layers) {
            if (l.group === g.name) og.appendChild(new Option(l.name, l.name));
        }
        if (og.children.length) sel.appendChild(og);
    }
    for (const l of state.layers) {
        if (!l.group) sel.appendChild(new Option(l.name, l.name));
    }
    sel.value = value;
}

function renderOverlayFields(o) {
    const set = (id, v) => {
        if (document.activeElement !== $(id)) $(id).value = v;
    };
    set('ovName', o.name || '');
    set('ovX', Math.round(o.x));
    set('ovY', Math.round(o.y));
    set('ovW', Math.round(o.w));
    set('ovH', Math.round(o.h));
    $('ovLock').checked = o.lock !== false;
    $('ovPixel').checked = !!o.pixelated;
    $('ovOp').value = Math.round((o.opacity ?? 1) * 100);
    $('ovOpVal').textContent = Math.round((o.opacity ?? 1) * 100) + '%';
}

const activeIconUsable = () => !!(state.activeIconId && allIcons().some(i => i.id === state.activeIconId));

async function addOverlayFiles(files) {
    const layer = layerByName(state.activeLayer) || state.layers[0];
    if (!state.map || !layer) return;
    const r = vp.getBoundingClientRect();
    const cx = (r.width / 2 - view.x) / view.s;
    const cy = (r.height / 2 - view.y) / view.s;
    let last = null;
    let snapped = false;
    for (const f of files) {
        if (!f.type.startsWith('image/')) continue;
        try {
            const src = await readUrl(f);
            const img = await loadImg(src);
            if (!snapped) {
                snap();
                snapped = true;
            }
            const imageId = 'img-' + uid();
            state.images[imageId] = src;
            const w = img.naturalWidth, h = img.naturalHeight;
            last = {
                id: uid(), layer: layer.name, imageId, name: f.name.replace(/\.[^.]+$/, ''),
                x: Math.round(cx - w / 2), y: Math.round(cy - h / 2), w, h, nw: w, nh: h,
                opacity: 1, lock: true, pixelated: false
            };
            state.overlays.push(last);
        } catch (e) {
            alert(`Could not add ${f.name}: ${e.message}`);
        }
    }
    if (!last) return;
    layer.visible = true;
    renderMarkers();
    renderLayers();
    select(last.id);
    save();
}

function nudgeSelected(dx, dy) {
    const item = selectedItem();
    if (!item) return;
    snap();
    item.x += dx;
    item.y += dy;
    if (markerById(item.id)) markerEl(item);
    else {
        overlayEl(item);
        renderOverlayFields(item);
    }
    save();
}

function renderPanel() {
    const o = overlayById(selectedId);
    $('ovPanel').hidden = !o;
    if (o) {
        renderOverlayFields(o);
        fillLayerSelect($('ovLayer'), o.layer);
    }
    const m = markerById(selectedId);
    $('selPanel').hidden = !m;
    if (!m) return;
    if (document.activeElement !== $('lbl')) $('lbl').value = m.label || '';
    $('size').value = m.size;
    $('sizeVal').textContent = Math.round(m.size) + 'px';
    fillLayerSelect($('mLayer'), m.layer);
}

function select(id) {
    const prev = markerById(selectedId);
    const prevO = overlayById(selectedId);
    selectedId = id;
    if (prev) markerEl(prev);
    if (prevO) overlayEl(prevO);
    const o = overlayById(id);
    if (o) overlayEl(o);
    const m = markerById(id);
    if (m) {
        markerEl(m);
        state.activeIconId = m.iconId;
        renderPalette();
        renderMode();
    }
    renderPanel();
}

function addMarker(x, y) {
    snap();
    const layer = layerByName(state.activeLayer) || state.layers[0];
    layer.visible = true;
    const m = { id: uid(), x, y, iconId: state.activeIconId, size: state.newSize || defaultSize(), label: '', layer: layer.name };
    state.markers.push(m);
    renderMarkers();
    select(m.id);
    renderLayers();
    save();
}

function deleteSelected() {
    if (!selectedItem()) return;
    snap();
    state.markers = state.markers.filter(m => m.id !== selectedId);
    state.overlays = state.overlays.filter(o => o.id !== selectedId);
    selectedId = null;
    renderMarkers();
    renderLayers();
    renderPanel();
    save();
}

async function loadProject(p) {
    if (!p || p.format !== 'map-pins' || !p.map || !p.map.src || !Array.isArray(p.markers)) {
        throw new Error('Not a Map Pins project file');
    }
    state.icons = (p.icons || []).filter(i => i && i.id && i.src);
    state.markers = p.markers
        .filter(m => m && Number.isFinite(m.x) && Number.isFinite(m.y))
        .map(m => ({ id: m.id || uid(), x: m.x, y: m.y, iconId: m.iconId, size: m.size || 32, label: m.label || '', layer: typeof m.layer === 'string' ? m.layer : '' }));
    state.images = {};
    if (p.images && typeof p.images === 'object') {
        for (const [id, src] of Object.entries(p.images)) {
            if (typeof src === 'string') state.images[id] = src;
        }
    }
    state.overlays = (Array.isArray(p.overlays) ? p.overlays : [])
        .filter(o => o && o.imageId && state.images[o.imageId] && [o.x, o.y, o.w, o.h].every(Number.isFinite))
        .map(o => ({
            id: o.id || uid(), layer: typeof o.layer === 'string' ? o.layer : '', imageId: o.imageId, name: o.name || '',
            x: o.x, y: o.y, w: Math.max(1, o.w), h: Math.max(1, o.h), nw: o.nw || o.w, nh: o.nh || o.h,
            opacity: Number.isFinite(o.opacity) ? clamp(o.opacity, 0, 1) : 1, lock: o.lock !== false, pixelated: !!o.pixelated, drawing: !!o.drawing
        }));
    state.groups = [];
    for (const g of Array.isArray(p.groups) ? p.groups : []) {
        if (g && typeof g.name === 'string' && g.name && !groupByName(g.name)) state.groups.push({ name: g.name, collapsed: !!g.collapsed });
    }
    state.layers = [];
    for (const l of Array.isArray(p.layers) ? p.layers : []) {
        if (l && typeof l.name === 'string' && l.name && !layerByName(l.name)) {
            const nl = { name: l.name, visible: l.visible !== false, group: typeof l.group === 'string' ? l.group : '' };
            if (l.labels === false) nl.labels = false;
            for (const k of ['labelScale', 'labelDx', 'labelDy']) {
                if (Number.isFinite(l[k])) nl[k] = l[k];
            }
            state.layers.push(nl);
        }
    }
    state.activeLayer = p.activeLayer;
    ensureLayers();
    state.activeIconId = allIcons().some(i => i.id === p.activeIconId) ? p.activeIconId : null;
    state.newSize = p.newSize || 0;
    history.length = 0;
    selectedId = null;
    await setMap(p.map.src, p.map.name);
    renderMarkers();
    renderPalette();
    renderLayers();
    renderPanel();
}

async function exportPng() {
    if (!state.map) return;
    const c = document.createElement('canvas');
    c.width = state.map.w;
    c.height = state.map.h;
    const g = c.getContext('2d');
    g.drawImage(await loadImg(state.map.src), 0, 0);
    const ovOrder = [...state.overlays].sort((a, b) => (layerZ.get(a.layer) || 0) - (layerZ.get(b.layer) || 0));
    for (const o of ovOrder) {
        if (!layerVisible(o.layer) || !state.images[o.imageId]) continue;
        const im = await loadImg(state.images[o.imageId]);
        g.globalAlpha = o.opacity ?? 1;
        g.imageSmoothingEnabled = !o.pixelated;
        g.drawImage(im, o.x, o.y, o.w, o.h);
    }
    g.globalAlpha = 1;
    g.imageSmoothingEnabled = true;
    const cache = new Map();
    const drawOrder = [...state.markers].sort((a, b) => (layerZ.get(a.layer) || 0) - (layerZ.get(b.layer) || 0));
    for (const m of drawOrder) {
        if (!layerVisible(m.layer)) continue;
        const icon = iconById(m.iconId);
        if (!cache.has(icon.id)) cache.set(icon.id, await loadImg(icon.src));
        const im = cache.get(icon.id);
        const iw = im.naturalWidth || m.size;
        const ih = im.naturalHeight || m.size;
        const k = m.size / Math.max(iw, ih);
        g.imageSmoothingEnabled = false;
        g.drawImage(im, m.x - iw * k / 2, m.y - ih * k / 2, iw * k, ih * k);
        g.imageSmoothingEnabled = true;
        const ls = labelStyle(m.layer);
        if (m.label && ls.show) {
            const fs = Math.max(6, m.size * 0.38) * ls.scale / 100;
            const ty = m.y + m.size / 2 + 2 + ls.dy;
            const tx = m.x + ls.dx;
            g.font = `600 ${fs}px system-ui, -apple-system, "Segoe UI", sans-serif`;
            g.textAlign = 'center';
            g.textBaseline = 'top';
            g.lineJoin = 'round';
            g.lineWidth = fs * 0.25;
            g.strokeStyle = 'rgba(0, 0, 0, .85)';
            g.strokeText(m.label, tx, ty);
            g.fillStyle = '#fff';
            g.fillText(m.label, tx, ty);
        }
    }
    const blob = await new Promise(res => c.toBlob(res, 'image/png'));
    if (!blob) throw new Error('the map may be too large for the browser canvas');
    return blob;
}

const at = { img: null, data: null, w: 0, h: 0, bg: null, boxes: [], zoom: 4, drag: null };

function atDetectBg() {
    const d = at.data;
    for (let i = 3; i < d.length; i += 4) {
        if (d[i] < 255) return null;
    }
    return [d[0], d[1], d[2]];
}

function atSolid(i) {
    const d = at.data;
    if (!at.bg) return d[i + 3] > 0;
    return Math.abs(d[i] - at.bg[0]) + Math.abs(d[i + 1] - at.bg[1]) + Math.abs(d[i + 2] - at.bg[2]) > 24;
}

function atContent(b) {
    let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
    for (let y = b.y; y < b.y + b.h; y++) {
        for (let x = b.x; x < b.x + b.w; x++) {
            if (atSolid((y * at.w + x) * 4)) {
                if (x < x0) x0 = x;
                if (x > x1) x1 = x;
                if (y < y0) y0 = y;
                if (y > y1) y1 = y;
            }
        }
    }
    return x1 < 0 ? null : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

function atAutoBoxes(gap, min) {
    const { w, h } = at;
    const n = w * h;
    const mask = new Uint8Array(n);
    for (let p = 0; p < n; p++) mask[p] = atSolid(p * 4) ? 1 : 0;
    const boxes = [];
    const stack = [];
    for (let p = 0; p < n; p++) {
        if (mask[p] !== 1) continue;
        let x0 = w, y0 = h, x1 = -1, y1 = -1;
        mask[p] = 2;
        stack.push(p);
        while (stack.length) {
            const q = stack.pop();
            const x = q % w;
            const y = (q - x) / w;
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
            for (let dy = -1; dy <= 1; dy++) {
                const ny = y + dy;
                if (ny < 0 || ny >= h) continue;
                for (let dx = -1; dx <= 1; dx++) {
                    const nx = x + dx;
                    if (nx < 0 || nx >= w) continue;
                    const k = ny * w + nx;
                    if (mask[k] === 1) {
                        mask[k] = 2;
                        stack.push(k);
                    }
                }
            }
        }
        boxes.push({ x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 });
    }
    const near = (a, b) => {
        const gx = Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w);
        const gy = Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h);
        return gx <= gap && gy <= gap;
    };
    let merged = true;
    while (merged) {
        merged = false;
        for (let i = 0; i < boxes.length; i++) {
            for (let j = i + 1; j < boxes.length; j++) {
                const a = boxes[i], b = boxes[j];
                if (!near(a, b)) continue;
                const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
                boxes[i] = { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y };
                boxes.splice(j, 1);
                merged = true;
                j = i;
            }
        }
    }
    return boxes
        .filter(b => Math.max(b.w, b.h) >= min)
        .sort((a, b) => (a.y + a.h <= b.y ? -1 : b.y + b.h <= a.y ? 1 : a.x - b.x));
}

function atGridBoxes() {
    const num = id => Math.max(0, Math.floor(+$(id).value || 0));
    const cw = Math.max(1, num('atCw')), ch = Math.max(1, num('atCh'));
    const ox = num('atOx'), oy = num('atOy'), sx = num('atSx'), sy = num('atSy');
    const boxes = [];
    for (let y = oy; y + ch <= at.h; y += ch + sy) {
        for (let x = ox; x + cw <= at.w; x += cw + sx) {
            const b = { x, y, w: cw, h: ch };
            if (atContent(b)) boxes.push(b);
        }
    }
    return boxes;
}

function atRecompute() {
    if (!at.img) return;
    const grid = $('atMode').value === 'grid';
    $('atAuto').hidden = grid;
    $('atGrid').hidden = !grid;
    const manual = at.boxes.filter(b => b.manual);
    const made = grid
        ? atGridBoxes()
        : atAutoBoxes(Math.max(0, +$('atGap').value || 0), Math.max(1, +$('atMin').value || 1));
    at.boxes = made.map(b => ({ ...b, sel: true })).concat(manual);
    atDraw();
}

function atDraw() {
    const maxZ = Math.max(1, Math.floor(16384 / Math.max(at.w, at.h)));
    at.zoom = clamp(at.zoom, 1, maxZ);
    const z = at.zoom;
    $('atZoomVal').textContent = z + '×';
    const c = $('atCanvas');
    if (c.width !== at.w * z || c.height !== at.h * z) {
        c.width = at.w * z;
        c.height = at.h * z;
    }
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.clearRect(0, 0, c.width, c.height);
    g.drawImage(at.img, 0, 0, c.width, c.height);
    g.lineWidth = 1;
    let sel = 0;
    for (const b of at.boxes) {
        if (b.sel) {
            sel++;
            g.fillStyle = 'rgba(79, 156, 255, .22)';
            g.fillRect(b.x * z, b.y * z, b.w * z, b.h * z);
        }
        g.setLineDash(b.manual ? [4, 3] : []);
        g.strokeStyle = b.sel ? '#4f9cff' : 'rgba(255, 255, 255, .45)';
        g.strokeRect(b.x * z + .5, b.y * z + .5, b.w * z - 1, b.h * z - 1);
    }
    g.setLineDash([]);
    const d = at.drag;
    if (d && d.moved) {
        const r = atRect(d);
        g.strokeStyle = '#ffd60a';
        g.strokeRect(r.x * z + .5, r.y * z + .5, r.w * z - 1, r.h * z - 1);
    }
    $('atCount').textContent = `${sel} of ${at.boxes.length} selected`;
    $('atAdd').disabled = !sel;
}

function atRect(d) {
    const x0 = clamp(Math.floor(Math.min(d.x0, d.x1)), 0, at.w);
    const y0 = clamp(Math.floor(Math.min(d.y0, d.y1)), 0, at.h);
    const x1 = clamp(Math.ceil(Math.max(d.x0, d.x1)), 0, at.w);
    const y1 = clamp(Math.ceil(Math.max(d.y0, d.y1)), 0, at.h);
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

function atPos(e) {
    const r = $('atCanvas').getBoundingClientRect();
    return { x: (e.clientX - r.left) / at.zoom, y: (e.clientY - r.top) / at.zoom };
}

function atHit(p) {
    let best = null;
    for (const b of at.boxes) {
        if (p.x >= b.x && p.y >= b.y && p.x < b.x + b.w && p.y < b.y + b.h && (!best || b.w * b.h < best.w * best.h)) best = b;
    }
    return best;
}

async function openAtlas(file) {
    if (!file || !file.type.startsWith('image/')) return;
    try {
        const img = await loadImg(await readUrl(file));
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const g = c.getContext('2d', { willReadFrequently: true });
        g.drawImage(img, 0, 0);
        at.img = c;
        at.w = c.width;
        at.h = c.height;
        at.data = g.getImageData(0, 0, c.width, c.height).data;
        at.bg = atDetectBg();
        at.boxes = [];
        at.drag = null;
        at.zoom = clamp(Math.floor(Math.min(780 / at.w, 700 / at.h)), 1, 16);
        $('atZoom').value = at.zoom;
        $('atName').value = file.name.replace(/\.[^.]+$/, '');
        $('atlasDlg').showModal();
        atRecompute();
    } catch (e) {
        alert('Could not open atlas: ' + e.message);
    }
}

function atAddIcons() {
    const prefix = $('atName').value.trim() || 'icon';
    const trim = $('atTrim').checked;
    let n = 0;
    let last = null;
    for (const b of at.boxes) {
        if (!b.sel) continue;
        const r = (trim && atContent(b)) || b;
        const c = document.createElement('canvas');
        c.width = r.w;
        c.height = r.h;
        c.getContext('2d').drawImage(at.img, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h);
        n++;
        last = { id: 'u:' + uid(), name: `${prefix}_${n}`, src: c.toDataURL('image/png') };
        state.icons.push(last);
    }
    if (last && !markerById(selectedId)) state.activeIconId = last.id;
    $('atlasDlg').close();
    renderPalette();
    renderMode();
    save();
}

$('atlasFile').addEventListener('change', e => {
    openAtlas(e.target.files[0]);
    e.target.value = '';
});
$('atMode').addEventListener('change', atRecompute);
for (const id of ['atGap', 'atMin', 'atCw', 'atCh', 'atOx', 'atOy', 'atSx', 'atSy']) {
    $(id).addEventListener('change', atRecompute);
}
$('atZoom').addEventListener('input', () => {
    at.zoom = +$('atZoom').value;
    atDraw();
});
$('atAll').addEventListener('click', () => {
    at.boxes.forEach(b => { b.sel = true; });
    atDraw();
});
$('atNone').addEventListener('click', () => {
    at.boxes.forEach(b => { b.sel = false; });
    atDraw();
});
$('atCancel').addEventListener('click', () => $('atlasDlg').close());
$('atAdd').addEventListener('click', atAddIcons);

const atCanvas = $('atCanvas');
atCanvas.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    e.preventDefault();
    atCanvas.setPointerCapture(e.pointerId);
    const p = atPos(e);
    at.drag = { x0: p.x, y0: p.y, x1: p.x, y1: p.y, sx: e.clientX, sy: e.clientY, moved: false };
});
atCanvas.addEventListener('pointermove', e => {
    const d = at.drag;
    if (!d) return;
    const p = atPos(e);
    d.x1 = p.x;
    d.y1 = p.y;
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 3) d.moved = true;
    if (d.moved) atDraw();
});
atCanvas.addEventListener('pointerup', e => {
    const d = at.drag;
    if (!d) return;
    at.drag = null;
    if (d.moved) {
        const r = atRect(d);
        if (r.w > 0 && r.h > 0) at.boxes.push({ ...r, sel: true, manual: true });
    } else {
        const b = atHit({ x: d.x0, y: d.y0 });
        if (b) b.sel = !b.sel;
    }
    atDraw();
});
atCanvas.addEventListener('pointercancel', () => {
    at.drag = null;
    atDraw();
});
atCanvas.addEventListener('contextmenu', e => {
    e.preventDefault();
    const b = atHit(atPos(e));
    if (b) {
        at.boxes.splice(at.boxes.indexOf(b), 1);
        atDraw();
    }
});

function buildHtml() {
    const data = JSON.stringify(projectData()).replace(/</g, '\\u003c');
    const title = (state.map.name || 'map').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
</head>
<body>
<script type="application/json" id="embedded">${data}<\/script>
<script>
(${mapPins.toString()})();
<\/script>
</body>
</html>
`;
    return new Blob([html], { type: 'text/html' });
}

const HAS_FS = 'showSaveFilePicker' in window && 'showOpenFilePicker' in window;
const HTML_TYPES = [{ description: 'Map Pins HTML', accept: { 'text/html': ['.html', '.htm'] } }];
const JSON_TYPES = [{ description: 'Map Pins project', accept: { 'application/json': ['.json'] } }];
const PNG_TYPES = [{ description: 'PNG image', accept: { 'image/png': ['.png'] } }];
let fileHandle = null;
let statusTimer = 0;

function status(text) {
    clearTimeout(statusTimer);
    renderFileInfo(text);
    statusTimer = setTimeout(() => renderFileInfo(), 2500);
}

function renderFileInfo(extra) {
    const name = fileHandle ? fileHandle.name : linked ? linked.data : '';
    $('fileInfo').textContent = [name, extra].filter(Boolean).join(' · ');
    $('saveBtn').title = name ? `Save to ${name} (Ctrl+S)` : 'Save as an HTML file (Ctrl+S)';
}

function setFileHandle(h) {
    fileHandle = h;
    renderFileInfo();
    idb('readwrite', s => (h ? s.put(h, 'handle:' + AUTOSAVE_KEY) : s.delete('handle:' + AUTOSAVE_KEY))).catch(() => {});
}

function baseName() {
    if (fileHandle) return fileHandle.name.replace(/\.[^.]+$/, '');
    const page = decodeURIComponent(location.pathname.split('/').pop() || '');
    if (($('embedded') || linked) && /\.html?$/i.test(page)) return page.replace(/\.[^.]+$/, '');
    return (state.map && state.map.name) || 'map';
}

async function writeHandle(h, blob) {
    const opts = { mode: 'readwrite' };
    if (h.queryPermission && (await h.queryPermission(opts)) !== 'granted') {
        if ((await h.requestPermission(opts)) !== 'granted') throw new Error('permission to write the file was denied');
    }
    const w = await h.createWritable();
    await w.write(blob);
    await w.close();
}

async function saveBlobAs(blob, name, types) {
    if (!HAS_FS) {
        download(blob, name);
        return null;
    }
    try {
        const h = await window.showSaveFilePicker({ suggestedName: name, types });
        await writeHandle(h, blob);
        return h;
    } catch (e) {
        if (e.name === 'AbortError') return undefined;
        throw e;
    }
}

async function saveLinked() {
    const { data, images } = splitImages(projectData());
    const files = [[linked.images, jsBlock('mapPinsImages', images)], [linked.data, jsBlock('mapPinsData', data)]];
    if (!('showDirectoryPicker' in window)) {
        for (const [n, t] of files) download(new Blob([t], { type: 'text/javascript' }), n);
        status('Downloaded');
        return;
    }
    let dir = await idb('readonly', s => s.get('dir:' + AUTOSAVE_KEY)).catch(() => null);
    if (!dir) {
        try {
            dir = await window.showDirectoryPicker({ mode: 'readwrite' });
        } catch (e) {
            if (e.name === 'AbortError') return;
            throw e;
        }
        try {
            await dir.getFileHandle(linked.data);
        } catch (e) {
            alert(`Pick the folder that holds ${linked.data}.`);
            return;
        }
        idb('readwrite', s => s.put(dir, 'dir:' + AUTOSAVE_KEY)).catch(() => {});
    }
    const opts = { mode: 'readwrite' };
    if (dir.queryPermission && (await dir.queryPermission(opts)) !== 'granted') {
        if ((await dir.requestPermission(opts)) !== 'granted') throw new Error('permission to write the folder was denied');
    }
    for (const [n, t] of files) await writeHandle(await dir.getFileHandle(n, { create: true }), new Blob([t], { type: 'text/javascript' }));
    status('Saved');
}

async function saveCurrent() {
    if (!state.map) return;
    if (linked) return saveLinked();
    if (!fileHandle) return saveAs('html');
    await writeHandle(fileHandle, buildHtml());
    status('Saved');
}

async function saveAs(fmt) {
    if (!state.map) return;
    if (fmt === 'png') {
        const h = await saveBlobAs(await exportPng(), `${baseName()}.png`, PNG_TYPES);
        if (h !== undefined) status('PNG saved');
        return;
    }
    const h = await saveBlobAs(buildHtml(), `${baseName()}.html`, HTML_TYPES);
    if (h === undefined) return;
    if (h && !linked) setFileHandle(h);
    status(h ? 'Saved' : 'Downloaded');
}

async function openWithPicker() {
    if (!HAS_FS) {
        $('projFile').click();
        return;
    }
    let h;
    try {
        [h] = await window.showOpenFilePicker({ types: [HTML_TYPES[0], JSON_TYPES[0]], excludeAcceptAllOption: false });
    } catch (e) {
        if (e.name !== 'AbortError') alert('Could not open: ' + e.message);
        return;
    }
    const file = await h.getFile();
    if (await openProjectFile(file)) setFileHandle(/\.html?$/i.test(file.name) ? h : null);
}

const pointers = new Map();
let gesture = null;

function pinchInfo() {
    const [a, b] = [...pointers.values()];
    const r = vp.getBoundingClientRect();
    return {
        d: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        mx: (a.x + b.x) / 2 - r.left,
        my: (a.y + b.y) / 2 - r.top
    };
}

vp.addEventListener('pointerdown', e => {
    if (!state.map || e.target.closest('#empty, #layerDock, #cropBar, #modeBtn, #drawDock')) return;
    if (e.pointerType === 'mouse' && e.button === 2) return;
    e.preventDefault();
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    vp.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
        if (gesture && gesture.type === 'draw' && draw.stroke && !draw.stroke.done) {
            draw.stroke.done = true;
            if (draw.stroke.works.length) finishStroke(draw.stroke);
        }
        const p = pinchInfo();
        gesture = { type: 'pinch', d0: p.d, px: (p.mx - view.x) / view.s, py: (p.my - view.y) / view.s, s0: view.s };
        vp.classList.remove('panning');
        return;
    }
    if (pointers.size > 2) return;
    if (crop.active && e.button === 0) {
        const p = toMap(e.clientX, e.clientY);
        gesture = { type: 'crop', x0: p.x, y0: p.y, sx: e.clientX, sy: e.clientY, moved: false };
        return;
    }
    if (draw.tool && e.button === 0) {
        const p = toMap(e.clientX, e.clientY);
        draw.pendingPoint = null;
        gesture = { type: 'draw', last: p };
        beginStroke(p);
        return;
    }
    const mEl = !reading && e.button === 0 && e.target.closest('.marker');
    if (mEl) {
        const m = markerById(mEl.dataset.id);
        select(m.id);
        const p = toMap(e.clientX, e.clientY);
        gesture = { type: 'marker', m, dx: m.x - p.x, dy: m.y - p.y, sx: e.clientX, sy: e.clientY, moved: false };
        return;
    }
    const oEl = !reading && e.button === 0 && e.target.closest('.ovl');
    if (oEl && e.target.closest('.handle')) {
        const o = overlayById(oEl.dataset.id);
        gesture = { type: 'resize', o, ratio: o.h / o.w, sx: e.clientX, sy: e.clientY, moved: false };
        return;
    }
    if (oEl && (oEl.dataset.id === selectedId || !activeIconUsable())) {
        const o = overlayById(oEl.dataset.id);
        select(o.id);
        const p = toMap(e.clientX, e.clientY);
        gesture = { type: 'overlay', o, dx: o.x - p.x, dy: o.y - p.y, sx: e.clientX, sy: e.clientY, moved: false };
        return;
    }
    gesture = { type: 'pan', sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y, moved: e.button !== 0 };
});

vp.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!gesture) return;
    if (gesture.type === 'pinch') {
        if (pointers.size < 2) return;
        const p = pinchInfo();
        const fs = fitScale();
        view.s = clamp(gesture.s0 * p.d / gesture.d0, fs * 0.25, Math.max(8, fs * 40));
        view.x = p.mx - gesture.px * view.s;
        view.y = p.my - gesture.py * view.s;
        apply();
        return;
    }
    const dist = Math.hypot(e.clientX - gesture.sx, e.clientY - gesture.sy);
    if (gesture.type === 'pan') {
        if (!gesture.moved && dist < 4) return;
        gesture.moved = true;
        vp.classList.add('panning');
        view.x = gesture.ox + e.clientX - gesture.sx;
        view.y = gesture.oy + e.clientY - gesture.sy;
        apply();
    } else if (gesture.type === 'draw') {
        const p = toMap(e.clientX, e.clientY);
        moveBrush(p);
        const s = draw.stroke;
        if (s && s.works.length && !s.done) {
            strokeTo(s, s.last, p);
            s.last = p;
        } else {
            draw.pendingPoint = p;
        }
    } else if (gesture.type === 'crop') {
        if (!gesture.moved && dist < 3) return;
        gesture.moved = true;
        const p = toMap(e.clientX, e.clientY);
        setCropRect(gesture.x0, gesture.y0, p.x, p.y);
    } else if (gesture.type === 'marker') {
        if (!gesture.moved && dist < 3) return;
        if (!gesture.moved) snap();
        gesture.moved = true;
        const p = toMap(e.clientX, e.clientY);
        gesture.m.x = clamp(p.x + gesture.dx, 0, state.map.w);
        gesture.m.y = clamp(p.y + gesture.dy, 0, state.map.h);
        markerEl(gesture.m);
    } else if (gesture.type === 'overlay' || gesture.type === 'resize') {
        if (!gesture.moved && dist < 3) return;
        if (!gesture.moved) snap();
        gesture.moved = true;
        const p = toMap(e.clientX, e.clientY);
        const o = gesture.o;
        if (gesture.type === 'overlay') {
            o.x = Math.round(p.x + gesture.dx);
            o.y = Math.round(p.y + gesture.dy);
        } else {
            o.w = Math.max(1, Math.round(p.x - o.x));
            o.h = o.lock !== false ? Math.max(1, Math.round(o.w * gesture.ratio)) : Math.max(1, Math.round(p.y - o.y));
        }
        overlayEl(o);
        renderOverlayFields(o);
    }
});

function endPointer(e, cancelled) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    vp.classList.remove('panning');
    if (!gesture) return;
    const g = gesture;
    if (g.type === 'pinch') {
        if (pointers.size === 0) gesture = null;
        return;
    }
    gesture = null;
    if (g.type === 'draw') {
        const s = draw.stroke;
        if (s && !s.done) {
            s.done = true;
            if (s.works.length) finishStroke(s);
        }
        return;
    }
    if (cancelled) return;
    if (g.type === 'pan' && !g.moved) {
        if (reading) return;
        if (state.activeIconId && allIcons().some(i => i.id === state.activeIconId)) {
            const p = toMap(e.clientX, e.clientY);
            if (p.x >= 0 && p.y >= 0 && p.x <= state.map.w && p.y <= state.map.h) addMarker(p.x, p.y);
        } else {
            select(null);
        }
    } else if ((g.type === 'marker' || g.type === 'overlay' || g.type === 'resize') && g.moved) {
        save();
    }
}

vp.addEventListener('pointerup', e => endPointer(e, false));
vp.addEventListener('pointercancel', e => endPointer(e, true));
vp.addEventListener('contextmenu', e => e.preventDefault());
vp.addEventListener('dragstart', e => e.preventDefault());
$('palette').addEventListener('dragstart', e => e.preventDefault());

vp.addEventListener('dblclick', e => {
    if (!reading && e.target.closest('.marker')) {
        $('lbl').focus();
        $('lbl').select();
    }
});

vp.addEventListener('wheel', e => {
    if (!state.map || e.target.closest('#layerDock, #cropBar, #modeBtn, #drawDock')) return;
    e.preventDefault();
    const r = vp.getBoundingClientRect();
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    zoomAt(Math.exp(-dy * 0.0015), e.clientX - r.left, e.clientY - r.top);
}, { passive: false });

window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (!reading && state.map) saveCurrent().catch(err => alert('Save failed: ' + err.message));
        return;
    }
    if ($('atlasDlg').open || $('importDlg').open) return;
    if (e.target.matches('input, textarea')) {
        if (e.key === 'Escape' || e.key === 'Enter') e.target.blur();
        return;
    }
    if (draw.tool && e.key === 'Escape') {
        setTool(null);
        return;
    }
    if (!crop.active && state.map && (e.key === 'p' || e.key === 'e') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tool = e.key === 'p' ? 'pen' : 'eraser';
        setTool(draw.tool === tool ? null : tool);
        return;
    }
    if (crop.active) {
        if (e.key === 'Escape') endCrop();
        else if (e.key === 'Enter') applyCrop();
        else if (['+', '=', '-', '0'].includes(e.key)) {
            if (e.key === '0') fit();
            else zoomCenter(e.key === '-' ? 0.8 : 1.25);
        }
        return;
    }
    if (reading && e.key === 'Escape') {
        setLayerPop(false);
        return;
    }
    if (reading && !['+', '=', '-', '0'].includes(e.key) && !((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z')) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
    } else if (e.key.startsWith('Arrow') && selectedItem()) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        nudgeSelected(
            e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0,
            e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0
        );
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
    } else if (e.key === 'Escape') {
        if (selectedId) {
            select(null);
        } else {
            state.activeIconId = null;
            renderPalette();
            renderMode();
        }
    } else if (e.key === '+' || e.key === '=') {
        zoomCenter(1.25);
    } else if (e.key === '-') {
        zoomCenter(0.8);
    } else if (e.key === '0') {
        fit();
    }
});

let lblSnapped = false;
$('lbl').addEventListener('input', () => {
    const m = markerById(selectedId);
    if (!m) return;
    if (!lblSnapped) {
        snap();
        lblSnapped = true;
    }
    m.label = $('lbl').value;
    markerEl(m);
    save();
});
$('lbl').addEventListener('change', () => { lblSnapped = false; });

let sizeSnapped = false;
$('size').addEventListener('input', () => {
    const m = markerById(selectedId);
    if (!m) return;
    if (!sizeSnapped) {
        snap();
        sizeSnapped = true;
    }
    m.size = +$('size').value;
    state.newSize = m.size;
    $('sizeVal').textContent = m.size + 'px';
    markerEl(m);
    save();
});
$('size').addEventListener('change', () => { sizeSnapped = false; });

$('del').addEventListener('click', deleteSelected);
$('fit').addEventListener('click', fit);
$('zoomIn').addEventListener('click', () => zoomCenter(1.25));
$('zoomOut').addEventListener('click', () => zoomCenter(0.8));

for (const id of ['mapFile', 'mapFile2']) {
    $(id).addEventListener('change', e => {
        openMapFile(e.target.files[0]);
        e.target.value = '';
    });
}

$('iconFile').addEventListener('change', e => {
    addIconFiles([...e.target.files]);
    e.target.value = '';
});

async function readProjectFile(file) {
    const text = await file.text();
    if (/\.html?$/i.test(file.name) || /^\s*</.test(text)) {
        const el = new DOMParser().parseFromString(text, 'text/html').getElementById('embedded');
        if (!el) throw new Error('That HTML file has no saved map in it');
        return JSON.parse(el.textContent);
    }
    return JSON.parse(text);
}

const imp = { src: null, layers: [], picked: new Set() };

function sourceLayers(src) {
    const groups = new Set((Array.isArray(src.groups) ? src.groups : []).filter(g => g && g.name).map(g => g.name));
    const out = [];
    const seen = new Set();
    for (const l of Array.isArray(src.layers) ? src.layers : []) {
        if (!l || typeof l.name !== 'string' || !l.name || seen.has(l.name)) continue;
        seen.add(l.name);
        out.push({ ...l, group: groups.has(l.group) ? l.group : '' });
    }
    for (const item of [...src.markers, ...src.overlays]) {
        const name = item.layer || 'Default';
        if (!seen.has(name)) {
            seen.add(name);
            out.push({ name, visible: true, group: '' });
        }
    }
    return out;
}

function guessOffset(src) {
    const srcIcon = new Map((src.icons || []).map(i => [i.id, i.src]));
    const byIcon = new Map();
    for (const m of state.markers) {
        const s = iconById(m.iconId).src;
        if (!byIcon.has(s)) byIcon.set(s, []);
        byIcon.get(s).push(m);
    }
    const votes = new Map();
    for (const m of src.markers) {
        const list = byIcon.get(srcIcon.get(m.iconId));
        if (!list) continue;
        for (const c of list.slice(0, 400)) {
            const key = `${Math.round(c.x - m.x)},${Math.round(c.y - m.y)}`;
            votes.set(key, (votes.get(key) || 0) + 1);
        }
    }
    const ranked = [...votes.entries()].sort((a, b) => b[1] - a[1]);
    if (!ranked.length || ranked[0][1] < 3 || (ranked[1] && ranked[1][1] * 2 > ranked[0][1])) return null;
    const [dx, dy] = ranked[0][0].split(',').map(Number);
    return { dx, dy, matches: ranked[0][1] };
}

function renderImportList() {
    const box = $('impList');
    box.replaceChildren();
    const counts = {};
    for (const item of [...imp.src.markers, ...imp.src.overlays]) {
        const n = item.layer || 'Default';
        counts[n] = (counts[n] || 0) + 1;
    }
    const row = (l, child) => {
        const r = document.createElement('label');
        r.className = 'layer' + (child ? ' child' : '');
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = imp.picked.has(l.name);
        cb.addEventListener('change', () => {
            if (cb.checked) imp.picked.add(l.name);
            else imp.picked.delete(l.name);
            renderImportList();
        });
        const name = document.createElement('span');
        name.className = 'name';
        name.textContent = l.name + (layerByName(l.name) ? ' •' : '');
        if (layerByName(l.name)) name.title = 'A layer with this name already exists here';
        const count = document.createElement('span');
        count.className = 'count';
        count.textContent = counts[l.name] || 0;
        r.append(cb, name, count);
        return r;
    };
    const groups = (Array.isArray(imp.src.groups) ? imp.src.groups : []).filter(g => g && g.name);
    for (const g of groups) {
        const members = imp.layers.filter(l => l.group === g.name);
        if (!members.length) continue;
        const picked = members.filter(l => imp.picked.has(l.name)).length;
        const head = document.createElement('label');
        head.className = 'layer group';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = picked === members.length;
        cb.indeterminate = picked > 0 && picked < members.length;
        cb.addEventListener('change', () => {
            for (const l of members) {
                if (cb.checked) imp.picked.add(l.name);
                else imp.picked.delete(l.name);
            }
            renderImportList();
        });
        const name = document.createElement('span');
        name.className = 'name';
        name.textContent = g.name;
        const count = document.createElement('span');
        count.className = 'count';
        count.textContent = members.reduce((n, l) => n + (counts[l.name] || 0), 0);
        head.append(cb, name, count);
        box.appendChild(head);
        for (const l of members) box.appendChild(row(l, true));
    }
    for (const l of imp.layers) {
        if (!l.group) box.appendChild(row(l, false));
    }
    $('impOk').disabled = !imp.picked.size;
}

async function startImport(file) {
    if (!state.map) {
        alert('Open a map first, then import layers into it.');
        return;
    }
    let src;
    try {
        src = await readProjectFile(file);
        if (!src || !Array.isArray(src.markers)) throw new Error('Not a Map Pins project file');
    } catch (err) {
        alert('Could not read that file: ' + err.message);
        return;
    }
    src.overlays = Array.isArray(src.overlays) ? src.overlays : [];
    src.icons = Array.isArray(src.icons) ? src.icons : [];
    src.images = src.images && typeof src.images === 'object' ? src.images : {};
    imp.src = src;
    imp.layers = sourceLayers(src);
    imp.picked = new Set();
    $('impSrc').textContent = file.name;
    const guess = guessOffset(src);
    $('impDx').value = guess ? guess.dx : 0;
    $('impDy').value = guess ? guess.dy : 0;
    $('impHint').textContent = guess
        ? `Offset worked out from ${guess.matches} markers that appear in both maps. Change it if the maps are aligned differently.`
        : 'Offset moves the imported markers and images. Leave it at 0 if both maps use the same image and crop. • marks names that already exist here.';
    renderImportList();
    $('importDlg').showModal();
}

function runImport() {
    const src = imp.src;
    if (!src || !imp.picked.size) return;
    const dx = Math.round(+$('impDx').value || 0);
    const dy = Math.round(+$('impDy').value || 0);
    const merge = $('impConflict').value === 'merge';
    const keepGroups = $('impGroups').checked;
    snap();
    const iconBySrc = new Map(state.icons.map(i => [i.src, i.id]));
    const iconMap = new Map();
    const mapIcon = id => {
        if (iconMap.has(id)) return iconMap.get(id);
        const si = src.icons.find(i => i.id === id);
        let nid = id;
        if (si && si.src) {
            if (iconBySrc.has(si.src)) {
                nid = iconBySrc.get(si.src);
            } else {
                nid = state.icons.some(i => i.id === si.id) ? 'u:' + uid() : si.id;
                state.icons.push({ id: nid, name: si.name || 'Icon', src: si.src });
                iconBySrc.set(si.src, nid);
            }
        }
        iconMap.set(id, nid);
        return nid;
    };
    const imageBySrc = new Map(Object.entries(state.images).map(([id, s]) => [s, id]));
    const imageMap = new Map();
    const mapImage = id => {
        if (imageMap.has(id)) return imageMap.get(id);
        const s = src.images[id];
        let nid = null;
        if (typeof s === 'string') {
            nid = imageBySrc.get(s);
            if (!nid) {
                nid = state.images[id] ? 'img-' + uid() : id;
                state.images[nid] = s;
                imageBySrc.set(s, nid);
            }
        }
        imageMap.set(id, nid);
        return nid;
    };
    const layerMap = new Map();
    for (const sl of imp.layers) {
        if (!imp.picked.has(sl.name)) continue;
        let name = sl.name;
        if (layerByName(name) && !merge) {
            let i = 2;
            while (layerByName(`${sl.name} (${i})`)) i++;
            name = `${sl.name} (${i})`;
        }
        if (!layerByName(name)) {
            const group = keepGroups && sl.group ? sl.group : '';
            if (group && !groupByName(group)) state.groups.push({ name: group, collapsed: false });
            const nl = { name, visible: true, group };
            if (sl.labels === false) nl.labels = false;
            for (const k of ['labelScale', 'labelDx', 'labelDy']) {
                if (Number.isFinite(sl[k])) nl[k] = sl[k];
            }
            state.layers.push(nl);
        }
        layerMap.set(sl.name, name);
    }
    let nMarkers = 0;
    let nImages = 0;
    for (const m of src.markers) {
        const layer = layerMap.get(m.layer || 'Default');
        if (!layer || !Number.isFinite(m.x) || !Number.isFinite(m.y)) continue;
        state.markers.push({
            id: uid(), x: m.x + dx, y: m.y + dy, iconId: mapIcon(m.iconId), size: m.size || 32, label: m.label || '', layer
        });
        nMarkers++;
    }
    for (const o of src.overlays) {
        const layer = layerMap.get(o.layer || 'Default');
        const imageId = layer && mapImage(o.imageId);
        if (!imageId || ![o.x, o.y, o.w, o.h].every(Number.isFinite)) continue;
        state.overlays.push({
            id: uid(), layer, imageId, name: o.name || '', x: o.x + dx, y: o.y + dy,
            w: Math.max(1, o.w), h: Math.max(1, o.h), nw: o.nw || o.w, nh: o.nh || o.h,
            opacity: Number.isFinite(o.opacity) ? clamp(o.opacity, 0, 1) : 1, lock: o.lock !== false, pixelated: !!o.pixelated, drawing: !!o.drawing
        });
        nImages++;
    }
    $('importDlg').close();
    imp.src = null;
    ensureLayers();
    renderPalette();
    renderMarkers();
    renderLayers();
    renderPanel();
    save();
    status(`Imported ${layerMap.size} layer(s): ${nMarkers} marker(s)` + (nImages ? `, ${nImages} image(s)` : ''));
}

async function openProjectFile(file) {
    try {
        const data = await readProjectFile(file);
        await loadProject(data);
        linked = null;
        save();
        return true;
    } catch (err) {
        alert('Could not open project: ' + err.message);
        return false;
    }
}

$('projFile').addEventListener('change', async e => {
    const f = e.target.files[0];
    e.target.value = '';
    if (f && await openProjectFile(f)) setFileHandle(null);
});
$('openBtn').addEventListener('click', openWithPicker);
$('saveBtn').addEventListener('click', () => saveCurrent().catch(err => alert('Save failed: ' + err.message)));
$('saveAsBtn').addEventListener('click', e => {
    e.stopPropagation();
    const menu = $('saveAsMenu');
    menu.hidden = !menu.hidden;
    $('saveAsBtn').setAttribute('aria-expanded', String(!menu.hidden));
});
$('saveAsMenu').addEventListener('click', e => {
    const b = e.target.closest('button[data-fmt]');
    if (!b) return;
    $('saveAsMenu').hidden = true;
    $('saveAsBtn').setAttribute('aria-expanded', 'false');
    saveAs(b.dataset.fmt).catch(err => alert('Save failed: ' + err.message));
});
document.addEventListener('click', e => {
    if (!e.target.closest('.menu')) {
        $('saveAsMenu').hidden = true;
        $('saveAsBtn').setAttribute('aria-expanded', 'false');
    }
});

function dropZone(el, onFiles) {
    el.addEventListener('dragover', e => {
        if (![...e.dataTransfer.types].includes('Files')) return;
        e.preventDefault();
        el.classList.add('drop');
    });
    el.addEventListener('dragleave', e => {
        if (!el.contains(e.relatedTarget)) el.classList.remove('drop');
    });
    el.addEventListener('drop', e => {
        e.preventDefault();
        el.classList.remove('drop');
        onFiles([...e.dataTransfer.files]);
    });
}

dropZone(vp, files => {
    if (reading) return;
    const f = files[0];
    if (!f) return;
    if (/\.(json|html?)$/i.test(f.name)) {
        openProjectFile(f).then(ok => ok && setFileHandle(null));
    } else if (f.type.startsWith('image/')) {
        if (state.map && !confirm('Replace the map image? Markers are kept.')) return;
        openMapFile(f);
    }
});
dropZone($('side'), addIconFiles);

window.addEventListener('resize', apply);

$('modeBtn').addEventListener('click', () => setReading(!reading));
$('cropBtn').addEventListener('click', () => (crop.active ? endCrop() : startCrop()));
$('cropAuto').addEventListener('click', () => autoCrop().catch(err => alert('Auto-crop failed: ' + err.message)));
$('cropReset').addEventListener('click', () => setCropRect(0, 0, state.map.w, state.map.h));
$('cropCancel').addEventListener('click', endCrop);
$('cropApply').addEventListener('click', applyCrop);
$('addLayer').addEventListener('click', addLayer);
$('addGroup').addEventListener('click', addGroup);
$('layers').addEventListener('dragover', e => {
    if (!layerDrag) return;
    e.preventDefault();
    clearDropMarks();
    $('layers').classList.add('drop-end');
});
$('layers').addEventListener('dragleave', e => {
    if (!$('layers').contains(e.relatedTarget)) $('layers').classList.remove('drop-end');
});
$('layers').addEventListener('drop', e => {
    if (!layerDrag) return;
    e.preventDefault();
    e.stopPropagation();
    moveLayerItem(layerDrag, { kind: 'end' }, true);
});
function toggleAllLayers() {
    const show = !state.layers.every(l => l.visible);
    for (const l of state.layers) l.visible = show;
    if (!show) select(null);
    renderMarkers();
    renderLayers();
    save();
}
$('toggleLayers').addEventListener('click', toggleAllLayers);
$('layersBtn').addEventListener('click', () => {
    setLayerPop($('layerPop').hidden);
});
$('lsShow').addEventListener('change', () => editActiveLabels(l => { l.labels = $('lsShow').checked; }));
$('lsSize').addEventListener('input', () => editActiveLabels(l => { l.labelScale = +$('lsSize').value; }));
$('lsX').addEventListener('input', () => editActiveLabels(l => { if ($('lsX').value !== '') l.labelDx = Math.round(+$('lsX').value); }));
$('lsY').addEventListener('input', () => editActiveLabels(l => { if ($('lsY').value !== '') l.labelDy = Math.round(+$('lsY').value); }));
$('lsReset').addEventListener('click', () => editActiveLabels(l => {
    delete l.labels;
    delete l.labelScale;
    delete l.labelDx;
    delete l.labelDy;
}));

$('impFile').addEventListener('change', e => {
    const f = e.target.files[0];
    e.target.value = '';
    if (f) startImport(f);
});
$('impAll').addEventListener('click', () => {
    imp.picked = new Set(imp.layers.map(l => l.name));
    renderImportList();
});
$('impNone').addEventListener('click', () => {
    imp.picked = new Set();
    renderImportList();
});
$('impCancel').addEventListener('click', () => {
    $('importDlg').close();
    imp.src = null;
});
$('impOk').addEventListener('click', runImport);

document.querySelectorAll('.draw-pen').forEach(b => b.addEventListener('click', () => setTool(draw.tool === 'pen' ? null : 'pen')));
document.querySelectorAll('.draw-eraser').forEach(b => b.addEventListener('click', () => setTool(draw.tool === 'eraser' ? null : 'eraser')));
document.querySelectorAll('.draw-size').forEach(s => s.addEventListener('input', () => {
    draw.sizes[draw.tool || 'pen'] = clamp(+s.value || 1, 1, 100);
    syncDrawUI();
    storeDrawPrefs();
}));
document.querySelectorAll('.draw-color').forEach(c => c.addEventListener('input', () => {
    draw.color = c.value;
    syncDrawUI();
    storeDrawPrefs();
}));
$('rLayer').addEventListener('change', () => {
    state.activeLayer = $('rLayer').value;
    renderLayers();
    save();
});
syncDrawUI();
vp.addEventListener('pointermove', e => {
    if (draw.tool && state.map && !(gesture && gesture.type === 'draw')) moveBrush(toMap(e.clientX, e.clientY));
});
vp.addEventListener('pointerleave', () => { $('brush').hidden = true; });

$('ovFile').addEventListener('change', e => {
    addOverlayFiles([...e.target.files]);
    e.target.value = '';
});
let ovSnapped = false;
const ovEdit = (fn, oneShot) => () => {
    const o = overlayById(selectedId);
    if (!o) return;
    if (!ovSnapped) {
        snap();
        ovSnapped = true;
    }
    if (oneShot) ovSnapped = false;
    fn(o);
    overlayEl(o);
    renderOverlayFields(o);
    save();
};
for (const id of ['ovName', 'ovX', 'ovY', 'ovW', 'ovH', 'ovOp']) {
    $(id).addEventListener('change', () => { ovSnapped = false; });
}
$('ovName').addEventListener('input', ovEdit(o => { o.name = $('ovName').value; }));
$('ovX').addEventListener('input', ovEdit(o => { if ($('ovX').value !== '') o.x = Math.round(+$('ovX').value); }));
$('ovY').addEventListener('input', ovEdit(o => { if ($('ovY').value !== '') o.y = Math.round(+$('ovY').value); }));
$('ovW').addEventListener('input', ovEdit(o => {
    const w = Math.round(+$('ovW').value);
    if (!(w >= 1)) return;
    if (o.lock !== false) o.h = Math.max(1, Math.round(w * o.h / o.w));
    o.w = w;
}));
$('ovH').addEventListener('input', ovEdit(o => {
    const h = Math.round(+$('ovH').value);
    if (!(h >= 1)) return;
    if (o.lock !== false) o.w = Math.max(1, Math.round(h * o.w / o.h));
    o.h = h;
}));
$('ovOp').addEventListener('input', ovEdit(o => { o.opacity = +$('ovOp').value / 100; }));
$('ovLock').addEventListener('change', ovEdit(o => { o.lock = $('ovLock').checked; }, true));
$('ovPixel').addEventListener('change', ovEdit(o => { o.pixelated = $('ovPixel').checked; }, true));
$('ovNatural').addEventListener('click', ovEdit(o => {
    o.w = o.nw || o.w;
    o.h = o.nh || o.h;
}, true));
$('ovDel').addEventListener('click', deleteSelected);
$('ovLayer').addEventListener('change', () => {
    const o = overlayById(selectedId);
    if (!o) return;
    snap();
    o.layer = $('ovLayer').value;
    overlayEl(o);
    if (!layerVisible(o.layer)) select(null);
    renderLayers();
    save();
});

$('mLayer').addEventListener('change', () => {
    const m = markerById(selectedId);
    if (!m) return;
    snap();
    m.layer = $('mLayer').value;
    markerEl(m);
    if (!layerVisible(m.layer)) select(null);
    renderLayers();
    save();
});

(async () => {
    renderPalette();
    renderLayers();
    renderMode();
    apply();
    try {
        let saved = await idb('readonly', s => s.get(AUTOSAVE_KEY)).catch(() => null);
        let embedded = null;
        try {
            if (linked) embedded = joinImages(window.mapPinsData, window.mapPinsImages || {});
            else if ($('embedded')) embedded = JSON.parse($('embedded').textContent);
        } catch (e) {}
        if (embedded && (!saved || (embedded.savedAt || 0) > (saved.savedAt || 0))) saved = embedded;
        if (!saved) saved = await idb('readonly', s => s.get('project'));
        if (saved) await loadProject(saved);
    } catch (e) {
        console.warn('No autosave restored', e);
    }
    try {
        const h = await idb('readonly', s => s.get('handle:' + AUTOSAVE_KEY));
        if (h && h.kind === 'file' && !linked) fileHandle = h;
    } catch (e) {}
    renderFileInfo();
    let mode = null;
    try {
        mode = localStorage.getItem('map-pins-mode:' + location.pathname);
    } catch (e) {}
    setReading(mode ? mode === 'read' : !!($('embedded') || linked));
})();
})();
