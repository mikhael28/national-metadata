# Maps Integration Usage Guide

This guide shows how to use the continental GeoJSON and country TopoJSON files from the `national-metadata` package in your React application.

## Installation

```bash
npm install national-metadata
```

## Continental GeoJSON Usage

### Option 1: Named Imports (Recommended)

```typescript
import { 
  southAmerica, 
  asia, 
  northAmerica, 
  europe, 
  oceania, 
  africa 
} from "national-metadata/maps/continents";

// Use in your component
function WorldMap() {
  return (
    <ComposableMap>
      <Geographies geography={southAmerica}>
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

### Option 2: Default Import

```typescript
import continents from "national-metadata/maps/continents";

// Access as object properties
const { southAmerica, asia, northAmerica, europe, oceania, africa } = continents;
```

### Option 3: Direct File Import

```typescript
import southAmericaGeo from "national-metadata/maps/continents/south-america.json";
import asiaGeo from "national-metadata/maps/continents/asia.json";
import northAmericaGeo from "national-metadata/maps/continents/north-america.json";
import europeGeo from "national-metadata/maps/continents/europe.json";
import oceaniaGeo from "national-metadata/maps/continents/oceania.json";
import africaGeo from "national-metadata/maps/continents/africa.json";
```

## Country TopoJSON Usage

### Option 1: Async Dynamic Import (Recommended for Modern Apps)

```typescript
import { getCountryTopology } from "national-metadata/maps/countries";

function CountryMap({ countryCode }: { countryCode: string }) {
  const [topology, setTopology] = React.useState(null);

  React.useEffect(() => {
    getCountryTopology(countryCode.toLowerCase()).then(setTopology);
  }, [countryCode]);

  if (!topology) return <div>Loading...</div>;

  return (
    <ComposableMap>
      <Geographies
        geography={topology}
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
```

### Option 2: Direct File Import (Best for Known Countries)

```typescript
import usaTopology from "national-metadata/maps/countries/usa.topo.json";
import canTopology from "national-metadata/maps/countries/can.topo.json";
import gbrTopology from "national-metadata/maps/countries/gbr.topo.json";

function USAMap() {
  return (
    <ComposableMap>
      <Geographies geography={usaTopology}>
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

### Option 3: Dynamic Require with Bundler (for Webpack/similar)

If your bundler supports dynamic requires, you can use this pattern:

```typescript
function CountryMap({ countryCode }: { countryCode: string }) {
  // This works with Webpack and similar bundlers that support dynamic requires
  const topology = require(`national-metadata/maps/countries/${countryCode.toLowerCase()}.topo.json`);

  return (
    <ComposableMap>
      <Geographies
        geography={topology}
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
```

## Migration from Local Files

### Before (Local Files)

```typescript
// Continental GeoJSON
import south_america_geo from "../lib/world-data/continental-geojson/south-america.json";
import asia_geo from "../lib/world-data/continental-geojson/asia.json";
import north_america_geo from "../lib/world-data/continental-geojson/north-america.json";
import europe_geo from "../lib/world-data/continental-geojson/europe.json";
import oceania_geo from "../lib/world-data/continental-geojson/oceania.json";
import africa_geo from "../lib/world-data/continental-geojson/africa.json";

// Country TopoJSON
<Geographies
  geography={require(`../../../topo/${props.country_code.toLowerCase()}.topo.json`)}
  stroke={mapTheme.sphereBorder}
  strokeWidth={0.5}
/>
```

### After (npm Package)

```typescript
// Continental GeoJSON - Named imports
import { 
  southAmerica as south_america_geo,
  asia as asia_geo,
  northAmerica as north_america_geo,
  europe as europe_geo,
  oceania as oceania_geo,
  africa as africa_geo
} from "national-metadata/maps/continents";

// Country TopoJSON - Option 1: Dynamic import (async)
import { getCountryTopology } from "national-metadata/maps/countries";

function CountryMap(props) {
  const [topology, setTopology] = React.useState(null);

  React.useEffect(() => {
    getCountryTopology(props.country_code.toLowerCase()).then(setTopology);
  }, [props.country_code]);

  if (!topology) return null;

  return (
    <Geographies
      geography={topology}
      stroke={mapTheme.sphereBorder}
      strokeWidth={0.5}
    />
  );
}

// Country TopoJSON - Option 2: Direct require (if your bundler supports it)
function CountryMap(props) {
  const topology = require(
    `national-metadata/maps/countries/${props.country_code.toLowerCase()}.topo.json`
  );

  return (
    <Geographies
      geography={topology}
      stroke={mapTheme.sphereBorder}
      strokeWidth={0.5}
    />
  );
}
```

## Available Continental GeoJSON Files

- `africa` - Africa continent
- `asia` - Asia continent  
- `europe` - Europe continent
- `northAmerica` - North America continent
- `oceania` - Oceania continent
- `southAmerica` - South America continent

## Available Country Codes

The package includes TopoJSON files for 200+ countries. Use the three-letter ISO country code (lowercase):

- `usa` - United States
- `can` - Canada
- `gbr` - United Kingdom
- `deu` - Germany
- `fra` - France
- `jpn` - Japan
- `chn` - China
- `ind` - India
- `bra` - Brazil
- `arg` - Argentina
- `aus` - Australia
- ... and many more

See the full list in `/src/mapping/topojson/` directory.

## TypeScript Support

All exports include full TypeScript type definitions:

```typescript
import type { Topology } from "national-metadata/maps/countries";
import { getCountryTopology } from "national-metadata/maps/countries";

const topology: Topology = await getCountryTopology("usa");
```

## Webpack/Vite Configuration

Most modern bundlers (Webpack 5+, Vite, etc.) handle JSON imports automatically. If you encounter issues, ensure your bundler is configured to handle JSON files:

### Vite (vite.config.ts)

```typescript
export default defineConfig({
  // No special config needed - Vite handles JSON by default
});
```

### Webpack (webpack.config.js)

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.json$/,
        type: 'json'
      }
    ]
  }
};
```

## File Sizes

- Continental GeoJSON files: ~150KB each (except North America at ~5.5MB)
- Country TopoJSON files: Vary from 2KB to 200KB per country
- Consider lazy loading for better performance

## Notes

- All country codes should be lowercase three-letter ISO codes
- Continental data uses GeoJSON format
- Country data uses TopoJSON format (more efficient)
- All files are included in the npm package distribution

