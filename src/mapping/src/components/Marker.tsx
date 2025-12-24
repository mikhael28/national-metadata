import React, { useContext, useState, forwardRef, ReactNode, CSSProperties } from "react";
import { MapContext } from "./MapProvider";

export interface MarkerStyles {
  default?: CSSProperties;
  hover?: CSSProperties;
  pressed?: CSSProperties;
}

export interface MarkerProps extends Omit<React.SVGProps<SVGGElement>, "style"> {
  coordinates: [number, number];
  children?: ReactNode;
  onMouseEnter?: (event: React.MouseEvent<SVGGElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<SVGGElement>) => void;
  onMouseDown?: (event: React.MouseEvent<SVGGElement>) => void;
  onMouseUp?: (event: React.MouseEvent<SVGGElement>) => void;
  onFocus?: (event: React.FocusEvent<SVGGElement>) => void;
  onBlur?: (event: React.FocusEvent<SVGGElement>) => void;
  style?: MarkerStyles;
  className?: string;
}

const Marker = forwardRef<SVGGElement, MarkerProps>(
  (
    {
      coordinates,
      children,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onFocus,
      onBlur,
      style = {},
      className = "",
      ...restProps
    },
    ref
  ) => {
    const { projection } = useContext(MapContext);
    const [isPressed, setPressed] = useState(false);
    const [isFocused, setFocus] = useState(false);

    const projectedPoint = projection(coordinates);
    const [x, y] = projectedPoint || [0, 0];

    function handleMouseEnter(evt: React.MouseEvent<SVGGElement>) {
      setFocus(true);
      if (onMouseEnter) onMouseEnter(evt);
    }

    function handleMouseLeave(evt: React.MouseEvent<SVGGElement>) {
      setFocus(false);
      if (isPressed) setPressed(false);
      if (onMouseLeave) onMouseLeave(evt);
    }

    function handleFocus(evt: React.FocusEvent<SVGGElement>) {
      setFocus(true);
      if (onFocus) onFocus(evt);
    }

    function handleBlur(evt: React.FocusEvent<SVGGElement>) {
      setFocus(false);
      if (isPressed) setPressed(false);
      if (onBlur) onBlur(evt);
    }

    function handleMouseDown(evt: React.MouseEvent<SVGGElement>) {
      setPressed(true);
      if (onMouseDown) onMouseDown(evt);
    }

    function handleMouseUp(evt: React.MouseEvent<SVGGElement>) {
      setPressed(false);
      if (onMouseUp) onMouseUp(evt);
    }

    const currentState = isPressed || isFocused ? (isPressed ? "pressed" : "hover") : "default";

    return (
      <g
        ref={ref}
        transform={`translate(${x}, ${y})`}
        className={`rsm-marker ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={style[currentState]}
        {...restProps}
      >
        {children}
      </g>
    );
  }
);

Marker.displayName = "Marker";

export default Marker;
