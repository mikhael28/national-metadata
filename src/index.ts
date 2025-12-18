// Hello World function as requested
export function helloWorld(): string {
  return "Mr World Wide is here";
}

// Import all data for internal use
import { code_to_country } from "./code-to-country.js";
import { country_name_strings } from "./country-name-strings.js";
import { country_to_code } from "./country-to-code.js";
import { list_of_countries } from "./list-of-countries.js";
import { mercator_hash, countrySizeScales } from "./mercator-hash.js";
import { threeToTwo } from "./three-to-two.js";
import { twoToThree } from "./two-to-three.js";

// Export all country data and utility functions
export { code_to_country } from "./code-to-country.js";
export { country_name_strings } from "./country-name-strings.js";
export { country_to_code, CountryMapping } from "./country-to-code.js";
export { list_of_countries } from "./list-of-countries.js";
export { mercator_hash, countrySizeScales } from "./mercator-hash.js";
export { threeToTwo } from "./three-to-two.js";
export { twoToThree } from "./two-to-three.js";

// Export flag utilities
export {
  getFlagPath,
  getFlagFilename,
  flagFilenames,
  availableFlagCodes,
  hasFlagForCountry,
  type FlagCountryCode,
} from "./flags.js";

// Export city data
export { city_slugs } from "./cities/city-slugs.js";
export { city_country_slugs } from "./cities/city-country-slugs.js";

// Export immigration/visa data
export { visa_travel, type VisaTravel } from "./immigration/visa-travel.js";

// Export rankings data
export { legatum_2023, type Legatum2023 } from "./rankings/legatum_2023.js";

// Utility functions for working with country codes
export function convertTwoToThree(twoDigitCode: string): string | undefined {
  return twoToThree[twoDigitCode.toUpperCase()];
}

export function convertThreeToTwo(threeDigitCode: string): string | undefined {
  return threeToTwo[threeDigitCode.toUpperCase()];
}

export function getCountryNameFromCode(code: string): string | undefined {
  return code_to_country[code.toUpperCase() as keyof typeof code_to_country];
}

export function getCountryCodeFromName(
  countryName: string
): string | undefined {
  return country_to_code[countryName as keyof typeof country_to_code];
}

export function getMercatorCoordinates(
  threeDigitCode: string
): [number, number] | undefined {
  const coords =
    mercator_hash[threeDigitCode.toUpperCase() as keyof typeof mercator_hash];
  return coords as [number, number] | undefined;
}

export function getCountrySizeScale(
  threeDigitCode: string
): number | undefined {
  return countrySizeScales[
    threeDigitCode.toUpperCase() as keyof typeof countrySizeScales
  ];
}

// City utility functions
import { city_slugs } from "./cities/city-slugs.js";
import { city_country_slugs } from "./cities/city-country-slugs.js";

export function getCitySlugs(): string[] {
  return city_slugs;
}

export function getCityCountrySlugs(): string[] {
  return city_country_slugs;
}

export function isCitySlugValid(slug: string): boolean {
  return city_slugs.includes(slug);
}

export function isCityCountrySlugValid(slug: string): boolean {
  return city_country_slugs.includes(slug);
}

// Visa/Travel utility functions
import { visa_travel } from "./immigration/visa-travel.js";

export function getVisaRequirements(
  countryCode: string
): (typeof visa_travel)[string] | undefined {
  return visa_travel[countryCode.toUpperCase()];
}

export function getVisaFreeCountries(
  countryCode: string
): string[] | undefined {
  return visa_travel[countryCode.toUpperCase()]?.visa_free;
}

export function getVisaOnArrivalCountries(
  countryCode: string
): string[] | undefined {
  return visa_travel[countryCode.toUpperCase()]?.visa_on_arrival;
}

export function getEVisaCountries(countryCode: string): string[] | undefined {
  return visa_travel[countryCode.toUpperCase()]?.e_visa;
}

export function getVisaRequiredCountries(
  countryCode: string
): string[] | undefined {
  return visa_travel[countryCode.toUpperCase()]?.visa_required;
}

// Legatum Prosperity Index utility functions
import { legatum_2023, Legatum2023 } from "./rankings/legatum_2023.js";

export function getLegatumData(): Legatum2023[] {
  return legatum_2023;
}

export function getLegatumRankingByCountry(
  countryName: string
): Legatum2023 | undefined {
  return legatum_2023.find(
    (entry) => entry.country.toLowerCase() === countryName.toLowerCase()
  );
}

export function getLegatumTopCountries(limit: number = 10): Legatum2023[] {
  return legatum_2023.slice(0, limit);
}

export function getLegatumCountriesByOverallRank(
  minRank: number,
  maxRank: number
): Legatum2023[] {
  return legatum_2023.filter(
    (entry) => entry.overall >= minRank && entry.overall <= maxRank
  );
}

// Type definitions for better TypeScript support
export interface Country {
  iso_two: string;
  name: string;
  continent: string;
}

export interface MercatorCoordinate {
  longitude: number;
  latitude: number;
}

export type CountryCode = keyof typeof code_to_country;
export type CountryName = keyof typeof country_to_code;
export type ThreeDigitCode = keyof typeof threeToTwo;
export type TwoDigitCode = keyof typeof twoToThree;
