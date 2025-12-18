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

## 🚩 Flag SVGs

National Metadata now includes high-quality SVG flags for all countries! The package exports flag utilities and includes all SVG files, optimized for web applications.

### Flag Functions

#### `getFlagPath(countryCode: string): string`

Returns the path to the flag SVG file for use in your bundler.

```typescript
import { getFlagPath } from "national-metadata";

getFlagPath("US"); // "national-metadata/dist/flag-svg/US.svg"
getFlagPath("fr"); // "national-metadata/dist/flag-svg/FR.svg" (case-insensitive)
```

#### `getFlagFilename(countryCode: string): string`

Returns just the filename of the flag.

```typescript
import { getFlagFilename } from "national-metadata";

getFlagFilename("US"); // "US.svg"
```

#### `hasFlagForCountry(countryCode: string): boolean`

Check if a flag exists for a given country code.

```typescript
import { hasFlagForCountry } from "national-metadata";

hasFlagForCountry("US"); // true
hasFlagForCountry("XX"); // false
```

### Flag Data Exports

#### `flagFilenames`

Object mapping country codes to flag filenames.

```typescript
import { flagFilenames } from "national-metadata";

flagFilenames["US"]; // "US.svg"
Object.keys(flagFilenames).length; // 260+ flags available
```

#### `availableFlagCodes`

Array of all country codes that have flags.

```typescript
import { availableFlagCodes } from "national-metadata";

availableFlagCodes; // ["AC", "AD", "AE", "AF", ...]
```

### Using Flags in React/Next.js

For React and Next.js applications, you can import flag SVGs directly:

#### Option 1: Direct Import (Recommended for Modern Bundlers)

```typescript
import { country_to_code } from "national-metadata";

// In your component
<img
  src={
    new URL(
      `../node_modules/national-metadata/dist/flag-svg/${
        country_to_code[city.country]
      }.svg`,
      import.meta.url
    ).href
  }
  alt={`${city.country} flag`}
  className="w-12 h-12"
/>;
```

#### Option 2: Next.js Public Folder (Copy to Public)

```bash
# Copy flags to your public folder
cp -r node_modules/national-metadata/dist/flag-svg public/flags
```

Then use in your component:

```typescript
import { country_to_code } from "national-metadata";

<img
  src={`/flags/${country_to_code[city.country]}.svg`}
  alt={`${city.country} flag`}
  className="w-12 h-12"
/>;
```

#### Option 3: Webpack/Vite with Explicit Imports

For Vite or modern bundlers:

```typescript
// Create a flag component
import { getFlagFilename } from "national-metadata";

interface FlagProps {
  countryCode: string;
  className?: string;
  alt?: string;
}

export function Flag({ countryCode, className, alt }: FlagProps) {
  // Dynamic import for tree-shaking
  const flagSrc = `/node_modules/national-metadata/dist/flag-svg/${countryCode.toUpperCase()}.svg`;

  return (
    <img
      src={flagSrc}
      alt={alt || `${countryCode} flag`}
      className={className}
    />
  );
}
```

### Tree-Shaking Support

This package is fully optimized for tree-shaking. Only the functions and data you import will be included in your bundle:

```typescript
// This only bundles the flag utilities, not all country data
import { getFlagPath, hasFlagForCountry } from "national-metadata";
```

The package uses:

- `"sideEffects": false` for aggressive tree-shaking
- ES Modules for optimal bundler support
- Separate flag utilities to minimize bundle size

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
  FlagCountryCode,
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
type FlagCountryCode = keyof typeof flagFilenames; // All valid flag codes
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

## 🏙️ City Data

National Metadata includes comprehensive city slug data for easy integration with city-based applications.

### City Functions

#### `getCitySlugs(): string[]`

Returns array of all city slugs (1300+ cities).

```typescript
import { getCitySlugs } from "national-metadata";

const cities = getCitySlugs();
// ["lisbon", "berlin", "tokyo", "new-york-city-ny", ...]
```

#### `getCityCountrySlugs(): string[]`

