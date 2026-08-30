import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AgeProvider } from "./context/AgeProvider";
import { LegacyHome } from "./legacy/LegacyHome";
import { V2Layout } from "./v2/layout/V2Layout";
import { Explore } from "./v2/pages/Explore";
import { V2Home } from "./v2/pages/Home";
import { V2WindowDetail } from "./v2/pages/WindowDetail";

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
        <Route element={<V2Layout />}>
          <Route path="/" element={<V2Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/window/:slug" element={<V2WindowDetail />} />
          <Route path="*" element={<V2Home />} />
        </Route>
      </Routes>
    </AgeProvider>
  );
}
