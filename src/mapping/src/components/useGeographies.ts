import { useMemo, useState, useEffect, useContext } from "react";
import type { Feature } from "geojson";
import { MapContext } from "./MapProvider";
import {
  fetchGeographies,
  getFeatures,
  getMesh,
  prepareFeatures,
  isString,
  prepareMesh,
  Geography,
  PreparedFeature,
} from "../utils";

interface UseGeographiesOptions {
  geography: string | Geography | Feature[];
  parseGeographies?: (features: Feature[]) => Feature[];
}

interface GeographiesOutput {
  geographies?: Feature[];
  mesh?: { outline: any; borders: any } | null;
}

export default function useGeographies({
  geography,
  parseGeographies,
}: UseGeographiesOptions): {
  geographies: PreparedFeature[];
  outline: PreparedFeature | undefined;
  borders: PreparedFeature | undefined;
} {
  const { path } = useContext(MapContext);
  const [output, setOutput] = useState<GeographiesOutput>({});

  useEffect(() => {
    if (typeof window === `undefined`) return;

    if (!geography) return;

    if (isString(geography)) {
      fetchGeographies(geography).then((geos) => {
        if (geos) {
          setOutput({
            geographies: getFeatures(geos, parseGeographies),
            mesh: getMesh(geos),
          });
        }
      });
    } else {
      const geographyData = geography as Geography;
      setOutput({
        geographies: getFeatures(geographyData, parseGeographies),
        mesh: getMesh(geographyData),
      });
    }
  }, [geography, parseGeographies]);

  const { geographies, outline, borders } = useMemo(() => {
    const mesh = output.mesh || { outline: undefined, borders: undefined };
    const preparedMesh = prepareMesh(mesh.outline, mesh.borders, path);
    return {
      geographies: prepareFeatures(output.geographies, path),
      outline: preparedMesh.outline,
      borders: preparedMesh.borders,
    };
  }, [output, path]);

  return { geographies, outline, borders };
}
