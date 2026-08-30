import { useContext } from "react";
import { AgeContext } from "../context/AgeContext";

export function useAge() {
  const context = useContext(AgeContext);
  if (!context) throw new Error("useAge must be used inside AgeProvider");
  return context;
}
