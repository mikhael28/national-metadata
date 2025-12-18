# Usage Examples

This document provides practical examples of using the national-metadata package.

## City Data Examples

### Finding Cities

```typescript
import { getCitySlugs, getCityCountrySlugs, isCitySlugValid } from 'national-metadata';

// Get all city slugs
const allCities = getCitySlugs();
console.log(`Total cities: ${allCities.length}`); // 1300+

// Get cities with country information
const citiesWithCountries = getCityCountrySlugs();
console.log(citiesWithCountries[0]); // "lisbon-portugal"

// Validate a city slug
if (isCitySlugValid('tokyo')) {
  console.log('Tokyo is a valid city!');
}

// Search for cities by pattern
const europeanCapitals = getCityCountrySlugs().filter(slug => 
  slug.includes('berlin') || 
  slug.includes('paris') || 
  slug.includes('london')
);
```

### Building a City Selector

```typescript
import { city_country_slugs } from 'national-metadata';

// Create a searchable city list
const cityOptions = city_country_slugs.map(slug => {
  const [city, ...countryParts] = slug.split('-');
  const country = countryParts.join(' ');
  return {
    value: slug,
    label: `${city.charAt(0).toUpperCase() + city.slice(1)}, ${country}`,
    searchTerms: slug.replace(/-/g, ' ')
  };
});

// Search function
function searchCities(query: string) {
  const lowerQuery = query.toLowerCase();
  return cityOptions.filter(city => 
    city.searchTerms.includes(lowerQuery)
  );
}

console.log(searchCities('tokyo')); // Find all Tokyo entries
```

## Visa & Immigration Examples

### Check Travel Requirements

```typescript
import { 
  getVisaRequirements, 
  getVisaFreeCountries,
  getVisaOnArrivalCountries 
} from 'national-metadata';

// Get complete visa information for US passport holders
const usVisa = getVisaRequirements('US');
console.log(`US citizens can visit ${usVisa?.visa_free?.length} countries visa-free`);

// Check if a specific country allows visa-free travel
const usVisaFree = getVisaFreeCountries('US');
if (usVisaFree?.includes('Japan')) {
  console.log('US citizens can visit Japan visa-free!');
}

// Find countries offering visa on arrival
const visaOnArrival = getVisaOnArrivalCountries('US');
console.log(`Visa on arrival available in ${visaOnArrival?.length} countries`);
```

### Travel Planning Application

```typescript
import { 
  getVisaFreeCountries, 
  getVisaOnArrivalCountries,
  getEVisaCountries 
} from 'national-metadata';

function getTravelOptions(passportCountry: string) {
  const visaFree = getVisaFreeCountries(passportCountry) || [];
  const visaOnArrival = getVisaOnArrivalCountries(passportCountry) || [];
  const eVisa = getEVisaCountries(passportCountry) || [];

  return {
    easyTravel: visaFree, // No visa needed
    moderateTravel: [...visaOnArrival, ...eVisa], // Simple visa process
    totalAccessible: visaFree.length + visaOnArrival.length + eVisa.length
  };
}

const usTravelOptions = getTravelOptions('US');
console.log(`Easy travel to ${usTravelOptions.easyTravel.length} countries`);
console.log(`Total accessible: ${usTravelOptions.totalAccessible} countries`);
```

### Compare Passport Strength

```typescript
import { getVisaFreeCountries, visa_travel } from 'national-metadata';

function comparePassports(country1: string, country2: string) {
  const visa1 = getVisaFreeCountries(country1) || [];
  const visa2 = getVisaFreeCountries(country2) || [];

  return {
    [country1]: visa1.length,
    [country2]: visa2.length,
    difference: Math.abs(visa1.length - visa2.length),
    stronger: visa1.length > visa2.length ? country1 : country2
  };
}

const comparison = comparePassports('US', 'AF');
console.log(comparison);
// { US: 180+, AF: 30+, difference: 150+, stronger: 'US' }
```

## Legatum Prosperity Index Examples

### Find Top Countries

