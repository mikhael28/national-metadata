import React, { createContext, useContext, ReactNode } from "react";
import type { Transform } from "../utils";

export interface ZoomPanContextValue extends Transform {
  transformString: string;
}

const ZoomPanContext = createContext<ZoomPanContextValue>(
  {} as ZoomPanContextValue
);

const defaultValue: ZoomPanContextValue = {
  x: 0,
  y: 0,
  k: 1,
  transformString: "translate(0 0) scale(1)",
};

export interface ZoomPanProviderProps {
  value?: ZoomPanContextValue;
  children?: ReactNode;
}

const ZoomPanProvider: React.FC<ZoomPanProviderProps> = ({
  value = defaultValue,
  children,
  ...restProps
}) => {
  return (
    <ZoomPanContext.Provider value={value} {...restProps}>
      {children}
    </ZoomPanContext.Provider>
  );
};

const useZoomPanContext = (): ZoomPanContextValue => {
  return useContext(ZoomPanContext);
};

export { ZoomPanContext, ZoomPanProvider, useZoomPanContext };
