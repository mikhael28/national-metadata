import React, { useContext, forwardRef, ReactNode } from "react";
import { MapContext } from "./MapProvider";
import { createConnectorPath } from "../utils";

export interface AnnotationProps extends React.SVGProps<SVGGElement> {
  subject: [number, number];
  children?: ReactNode;
  connectorProps?: React.SVGProps<SVGPathElement>;
  dx?: number;
  dy?: number;
  curve?: number | [number, number];
  className?: string;
}

const Annotation = forwardRef<SVGGElement, AnnotationProps>(
  (
    {
      subject,
      children,
      connectorProps,
      dx = 30,
      dy = 30,
      curve = 0,
      className = "",
      ...restProps
    },
    ref
  ) => {
    const { projection } = useContext(MapContext);
    const projectedPoint = projection(subject);
    const [x, y] = projectedPoint || [0, 0];
    const connectorPath = createConnectorPath(dx, dy, curve);

    return (
      <g
        ref={ref}
        transform={`translate(${x + dx}, ${y + dy})`}
        className={`rsm-annotation ${className}`}
        {...restProps}
      >
        <path
          d={connectorPath}
          fill="transparent"
          stroke="#000"
          {...connectorProps}
        />
        {children}
      </g>
    );
  }
);

Annotation.displayName = "Annotation";

export default Annotation;
