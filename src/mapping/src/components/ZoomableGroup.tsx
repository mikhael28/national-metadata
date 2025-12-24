import React, { useContext, forwardRef, ReactNode } from "react";
import { MapContext } from "./MapProvider";
import { ZoomPanProvider } from "./ZoomPanProvider";
import useZoomPan from "./useZoomPan";

export interface ZoomableGroupProps extends React.SVGProps<SVGGElement> {
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  translateExtent?: [[number, number], [number, number]];
  filterZoomEvent?: (event: any) => boolean;
  onMoveStart?: (position: { x: number; y: number; k: number; dragging?: boolean }, event?: any) => void;
  onMove?: (position: { x: number; y: number; zoom: number; dragging?: boolean }, event?: any) => void;
  onMoveEnd?: (position: { coordinates?: [number, number]; zoom?: number }, event?: any) => void;
  className?: string;
  children?: ReactNode;
}

const ZoomableGroup = forwardRef<SVGGElement, ZoomableGroupProps>(
  (
    {
      center = [0, 0],
      zoom = 1,
      minZoom = 1,
      maxZoom = 8,
      translateExtent,
      filterZoomEvent,
      onMoveStart,
      onMove,
      onMoveEnd,
      className = "",
      children,
      ...restProps
    },
    ref
  ) => {
    const { width, height } = useContext(MapContext);

    const { mapRef, transformString, position } = useZoomPan({
      center,
      filterZoomEvent,
      onMoveStart,
      onMove,
      onMoveEnd,
      scaleExtent: [minZoom, maxZoom],
      translateExtent,
      zoom,
    });

    return (
      <ZoomPanProvider
        value={{ x: position.x, y: position.y, k: position.k, transformString }}
      >
        <g ref={mapRef}>
          <rect width={width} height={height} fill="transparent" />
          <g
            ref={ref}
            transform={transformString}
            className={`rsm-zoomable-group ${className}`}
            {...restProps}
          >
            {children}
          </g>
        </g>
      </ZoomPanProvider>
    );
  }
);

ZoomableGroup.displayName = "ZoomableGroup";

export default ZoomableGroup;
