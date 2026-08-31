import { Outlet } from "react-router-dom";
import { V3Footer } from "../components/Footer";
import { V3Header } from "../components/Header";
import { V3AgeProvider } from "../context/AgeProvider";

export function V3Layout() {
  return (
    <V3AgeProvider>
      <div className="v3-root">
        <V3Header />
        <Outlet />
        <V3Footer />
      </div>
    </V3AgeProvider>
  );
}
