# Countries Game

Interactive quiz for learning world countries built with React and Vite.

## Getting Started

```bash
npm install
npm run dev
```

## Outline Quiz

The **Outline Quiz** mode challenges you to identify countries using only their borders.

### Gameplay

1. The game displays the silhouette of a random country.
2. Type the country's name into the answer box.
3. Submit to check your guess and move to the next outline.

### Development Setup

Generating the outline assets requires a preprocessing step:

```bash
npm install --save-dev mapshaper @turf/turf
npm run extract-outlines
```

`extract-outlines` fetches raw GeoJSON data and produces simplified SVG paths stored in `src/assets/outlines`.

### Switching Modes

The app starts in the classic flag quiz. To switch to the Outline Quiz:

- Launch the dev server: `npm run dev`
- Use the in-app mode selector to choose **Outline Quiz**, or start directly with:

```bash
npm run dev -- --mode outline
```
- Use the in-app mode selector to choose **Outline Quiz**.
### Screenshots

![Outline Quiz in action](docs/outline-quiz.gif)
## NPM Scripts & Dependencies

- `extract-outlines` – generates outline assets.
- Dev dependencies: `mapshaper`, `@turf/turf` for geographic processing.

