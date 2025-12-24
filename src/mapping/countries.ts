// Country-specific TopoJSON exports
// This file provides a helper function to load country topojson files

import type { Topology } from "topojson-specification";

/**
 * Dynamically imports a country's TopoJSON file by country code
 * @param countryCode - Three-letter country code (e.g., 'usa', 'can', 'gbr')
 * @returns Promise resolving to the TopoJSON topology
 * @example
 * const usaTopo = await getCountryTopology('usa');
 * 
 * // In a React component:
 * const [topology, setTopology] = React.useState(null);
 * React.useEffect(() => {
 *   getCountryTopology('usa').then(setTopology);
 * }, []);
 */
export async function getCountryTopology(
  countryCode: string
): Promise<Topology> {
  const code = countryCode.toLowerCase();
  const topology = await import(`./topojson/${code}.topo.json`);
  return topology.default || topology;
}

/**
 * Returns the path to a country's TopoJSON file for use with bundler's require/import
 * This allows you to use it with dynamic requires in your bundler
 * @param countryCode - Three-letter country code (e.g., 'usa', 'can', 'gbr')
 * @returns The module path that can be used with your bundler's require
 * @example
 * // In your React component with a bundler that supports dynamic requires:
 * const topology = require(getCountryTopologyPath('usa'));
 * 
 * // Or with Webpack's require.context:
 * const path = getCountryTopologyPath(props.country_code);
 */
export function getCountryTopologyPath(countryCode: string): string {
  const code = countryCode.toLowerCase();
  return `national-metadata/maps/countries/${code}.topo.json`;
}

// Export types
export type { Topology } from "topojson-specification";