```typescript
import { 
  getLegatumTopCountries, 
  getLegatumRankingByCountry 
} from 'national-metadata';

// Get top 10 most prosperous countries
const top10 = getLegatumTopCountries(10);
console.log('Top 10 Most Prosperous Countries:');
top10.forEach(country => {
  console.log(`${country.overall}. ${country.country}`);
});

// Get specific country data
const denmark = getLegatumRankingByCountry('Denmark');
if (denmark) {
  console.log(`Denmark - Overall Rank: ${denmark.overall}`);
  console.log(`Safety & Security: ${denmark.safety_and_security}`);
  console.log(`Personal Freedom: ${denmark.personal_freedom}`);
}
```

### Analyze Prosperity Pillars

```typescript
import { legatum_2023, type Legatum2023 } from 'national-metadata';

// Find countries with best safety rankings
const safestCountries = legatum_2023
  .sort((a, b) => a.safety_and_security - b.safety_and_security)
  .slice(0, 10);

console.log('Top 10 Safest Countries:');
safestCountries.forEach(c => {
  console.log(`${c.country}: Rank ${c.safety_and_security}`);
});

// Find countries with best education
const bestEducation = legatum_2023
  .sort((a, b) => a.education - b.education)
  .slice(0, 10);

// Calculate average prosperity score by region
function getAverageProsperity(countries: Legatum2023[]) {
  const sum = countries.reduce((acc, c) => acc + c.overall, 0);
  return sum / countries.length;
}
```

### Compare Countries

```typescript
import { getLegatumRankingByCountry } from 'national-metadata';

function compareCountries(country1: string, country2: string) {
  const data1 = getLegatumRankingByCountry(country1);
  const data2 = getLegatumRankingByCountry(country2);

  if (!data1 || !data2) return null;

  return {
    overall: {
      [country1]: data1.overall,
      [country2]: data2.overall,
      better: data1.overall < data2.overall ? country1 : country2
    },
    safety: {
      [country1]: data1.safety_and_security,
      [country2]: data2.safety_and_security,
      better: data1.safety_and_security < data2.safety_and_security ? country1 : country2
    },
    education: {
      [country1]: data1.education,
      [country2]: data2.education,
      better: data1.education < data2.education ? country1 : country2
    }
  };
}

const comparison = compareCountries('Denmark', 'Norway');
console.log(comparison);
```

### Filter by Prosperity Range

```typescript
import { getLegatumCountriesByOverallRank } from 'national-metadata';

// Get top tier countries (ranks 1-20)
const topTier = getLegatumCountriesByOverallRank(1, 20);
console.log(`Top tier: ${topTier.length} countries`);

// Get middle tier countries (ranks 50-100)
const middleTier = getLegatumCountriesByOverallRank(50, 100);

// Find countries in specific prosperity range
function findCountriesInRange(minRank: number, maxRank: number) {
  const countries = getLegatumCountriesByOverallRank(minRank, maxRank);
  return countries.map(c => ({
    name: c.country,
    rank: c.overall,
    strengths: [
      { pillar: 'Safety', rank: c.safety_and_security },
      { pillar: 'Education', rank: c.education },
      { pillar: 'Health', rank: c.health }
    ].sort((a, b) => a.rank - b.rank)
  }));
}
```

## Combined Examples

### Travel Destination Recommender

```typescript
import {
  getVisaFreeCountries,
  getLegatumRankingByCountry,
  isCityCountrySlugValid
} from 'national-metadata';

function recommendDestinations(passportCountry: string, minProsperityRank: number = 50) {
  const visaFree = getVisaFreeCountries(passportCountry) || [];
  
  const recommendations = visaFree
    .map(country => {
      const prosperity = getLegatumRankingByCountry(country);
      return {
        country,
        prosperityRank: prosperity?.overall || 999,
        safetyRank: prosperity?.safety_and_security || 999,
        healthRank: prosperity?.health || 999
      };
    })
    .filter(dest => dest.prosperityRank <= minProsperityRank)
    .sort((a, b) => a.prosperityRank - b.prosperityRank);

  return recommendations;
}

const recommendations = recommendDestinations('US', 30);
console.log('Top visa-free destinations with high prosperity:');
recommendations.forEach(dest => {
  console.log(`${dest.country} (Prosperity Rank: ${dest.prosperityRank})`);
});
```

### Digital Nomad Location Finder

