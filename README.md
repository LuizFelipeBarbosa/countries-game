# Countries Game

An interactive quiz for learning world countries built with React and Vite. Guess nations by their flags or challenge yourself with an outline-only mode.

## Features

- **Flag Quiz** – identify countries by their flags.
- **Outline Quiz** – guess countries from their silhouettes.
- Scoreboard with continent breakdown and countdown timer.
- Best score and time stored in local storage.
- Built with React, Vite, Tailwind CSS and Leaflet.

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Start directly in outline mode:
```bash
npm run dev -- --mode outline
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Outline Assets

The outline quiz relies on individual SVG files for each country. To regenerate them from `src/assets/map.svg` run:

```bash
npm run generate:outlines
```

Generated files are stored in `public/outlines/`.

## Scripts

- `npm run dev` – start the local development server.
- `npm run build` – create a production build.
- `npm run preview` – preview the production build.
- `npm test` – run unit tests with Vitest.
- `npm run lint` – lint source files with ESLint.
- `npm run generate:outlines` – create country outline SVGs.

## Testing

Run the test suite and linter:

```bash
npm test
npm run lint
```

## Project Structure

- `src/` – React components, assets and utilities.
- `public/` – static assets and generated outlines.
- `scripts/` – helper scripts such as outline generation.

## Contributing

Issues and pull requests are welcome. Feel free to suggest improvements or new features.

