// Hello World function as requested
export function helloWorld(): string {
  return "Mr World Wide is here";
}

// Import all data for internal use
import { code_to_country } from './code-to-country';
import { country_name_strings } from './country-name-strings';
import { country_to_code } from './country-to-code';
import { list_of_countries } from './list-of-countries';
import { mercator_hash, countrySizeScales } from './mercator-hash';
import { threeToTwo } from './three-to-two';
import { twoToThree } from './two-to-three';

// Export all country data and utility functions
export { code_to_country } from './code-to-country';
export { country_name_strings } from './country-name-strings';
export { country_to_code, CountryMapping } from './country-to-code';
export { list_of_countries } from './list-of-countries';
export { mercator_hash, countrySizeScales } from './mercator-hash';
export { threeToTwo } from './three-to-two';
export { twoToThree } from './two-to-three';

// Export flag utilities
export { 
  getFlagPath, 
  getFlagFilename, 
  flagFilenames, 
  availableFlagCodes,
  hasFlagForCountry,
  type FlagCountryCode 
} from './flags';

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

export function getCountryCodeFromName(countryName: string): string | undefined {
  return country_to_code[countryName as keyof typeof country_to_code];
}

export function getMercatorCoordinates(threeDigitCode: string): [number, number] | undefined {
  const coords = mercator_hash[threeDigitCode.toUpperCase() as keyof typeof mercator_hash];
  return coords as [number, number] | undefined;
}

export function getCountrySizeScale(threeDigitCode: string): number | undefined {
  return countrySizeScales[threeDigitCode.toUpperCase() as keyof typeof countrySizeScales];
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
