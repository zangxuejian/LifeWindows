import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { V3Footer } from "../components/Footer";
import { V3Header } from "../components/Header";
import { V3AgeProvider } from "../context/AgeProvider";
import { getExpiringWindow } from "../data/windows";

export function V3Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    const title = pathname.startsWith("/v3/window/") ? getExpiringWindow(pathname.split("/").pop())?.title ?? "窗口未找到" : pathname === "/v3/explore" ? "探索全部窗口" : pathname === "/v3/about" ? "数据与依据" : "此刻的人生窗口";
    document.title = `${title} · 人生窗口期 Life Windows`;
  }, [pathname]);
  return <V3AgeProvider><div className="v3-root"><V3Header /><Outlet /><V3Footer /></div></V3AgeProvider>;
}
