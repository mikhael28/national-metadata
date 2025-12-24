# Migration Guide: Local Map Files → national-metadata Package

This guide helps you migrate from local GeoJSON/TopoJSON files to the `national-metadata` npm package.

## Overview

The `national-metadata` package now includes:
- **6 Continental GeoJSON files** (Africa, Asia, Europe, North America, Oceania, South America)
- **250+ Country TopoJSON files** (all countries with three-letter ISO codes)
- **React Simple Maps components** (all mapping components in one package)

## Installation

```bash
npm install national-metadata
```

## Migration Steps

### Step 1: Update Continental GeoJSON Imports

#### Before (Local Files)

```typescript
import south_america_geo from "../lib/world-data/continental-geojson/south-america.json";
import asia_geo from "../lib/world-data/continental-geojson/asia.json";
import north_america_geo from "../lib/world-data/continental-geojson/north-america.json";
import europe_geo from "../lib/world-data/continental-geojson/europe.json";
import oceania_geo from "../lib/world-data/continental-geojson/oceania.json";
import africa_geo from "../lib/world-data/continental-geojson/africa.json";
```

#### After (npm Package)

```typescript
import {
  southAmerica as south_america_geo,
  asia as asia_geo,
  northAmerica as north_america_geo,
  europe as europe_geo,
  oceania as oceania_geo,
  africa as africa_geo,
} from "national-metadata/maps/continents";
```

Or use the new naming convention:

```typescript
import {
  southAmerica,
  asia,
  northAmerica,
  europe,
  oceania,
  africa,
} from "national-metadata/maps/continents";
```

### Step 2: Update Country TopoJSON Imports

#### Before (Local Files with Dynamic Require)

```tsx
<Geographies
  geography={require(
    `../../../topo/${props.country_code.toLowerCase()}.topo.json`
  )}
  stroke={mapTheme.sphereBorder}
  strokeWidth={0.5}
>
  {({ geographies }) =>
    geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)
  }
</Geographies>
```

#### After (npm Package - Option 1: Keep Dynamic Require)

```tsx
<Geographies
  geography={require(
    `national-metadata/maps/countries/${props.country_code.toLowerCase()}.topo.json`
  )}
  stroke={mapTheme.sphereBorder}
  strokeWidth={0.5}
>
  {({ geographies }) =>
    geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)
  }
</Geographies>
```

#### After (npm Package - Option 2: Use Async Loading)

```tsx
import { getCountryTopology } from "national-metadata/maps/countries";

function CountryMap({ country_code, mapTheme }) {
  const [topology, setTopology] = React.useState(null);

  React.useEffect(() => {
    getCountryTopology(country_code.toLowerCase()).then(setTopology);
  }, [country_code]);

  if (!topology) return <div>Loading...</div>;

  return (
    <Geographies
      geography={topology}
      stroke={mapTheme.sphereBorder}
      strokeWidth={0.5}
    >
      {({ geographies }) =>
        geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)
      }
    </Geographies>
  );
}
```

### Step 3: Update Map Component Imports (Optional)

If you're also using React Simple Maps, you can now import components from the same package:

#### Before

```typescript
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
```

#### After

```typescript
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "national-metadata/maps";
```

## Complete Example: Before & After

### Before (Local Files)

```tsx
import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import south_america_geo from "../lib/world-data/continental-geojson/south-america.json";
import asia_geo from "../lib/world-data/continental-geojson/asia.json";

interface MapProps {
  country_code: string;
  mapTheme: {
    sphereBorder: string;
    fill: string;
  };
}

function WorldMap({ country_code, mapTheme }: MapProps) {
  return (
    <ComposableMap>
      {/* Continental map */}
      <Geographies geography={south_america_geo}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={mapTheme.fill}
            />
          ))
        }
      </Geographies>

      {/* Country-specific map */}
      <Geographies
        geography={require(
          `../../../topo/${country_code.toLowerCase()}.topo.json`
        )}
        stroke={mapTheme.sphereBorder}
        strokeWidth={0.5}
      >
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
}

export default WorldMap;
```

### After (npm Package)

```tsx
import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "national-metadata/maps";
import { southAmerica } from "national-metadata/maps/continents";

interface MapProps {
  country_code: string;
  mapTheme: {
    sphereBorder: string;
    fill: string;
  };
}

function WorldMap({ country_code, mapTheme }: MapProps) {
  return (
    <ComposableMap>
      {/* Continental map */}
      <Geographies geography={southAmerica}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={mapTheme.fill}
            />
          ))
        }
      </Geographies>

      {/* Country-specific map */}
      <Geographies
        geography={require(
          `national-metadata/maps/countries/${country_code.toLowerCase()}.topo.json`
        )}
        stroke={mapTheme.sphereBorder}
        strokeWidth={0.5}
      >
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
}

export default WorldMap;
```

## Benefits of Migration

1. **Centralized Updates**: Map data updates automatically with package updates
2. **Reduced Codebase Size**: Remove local map files from your repository
3. **Better Type Safety**: Full TypeScript support with proper types
4. **Consistent Versioning**: Map data versioned alongside other country metadata
5. **Tree-Shaking**: Only bundle the map files you actually use
6. **Single Dependency**: Maps, flags, and country data in one package

## Troubleshooting

### Issue: Dynamic require not working

If your bundler doesn't support dynamic requires, use the async import method:

```tsx
import { getCountryTopology } from "national-metadata/maps/countries";

// In your component
const topology = await getCountryTopology(countryCode);
```

### Issue: Large bundle size

The package is optimized for tree-shaking. Make sure:
1. You're using ES modules (`import` not `require`)
2. Your bundler supports tree-shaking (Webpack 5+, Vite, Rollup)
3. You're only importing what you need

### Issue: TypeScript errors

Make sure you have the latest version:

```bash
npm install national-metadata@latest
```

The package includes full TypeScript definitions.

## Rollback Plan

If you need to rollback, simply keep your local files and revert the import statements. The package doesn't modify your local files.

## Next Steps

1. Update your imports following the patterns above
2. Test your maps render correctly
3. Remove local map files from your repository
4. Update your `.gitignore` if needed
5. Commit the changes

## Support

- [Maps Usage Guide](./MAPS_USAGE.md) - Complete API reference
- [Maps Examples](./MAPS_EXAMPLES.md) - Real-world examples
- [GitHub Issues](https://github.com/mikhael28/national-metadata/issues) - Report problems

## Checklist

- [ ] Install `national-metadata` package
- [ ] Update continental GeoJSON imports
- [ ] Update country TopoJSON imports
- [ ] Test maps render correctly
- [ ] Update map component imports (optional)
- [ ] Remove local map files
- [ ] Update documentation/comments
- [ ] Commit changes

