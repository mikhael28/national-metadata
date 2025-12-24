# 🌍 National Metadata

The most comprehensive npm package for country data, mapping, flags, taxation, visa requirements, and prosperity rankings. Built for developers creating international applications, travel platforms, tax tools, and geographic visualizations - best tree shaken, not stirred.

## 📦 What's Included

**9 Core Modules:**

- 🗺️ **Maps & GeoJSON** - Continental GeoJSON + 250+ country TopoJSON files with a built-in, tree-shaken React component for easy integration.
- 🚩 **Flag SVGs** - 260+ high-quality country flag SVGs
- 🌐 **Country Metadata** - Comprehensive data with scores, regions, and Chinese translations
- 💰 **Taxation Data** - Personal income tax, capital gains, corporate rates, and tax system types
- ✈️ **Visa Requirements** - Travel requirements for all country pairs (updated Q3 2024)
- 📊 **Legatum Index 2023** - Prosperity rankings across 12 pillars for 167 countries
- 🏙️ **City Data** - 1300+ city slugs and validation
- 🔤 **ISO Code Utilities** - Convert between 2-digit and 3-digit country codes
- 📍 **Mercator Coordinates** - Geographic coordinates and size scales for map visualization

## Installation

```bash
npm install national-metadata
```

## Quick Start

```typescript
import {
  // Country basics
  getCountryNameFromCode,
  convertTwoToThree,
  getCountryMetadata,

  // Taxation & visa
  getTaxationData,
  getZeroTaxCountries,
  getVisaFreeCountries,

  // Maps & flags
  getFlagPath,
  getCountryTopology,
} from "national-metadata";

// Country metadata with Chinese translations
const usData = getCountryMetadata("US");
console.log(usData?.name_chinese); // "美国"
console.log(usData?.region); // "North America"

// Tax information for digital nomads
const usTax = getTaxationData("US");
console.log(usTax?.personal_income_tax_limit); // 37
console.log(usTax?.zero_tax_system); // false

// Visa-free travel
const visaFree = getVisaFreeCountries("US");
console.log(visaFree?.length); // 180+ countries

// Flags for UI
const flagPath = getFlagPath("US"); // "national-metadata/dist/flag-svg/US.svg"
```

## API Reference

### 🔤 ISO Code Utilities

```typescript
// Convert between ISO formats
convertTwoToThree("US"); // "USA"
convertThreeToTwo("USA"); // "US"

// Get names and codes
getCountryNameFromCode("US"); // "United States"
getCountryCodeFromName("France"); // "FR"

// Geographic coordinates
getMercatorCoordinates("USA"); // [-95.71, 37.09]
getCountrySizeScale("USA"); // 300
```

**Data Exports:**

```typescript
import {
  code_to_country, // {"US": "United States", ...}
  country_to_code, // {"United States": "US", ...}
  list_of_countries, // [{iso_two: "US", name: "...", continent: "..."}, ...]
  country_name_strings, // ["United States", "Afghanistan", ...]
  mercator_hash, // {"USA": [-95.71, 37.09], ...}
  countrySizeScales, // {"USA": 300, ...}
  twoToThree, // {"US": "USA", ...}
  threeToTwo, // {"USA": "US", ...}
} from "national-metadata";
```

## 🗺️ Maps & Geographic Data

Complete mapping solution with 6 continental GeoJSON files, 250+ country TopoJSON files, and React Simple Maps components.

```typescript
// Continental GeoJSON
import {
  africa,
  asia,
  europe,
  northAmerica,
  oceania,
  southAmerica,
} from "national-metadata/maps/continents";

// Country TopoJSON (async recommended)
import { getCountryTopology } from "national-metadata/maps/countries";
const usaTopo = await getCountryTopology("usa");

// React Simple Maps components
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
  Annotation,
} from "national-metadata/maps";

// Build interactive maps
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

**Available:** 250+ country TopoJSON files using three-letter ISO codes (`usa`, `gbr`, `deu`, `fra`, `jpn`, `chn`, etc.)

📖 **Detailed Docs:** [Maps Usage Guide](./MAPS_USAGE.md) | [Maps Examples](./MAPS_EXAMPLES.md)

## 🚩 Flag SVGs

260+ high-quality SVG country flags included and optimized for web applications.

```typescript
import {
  getFlagPath,
  getFlagFilename,
  hasFlagForCountry,
  flagFilenames,
  availableFlagCodes,
} from "national-metadata";

