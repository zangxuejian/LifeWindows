import { useContext } from "react";
import { V3AgeContext } from "../context/AgeContext";

export function useV3Age() {
  const context = useContext(V3AgeContext);
  if (!context) throw new Error("useV3Age must be used within V3AgeProvider");
  return context;
}
