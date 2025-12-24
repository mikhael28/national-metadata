import React, { Fragment, memo, useMemo, useContext, forwardRef } from "react";
import { MapContext } from "./MapProvider";

export interface SphereProps extends React.SVGProps<SVGPathElement> {
  id?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
}

const Sphere = forwardRef<SVGPathElement, SphereProps>(
  (
    {
      id = "rsm-sphere",
      fill = "transparent",
      stroke = "currentcolor",
      strokeWidth = 0.5,
      className = "",
      ...restProps
    },
    ref
  ) => {
    const { path } = useContext(MapContext);
    const spherePath = useMemo(() => path({ type: "Sphere" }), [path]);
    return (
      <Fragment>
        <defs>
          <clipPath id={id}>
            <path d={spherePath || undefined} />
          </clipPath>
        </defs>
        <path
          ref={ref}
          d={spherePath || undefined}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          style={{ pointerEvents: "none" }}
          className={`rsm-sphere ${className}`}
          {...restProps}
        />
      </Fragment>
    );
  }
);

Sphere.displayName = "Sphere";

export default memo(Sphere);
