import React, { useContext, forwardRef } from "react";
import { MapContext } from "./MapProvider";

export interface LineProps extends Omit<React.SVGProps<SVGPathElement>, "from" | "to"> {
  from?: [number, number];
  to?: [number, number];
  coordinates?: [number, number][];
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  className?: string;
}

const Line = forwardRef<SVGPathElement, LineProps>(
  (
    {
      from = [0, 0],
      to = [0, 0],
      coordinates,
      stroke = "currentcolor",
      strokeWidth = 3,
      fill = "transparent",
      className = "",
      ...restProps
    },
    ref
  ) => {
    const { path } = useContext(MapContext);

    const lineData = {
      type: "LineString" as const,
      coordinates: coordinates || [from, to],
    };

    return (
      <path
        ref={ref}
        d={path(lineData) || undefined}
        className={`rsm-line ${className}`}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
        {...restProps}
      />
    );
  }
);

Line.displayName = "Line";

export default Line;