getFlagPath("US"); // "national-metadata/dist/flag-svg/US.svg"
getFlagFilename("US"); // "US.svg"
hasFlagForCountry("US"); // true
flagFilenames["US"]; // "US.svg"
availableFlagCodes; // ["AC", "AD", "AE", "AF", ...]
```

### React/Next.js Usage

**Option 1: Direct Import (Modern Bundlers)**

```typescript
<img
  src={
    new URL(
      `../node_modules/national-metadata/dist/flag-svg/${country_to_code[country]}.svg`,
      import.meta.url
    ).href
  }
/>
```

**Option 2: Public Folder (Next.js)**

```bash
cp -r node_modules/national-metadata/dist/flag-svg public/flags
```

```typescript
<img src={`/flags/${country_to_code[country]}.svg`} />
```

**Tree-shaking enabled** - Only imported functions are bundled (`"sideEffects": false`)

## 🌐 Country Metadata

Comprehensive country information with quality scores, regions, and Chinese translations.

```typescript
import {
  getCountryMetadata,
  getAllCountryMetadata,
  getCountryBySlug,
  getCountriesByRegion,
  countries,
} from "national-metadata";

const usData = getCountryMetadata("US");
// {
//   name: "United States", name_chinese: "美国", region: "North America",
//   cost_score: 3.02, overall_score: 3.33, country_code: "US", slug: "united-states"
// }

const europeanCountries = getCountriesByRegion("Europe");
const portugalData = getCountryBySlug("portugal");
```

**Regions:** Africa, Asia, Europe, North America, Latin America, Oceania, Antarctica, Caribbean

## 💰 Taxation Data

Complete tax information including personal income tax, capital gains, corporate rates, and tax system types.

```typescript
import {
  getTaxationData,
  getTaxationDataBySlug,
  getZeroTaxCountries,
  getTerritorialTaxCountries,
  getAllTaxationData,
  taxation_data,
} from "national-metadata";

const usTax = getTaxationData("US");
// {
//   code: "US", slug: "united-states", zero_tax_system: false,
//   personal_income_tax_limit: 37, capital_percentage_limit: 20,
//   corporate_tax_rate: 21, residence_threshold: 183, ...
// }

const taxHavens = getZeroTaxCountries(); // Monaco, UAE, Bahamas, etc.
const territorial = getTerritorialTaxCountries(); // Territorial tax systems
```

**Key Fields:** Personal income tax, capital gains, corporate tax, wealth tax, inheritance tax, VAT rates, residence thresholds, withholding tax, tax system type, government links, detailed notes

## 🏙️ City Data

1300+ city slugs with validation utilities.

```typescript
import {
  getCitySlugs,
  getCityCountrySlugs,
  isCitySlugValid,
  isCityCountrySlugValid,
  city_slugs,
} from "national-metadata";

getCitySlugs(); // ["lisbon", "berlin", "tokyo", ...]
getCityCountrySlugs(); // ["lisbon-portugal", "berlin-germany", ...]
isCitySlugValid("tokyo"); // true
isCityCountrySlugValid("tokyo-japan"); // true
```

## ✈️ Visa Requirements

Comprehensive visa data for all countries (updated Q3 2024).

```typescript
import {
  getVisaRequirements,
  getVisaFreeCountries,
  getVisaOnArrivalCountries,
  getEVisaCountries,
  visa_travel,
} from "national-metadata";

const usVisa = getVisaRequirements("US");
// { country_code: "US", visa_free: [...], visa_on_arrival: [...], e_visa: [...], visa_required: [...] }

const visaFree = getVisaFreeCountries("US"); // ["Canada", "Mexico", "UK", ...]
```

## 📊 Legatum Prosperity Index 2023

Rankings for 167 countries across 12 prosperity pillars.

```typescript
import {
  getLegatumData,
  getLegatumRankingByCountry,
  getLegatumTopCountries,
  getLegatumCountriesByOverallRank,
} from "national-metadata";

const denmark = getLegatumRankingByCountry("Denmark");
// { country: "Denmark", overall: 1, safety_and_security: 6, personal_freedom: 2, ... }

