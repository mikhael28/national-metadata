# 🌍 National Metadata

The internet's most helpful npm package for comprehensive country data, including utility functions to help work with ISO codes, names, continents, and mercator coordinates.

## Installation

```bash
npm install national-metadata
```

## Quick Start

```typescript
import {
  helloWorld,
  getCountryNameFromCode,
  convertTwoToThree,
} from "national-metadata";

// Hello World function
console.log(helloWorld()); // "Mr World Wide is here"

// Convert ISO codes
console.log(getCountryNameFromCode("US")); // "United States"
console.log(convertTwoToThree("US")); // "USA"
```

## API Reference

### Hello World Function

```typescript
helloWorld(): string
```

Returns the signature greeting: "Mr World Wide is here"

### Country Code Conversion

#### `convertTwoToThree(twoDigitCode: string): string | undefined`

Converts 2-digit ISO country codes to 3-digit codes.

```typescript
convertTwoToThree("US"); // "USA"
convertTwoToThree("GB"); // "GBR"
convertTwoToThree("DE"); // "DEU"
```

#### `convertThreeToTwo(threeDigitCode: string): string | undefined`

Converts 3-digit ISO country codes to 2-digit codes.

```typescript
convertThreeToTwo("USA"); // "US"
convertThreeToTwo("GBR"); // "GB"
convertThreeToTwo("DEU"); // "DE"
```

### Country Name Functions

#### `getCountryNameFromCode(code: string): string | undefined`

Gets country name from 2-digit ISO code.

```typescript
getCountryNameFromCode("US"); // "United States"
getCountryNameFromCode("FR"); // "France"
getCountryNameFromCode("JP"); // "Japan"
```

#### `getCountryCodeFromName(countryName: string): string | undefined`

Gets 2-digit ISO code from country name.

```typescript
getCountryCodeFromName("United States"); // "US"
getCountryCodeFromName("France"); // "FR"
getCountryCodeFromName("Japan"); // "JP"
```

### Geographic Data

#### `getMercatorCoordinates(threeDigitCode: string): [number, number] | undefined`

Gets mercator coordinates [longitude, latitude] for a country.

```typescript
getMercatorCoordinates("USA"); // [-95.71, 37.09]
getMercatorCoordinates("GBR"); // [-3.48, 52.35]
getMercatorCoordinates("JPN"); // [139.75, 35.68]
```

#### `getCountrySizeScale(threeDigitCode: string): number | undefined`

Gets the size scale factor for map visualization.

```typescript
getCountrySizeScale("USA"); // 300
getCountrySizeScale("GBR"); // 800
getCountrySizeScale("MCO"); // 2500 (Monaco - smaller countries have higher scale)
```

## Data Exports

### Raw Data Objects

```typescript
import {
  code_to_country,
  country_to_code,
  list_of_countries,
  country_name_strings,
  mercator_hash,
  countrySizeScales,
  twoToThree,
  threeToTwo,
} from "national-metadata";
```

#### `code_to_country`

Object mapping 2-digit ISO codes to country names.

```typescript
code_to_country["US"]; // "United States"
code_to_country["GB"]; // "United Kingdom"
```

#### `country_to_code`

Object mapping country names to 2-digit ISO codes.

```typescript
country_to_code["United States"]; // "US"
country_to_code["United Kingdom"]; // "UK"
```

#### `list_of_countries`

Array of country objects with ISO code, name, and continent.

```typescript
// Returns array of objects like:
{
  iso_two: "US",
  name: "United States of America",
  continent: "North America"
}
```

#### `country_name_strings`

Simple array of country names.

```typescript
// ["United States", "Afghanistan", "Albania", ...]
```

#### `mercator_hash`

Object mapping 3-digit ISO codes to [longitude, latitude] coordinates.

```typescript
mercator_hash["USA"]; // [-95.71, 37.09]
```

#### `countrySizeScales`

Object mapping 3-digit ISO codes to size scale factors for visualization.

```typescript
countrySizeScales["USA"]; // 300
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  Country,
  CountryMapping,
  MercatorCoordinate,
  CountryCode,
  CountryName,
  ThreeDigitCode,
  TwoDigitCode,
} from "national-metadata";

// Country interface
interface Country {
  iso_two: string;
  name: string;
  continent: string;
}

// Type-safe country codes
type CountryCode = keyof typeof code_to_country;
type CountryName = keyof typeof country_to_code;
```

## Use Cases

- **Geographic Applications**: Use mercator coordinates for map plotting
- **Form Validation**: Validate country codes and names
- **Data Normalization**: Convert between different ISO code formats
- **Analytics**: Group data by continent using the country list
- **Internationalization**: Display localized country names

## Examples

### Building a Country Selector

```typescript
import { list_of_countries, getCountryCodeFromName } from "national-metadata";

// Create dropdown options
const countryOptions = list_of_countries.map((country) => ({
  value: country.iso_two,
  label: country.name,
  continent: country.continent,
}));

// Group by continent
const continentGroups = countryOptions.reduce((groups, country) => {
  const continent = country.continent;
  if (!groups[continent]) groups[continent] = [];
  groups[continent].push(country);
  return groups;
}, {} as Record<string, typeof countryOptions>);
```

### Map Visualization

```typescript
import { mercator_hash, countrySizeScales } from "national-metadata";

// Plot countries on a map
Object.entries(mercator_hash).forEach(([code, [lng, lat]]) => {
  const scale = countrySizeScales[code] || 1000;
  plotCountryOnMap(code, lng, lat, scale);
});
```

### Data Validation

```typescript
import { convertTwoToThree, getCountryNameFromCode } from "national-metadata";

function validateCountryCode(code: string): boolean {
  return getCountryNameFromCode(code) !== undefined;
}

function normalizeCountryCode(code: string): string | null {
  if (code.length === 2) {
    return convertTwoToThree(code) || null;
  }
  return code.length === 3 ? code : null;
}
```

## Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## License

MIT License - see LICENSE file for details.

## Changelog

### v1.0.0

- Initial release with comprehensive country data
- ISO code conversion utilities
- Mercator coordinates for map visualization
- Full TypeScript support
- Hello World function: "Mr World Wide is here"
