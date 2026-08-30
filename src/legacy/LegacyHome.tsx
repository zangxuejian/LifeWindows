import { Header } from "../components/Header";
import { Home } from "../pages/Home";

export function LegacyHome() {
  return (
    <div className="legacy-root">
      <Header />
      <Home />
      <footer className="site-footer page-shell">
        <p>人生窗口期 · Life Windows</p>
        <p>年龄是观察坐标，不是价值判断。</p>
      </footer>
    </div>
  );
}