const top10 = getLegatumTopCountries();
const topTier = getLegatumCountriesByOverallRank(1, 20);
```

**12 Pillars:** Safety & Security, Personal Freedom, Governance, Social Capital, Investment Environment, Enterprise Conditions, Infrastructure & Market Access, Economic Quality, Living Conditions, Health, Education, Natural Environment

## 🛠️ Use Cases

- **Geographic Apps** - Map plotting with mercator coordinates
- **Form Validation** - Validate country codes and names
- **Internationalization** - Localized country names (Chinese included)
- **Tax Planning Tools** - Build calculators for international taxation
- **Digital Nomad Platforms** - Find tax-friendly destinations
- **Relocation Research** - Compare countries by cost, tax, prosperity
- **Immigration Platforms** - Integrate visa and tax information
- **Business Intelligence** - Analyze corporate tax and investment climates

## 📝 Examples

### Tax-Friendly Country Finder

```typescript
function findBestTaxDestinations(fromCountryCode: string) {
  const zeroTax = getZeroTaxCountries();
  const territorial = getTerritorialTaxCountries();
  const visaFree = getVisaFreeCountries(fromCountryCode) || [];

  return [...zeroTax, ...territorial]
    .map((taxData) => {
      const metadata = getCountryMetadata(taxData.code);
      return {
        name: metadata?.name,
        region: metadata?.region,
        overallScore: metadata?.overall_score,
        taxSystem: taxData.zero_tax_system ? "Zero Tax" : "Territorial",
        personalTaxRate: taxData.personal_income_tax_limit || 0,
        visaFree: visaFree.includes(metadata?.name || ""),
      };
    })
    .filter((c) => c.overallScore && c.overallScore > 3)
    .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
}
```

### Country Comparison

```typescript
function compareCountries(codes: string[]) {
  return codes.map((code) => {
    const metadata = getCountryMetadata(code);
    const taxData = getTaxationData(code);
    const prosperity = getLegatumRankingByCountry(metadata?.name || "");

    return {
      country: metadata?.name,
      scores: { cost: metadata?.cost_score, overall: metadata?.overall_score },
      taxation: {
        personalTax: taxData?.personal_income_tax_limit,
        corporateTax: taxData?.corporate_tax_rate,
      },
      quality: {
        safety: prosperity?.safety_and_security,
        freedom: prosperity?.personal_freedom,
      },
    };
  });
}
```

## 📘 TypeScript Support

Full TypeScript support with comprehensive types:

```typescript
import type {
  Country,
  CountryMapping,
  CountryCode,
  CountryName,
  TaxationData,
  TaxCreditOrDeduction,
  AdditionalTax,
  VisaTravel,
  Legatum2023,
  FlagCountryCode,
  MercatorCoordinate,
  ThreeDigitCode,
  TwoDigitCode,
} from "national-metadata";
```

## Contributing

Contributions welcome! Please submit PRs or issues on GitHub.

## License

See LICENSE file for details.

## Changelog

### v0.2.0 (Current)

**9 Complete Modules:**

- 🗺️ **Maps**: 6 continental GeoJSON files + 250+ country TopoJSON files + React Simple Maps components
- 🚩 **Flags**: 260+ country flag SVGs with utility functions
- 🌐 **Country Metadata**: Comprehensive data with scores, regions, Chinese translations
- 💰 **Taxation**: Personal/corporate tax rates, capital gains, wealth tax, VAT, residence thresholds
- ✈️ **Visa Requirements**: Complete travel requirements for all country pairs (Q3 2024)
- 📊 **Legatum Index**: 2023 prosperity rankings across 12 pillars for 167 countries
- 🏙️ **City Data**: 1300+ city slugs with validation
- 🔤 **ISO Utilities**: Convert between 2/3-digit country codes
- 📍 **Coordinates**: Mercator coordinates and size scales

**Package Improvements:**

- Tree-shaking enabled (`sideEffects: false`)
- ES Modules for optimal bundling
- Full TypeScript support with comprehensive types
- Detailed documentation: `MAPS_USAGE.md`, `MAPS_EXAMPLES.md`

### v0.1.1 - v0.1.3

Initial releases with progressive feature additions leading to v0.2.0 consolidation.
