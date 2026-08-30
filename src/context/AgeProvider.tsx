import type { ReactNode } from "react";
import { usePersistentAge } from "../hooks/usePersistentAge";
import { AgeContext } from "./AgeContext";

export function AgeProvider({ children }: { children: ReactNode }) {
  const value = usePersistentAge();
  return <AgeContext.Provider value={value}>{children}</AgeContext.Provider>;
}