Returns array of city slugs with country information (format: `city-country`).

```typescript
import { getCityCountrySlugs } from "national-metadata";

const citiesWithCountries = getCityCountrySlugs();
// ["lisbon-portugal", "berlin-germany", "tokyo-japan", ...]
```

#### `isCitySlugValid(slug: string): boolean`

Validates if a city slug exists in the database.

```typescript
import { isCitySlugValid } from "national-metadata";

isCitySlugValid("tokyo"); // true
isCitySlugValid("fake-city"); // false
```

#### `isCityCountrySlugValid(slug: string): boolean`

Validates if a city-country slug exists.

```typescript
import { isCityCountrySlugValid } from "national-metadata";

isCityCountrySlugValid("tokyo-japan"); // true
isCityCountrySlugValid("tokyo-china"); // false
```

### City Data Exports

```typescript
import { city_slugs, city_country_slugs } from "national-metadata";

// Array of 1300+ city slugs
city_slugs; // ["lisbon", "berlin", "tokyo", ...]

// Array of 1300+ city-country slugs
city_country_slugs; // ["lisbon-portugal", "berlin-germany", ...]
```

## ✈️ Immigration & Visa Data

Comprehensive visa requirements data for all countries (updated Q3 2024).

### Visa Functions

#### `getVisaRequirements(countryCode: string): VisaTravel | undefined`

Gets all visa information for a country.

```typescript
import { getVisaRequirements } from "national-metadata";

const usVisa = getVisaRequirements("US");
// {
//   country_code: "US",
//   visa_free: ["Canada", "Mexico", ...],
//   visa_on_arrival: [...],
//   e_visa: [...],
//   visa_required: [...]
// }
```

#### `getVisaFreeCountries(countryCode: string): string[] | undefined`

Gets list of countries that don't require visa.

```typescript
import { getVisaFreeCountries } from "national-metadata";

const visaFree = getVisaFreeCountries("US");
// ["Canada", "Mexico", "United Kingdom", ...]
```

#### `getVisaOnArrivalCountries(countryCode: string): string[] | undefined`

Gets list of countries offering visa on arrival.

```typescript
import { getVisaOnArrivalCountries } from "national-metadata";

const visaOnArrival = getVisaOnArrivalCountries("US");
```

#### `getEVisaCountries(countryCode: string): string[] | undefined`

Gets list of countries offering e-visa.

```typescript
import { getEVisaCountries } from "national-metadata";

const eVisa = getEVisaCountries("US");
```

#### `getVisaRequiredCountries(countryCode: string): string[] | undefined`

Gets list of countries requiring visa.

```typescript
import { getVisaRequiredCountries } from "national-metadata";

const visaRequired = getVisaRequiredCountries("US");
```

### Visa Data Exports

```typescript
import { visa_travel, type VisaTravel } from "national-metadata";

// Record mapping country codes to visa requirements
visa_travel["US"]; // Full visa data for United States

// TypeScript interface
interface VisaTravel {
  country_code: string;
  e_visa?: string[];
  visa_on_arrival?: string[];
  visa_required?: string[];
  visa_free?: string[];
}
```

## 📊 Legatum Prosperity Index 2023

Access comprehensive prosperity rankings data from the Legatum Institute's 2023 Prosperity Index.

### Legatum Functions

#### `getLegatumData(): Legatum2023[]`

Returns complete Legatum prosperity rankings.

```typescript
import { getLegatumData } from "national-metadata";

const allRankings = getLegatumData();
// Array of 167 countries with 12 prosperity pillars
```

#### `getLegatumRankingByCountry(countryName: string): Legatum2023 | undefined`

Gets prosperity ranking for a specific country.

```typescript
import { getLegatumRankingByCountry } from "national-metadata";

const denmark = getLegatumRankingByCountry("Denmark");
// {
//   country: "Denmark",
//   overall: 1,
//   safety_and_security: 6,
//   personal_freedom: 2,
//   governance: 3,
//   social_capital: 1,
//   investment_environment: 8,
//   enterprise_conditions: 8,
//   infrastructure_and_market_access: 9,
//   economic_quality: 7,
//   living_conditions: 2,
//   health: 16,
//   education: 5,
//   natural_environment: 5
// }
```

