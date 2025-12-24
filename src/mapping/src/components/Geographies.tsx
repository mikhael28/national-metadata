import React, { useContext, forwardRef, ReactNode } from "react";
import type { Feature } from "geojson";
import type { GeoPath, GeoProjection } from "d3-geo";
import { MapContext } from "./MapProvider";
import useGeographies from "./useGeographies";
import type { Geography, PreparedFeature, PreparedMesh } from "../utils";

export interface GeographiesChildrenProps {
  geographies: PreparedFeature[];
  outline: PreparedFeature | undefined;
  borders: PreparedFeature | undefined;
  path: GeoPath;
  projection: GeoProjection;
}

export interface GeographiesProps extends Omit<React.SVGProps<SVGGElement>, "children"> {
  geography: string | Geography | Feature[];
  children: (props: GeographiesChildrenProps) => ReactNode;
  parseGeographies?: (features: Feature[]) => Feature[];
  className?: string;
}

const Geographies = forwardRef<SVGGElement, GeographiesProps>(
  ({ geography, children, parseGeographies, className = "", ...restProps }, ref) => {
    const { path, projection } = useContext(MapContext);
    const { geographies, outline, borders } = useGeographies({
      geography,
      parseGeographies,
    });

    return (
      <g ref={ref} className={`rsm-geographies ${className}`} {...restProps}>
        {geographies &&
          geographies.length > 0 &&
          children({ geographies, outline, borders, path, projection })}
      </g>
    );
  }
);

Geographies.displayName = "Geographies";

export default Geographies;
