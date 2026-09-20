import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AgeProvider } from "./context/AgeProvider";
import { V3Layout } from "./v3/layout/V3Layout";
import { V3Home } from "./v3/pages/Home";
import "./v3/styles.css";
import "./v3/styles.content.css";

const LegacyHome = lazy(() => import("./legacy/LegacyHome").then((module) => ({ default: module.LegacyHome })));
const V2Layout = lazy(() => import("./v2/layout/V2Layout").then((module) => ({ default: module.V2Layout })));
const Explore = lazy(() => import("./v2/pages/Explore").then((module) => ({ default: module.Explore })));
const V2Home = lazy(() => import("./v2/pages/Home").then((module) => ({ default: module.V2Home })));
const V2WindowDetail = lazy(() => import("./v2/pages/WindowDetail").then((module) => ({ default: module.V2WindowDetail })));
const V3WindowDetail = lazy(() => import("./v3/pages/WindowDetail").then((module) => ({ default: module.V3WindowDetail })));
const V3Explore = lazy(() => import("./v3/pages/Explore").then((module) => ({ default: module.V3Explore })));
const V3About = lazy(() => import("./v3/pages/About").then((module) => ({ default: module.V3About })));

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const scroll = () => {
        const target = document.getElementById(id);
        if (!target) return false;
        target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
        return true;
      };
      if (scroll()) return;
      const observer = new MutationObserver(() => { if (scroll()) observer.disconnect(); });
      observer.observe(document.body, { childList: true, subtree: true });
      const timeout = window.setTimeout(() => observer.disconnect(), 5000);
      return () => { observer.disconnect(); window.clearTimeout(timeout); };
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [hash, pathname]);
  return null;
}

export default function App() {
  return <AgeProvider><ScrollManager /><Suspense fallback={<div className="v3-route-loading" role="status">正在打开窗口…</div>}><Routes>
    <Route path="/legacy" element={<LegacyHome />} />
    <Route element={<V3Layout />}>
      <Route path="/" element={<V3Home />} />
      <Route path="/v3/explore" element={<V3Explore />} />
      <Route path="/v3/about" element={<V3About />} />
      <Route path="/v3/window/:slug" element={<V3WindowDetail />} />
    </Route>
    <Route path="/v2" element={<V2Layout />}><Route index element={<V2Home />} /><Route path="explore" element={<Explore />} /><Route path="window/:slug" element={<V2WindowDetail />} /></Route>
    <Route element={<V2Layout />}><Route path="/explore" element={<Explore />} /><Route path="/window/:slug" element={<V2WindowDetail />} /></Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Suspense></AgeProvider>;
}
