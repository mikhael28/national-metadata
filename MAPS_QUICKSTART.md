# Maps Quick Start Guide

Get started with maps in your React application in 5 minutes.

## Installation

```bash
npm install national-metadata
```

## Basic Usage

### 1. Import Continental Map

```tsx
import React from "react";
import { ComposableMap, Geographies, Geography } from "national-metadata/maps";
import { southAmerica } from "national-metadata/maps/continents";

function MyMap() {
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

export default MyMap;
```

### 2. Import Country Map (Static)

```tsx
import React from "react";
import { ComposableMap, Geographies, Geography } from "national-metadata/maps";
import usaTopology from "national-metadata/maps/countries/usa.topo.json";

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

export default USAMap;
```

### 3. Dynamic Country Map

```tsx
import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "national-metadata/maps";
import { getCountryTopology } from "national-metadata/maps/countries";

function DynamicCountryMap({ countryCode }) {
  const [topology, setTopology] = useState(null);

  useEffect(() => {
    getCountryTopology(countryCode.toLowerCase()).then(setTopology);
  }, [countryCode]);

  if (!topology) return <div>Loading...</div>;

  return (
    <ComposableMap>
      <Geographies geography={topology}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
}

export default DynamicCountryMap;
```

## Available Continents

```typescript
import {
  africa,
  asia,
  europe,
  northAmerica,
  oceania,
  southAmerica,
} from "national-metadata/maps/continents";
```

## Available Countries

250+ countries with three-letter ISO codes:
- `usa`, `can`, `mex` (North America)
- `gbr`, `fra`, `deu`, `esp`, `ita` (Europe)
- `chn`, `jpn`, `ind`, `kor`, `tha` (Asia)
- `bra`, `arg`, `chl`, `col`, `per` (South America)
- `aus`, `nzl` (Oceania)
- `zaf`, `egy`, `nga`, `ken`, `mar` (Africa)

## Migration from Local Files

### Before
```typescript
import south_america_geo from "../lib/world-data/continental-geojson/south-america.json";
```

### After
```typescript
import { southAmerica } from "national-metadata/maps/continents";
// Or keep your variable name:
import { southAmerica as south_america_geo } from "national-metadata/maps/continents";
```

## Next Steps

- **[Full Usage Guide](./MAPS_USAGE.md)** - Complete API reference
- **[Examples](./MAPS_EXAMPLES.md)** - Real-world examples
- **[Migration Guide](./MIGRATION_GUIDE.md)** - Detailed migration steps

## Need Help?

- [GitHub Issues](https://github.com/mikhael28/national-metadata/issues)
- [README](./README.md) - Full package documentation

