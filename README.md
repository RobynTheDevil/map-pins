# Map Pins

A lightweight map editor that runs in the browser from a local file. Load a map image, add
your own icons, and place them as markers. Organise everything into layers. Save the result as
a PNG, or as a single HTML file that opens the map in the same editor.

No install, no server, no build step. Open `index.html` and start.

## Features

- **Map image.** Open any image as the map, and crop it in the editor.
- **Custom icons.** Add icon images by picking files or dropping them on the window. Icons
  that come as one sheet (an atlas) can be cut apart with the built-in atlas splitter.
- **Markers.** Click to place the active icon. Drag to move. Each marker can carry a label
  and its own size.
- **Layers and groups.** Show or hide layers, drag them to reorder, and gather them into
  groups. Each layer has its own label settings: show or hide, size, and offset.
- **Image overlays.** Add images to a layer to cover whole sections of the map. They show
  when the layer is on.
- **Pencil and eraser.** Draw on the active layer. Each tool keeps its own size.
- **Read and edit modes.** Read mode hides the sidebar and keeps panning, zooming, layer
  toggles and drawing. Edit mode has everything.
- **Import layers.** Copy chosen layers from another Map Pins project. If the two maps are
  cropped differently, the offset between them is detected for you.
- **Autosave.** Every change is kept in the browser until you save.

## Getting started

1. Open `index.html` in Chrome or Edge.
2. Click **Open map image** and choose your map.
3. Add icons under **Icons**. Select one and click the map to place it.
4. Click **Save** to write an HTML file you can open again later or send to someone.

## Controls

| Action | How |
|---|---|
| Zoom | Scroll or pinch; `+`, `-`, `0` to fit |
| Pan | Drag the map; middle-drag while drawing |
| Place a marker | Click the map with an icon selected |
| Move a marker | Drag it; arrow keys nudge 1px, Shift + arrow 10px |
| Swap a marker's icon | Select the marker, then click another icon |
| Delete | `Del` |
| Deselect, stop drawing | `Esc` |
| Pencil, eraser | `P`, `E` |
| Undo | `Ctrl+Z` |
| Save | `Ctrl+S` |

## Saving

- **Save** writes the current file. The first time, it asks where to save.
- **Save As → HTML** writes one self-contained file holding the editor and your map. Anyone
  can open it in a browser, with nothing else needed.
- **Save As → PNG** writes a flat image of the map with visible layers, markers and labels.
- **Open** loads a saved HTML file or a `.mappins.json` project.

Saving straight to a file needs the File System Access API, which Chrome and Edge have.
In Firefox, saves download the file instead.

## Keeping data in separate files

A map can keep its data next to the editor instead of inside one HTML file, which suits
version control. The page loads two data files before the editor:

```html
<script src="mymap.data.js"></script>
<script src="mymap.images.js"></script>
<script src="path/to/map-pins.js"></script>
```

- `mymap.data.js` holds markers, layers, groups and label settings, one item per line.
- `mymap.images.js` holds the map, icons and overlay images, one image per line, keyed by a
  hash of the content, so an unchanged image never shows up in a diff.

In such a page, **Save** asks once for the folder holding the data files and rewrites both.
Images are kept as data URLs because browsers refuse to let a page read pixels from images
loaded off disk, which drawing, cropping and PNG export need.

## Files

| File | What it is |
|---|---|
| `index.html` | the blank editor |
| `map-pins.js` | the whole editor: styles, markup and code |

## License

MIT. See [LICENSE](LICENSE).
