import React, { memo, useContext, forwardRef } from "react";
import { geoGraticule } from "d3-geo";
import { MapContext } from "./MapProvider";

export interface GraticuleProps extends React.SVGProps<SVGPathElement> {
  fill?: string;
  stroke?: string;
  step?: [number, number];
  className?: string;
}

const Graticule = forwardRef<SVGPathElement, GraticuleProps>(
  (
    {
      fill = "transparent",
      stroke = "currentcolor",
      step = [10, 10],
      className = "",
      ...restProps
    },
    ref
  ) => {
    const { path } = useContext(MapContext);
    return (
      <path
        ref={ref}
        d={path(geoGraticule().step(step)()) || undefined}
        fill={fill}
        stroke={stroke}
        className={`rsm-graticule ${className}`}
        {...restProps}
      />
    );
  }
);

Graticule.displayName = "Graticule";

export default memo(Graticule);
