import React, {
  createContext,
  useMemo,
  useCallback,
  useContext,
  ReactNode,
} from "react";
import * as d3Geo from "d3-geo";
import type { GeoPath, GeoProjection } from "d3-geo";

const { geoPath, ...projections } = d3Geo;

export interface ProjectionConfig {
  center?: [number, number];
  rotate?: [number, number, number?];
  scale?: number;
  parallels?: [number, number];
}

export interface MapContextValue {
  width: number;
  height: number;
  projection: GeoProjection;
  path: GeoPath;
}

const MapContext = createContext<MapContextValue>({} as MapContextValue);

interface MakeProjectionOptions {
  projectionConfig?: ProjectionConfig;
  projection?: string | GeoProjection;
  width?: number;
  height?: number;
}

const makeProjection = ({
  projectionConfig = {},
  projection = "geoEqualEarth",
  width = 800,
  height = 600,
}: MakeProjectionOptions): GeoProjection => {
  const isFunc = typeof projection === "function";

  if (isFunc) return projection as GeoProjection;

  const projectionName = projection as keyof typeof projections;
  const projectionFn = projections[projectionName] as () => GeoProjection;
  let proj = projectionFn().translate([width / 2, height / 2]);

  const supported = [
    (proj as any).center ? "center" : null,
    (proj as any).rotate ? "rotate" : null,
    (proj as any).scale ? "scale" : null,
    (proj as any).parallels ? "parallels" : null,
  ] as const;

  supported.forEach((d) => {
    if (!d) return;
    const method = d as keyof ProjectionConfig;
    const projMethod = (proj as any)[d];
    if (projMethod && typeof projMethod === "function") {
      proj = projMethod.call(proj, projectionConfig[method] || projMethod.call(proj));
    }
  });

  return proj;
};

export interface MapProviderProps {
  width: number;
  height: number;
  projection?: string | GeoProjection;
  projectionConfig?: ProjectionConfig;
  children?: ReactNode;
}

const MapProvider: React.FC<MapProviderProps> = ({
  width,
  height,
  projection,
  projectionConfig = {},
  children,
  ...restProps
}) => {
  const [cx, cy] = projectionConfig.center || [];
  const [rx, ry, rz] = projectionConfig.rotate || [];
  const [p1, p2] = projectionConfig.parallels || [];
  const s = projectionConfig.scale || null;

  const projMemo = useMemo(() => {
    return makeProjection({
      projectionConfig: {
        center: cx != null || cy != null ? [cx || 0, cy || 0] : undefined,
        rotate: rx != null || ry != null ? [rx || 0, ry || 0, rz] : undefined,
        parallels: p1 != null || p2 != null ? [p1 || 0, p2 || 0] : undefined,
        scale: s || undefined,
      },
      projection,
      width,
      height,
    });
  }, [width, height, projection, cx, cy, rx, ry, rz, p1, p2, s]);

  const proj = useCallback(() => projMemo, [projMemo])();

  const value = useMemo(() => {
    return {
      width,
      height,
      projection: proj,
      path: geoPath().projection(proj),
    };
  }, [width, height, proj]);

  return <MapContext.Provider value={value} {...restProps}>{children}</MapContext.Provider>;
};

const useMapContext = (): MapContextValue => {
  return useContext(MapContext);
};

export { MapProvider, MapContext, useMapContext };
