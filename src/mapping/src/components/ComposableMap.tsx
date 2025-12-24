import React, { forwardRef } from "react";
import type { GeoProjection } from "d3-geo";
import { MapProvider, ProjectionConfig } from "./MapProvider";

export interface ComposableMapProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  projection?: string | GeoProjection;
  projectionConfig?: ProjectionConfig;
  className?: string;
}

const ComposableMap = forwardRef<SVGSVGElement, ComposableMapProps>(
  (
    {
      width = 800,
      height = 600,
      projection = "geoEqualEarth",
      projectionConfig = {},
      className = "",
      children,
      ...restProps
    },
    ref
  ) => {
    return (
      <MapProvider
        width={width}
        height={height}
        projection={projection}
        projectionConfig={projectionConfig}
      >
        <svg
          ref={ref}
          viewBox={`0 0 ${width} ${height}`}
          className={`rsm-svg ${className}`}
          {...restProps}
        >
          {children}
        </svg>
      </MapProvider>
    );
  }
);

ComposableMap.displayName = "ComposableMap";

export default ComposableMap;
