# Mapping Module Integration

## Overview

This `mapping` module is an integrated fork of [react-simple-maps](https://github.com/zcreativelabs/react-simple-maps) (originally MIT licensed, now under our license), providing React components for visualizing TopoJSON and other map formats within the national-metadata package.

## Integration Details

**Original Package**: react-simple-maps v3.0.0
**Integration Date**: December 2023

### What Changed

1. **Build System**: Replaced Rollup + Babel with TypeScript compiler

   - Simpler build pipeline using existing `tsc`
   - Single build tool for entire package
   - Automatic type declaration generation

2. **Module Structure**: Converted from standalone package to integrated module

   - Exported via subpath: `national-metadata/maps`
   - Tree-shakeable: Only bundles React/d3 if maps are imported
   - Maintains same API as original package

3. **Language Migration**: Converting from JavaScript + JSX to TypeScript
   - Gradual conversion from `.js` → `.ts`/`.tsx`
   - Adding proper TypeScript type annotations
   - Replacing PropTypes with TypeScript interfaces

## Exported Components

### Map Container

- `ComposableMap` - Main SVG map container with projection support

### Geography Components

- `Geographies` - Container for rendering geographic features
- `Geography` - Individual geographic path renderer
- `Graticule` - Latitude/longitude grid lines
- `Sphere` - Globe outline renderer

### Overlay Components

- `Marker` - Point markers on maps
- `Line` - Lines connecting geographic points
- `Annotation` - Text annotations on maps

### Interaction Components

- `ZoomableGroup` - Enables pan and zoom functionality

### Providers & Hooks

- `MapProvider`, `MapContext`, `useMapContext` - Map configuration context
- `ZoomPanProvider`, `ZoomPanContext`, `useZoomPanContext` - Zoom/pan state
- `useGeographies` - Hook for loading and processing geography data
- `useZoomPan` - Hook for zoom/pan controls

## Usage

```typescript
import { ComposableMap, Geographies, Geography } from "national-metadata/maps";
import { countries } from "national-metadata";

function WorldMap() {
  const geoUrl =
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

  return (
    <ComposableMap>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
}
```

## Dependencies

### Runtime Dependencies

- `react` (peer, optional) - React 16.8+ || 17.x || 18.x || 19.x
- `react-dom` (peer, optional) - React DOM 16.8+ || 17.x || 18.x || 19.x
- `d3-geo` - Geographic projections
- `d3-zoom` - Zoom behavior
- `d3-selection` - DOM selection
- `d3-color` - Color manipulation
- `d3-interpolate` - Value interpolation
- `topojson-client` - TopoJSON utilities

### Why "Optional" Peer Dependencies?

React and ReactDOM are marked as optional peer dependencies to support tree-shaking. Users who only import country data or other non-map features won't receive peer dependency warnings and won't bundle React unnecessarily.

## File Structure

```
src/mapping/
├── Claude.md              # This file
├── index.js              # Main export file
├── src/
│   ├── index.js          # Internal exports
│   ├── utils.js          # Utility functions
│   └── components/       # React components
│       ├── ComposableMap.js
│       ├── Geographies.js
│       ├── Geography.js
│       ├── Graticule.js
│       ├── ZoomableGroup.js
│       ├── Sphere.js
│       ├── Marker.js
│       ├── Line.js
│       ├── Annotation.js
│       ├── MapProvider.js
│       ├── ZoomPanProvider.js
│       ├── useGeographies.js
│       └── useZoomPan.js
└── tests/                # Test files (excluded from build)
```

## TypeScript Conversion Progress

- [ ] `src/utils.js` → `src/utils.ts`
- [ ] `src/index.js` → `src/index.ts`
- [ ] `src/components/*.js` → `src/components/*.tsx`
- [ ] `index.js` → `index.ts`
- [ ] Remove PropTypes in favor of TypeScript types
- [ ] Add comprehensive type definitions
- [ ] Create `types.ts` for shared interfaces

## Build Process

The mapping module is built as part of the main national-metadata build:

```bash
npm run build
```

This:

1. Compiles TypeScript/JavaScript files with `tsc`
2. Transpiles JSX to JavaScript
3. Generates `.d.ts` type declarations
4. Creates source maps
5. Outputs to `dist/mapping/`

## Migration Notes

### Phase 1: Clean Integration ✅

- Integrated source code into national-metadata
- Configured TypeScript to handle JSX with `allowJs`
- Set up subpath exports for tree-shaking
- Maintained same API as original package

### Phase 2: TypeScript Conversion (In Progress)

- Converting `.js` files to `.ts`/`.tsx`
- Adding TypeScript type annotations
- Replacing PropTypes with TypeScript interfaces
- Improving type safety

### Phase 3: Enhancements (Future)

- Add strict null checks
- Improve component prop types
- Add utility type helpers
- Create comprehensive documentation

## Credits

Original react-simple-maps created by Richard Zimerman ([@zimrick](https://github.com/zimrick))
Copyright (c) 2017 Richard Zimerman
Original repository: https://github.com/zcreativelabs/react-simple-maps

Integrated and maintained by Michael Nightingale, Expatria, Inc
