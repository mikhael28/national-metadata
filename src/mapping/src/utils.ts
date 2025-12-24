import { feature, mesh } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";

export type Point = [number, number];
// Transform object for zoom/pan operations
export interface Transform {
  x: number;
  y: number;
  k: number;
}

// Extended feature with SVG path and key
// We make id and properties required to match typical TopoJSON/GeoJSON geography usage
export interface PreparedFeature extends Omit<Feature, "id" | "properties"> {
  id: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  rsmKey: string;
  svgPath: string;
}

// Mesh object with SVG path
export interface PreparedMesh {
  outline?: PreparedFeature;
  borders?: PreparedFeature;
}

// Geography can be either Topology (TopoJSON) or FeatureCollection (GeoJSON)
export type Geography = Topology | FeatureCollection;

// Path generator function from d3-geo
export type PathGenerator = (geo: any) => string | null;

export function getCoords(
  w: number,
  h: number,
  t: Transform
): [number, number] {
  const xOffset = (w * t.k - w) / 2;
  const yOffset = (h * t.k - h) / 2;
  return [w / 2 - (xOffset + t.x) / t.k, h / 2 - (yOffset + t.y) / t.k];
}

export function fetchGeographies(url: string): Promise<Geography | undefined> {
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.json();
    })
    .catch((error) => {
      console.log("There was a problem when fetching the data: ", error);
      return undefined;
    });
}

export function getFeatures(
  geographies: Geography,
  parseGeographies?: (features: Feature[]) => Feature[]
): Feature[] {
  const isTopojson = geographies.type === "Topology";

  if (!isTopojson) {
    const geoCollection = geographies as FeatureCollection;
    const features = geoCollection.features || (geographies as any);
    return parseGeographies ? parseGeographies(features) : features;
  }

  const topology = geographies as Topology;
  const firstObjectKey = Object.keys(topology.objects)[0];
  const feats = feature(
    topology,
    topology.objects[firstObjectKey] as GeometryCollection
  ).features;

  return parseGeographies ? parseGeographies(feats) : feats;
}

export function getMesh(
  geographies: Geography
): { outline: any; borders: any } | null {
  const isTopojson = geographies.type === "Topology";
  if (!isTopojson) return null;

  const topology = geographies as Topology;
  const firstObjectKey = Object.keys(topology.objects)[0];
  const geometryCollection = topology.objects[
    firstObjectKey
  ] as GeometryCollection;

  const outline = mesh(topology, geometryCollection, (a, b) => a === b);
  const borders = mesh(topology, geometryCollection, (a, b) => a !== b);

  return { outline, borders };
}

export function prepareMesh(
  outline: any,
  borders: any,
  path: PathGenerator
): PreparedMesh {
  return outline && borders
    ? {
        outline: {
          ...outline,
          rsmKey: "outline",
          svgPath: path(outline) || "",
        },
        borders: {
          ...borders,
          rsmKey: "borders",
          svgPath: path(borders) || "",
        },
      }
    : {};
}

export function prepareFeatures(
  geographies: Feature[] | null | undefined,
  path: PathGenerator
): PreparedFeature[] {
  return geographies
    ? geographies.map((d, i) => {
        return {
          ...d,
          id: d.id !== undefined ? String(d.id) : `geo-${i}`,
          properties: {
            name: d.properties?.name || "",
            ...(d.properties || {}),
          },
          rsmKey: `geo-${i}`,
          svgPath: path(d) || "",
        };
      })
    : [];
}

export function createConnectorPath(
  dx: number = 30,
  dy: number = 30,
  curve: number | [number, number] = 0.5
): string {
  const curvature = Array.isArray(curve) ? curve : [curve, curve];
  const curveX = (dx / 2) * curvature[0];
  const curveY = (dy / 2) * curvature[1];
  return `M${0},${0} Q${-dx / 2 - curveX},${-dy / 2 + curveY} ${-dx},${-dy}`;
}

export function isString(geo: any): geo is string {
  return typeof geo === "string";
}
