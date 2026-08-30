import { createContext } from "react";

export interface AgeContextValue {
  age: number;
  setAge: (age: number) => void;
}

export const AgeContext = createContext<AgeContextValue | null>(null);
