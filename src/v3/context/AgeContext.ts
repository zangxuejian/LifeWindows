import { createContext } from "react";

export interface V3AgeContextValue {
  currentAgeMonths: number;
  setCurrentAgeMonths: (months: number) => void;
}

export const V3AgeContext = createContext<V3AgeContextValue | null>(null);
