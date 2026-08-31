import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AgeProvider } from "./context/AgeProvider";
import { LegacyHome } from "./legacy/LegacyHome";
import { V2Layout } from "./v2/layout/V2Layout";
import { Explore } from "./v2/pages/Explore";
import { V2Home } from "./v2/pages/Home";
import { V2WindowDetail } from "./v2/pages/WindowDetail";
import { V3Layout } from "./v3/layout/V3Layout";
import { V3Home } from "./v3/pages/Home";
import { V3WindowDetail } from "./v3/pages/WindowDetail";
import "./v3/styles.css";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }));
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [hash, pathname]);

  return null;
}

export default function App() {
  return (
    <AgeProvider>
      <ScrollManager />
      <Routes>
        <Route path="/legacy" element={<LegacyHome />} />
        <Route element={<V3Layout />}>
          <Route path="/" element={<V3Home />} />
          <Route path="/v3/window/:slug" element={<V3WindowDetail />} />
        </Route>
        <Route path="/v2" element={<V2Layout />}>
          <Route index element={<V2Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="window/:slug" element={<V2WindowDetail />} />
        </Route>
        <Route element={<V2Layout />}>
          <Route path="/explore" element={<Explore />} />
          <Route path="/window/:slug" element={<V2WindowDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AgeProvider>
  );
}
