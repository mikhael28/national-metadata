# Maps Integration Examples

Complete examples showing how to integrate continental GeoJSON and country TopoJSON files from the `national-metadata` package.

## Example 1: Continental Map with All Continents

```tsx
import React from "react";
import { ComposableMap, Geographies, Geography } from "national-metadata/maps";
import {
  southAmerica,
  asia,
  northAmerica,
  europe,
  oceania,
  africa,
} from "national-metadata/maps/continents";

interface MapTheme {
  sphereBorder: string;
  geography: {
    fill: string;
    stroke: string;
  };
}

const mapTheme: MapTheme = {
  sphereBorder: "#E4E5E6",
  geography: {
    fill: "#D6D6DA",
    stroke: "#FFFFFF",
  },
};

function WorldMap() {
  const continents = [africa, asia, europe, northAmerica, oceania, southAmerica];

  return (
    <ComposableMap>
      {continents.map((continent, idx) => (
        <Geographies key={idx} geography={continent}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={mapTheme.geography.fill}
                stroke={mapTheme.geography.stroke}
              />
            ))
          }
        </Geographies>
      ))}
    </ComposableMap>
  );
}

export default WorldMap;
```

## Example 2: Single Continental Map (South America)

```tsx
import React from "react";
import { ComposableMap, Geographies, Geography } from "national-metadata/maps";
import { southAmerica } from "national-metadata/maps/continents";

function SouthAmericaMap() {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 400,
        center: [-60, -15],
      }}
    >
      <Geographies geography={southAmerica}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#EAEAEC"
              stroke="#D6D6DA"
              style={{
                default: { outline: "none" },
                hover: { fill: "#F53", outline: "none" },
                pressed: { fill: "#E42", outline: "none" },
              }}
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
}

export default SouthAmericaMap;
```

## Example 3: Dynamic Country Map with Async Loading

```tsx
import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "national-metadata/maps";
import { getCountryTopology } from "national-metadata/maps/countries";
import type { Topology } from "national-metadata/maps/countries";

interface CountryMapProps {
  countryCode: string;
  mapTheme?: {
    sphereBorder: string;
    fill: string;
    stroke: string;
  };
}

function CountryMap({ countryCode, mapTheme }: CountryMapProps) {
  const [topology, setTopology] = useState<Topology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    getCountryTopology(countryCode.toLowerCase())
      .then((topo) => {
        setTopology(topo);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to load map for ${countryCode}`);
        setLoading(false);
        console.error(err);
      });
  }, [countryCode]);

  if (loading) {
    return <div>Loading map...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!topology) {
    return null;
  }

  return (
    <ComposableMap>
      <Geographies
        geography={topology}
        stroke={mapTheme?.sphereBorder || "#E4E5E6"}
        strokeWidth={0.5}
      >
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={mapTheme?.fill || "#D6D6DA"}
              stroke={mapTheme?.stroke || "#FFFFFF"}
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
}

// Usage
function App() {
  const [selectedCountry, setSelectedCountry] = useState("usa");

  return (
    <div>
      <select 
        value={selectedCountry} 
        onChange={(e) => setSelectedCountry(e.target.value)}
      >
        <option value="usa">United States</option>
        <option value="can">Canada</option>
        <option value="gbr">United Kingdom</option>
        <option value="fra">France</option>
        <option value="deu">Germany</option>
        <option value="jpn">Japan</option>
        <option value="bra">Brazil</option>
        <option value="aus">Australia</option>
      </select>
      
      <CountryMap countryCode={selectedCountry} />
    </div>
  );
}

export default App;
```

## Example 4: Country Map with Direct Import (No Loading State)

```tsx
import React from "react";
import { ComposableMap, Geographies, Geography } from "national-metadata/maps";
import usaTopology from "national-metadata/maps/countries/usa.topo.json";

