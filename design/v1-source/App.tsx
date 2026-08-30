import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { AgeProvider } from "./context/AgeProvider";
import { Ask } from "./pages/Ask";
import { Home } from "./pages/Home";
import { Now } from "./pages/Now";
import { WindowDetail } from "./pages/WindowDetail";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AgeProvider>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/now" element={<Now />} />
        <Route path="/ask" element={<Ask />} />
        <Route path="/window/:slug" element={<WindowDetail />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <footer className="site-footer page-shell">
        <p>人生窗口期 · Life Windows</p>
        <p>年龄是观察坐标，不是价值判断。</p>
      </footer>
    </AgeProvider>
  );
}