```typescript
import {
  getVisaFreeCountries,
  getLegatumRankingByCountry,
  getCityCountrySlugs
} from 'national-metadata';

interface NomadDestination {
  country: string;
  cities: string[];
  visaFree: boolean;
  prosperityRank: number;
  internetInfrastructure: number;
  safety: number;
  score: number;
}

function findNomadDestinations(passportCountry: string): NomadDestination[] {
  const visaFree = getVisaFreeCountries(passportCountry) || [];
  const allCities = getCityCountrySlugs();
  
  const destinations = visaFree.map(country => {
    const prosperity = getLegatumRankingByCountry(country);
    const cities = allCities.filter(slug => 
      slug.toLowerCase().includes(country.toLowerCase())
    );
    
    // Calculate nomad score (lower is better)
    const score = prosperity ? (
      prosperity.infrastructure_and_market_access * 0.4 +
      prosperity.safety_and_security * 0.3 +
      prosperity.living_conditions * 0.3
    ) : 999;
    
    return {
      country,
      cities,
      visaFree: true,
      prosperityRank: prosperity?.overall || 999,
      internetInfrastructure: prosperity?.infrastructure_and_market_access || 999,
      safety: prosperity?.safety_and_security || 999,
      score
    };
  })
  .filter(dest => dest.cities.length > 0 && dest.score < 100)
  .sort((a, b) => a.score - b.score);
  
  return destinations;
}

const nomadSpots = findNomadDestinations('US');
console.log('Top digital nomad destinations:');
nomadSpots.slice(0, 10).forEach(dest => {
  console.log(`${dest.country} - ${dest.cities.length} cities (Score: ${dest.score.toFixed(1)})`);
});
```

### Country Profile Generator

```typescript
import {
  getCountryNameFromCode,
  getVisaRequirements,
  getLegatumRankingByCountry,
  getFlagPath
} from 'national-metadata';

function generateCountryProfile(countryCode: string) {
  const name = getCountryNameFromCode(countryCode);
  const visa = getVisaRequirements(countryCode);
  const prosperity = getLegatumRankingByCountry(name || '');
  const flagPath = getFlagPath(countryCode);
  
  return {
    name,
    code: countryCode,
    flag: flagPath,
    travel: {
      visaFreeAccess: visa?.visa_free?.length || 0,
      visaOnArrival: visa?.visa_on_arrival?.length || 0,
      eVisaAvailable: visa?.e_visa?.length || 0
    },
    prosperity: prosperity ? {
      overallRank: prosperity.overall,
      topStrengths: [
        { pillar: 'Safety', rank: prosperity.safety_and_security },
        { pillar: 'Freedom', rank: prosperity.personal_freedom },
        { pillar: 'Governance', rank: prosperity.governance },
        { pillar: 'Education', rank: prosperity.education },
        { pillar: 'Health', rank: prosperity.health }
      ].sort((a, b) => a.rank - b.rank).slice(0, 3)
    } : null
  };
}

const profile = generateCountryProfile('DK');
console.log(JSON.stringify(profile, null, 2));
```

## TypeScript Examples

### Type-Safe Country Operations

```typescript
import type {
  VisaTravel,
  Legatum2023,
  CountryCode,
  CountryName
} from 'national-metadata';

// Type-safe visa data handling
function processVisaData(data: VisaTravel) {
  const totalAccess = 
    (data.visa_free?.length || 0) +
    (data.visa_on_arrival?.length || 0) +
    (data.e_visa?.length || 0);
  
  return {
    countryCode: data.country_code,
    totalAccess,
    easyAccess: data.visa_free?.length || 0
  };
}

// Type-safe prosperity analysis
function analyzeProsperity(data: Legatum2023) {
  const pillars = [
    data.safety_and_security,
    data.personal_freedom,
    data.governance,
    data.social_capital,
    data.investment_environment,
    data.enterprise_conditions,
    data.infrastructure_and_market_access,
    data.economic_quality,
    data.living_conditions,
    data.health,
    data.education,
    data.natural_environment
  ];
  
  const average = pillars.reduce((a, b) => a + b, 0) / pillars.length;
  const best = Math.min(...pillars);
  const worst = Math.max(...pillars);
  
  return { average, best, worst, consistency: worst - best };
}
```