#### `getLegatumTopCountries(limit?: number): Legatum2023[]`

Gets top N countries by prosperity ranking (default 10).

```typescript
import { getLegatumTopCountries } from "national-metadata";

const top10 = getLegatumTopCountries();
const top5 = getLegatumTopCountries(5);
// Returns top ranked countries
```

#### `getLegatumCountriesByOverallRank(minRank: number, maxRank: number): Legatum2023[]`

Gets countries within a rank range.

```typescript
import { getLegatumCountriesByOverallRank } from "national-metadata";

const topTier = getLegatumCountriesByOverallRank(1, 20);
// Returns countries ranked 1-20
```

### Legatum Data Exports

```typescript
import { legatum_2023, type Legatum2023 } from "national-metadata";

// Array of all country rankings
legatum_2023; // 167 countries

// TypeScript interface
interface Legatum2023 {
  country: string;
  overall: number;
  safety_and_security: number;
  personal_freedom: number;
  governance: number;
  social_capital: number;
  investment_environment: number;
  enterprise_conditions: number;
  infrastructure_and_market_access: number;
  economic_quality: number;
  living_conditions: number;
  health: number;
  education: number;
  natural_environment: number;
}
```

### Legatum Index Pillars

The Legatum Prosperity Index measures prosperity across 12 pillars:

1. **Safety & Security**: Personal and national security
2. **Personal Freedom**: Individual liberties and rights
3. **Governance**: Effective and accountable governance
4. **Social Capital**: Social cohesion and engagement
5. **Investment Environment**: Protection of investors and financial infrastructure
6. **Enterprise Conditions**: Business environment and competition
7. **Infrastructure & Market Access**: Physical and digital infrastructure
8. **Economic Quality**: Economic growth and opportunity
9. **Living Conditions**: Material wellbeing and housing
10. **Health**: Physical and mental health outcomes
11. **Education**: Access to quality education
12. **Natural Environment**: Environmental quality and protection

Lower numbers indicate better rankings (1 = best).

## Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## License

MIT License - see LICENSE file for details.

## Changelog

### v0.1.2

- **NEW**: City data exports - 1300+ city slugs and city-country slugs
- **NEW**: City utility functions: `getCitySlugs`, `getCityCountrySlugs`, `isCitySlugValid`, `isCityCountrySlugValid`
- **NEW**: Immigration & Visa data - Comprehensive visa requirements for all countries (Q3 2024)
- **NEW**: Visa utility functions: `getVisaRequirements`, `getVisaFreeCountries`, `getVisaOnArrivalCountries`, `getEVisaCountries`, `getVisaRequiredCountries`
- **NEW**: Legatum Prosperity Index 2023 - Rankings for 167 countries across 12 prosperity pillars
- **NEW**: Legatum utility functions: `getLegatumData`, `getLegatumRankingByCountry`, `getLegatumTopCountries`, `getLegatumCountriesByOverallRank`
- **NEW**: TypeScript types: `VisaTravel`, `Legatum2023`
- **IMPROVED**: Expanded package capabilities for travel, immigration, and prosperity research

### v0.1.2

- **NEW**: Flag SVGs for 260+ countries included in package
- **NEW**: Flag utility functions: `getFlagPath`, `getFlagFilename`, `hasFlagForCountry`
- **NEW**: Flag data exports: `flagFilenames`, `availableFlagCodes`
- **NEW**: Full tree-shaking support with `sideEffects: false`
- **NEW**: ES Modules support for better bundler optimization
- **IMPROVED**: TypeScript types with new `FlagCountryCode` type
- **IMPROVED**: Package exports map for better module resolution

### v0.1.1

- Initial release with comprehensive country data
- ISO code conversion utilities
- Mercator coordinates for map visualization
- Full TypeScript support
- Hello World function: "Mr World Wide is here"