function USAMap() {
  return (
    <ComposableMap
      projection="geoAlbersUsa"
      projectionConfig={{
        scale: 1000,
      }}
    >
      <Geographies geography={usaTopology} stroke="#E4E5E6" strokeWidth={0.5}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#D6D6DA"
              stroke="#FFFFFF"
              style={{
                default: { outline: "none" },
                hover: { fill: "#F53", outline: "none" },
                pressed: { fill: "#E42", outline: "none" },
              }}
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
}

export default USAMap;
```

## Example 5: Interactive World Map with Country Selection

```tsx
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "national-metadata/maps";
import continents from "national-metadata/maps/continents";

function InteractiveWorldMap() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const allContinents = [
    continents.africa,
    continents.asia,
    continents.europe,
    continents.northAmerica,
    continents.oceania,
    continents.southAmerica,
  ];

  return (
    <div>
      {selectedCountry && (
        <div style={{ padding: "20px" }}>
          Selected: {selectedCountry}
        </div>
      )}
      
      <ComposableMap>
        {allContinents.map((continent, idx) => (
          <Geographies key={idx} geography={continent}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isSelected = selectedCountry === geo.properties.name;
                const isHovered = hoveredCountry === geo.properties.name;
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isSelected ? "#F53" : isHovered ? "#FF8C69" : "#D6D6DA"}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 2 : 0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={() => setHoveredCountry(geo.properties.name)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => setSelectedCountry(geo.properties.name)}
                  />
                );
              })
            }
          </Geographies>
        ))}
      </ComposableMap>
    </div>
  );
}

export default InteractiveWorldMap;
```

## Example 6: Multiple Country Maps in a Grid

```tsx
import React from "react";
import { ComposableMap, Geographies, Geography } from "national-metadata/maps";
import usaTopology from "national-metadata/maps/countries/usa.topo.json";
import canTopology from "national-metadata/maps/countries/can.topo.json";
import gbrTopology from "national-metadata/maps/countries/gbr.topo.json";
import fraTopology from "national-metadata/maps/countries/fra.topo.json";

interface CountryCardProps {
  name: string;
  topology: any;
}

function CountryCard({ name, topology }: CountryCardProps) {
  return (
    <div style={{ border: "1px solid #ddd", padding: "10px", margin: "10px" }}>
      <h3>{name}</h3>
      <ComposableMap
        width={400}
        height={300}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={topology}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#D6D6DA"
                stroke="#FFFFFF"
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

function CountryGrid() {
  const countries = [
    { name: "United States", topology: usaTopology },
    { name: "Canada", topology: canTopology },
    { name: "United Kingdom", topology: gbrTopology },
    { name: "France", topology: fraTopology },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
      {countries.map((country) => (
        <CountryCard
          key={country.name}
          name={country.name}
          topology={country.topology}
        />
      ))}
    </div>
  );
}

export default CountryGrid;
```

## Example 7: Migrating Your Existing Code

### Before (Local Files)

```tsx
import south_america_geo from "../lib/world-data/continental-geojson/south-america.json";

function OldMap({ country_code }) {
  return (
    <ComposableMap>
      <Geographies geography={south_america_geo}>
        {/* ... */}
      </Geographies>
      
      <Geographies
        geography={require(`../../../topo/${country_code.toLowerCase()}.topo.json`)}
        stroke={mapTheme.sphereBorder}
        strokeWidth={0.5}
      >
        {/* ... */}
      </Geographies>
    </ComposableMap>
  );
}
```

### After (npm Package)

```tsx
import { southAmerica } from "national-metadata/maps/continents";

function NewMap({ country_code }) {
  return (
    <ComposableMap>
      <Geographies geography={southAmerica}>
        {/* ... */}
      </Geographies>
      
      <Geographies
        geography={require(`national-metadata/maps/countries/${country_code.toLowerCase()}.topo.json`)}
        stroke={mapTheme.sphereBorder}
        strokeWidth={0.5}
      >
        {/* ... */}
      </Geographies>
    </ComposableMap>
  );
}
```

## TypeScript Types

All exports include full TypeScript support:

```typescript
import type { Topology } from "national-metadata/maps/countries";
import type { FeatureCollection } from "geojson";

// Continental GeoJSON is FeatureCollection
import { southAmerica } from "national-metadata/maps/continents";
const geo: FeatureCollection = southAmerica;

// Country TopoJSON is Topology
import { getCountryTopology } from "national-metadata/maps/countries";
const topo: Topology = await getCountryTopology("usa");
```

## Performance Tips

1. **Lazy Loading**: Use dynamic imports for country maps to reduce initial bundle size
2. **Code Splitting**: Import only the continents you need
3. **Memoization**: Wrap map components in `React.memo()` to prevent unnecessary re-renders
4. **Suspense**: Use React Suspense with async loading for better UX

```tsx
import React, { Suspense } from "react";

const CountryMap = React.lazy(() => import("./CountryMap"));

function App() {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <CountryMap countryCode="usa" />
    </Suspense>
  );
}
```

